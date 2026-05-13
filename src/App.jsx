import { useCallback, useEffect, useRef, useState } from "react";
import CopyBtn from "./components/CopyBtn";
import { DATA_SYSTEM, SQL_SYSTEM } from "./constants/prompts";
import ResultCard from "./components/ResultCard";
import TypeBadge from "./components/TypeBadge";
import { SCHEMA_TABLES, SUGGESTIONS } from "./constants/saviyntData";
import { openRouterCall } from "./api/openRouterApi";
import "./App.css";


function parseJSON(raw) {
  if (!raw) return null;

  let text = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch {}

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }

  return null;
}

export default function App() {
  const [msgs, setMsgs] = useState([{ id: 0, role: "bot", type: "welcome" }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState("chat");

  const bottomRef = useRef(null);
  const idRef = useRef(1);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const patch = useCallback((id, delta) => {
    setMsgs((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...delta } : m))
    );
  }, []);

  const send = useCallback(
    async (text) => {
      const question = (text || input).trim();
      if (!question || busy) return;

      setInput("");
      setBusy(true);

      const userId = idRef.current++;
      const botId = idRef.current++;

      setMsgs((prev) => [
        ...prev,
        { id: userId, role: "user", text: question },
        { id: botId, role: "bot", type: "loading" }
      ]);

      try {
        const rawSql = await openRouterCall(SQL_SYSTEM, question, 3000);
        const sqlResult = parseJSON(rawSql);

        if (!sqlResult?.sql) {
          patch(botId, {
            type: "error",
            text: "Could not generate SQL. Try rephrasing your question."
          });
          return;
        }

        patch(botId, {
          type: "result",
          answer: sqlResult.answer || "",
          sql: sqlResult.sql,
          query_type: sqlResult.query_type || "user_access",
          complexity: sqlResult.complexity || "medium",
          tables_used: sqlResult.tables_used || [],
          columns: [],
          rows: [],
          dataLoading: true
        });

        try {
          const rawData = await openRouterCall(
            DATA_SYSTEM,
            `SQL:\n${sqlResult.sql}\n\nGenerate 6 realistic sample rows.`,
            1500
          );

          const dataResult = parseJSON(rawData);

          if (dataResult?.columns && Array.isArray(dataResult.rows)) {
            patch(botId, {
              columns: dataResult.columns,
              rows: dataResult.rows,
              dataLoading: false
            });
          } else {
            patch(botId, { dataLoading: false });
          }
        } catch {
          patch(botId, { dataLoading: false });
        }
      } catch (err) {
        patch(botId, {
          type: "error",
          text: err.message
        });
      } finally {
        setBusy(false);
      }
    },
    [input, busy, patch]
  );

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const results = msgs.filter((m) => m.type === "result");

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">🔐</div>
          <div>
            <h1>SaviyntBot</h1>
            <p>Identity Cloud · SQL Query Assistant</p>
          </div>
        </div>

        <nav>
          {["chat", "history", "schema"].map((item) => (
            <button
              key={item}
              className={tab === item ? "active" : ""}
              onClick={() => setTab(item)}
            >
              {item}
            </button>
          ))}
        </nav>
      </header>

      {tab === "chat" && (
        <>
          <main className="chat-area">
            {msgs.map((m) => (
              <div key={m.id}>
                {m.role === "user" && (
                  <div className="user-row">
                    <div className="user-msg">{m.text}</div>
                  </div>
                )}

                {m.role === "bot" && m.type === "welcome" && (
                  <div className="bot-row">
                    <div className="bot-avatar">🔐</div>
                    <div className="bot-msg">
                      Hello! I am <strong>SaviyntBot</strong>. Ask me about users,
                      accounts, endpoints, entitlements, SoD risks, privileged
                      access, or provisioning requests.
                    </div>
                  </div>
                )}

                {m.role === "bot" && m.type === "loading" && (
                  <div className="bot-row">
                    <div className="bot-avatar">🔐</div>
                    <div className="bot-msg">Generating SQL...</div>
                  </div>
                )}

                {m.role === "bot" && m.type === "result" && (
                  <div className="bot-row">
                    <div className="bot-avatar">🔐</div>
                    <ResultCard msg={m} />
                  </div>
                )}

                {m.role === "bot" && m.type === "error" && (
                  <div className="bot-row">
                    <div className="bot-avatar error">!</div>
                    <div className="error-box">{m.text}</div>
                  </div>
                )}
              </div>
            ))}

            {msgs.length <= 1 && (
              <section className="suggestions">
                <p>Quick-start queries:</p>
                <div>
                  {SUGGESTIONS.map((s) => (
                    <button key={s.label} onClick={() => send(s.q)}>
                      <span>{s.icon}</span>
                      {s.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            <div ref={bottomRef} />
          </main>

          <footer className="input-area">
            <div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about users, endpoints, SoD risks, privileged access..."
                disabled={busy}
              />

              <button disabled={busy || !input.trim()} onClick={() => send()}>
                {busy ? "..." : "Send →"}
              </button>
            </div>

            <p>Powered by OpenRouter · Saviynt Identity Cloud · SELECT-only</p>
          </footer>
        </>
      )}

      {tab === "history" && (
        <main className="page">
          <h2>Query History</h2>

          {results.length === 0 ? (
            <p>No queries yet.</p>
          ) : (
            results
              .slice()
              .reverse()
              .map((r, i) => (
                <div className="history-card" key={r.id}>
                  <div>
                    <span>#{results.length - i}</span>
                    <TypeBadge type={r.query_type} />
                  </div>

                  <p>{r.answer}</p>
                  <CopyBtn text={r.sql} />
                </div>
              ))
          )}
        </main>
      )}

      {tab === "schema" && (
        <main className="page">
          <h2>Schema Reference</h2>

          {SCHEMA_TABLES.map((t) => (
            <div className="schema-card" key={t.name}>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <div>
                {t.cols.map((c) => (
                  <code key={c}>{c}</code>
                ))}
              </div>
            </div>
          ))}
        </main>
      )}
    </div>
  );
}