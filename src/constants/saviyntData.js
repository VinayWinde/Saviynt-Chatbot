export const QT = {
  user_access: { label: "User Access", bg: "#EBF4FF", tx: "#1D4ED8", dot: "#3B82F6" },
  endpoint_access: { label: "Endpoint Access", bg: "#ECFDF5", tx: "#065F46", dot: "#10B981" },
  role_based: { label: "Role Based", bg: "#F5F3FF", tx: "#5B21B6", dot: "#8B5CF6" },
  sod_risk: { label: "SoD Risk", bg: "#FFF7ED", tx: "#9A3412", dot: "#F97316" },
  request_audit: { label: "Request Audit", bg: "#EFF6FF", tx: "#1E40AF", dot: "#60A5FA" },
  privileged_access: { label: "Privileged Access", bg: "#FFF1F2", tx: "#9F1239", dot: "#F43F5E" },
  orphan_accounts: { label: "Orphan Accounts", bg: "#F5F5F4", tx: "#44403C", dot: "#78716C" },
  compliance: { label: "Compliance", bg: "#F0FDFA", tx: "#134E4A", dot: "#14B8A6" }
};

export const SUGGESTIONS = [
  { icon: "🏢", label: "SAP Endpoint Access", q: "Show all users who have access to SAP endpoints with their account status" },
  { icon: "🔑", label: "Privileged Accounts", q: "List all users with privileged accounts or privileged entitlements across all endpoints" },
  { icon: "👻", label: "Orphan Accounts", q: "Find all orphan accounts that have no linked active users" },
  { icon: "⚠️", label: "SoD Conflicts", q: "Show users with SOD risk entitlements and their risk severity level" },
  { icon: "❌", label: "Failed Provisioning", q: "List all failed provisioning tasks with user and endpoint details" }
];

export const SCHEMA_TABLES = [
  { name: "users", desc: "Core identity records", cols: ["USERKEY", "USERNAME", "EMAIL", "STATUSKEY", "ENABLED", "DEPARTMENTNAME", "RISKSCORE"] },
  { name: "accounts", desc: "Application accounts", cols: ["ACCOUNTKEY", "ACCOUNTID", "ENDPOINTKEY", "STATUS", "ORPHAN", "PRIVILEGED"] },
  { name: "endpoints", desc: "Application endpoints", cols: ["ENDPOINTKEY", "ENDPOINTNAME", "SECURITYSYSTEMKEY", "STATUS"] },
  { name: "securitysystems", desc: "Security systems", cols: ["SYSTEMKEY", "SYSTEMNAME", "DISPLAYNAME", "STATUS"] },
  { name: "entitlement_values", desc: "Entitlements", cols: ["ENTITLEMENT_VALUEKEY", "ENTITLEMENT_VALUE", "PRIVILEGED", "SOD", "SOX_CRITICAL"] },
  { name: "roles", desc: "Business roles", cols: ["ROLEKEY", "ROLE_NAME", "ROLE_STATUS", "RISK", "PRIVILEGED"] },
  { name: "ars_requests", desc: "Access requests", cols: ["REQUESTKEY", "REQUESTID", "USERKEY", "STATUS", "REQUESTOR"] },
  { name: "arstasks", desc: "Provisioning tasks", cols: ["TASKKEY", "REQUESTKEY", "STATUS", "TASKTYPE"] }
];