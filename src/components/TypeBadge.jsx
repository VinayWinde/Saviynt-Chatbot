import { QT } from "../constants/saviyntData";

export default function TypeBadge({ type }) {
  const item = QT[type] || QT.user_access;

  return (
    <span
      className="type-badge"
      style={{ background: item.bg, color: item.tx }}
    >
      <span style={{ background: item.dot }} />
      {item.label}
    </span>
  );
}