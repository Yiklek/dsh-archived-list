# dsh-archived-list

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) plugin:
view and restore **archived sessions** from a dedicated page in the web Settings.

- A **已归档 / Archived** nav row (own `settings.section` page) lists every
  archived session **grouped by workspace**, newest first inside each group.
- Each row shows the **title** (log-backed title fold via the host service, with
  client-list and directory-name fallbacks) and the **full session id**
  (selectable text); the group header shows the workspace name and its count.
- **Multi-select**: checkbox per row and per workspace group, plus a toolbar
  (已选 N 项) with 恢复所选 / 删除所选 / 取消选择.
- **恢复 / Restore** removes the session id from the durable `archivedSessionIds`
  set through `workspaceRegistry`'s own serialized write path, then opens the
  restored conversation and closes Settings. Batch restore closes Settings and
  opens the session when exactly one was selected.
- **删除 / Destroy** permanently deletes one archived session (or the whole
  selection, behind the same double confirmation): the host reads the durable
  header to locate the log, detaches workspace accounting, removes the id from
  the archived set through the serialized write path, then removes the session
  log directory from disk. Live sessions are refused.

## Layout

| Path | Plane | Role |
| --- | --- | --- |
| `lib/index.js` | host | `archvList` Cordis service (Typert Remote, SRC mode): `list()`, `restore(sessionId)`, `destroy(sessionId)` |
| `lib/client.js` | web | `dsh.client` bundle: `settings.section` page (nav "已归档"), workspace-grouped list, locale dictionaries (zh/en), own `<style>` |

The host half is discovered by the Loader as an ordinary plugin entry; the
browser half is discovered through `package.json`'s `dsh.client` declaration
and served at `/plugins/dsh-archived-list/client.js`. Client -> host calls ride
the shared connection RPC carrier (`connection.rpc.call("/api", "archvList/…")`)
resolved by the api gateway's SRC (source-mode) discovery - no generated typert
schemas are required.

## Install into a profile

Install from GitHub:

```bash
npx @deepseek-ai/dsh plugin --profile web add github:Yiklek/dsh-archived-list
```

For development, a `link:` install instead keeps this checkout live (`dsh plugin`
forwards to pnpm inside the profile directory; edits to `lib/*.js` apply on the
next dsh restart; client bundle edits need no build step because the bundle is
hand-written in the module-loader format):

```bash
dsh plugin --profile web add link:../../projects/dsh-archived-list
```

Then add one row to `~/.dsh/profiles/web/cordis.patch.yml` (replacing `[]`):

```yaml
- insert:
    - id: archived-list
      name: dsh-archived-list
```

Restart dsh (`dsh web`) to activate. To verify the composition without booting
the app: `dsh --profile web --dump-config | grep -A2 archived-list`.

## Notes

- The remote service is namespace `archvList`; endpoints are `archvList/list`,
  `archvList/restore`, and `archvList/destroy`. Parameter names are parsed from
  the method source (gateway SRC mode), so keep `restore(sessionId)`'s and
  `destroy(sessionId)`'s parameter a simple identifier and avoid the reserved
  lookup names (`agent`, `session`).
- `destroy` is ordered so a mid-flight failure never strands accounting:
  refuse live sessions -> read the durable header (proves the log exists and
  locates it via `sessionPersistence.locate`; the directory basename must equal
  the session id) -> `detachSession` while the registry's path index still
  resolves the id -> serialized archived-set removal -> `rm -r` the log
  directory last. The UI additionally requires an explicit second click
  ("确认删除") before each destroy.
- `Remote(...)` markers are applied without decorator syntax in `markRemote`;
  this follows the decorator-context contract of `@deepseek-ai/dsh-typert-protocol`.
- **Keep `@deepseek-ai/dsh-typert-protocol` (and `@deepseek-ai/cordis`) as symlinks
  to the dsh installation's own copies.** The gateway discovers SRC-mode Remote
  endpoints through `remoteMethods()`, which reads a module-private marker table
  (`markers` WeakMap). A second physical copy installed by this checkout (e.g. by
  a local `pnpm install` pulling `devDependencies`) becomes a different module
  instance, so `archvList/list` is never claimed and every archived session shows
  "(无标题)". If the panel regresses, check the symlinks are still valid:
  `node_modules/@deepseek-ai/{cordis,dsh-typert-protocol}` should resolve to the
  dsh installation's `node_modules/@deepseek-ai/...`; re-run the `ln -s` from the
  Install section after any `pnpm install` here, then restart `dsh web`.
- Archiving never touches workspace accounting, so restore is exactly the
  inverse set removal; the session keeps its position in the workspace.
