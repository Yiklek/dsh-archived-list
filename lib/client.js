window.__ModuleLoader__.load({
	id: "dsh-archived-list",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		const React = require("react");

		const NS = "archv";
		const EMPTY = [];
		const STORAGE_KEY = "dsh-archived-list:restore";
		const ZH = {
			nav: "已归档",
			heading: "已归档的会话",
			intro: "按工作区分组的已归档会话；恢复后会话将回到原工作区，彻底删除不可恢复。",
			empty: "没有已归档的会话",
			loading: "加载中…",
			prefAutoOpen: "恢复后自动打开会话",
			prefCloseSettings: "恢复后关闭设置窗口",
			untitled: "(无标题)",
			wsUngrouped: "未分组",
			restore: "恢复",
			restoring: "恢复中…",
			restored: "已恢复:{title}",
			destroy: "删除",
			destroying: "删除中…",
			destroyConfirm: "确认删除",
			destroyCancel: "取消",
			destroyWarn: "彻底删除后不可恢复",
			destroyed: "已彻底删除:{title}",
			select: "选择",
			selectedCount: "已选 {n} 项",
			restoreSelected: "恢复所选",
			destroySelected: "删除所选",
			clearSelection: "取消选择",
			batchConfirm: "将彻底删除 {n} 个会话，删除后不可恢复。",
			batchRestored: "已恢复 {n} 个会话",
			batchDestroyed: "已彻底删除 {n} 个会话",
			batchFailed: "{done} 个成功，{failed} 个失败：{reason}"
		};
		const EN = {
			nav: "Archived",
			heading: "Archived sessions",
			intro: "Archived sessions grouped by workspace; restoring returns a session to its workspace, permanent deletion cannot be undone.",
			empty: "No archived sessions",
			loading: "Loading…",
			prefAutoOpen: "Auto-open session after restore",
			prefCloseSettings: "Close settings after restore",
			untitled: "(untitled)",
			wsUngrouped: "Ungrouped",
			restore: "Restore",
			restoring: "Restoring…",
			restored: "Restored: {title}",
			destroy: "Delete",
			destroying: "Deleting…",
			destroyConfirm: "Confirm delete",
			destroyCancel: "Cancel",
			destroyWarn: "Permanent deletion cannot be undone",
			destroyed: "Deleted: {title}",
			select: "Select",
			selectedCount: "{n} selected",
			restoreSelected: "Restore selected",
			destroySelected: "Delete selected",
			clearSelection: "Clear selection",
			batchConfirm: "This permanently deletes {n} sessions and cannot be undone.",
			batchRestored: "Restored {n} sessions",
			batchDestroyed: "Permanently deleted {n} sessions",
			batchFailed: "{done} succeeded, {failed} failed: {reason}"
		};
		const CSS = [
			".archv-section{max-width:760px;color:var(--dsw-alias-label-primary);flex-direction:column;gap:12px;display:flex;}",
			".archv-heading{margin:0;font-size:18px;font-weight:600;}",
			".archv-intro{color:var(--dsw-alias-label-tertiary);margin:0;font-size:13px;}",
			".archv-empty{color:var(--dsw-alias-label-tertiary);margin:0;font-size:13px;}",
			".archv-group{border:1px solid var(--dsw-alias-border-l2);border-radius:12px;overflow:hidden;background:rgba(127,127,127,.04);}",
			".archv-ws{display:flex;align-items:center;gap:10px;padding:10px 14px;font-size:12px;font-weight:600;color:var(--dsw-alias-label-secondary);background:rgba(127,127,127,.08);}",
			".archv-wsname{flex:1;min-width:0;}",
			".archv-count{font-weight:400;opacity:.6;}",
			".archv-row{display:flex;align-items:flex-start;gap:10px;padding:8px 14px;}",
			".archv-row:hover,.archv-row[data-sel=\"1\"]{background:var(--dsw-alias-interactive-bg-hover);}",
			".archv-main{flex:1;min-width:0;cursor:default;}",
			".archv-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:500;}",
			".archv-id{opacity:.6;font-size:11px;margin-top:2px;line-height:1.4;word-break:break-all;user-select:all;}",
			".archv-acts{display:flex;align-items:center;gap:6px;flex-shrink:0;padding-top:2px;}",
			".archv-btn{cursor:pointer;border-radius:8px;padding:4px 12px;border:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;flex-shrink:0;white-space:nowrap;}",
			".archv-btn:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);}",
			".archv-btn:disabled{opacity:.5;cursor:default;}",
			".archv-btn.archv-danger{color:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary);}",
			".archv-check{accent-color:var(--dsw-alias-state-business-primary);width:14px;height:14px;flex:none;margin-top:3px;cursor:pointer;}",
			".archv-wcheck{accent-color:var(--dsw-alias-state-business-primary);width:13px;height:13px;flex:none;cursor:pointer;}",
			".archv-prefs{display:flex;align-items:center;gap:16px;padding:10px 14px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:rgba(127,127,127,.06);font-size:12px;flex-wrap:wrap;}",
			".archv-pref{display:inline-flex;align-items:center;gap:6px;cursor:pointer;user-select:none;}",
			".archv-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:8px 12px;border:1px solid var(--dsw-alias-border-l2);border-radius:10px;background:rgba(127,127,127,.06);font-size:12px;}",
			".archv-bar .archv-btn{padding:3px 10px;}",
			".archv-barwarn{color:var(--dsw-alias-state-error-primary);font-size:12px;}",
			".archv-barsep{flex:1;}",
			".archv-msg{font-size:12px;color:var(--dsw-alias-label-secondary);}",
			".archv-err{color:var(--dsw-alias-state-error-primary);}"
		].join("\n");

		function basename(p) {
			if (typeof p !== "string" || p === "") return "";
			const parts = p.split("/");
			return parts[parts.length - 1] || p;
		}
		function errText(err) {
			if (err !== null && typeof err === "object" && typeof err.message === "string" && err.message !== "") return err.message;
			return String(err);
		}
		function fill(text, name, value) {
			return typeof text === "string" ? text.split("{" + name + "}").join(String(value)) : text;
		}
		function readRestorePrefs() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (raw !== null) {
					const parsed = JSON.parse(raw);
					return {
						autoOpen: parsed !== null && typeof parsed === "object" && parsed.autoOpen === true,
						closeSettings: parsed !== null && typeof parsed === "object" && parsed.closeSettings === true
					};
				}
			} catch (err) { /* ignore */ }
			return { autoOpen: false, closeSettings: false };
		}
		function writeRestorePrefs(prefs) {
			try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch (err) { /* ignore */ }
		}
		function makeT(locale) {
			if (locale !== undefined && locale !== null && typeof locale.bind === "function") {
				const bound = locale.bind(NS);
				if (typeof bound === "function") {
					return (key) => {
						try {
							const v = bound(key);
							if (typeof v === "string" && v !== "" && v !== key) return v;
						} catch (err) { /* fall through */ }
						const f = ZH[key];
						return typeof f === "string" ? f : key;
					};
				}
			}
			return (key) => {
				const f = ZH[key];
				return typeof f === "string" ? f : key;
			};
		}

		function useLocaleTick(locale) {
			const state = React.useState(0);
			const setRev = state[1];
			React.useEffect(() => {
				if (locale === undefined || locale === null) return;
				if (typeof locale.subscribe !== "function" || typeof locale.getSnapshot !== "function") return;
				const read = () => {
					const snap = locale.getSnapshot();
					return snap !== null && typeof snap === "object" && typeof snap.revision === "number" ? snap.revision : 0;
				};
				setRev(read());
				return locale.subscribe(() => setRev(read()));
			}, [locale]);
		}

		function rpcCall(ctx, method, args) {
			const connection = ctx.get("connection");
			if (connection === undefined || connection === null || connection.rpc === undefined
				|| typeof connection.rpc.call !== "function") {
				return Promise.reject(new Error("archived-list: connection service unavailable"));
			}
			return connection.rpc.call("/api", "archvList/" + method, { args }).then((result) => {
				if (result !== null && typeof result === "object" && result.ok === true) return result.value;
				const failure = result !== null && typeof result === "object" && result.error !== undefined ? result.error : undefined;
				const text = failure !== undefined && typeof failure.message === "string" && failure.message !== ""
					? failure.message
					: (failure !== undefined && failure.code ? String(failure.code) : "rpc failed");
				throw new Error(text);
			});
		}

		let hostCache = null;
		let hostPromise = null;

		function loadHostRows(ctx, force) {
			if (hostPromise === null || force === true) {
				let promise;
				promise = rpcCall(ctx, "list", {}).then((res) => {
					hostCache = res !== null && typeof res === "object" && Array.isArray(res.rows) ? res : { rows: [] };
					return hostCache;
				}).catch((err) => {
					if (hostPromise === promise) hostPromise = null;
					throw err;
				});
				hostPromise = promise;
			}
			return hostPromise;
		}

		function insertStyles(css) {
			const el = document.createElement("style");
			el.setAttribute("data-dsh-plugin", "dsh-archived-list");
			el.textContent = css;
			document.head.appendChild(el);
			return () => { el.remove(); };
		}

		/**
		 * Settings section body: archived sessions grouped by workspace with
		 * multi-select restore and per-row / per-batch permanent destroy
		 * behind explicit double confirmation.
		 */
		function ArchivedSection(props) {
			const t = props.t;
			useLocaleTick(props.locale);
			const archivedIds = props.useWorkspaces((s) => {
				return s !== null && typeof s === "object" && Array.isArray(s.archivedSessionIds) ? s.archivedSessionIds : EMPTY;
			});
			const workspaces = props.useWorkspaces((s) => {
				return s !== null && typeof s === "object" && Array.isArray(s.items) ? s.items : EMPTY;
			});
			// SessionListState exposes ids/byId (not `items`): byId maps sessionId ->
			// { id, displayTitle, title?, cwd?, ... }.
			const sessionById = props.useSessions((s) => {
				return s !== null && typeof s === "object" && s.byId !== null && typeof s.byId === "object" ? s.byId : {};
			});
			const [selected, setSelected] = React.useState({});
			const [confirming, setConfirming] = React.useState(null);
			const [busy, setBusy] = React.useState(null);
			const [error, setError] = React.useState("");
			const [ok, setOk] = React.useState("");
			const [hostRows, setHostRows] = React.useState(hostCache);
			const [prefs, setPrefs] = React.useState(readRestorePrefs);
			const updatePref = (patch) => {
				setPrefs((prev) => {
					const next = { ...prev, ...patch };
					writeRestorePrefs(next);
					return next;
				});
			};

			const archivedKey = archivedIds.join(",");
			React.useEffect(() => {
				if (archivedKey === "") {
					setHostRows({ rows: [] });
					return;
				}
				let cancelled = false;
				loadHostRows(props.ctx, true).then((res) => {
					if (cancelled) return;
					setHostRows(res);
				}).catch((err) => {
					if (!cancelled) setError(errText(err));
				});
				return () => { cancelled = true; };
			}, [archivedKey]);

			// Drop selection and any pending confirmation for ids that left the
			// archived set (restored or destroyed elsewhere).
			React.useEffect(() => {
				const live = {};
				for (const id of archivedIds) live[id] = true;
				setSelected((prev) => {
					const next = {};
					let changed = false;
					for (const id of Object.keys(prev)) {
						if (live[id] === true) next[id] = true;
						else changed = true;
					}
					return changed ? next : prev;
				});
				setConfirming(null);
			}, [archivedKey]);

			const wsById = {};
			for (let k = 0; k < workspaces.length; k++) {
				const w = workspaces[k];
				if (w === null || typeof w !== "object") continue;
				const wIds = Array.isArray(w.sessionIds) ? w.sessionIds : [];
				const wTitle = typeof w.title === "string" && w.title !== ""
					? w.title
					: (typeof w.path === "string" ? basename(w.path) : (typeof w.workspaceId === "string" ? w.workspaceId : ""));
				for (let m = 0; m < wIds.length; m++) wsById[wIds[m]] = wTitle;
			}
			const hostById = {};
			const hostPos = {};
			if (hostRows !== null && typeof hostRows === "object" && Array.isArray(hostRows.rows)) {
				for (let h = 0; h < hostRows.rows.length; h++) {
					const hr = hostRows.rows[h];
					if (hr !== null && typeof hr === "object" && typeof hr.id === "string") {
						hostById[hr.id] = hr;
						hostPos[hr.id] = h;
					}
				}
			}

			const rows = [];
			for (let j = 0; j < archivedIds.length; j++) {
				const id = archivedIds[j];
				if (typeof id !== "string") continue;
				const entry = sessionById[id];
				const dirName = entry !== undefined && entry !== null && typeof entry === "object" && typeof entry.cwd === "string"
					? basename(entry.cwd) : "";
				const hostRow = hostById[id];
				let title = "";
				if (hostRow !== undefined && typeof hostRow.title === "string" && hostRow.title !== "") title = hostRow.title;
				else if (entry !== undefined && entry !== null && typeof entry === "object" && typeof entry.title === "string" && entry.title !== "") title = entry.title;
				else if (dirName !== "") title = dirName;
				if (title === "") title = t("untitled");
				let wsTitle = "";
				if (hostRow !== undefined && typeof hostRow.workspaceTitle === "string" && hostRow.workspaceTitle !== "") wsTitle = hostRow.workspaceTitle;
				else if (wsById[id] !== undefined) wsTitle = wsById[id];
				rows.push({
					id: id,
					title: title,
					wsKey: wsTitle !== "" ? wsTitle : t("wsUngrouped"),
					order: hostPos[id] !== undefined ? hostPos[id] : j
				});
			}
			rows.sort((a, b) => a.order - b.order);

			const groups = [];
			const groupAt = {};
			for (let r = 0; r < rows.length; r++) {
				const row = rows[r];
				if (groupAt[row.wsKey] === undefined) {
					groupAt[row.wsKey] = groups.length;
					groups.push({ wsKey: row.wsKey, rows: [] });
				}
				groups[groupAt[row.wsKey]].rows.push(row);
			}

			const loading = archivedIds.length > 0 && (hostRows === null || archivedIds.some((id) => !hostById[id]));
			const listRows = loading ? [] : rows;
			const selectedIds = listRows.filter((row) => selected[row.id] === true).map((row) => row.id);
			const selectedCount = selectedIds.length;
			const busyNow = busy !== null;

			const toggleOne = (id) => {
				if (busyNow) return;
				setConfirming(null);
				setSelected((prev) => {
					const next = { ...prev };
					if (next[id] === true) delete next[id];
					else next[id] = true;
					return next;
				});
			};
			const toggleGroup = (group) => {
				if (busyNow) return;
				setConfirming(null);
				const all = group.rows.every((row) => selected[row.id] === true);
				setSelected((prev) => {
					const next = { ...prev };
					for (const row of group.rows) {
						if (all) delete next[row.id];
						else next[row.id] = true;
					}
					return next;
				});
			};

			const restoreRow = (row) => {
				if (busyNow) return;
				setBusy({ label: t("restoring") });
				setError("");
				setOk("");
				rpcCall(props.ctx, "restore", { sessionId: row.id }).then(() => {
					setBusy(null);
					setOk(fill(t("restored"), "title", row.title));
					if (prefs.autoOpen && sessionById[row.id] !== undefined) {
						const sessions = props.ctx.get("sessions");
						if (sessions !== undefined && sessions !== null && typeof sessions.open === "function") {
							try { sessions.open(row.id); } catch (err) { setError(errText(err)); }
						}
					}
					if (prefs.closeSettings && typeof props.close === "function") props.close();
				}).catch((err) => {
					setBusy(null);
					setError(errText(err));
				});
			};

			const destroyRow = (row) => {
				if (busyNow) return;
				setBusy({ label: t("destroying") });
				setError("");
				setOk("");
				rpcCall(props.ctx, "destroy", { sessionId: row.id }).then(() => {
					setBusy(null);
					setConfirming(null);
					setSelected((prev) => {
						const next = { ...prev };
						delete next[row.id];
						return next;
					});
					setOk(fill(t("destroyed"), "title", row.title));
				}).catch((err) => {
					setBusy(null);
					setError(errText(err));
				});
			};

			const runBatch = (kind) => {
				const ids = listRows.filter((row) => selected[row.id] === true).map((row) => row.id);
				if (ids.length === 0 || busyNow) return;
				setError("");
				setOk("");
				const verb = kind === "restore" ? t("restoring") : t("destroying");
				const task = (async () => {
					let done = 0;
					let failed = 0;
					let firstReason = "";
					for (let i = 0; i < ids.length; i++) {
						setBusy({ label: verb + " " + (i + 1) + "/" + ids.length });
						try {
							await rpcCall(props.ctx, kind, { sessionId: ids[i] });
							done++;
						} catch (err) {
							failed++;
							if (firstReason === "") firstReason = errText(err);
						}
					}
					setBusy(null);
					setConfirming(null);
					setSelected({});
					if (failed > 0) {
						setError(fill(fill(fill(t("batchFailed"), "done", done), "failed", failed), "reason", firstReason));
					} else if (kind === "restore") {
						setOk(fill(t("batchRestored"), "n", done));
						if (prefs.autoOpen && ids.length === 1 && sessionById[ids[0]] !== undefined) {
							const sessions = props.ctx.get("sessions");
							if (sessions !== undefined && sessions !== null && typeof sessions.open === "function") {
								try { sessions.open(ids[0]); } catch (err) { setError(errText(err)); }
							}
						}
						if (prefs.closeSettings && typeof props.close === "function") props.close();
					} else {
						setOk(fill(t("batchDestroyed"), "n", done));
					}
				})();
				task.catch((err) => {
					setBusy(null);
					setError(errText(err));
				});
			};

			const batchConfirming = confirming !== null && confirming.kind === "batch";

			const body = loading
				? [React.createElement("p", { className: "archv-msg", key: "loading" }, t("loading"))]
				: groups.length === 0
				? [React.createElement("p", { className: "archv-empty", key: "empty" }, t("empty"))]
				: groups.map((group) => {
					const groupAll = group.rows.every((row) => selected[row.id] === true);
					return React.createElement("div", { className: "archv-group", key: group.wsKey },
						React.createElement("div", { className: "archv-ws" },
							React.createElement("input", {
								className: "archv-wcheck",
								type: "checkbox",
								"aria-label": t("select"),
								checked: groupAll,
								disabled: busyNow || group.rows.length === 0,
								onChange: () => toggleGroup(group)
							}),
							React.createElement("span", { className: "archv-wsname" }, group.wsKey),
							React.createElement("span", { className: "archv-count" }, String(group.rows.length))),
						group.rows.map((row) => {
							const rowConfirming = confirming !== null && confirming.kind === "row" && confirming.id === row.id;
							return React.createElement("div", { className: "archv-row", key: row.id, "data-sel": selected[row.id] === true ? "1" : "0" },
								React.createElement("input", {
									className: "archv-check",
									type: "checkbox",
									"aria-label": t("select"),
									checked: selected[row.id] === true,
									disabled: busyNow,
									onChange: () => toggleOne(row.id)
								}),
								React.createElement("div", { className: "archv-main", title: row.id },
									React.createElement("div", { className: "archv-title" }, row.title),
									React.createElement("div", { className: "archv-id" }, row.id)),
								React.createElement("div", { className: "archv-acts" },
									rowConfirming
										? [React.createElement("button", {
											className: "archv-btn archv-danger",
											key: "yes",
											disabled: busyNow,
											title: t("destroyWarn"),
											onClick: () => destroyRow(row)
										}, t("destroyConfirm")),
										React.createElement("button", {
											className: "archv-btn",
											key: "no",
											disabled: busyNow,
											onClick: () => setConfirming(null)
										}, t("destroyCancel"))]
										: [React.createElement("button", {
											className: "archv-btn",
											key: "restore",
											disabled: busyNow,
											onClick: () => restoreRow(row)
										}, t("restore")),
										React.createElement("button", {
											className: "archv-btn archv-danger",
											key: "destroy",
											disabled: busyNow,
											title: t("destroyWarn"),
											onClick: () => { setOk(""); setError(""); setConfirming({ kind: "row", id: row.id }); }
										}, t("destroy"))]));
						}));
				});

			const toolbar = selectedCount === 0 && !batchConfirming ? null
				: React.createElement("div", { className: "archv-bar" },
					batchConfirming
						? [React.createElement("span", { className: "archv-barwarn", key: "warn" },
							fill(t("batchConfirm"), "n", selectedCount)),
							React.createElement("span", { className: "archv-barsep", key: "sep" }),
							React.createElement("button", {
								className: "archv-btn archv-danger",
								key: "yes",
								disabled: busyNow,
								onClick: () => runBatch("destroy")
							}, t("destroyConfirm")),
							React.createElement("button", {
								className: "archv-btn",
								key: "no",
								disabled: busyNow,
								onClick: () => setConfirming(null)
							}, t("destroyCancel"))]
						: [React.createElement("span", { key: "count" }, fill(t("selectedCount"), "n", selectedCount)),
							React.createElement("span", { className: "archv-barsep", key: "sep" }),
							React.createElement("button", {
								className: "archv-btn",
								key: "restore",
								disabled: busyNow || selectedCount === 0,
								onClick: () => runBatch("restore")
							}, t("restoreSelected")),
							React.createElement("button", {
								className: "archv-btn archv-danger",
								key: "destroy",
								disabled: busyNow || selectedCount === 0,
								onClick: () => { setOk(""); setError(""); setConfirming({ kind: "batch" }); }
							}, t("destroySelected")),
							React.createElement("button", {
								className: "archv-btn",
								key: "clear",
								disabled: busyNow,
								onClick: () => setSelected({})
							}, t("clearSelection"))]);

			const prefsBar = React.createElement("div", { className: "archv-prefs", key: "prefs" },
				React.createElement("label", { className: "archv-pref", key: "auto" },
					React.createElement("input", {
						type: "checkbox",
						checked: prefs.autoOpen,
						onChange: (e) => updatePref({ autoOpen: e.target.checked })
					}),
					t("prefAutoOpen")),
				React.createElement("label", { className: "archv-pref", key: "close" },
					React.createElement("input", {
						type: "checkbox",
						checked: prefs.closeSettings,
						onChange: (e) => updatePref({ closeSettings: e.target.checked })
					}),
					t("prefCloseSettings")));

			return React.createElement("div", { className: "archv-section" },
				React.createElement("h2", { className: "archv-heading" }, t("heading") + " · " + (loading ? archivedIds.length : rows.length)),
				React.createElement("p", { className: "archv-intro" }, t("intro")),
				prefsBar,
				toolbar,
				body,
				busy !== null ? React.createElement("div", { className: "archv-msg" }, busy.label) : null,
				error !== "" ? React.createElement("div", { className: "archv-msg archv-err" }, error) : null,
				ok !== "" && error === "" ? React.createElement("div", { className: "archv-msg" }, ok) : null);
		}

		function apply(ctx) {
			const locale = ctx.locale;
			const t = makeT(locale);
			ctx.effect(() => insertStyles(CSS), "archived-list: styles");
			ctx.effect(() => locale.register(NS, { zh: ZH, en: EN }), "archived-list: dictionaries");
			const connection = ctx.get("connection");
			if (connection !== undefined && connection !== null && connection.rpc !== undefined
				&& typeof connection.rpc.call === "function") {
				loadHostRows(ctx, true).catch(() => {});
			}
			const slots = ctx.slots;
			// The sidebar's workspace header row exposes no injection seat, so the
			// archived browser lives as its own settings.section page (nav "已归档"),
			// grouped by workspace, with multi-select restore and double-confirmed
			// permanent destroy.
			slots.inject("settings.section", () => slots.register(
				{ name: "settings.section", id: "archived", order: 20, label: () => t("nav"), locale: NS },
				(entryProps) => {
					if (entryProps === null || typeof entryProps !== "object") return null;
					if (typeof entryProps.useWorkspaces !== "function" || typeof entryProps.useSessions !== "function") return null;
					return React.createElement(ArchivedSection, {
						close: typeof entryProps.close === "function" ? entryProps.close : undefined,
						useSessions: entryProps.useSessions,
						useWorkspaces: entryProps.useWorkspaces,
						ctx: ctx,
						t: t,
						locale: locale
					});
				}
			));
		}

		exports.apply = apply;
		exports.inject = ["slots", "locale", "connection"];
		return module.exports;
	}
});
