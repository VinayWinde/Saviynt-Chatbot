import { useState } from "react";

export default function CopyBtn({ text }) {
  const [ok, setOk] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text || "");
    setOk(true);
    setTimeout(() => setOk(false), 1500);
  };

  return (
    <button className="copy-btn" onClick={copy}>
      {ok ? "✓ Copied" : "⧉ Copy SQL"}
    </button>
  );
}