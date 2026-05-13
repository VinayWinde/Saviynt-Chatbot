import { useState } from "react";
import TypeBadge from "./TypeBadge";
import CopyBtn from "./CopyBtn";

function csvDownload(cols, rows, name) {
  const lines = [
    cols.join(","),
    ...rows.map((r) =>
      r.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")
    )
  ];

  const url = URL.createObjectURL(
    new Blob([lines.join("\n")], { type: "text/csv" })
  );

  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();

  URL.revokeObjectURL(url);
}

export default function ResultCard({ msg }) {
  const [open, setOpen] = useState(false);
  const hasData = msg.columns?.length && msg.rows?.length;

  return (
    <div className="result-card">
      <div className="answer-box">
        <div className="meta-row">
          <TypeBadge type={msg.query_type} />
          <span className="complexity">{msg.complexity}</span>
          {(msg.tables_used || []).map((t) => (
            <code key={t}>{t}</code>
          ))}
        </div>
        <p>{msg.answer}</p>
      </div>

      <div className="sql-box">
        <div className="sql-header" onClick={() => setOpen(!open)}>
          <div>
            <span className="sql-label">SQL</span>
            <span>Generated Query</span>
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <CopyBtn text={msg.sql} />
            <button className="toggle-btn" onClick={() => setOpen(!open)}>
              {open ? "▲" : "▼"}
            </button>
          </div>
        </div>

        {open && (
          <pre className="sql-code">{msg.sql}</pre>
        )}
      </div>

      {hasData ? (
        <div className="table-box">
          <div className="table-header">
            <strong>Sample Results — {msg.rows.length} rows</strong>
            <button
              onClick={() =>
                csvDownload(
                  msg.columns,
                  msg.rows,
                  `saviynt_${msg.query_type}_${Date.now()}.csv`
                )
              }
            >
              ↓ CSV
            </button>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {msg.columns.map((c) => (
                    <th key={c}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {msg.rows.map((row, i) => (
                  <tr key={i}>
                    {(Array.isArray(row) ? row : Object.values(row)).map((v, j) => (
                      <td key={j}>{v || "NULL"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : msg.dataLoading ? (
        <div className="loading-small">Generating sample data...</div>
      ) : null}
    </div>
  );
}