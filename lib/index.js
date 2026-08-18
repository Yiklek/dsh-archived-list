import { Remote, TypertRemoteService } from '@deepseek-ai/dsh-typert-protocol'
import { rm } from 'node:fs/promises'
import { basename as pathBasename, dirname } from 'node:path'

/**
 * Apply one Remote method marker without decorator syntax. `Remote(name)`
 * returns a standard method decorator; invoking it by hand with the
 * decorator-context contract it expects (name/private/static/addInitializer)
 * registers exactly the marker the compiled decorator writes. The initializer
 * must observe `Object.getPrototypeOf(this)` as the class prototype, so it is
 * invoked against an object whose prototype is `ctor.prototype`.
 */
function markRemote(ctor, method) {
  Remote(method)(ctor.prototype[method], {
    name: method,
    private: false,
    static: false,
    addInitializer: (fn) => { fn.call(Object.create(ctor.prototype)) },
  })
}

function baseName(p) {
  if (typeof p !== 'string' || p === '') return ''
  const parts = p.split('/')
  return parts[parts.length - 1] || p
}

function archivedIdList(registry) {
  const state = registry.requireState()
  const list = Array.isArray(state.archivedSessionIds) ? state.archivedSessionIds : []
  return list.filter((id) => typeof id === 'string' && id !== '')
}

/**
 * Host service `archvList`: the Remote face the browser panel calls.
 *
 * - `list()` -> { rows: [{ id, title, workspaceTitle, createdAt }] }
 *   Titles come from the log-backed title fold (sessionQuery.readTitleSnapshots);
 *   workspace names from the durable registry; rows sort newest-first.
 * - `restore(sessionId)` -> { restored, remaining }
 *   Mirrors workspaceRegistry.archiveSession's write path: enqueueOperation
 *   serialization, membership + sessionKnown guards, then setState with the id
 *   removed from the durable archivedSessionIds set.
 * - `destroy(sessionId)` -> { destroyed, remaining }
 *   Permanently deletes one archived session: resolves the durable log path
 *   via sessionPersistence.locate (read the header first — the log must still
 *   exist), detaches workspace accounting while the in-memory path index
 *   still knows the session, removes the id from the archived set through
 *   the same serialized write path as restore, then removes the session log
 *   directory from disk. Live sessions are refused.
 */
class ArchivedListService extends TypertRemoteService {
  static inject = ['workspaceRegistry', 'sessionQuery']

  constructor(ctx) {
    super(ctx, 'archvList')
  }

  async list() {
    const registry = this.ctx.workspaceRegistry
    const sessionQuery = this.ctx.sessionQuery
    const ids = archivedIdList(registry)
    const wsRows = []
    try {
      const workspaces = registry.list()
      for (const w of workspaces) {
        if (w === null || typeof w !== 'object') continue
        const sids = Array.isArray(w.sessionIds) ? w.sessionIds : []
        const title = typeof w.title === 'string' && w.title !== ''
          ? w.title
          : baseName(typeof w.path === 'string' ? w.path : '')
        for (const sid of sids) wsRows.push({ sid, title })
      }
    } catch (error) {
      this.ctx.logger.warn('archived-list: workspace mapping failed', error)
    }
    const titles = {}
    const created = {}
    if (ids.length > 0) {
      try {
        const results = await sessionQuery.readTitleSnapshots(ids)
        for (const result of results) {
          if (result === null || typeof result !== 'object' || result.status !== 'fulfilled') continue
          const value = result.value
          if (value === null || typeof value !== 'object') continue
          const header = value.session !== null && typeof value.session === 'object' ? value.session : null
          if (header === null || typeof header.id !== 'string' || header.id === '') continue
          if (value.title !== null && typeof value.title === 'object'
              && typeof value.title.title === 'string' && value.title.title !== '') titles[header.id] = value.title.title
          if (typeof header.createdAt === 'number') created[header.id] = header.createdAt
        }
      } catch (error) {
        this.ctx.logger.warn('archived-list: title read failed', error)
      }
    }
    const rows = ids.map((id, index) => {
      const ws = wsRows.find((row) => row.sid === id)
      return {
        id,
        title: titles[id] || '',
        workspaceTitle: ws === undefined ? '' : ws.title,
        createdAt: created[id] || 0,
        archiveOrder: index,
      }
    })
    rows.sort((a, b) => (b.createdAt !== a.createdAt ? b.createdAt - a.createdAt : a.archiveOrder - b.archiveOrder))
    return { rows }
  }

  async restore(sessionId) {
    if (typeof sessionId !== 'string' || sessionId === '') {
      throw new Error('archived-list: "sessionId" (string) is required')
    }
    const registry = this.ctx.workspaceRegistry
    if (typeof registry.enqueueOperation !== 'function' || typeof registry.requireState !== 'function'
        || typeof registry.setState !== 'function' || typeof registry.sessionKnown !== 'function') {
      throw new Error('archived-list: workspaceRegistry lacks the expected instance methods')
    }
    await registry.enqueueOperation(async () => {
      const current = registry.requireState()
      const archived = Array.isArray(current.archivedSessionIds) ? current.archivedSessionIds : []
      if (!archived.includes(sessionId)) throw new Error(`archived-list: session is not archived: ${sessionId}`)
      if (!(await registry.sessionKnown(sessionId))) throw new Error(`archived-list: session no longer exists: ${sessionId}`)
      const state = registry.requireState()
      await registry.setState({ ...state, archivedSessionIds: archived.filter((id) => id !== sessionId) })
    })
    const after = registry.requireState()
    const remaining = Array.isArray(after.archivedSessionIds) ? after.archivedSessionIds : []
    return { restored: sessionId, remaining: remaining.length }
  }

  async destroy(sessionId) {
    if (typeof sessionId !== 'string' || sessionId === '') {
      throw new Error('archived-list: "sessionId" (string) is required')
    }
    const registry = this.ctx.workspaceRegistry
    if (typeof registry.enqueueOperation !== 'function' || typeof registry.requireState !== 'function'
        || typeof registry.setState !== 'function' || typeof registry.list !== 'function') {
      throw new Error('archived-list: workspaceRegistry lacks the expected instance methods')
    }
    const liveStore = this.ctx.get('sessions')
    if (liveStore !== undefined && liveStore !== null && typeof liveStore.get === 'function'
        && liveStore.get(sessionId) !== undefined) {
      throw new Error(`archived-list: session is currently open: ${sessionId}`)
    }
    // Read the durable header BEFORE any removal: the observation proves the
    // log exists and carries the cwd that locates it on disk.
    const persistence = this.ctx.get('sessionPersistence')
    if (persistence === undefined || persistence === null || typeof persistence.locate !== 'function') {
      throw new Error('archived-list: sessionPersistence service unavailable')
    }
    const observations = await this.ctx.sessionQuery.readTitleSnapshots([sessionId])
    const observation = observations[0]
    if (observation === null || typeof observation !== 'object' || observation.status !== 'fulfilled') {
      const reason = observation !== null && typeof observation === 'object' && observation.reason !== undefined
        ? String(observation.reason?.message ?? observation.reason)
        : 'not found'
      throw new Error(`archived-list: cannot read session "${sessionId}": ${reason}`)
    }
    const header = observation.value.session
    const location = persistence.locate(header)
    if (location === undefined || typeof location.path !== 'string' || location.path === '') {
      throw new Error(`archived-list: no durable location for session "${sessionId}"`)
    }
    const dir = dirname(location.path)
    if (pathBasename(dir) !== sessionId) {
      throw new Error(`archived-list: refusing to delete unexpected path "${dir}"`)
    }
    // Detach workspace accounting first, while the in-memory sessionPaths
    // index still resolves the id (the log still exists at this point).
    for (const workspace of registry.list()) {
      if (workspace === null || typeof workspace !== 'object') continue
      if (typeof workspace.detachSession !== 'function') continue
      if (Array.isArray(workspace.sessionIds) && workspace.sessionIds.includes(sessionId)) {
        await workspace.detachSession(sessionId)
        break
      }
    }
    // Serialized state write: membership guard + archived-set removal.
    await registry.enqueueOperation(async () => {
      const current = registry.requireState()
      const archived = Array.isArray(current.archivedSessionIds) ? current.archivedSessionIds : []
      if (!archived.includes(sessionId)) throw new Error(`archived-list: session is not archived: ${sessionId}`)
      const state = registry.requireState()
      await registry.setState({ ...state, archivedSessionIds: archived.filter((id) => id !== sessionId) })
    })
    // Remove the durable log directory last: a failure here leaves a
    // re-attachable log (the id is already out of the archived set, so the
    // sidebar resurfaces it and the operator can retry).
    await rm(dir, { recursive: true, force: true })
    const after = registry.requireState()
    const remaining = Array.isArray(after.archivedSessionIds) ? after.archivedSessionIds : []
    return { destroyed: sessionId, remaining: remaining.length }
  }
}

markRemote(ArchivedListService, 'list')
markRemote(ArchivedListService, 'restore')
markRemote(ArchivedListService, 'destroy')

export { ArchivedListService }
export default ArchivedListService
