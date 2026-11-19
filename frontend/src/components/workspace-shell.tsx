"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const users = [
  { email: "alex@meridianlabs.example", name: "Alex Rivera", role: "Creator" },
  { email: "dana@meridianlabs.example", name: "Dana Kim", role: "Reviewer" },
  { email: "morgan@meridianlabs.example", name: "Morgan Lee", role: "Brand manager" },
];

const nav = [
  { href: "/workspace", number: "01", label: "Overview" },
  { href: "/workspace/knowledge", number: "02", label: "Brand knowledge" },
  { href: "/workspace/review", number: "03", label: "Review studio" },
  { href: "/workspace/approvals", number: "04", label: "Approvals" },
  { href: "/workspace/impact", number: "05", label: "Impact radar" },
];

const platformNav = [
  { href: "/workspace/analytics", number: "06", label: "Analytics" },
  { href: "/workspace/integrations", number: "07", label: "Integrations" },
  { href: "/workspace/settings", number: "08", label: "Settings" },
];

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState(users[0].email);

  useEffect(() => {
    const saved = localStorage.getItem("proofgate-demo-user");
    if (saved && users.some((user) => user.email === saved)) setEmail(saved);
  }, []);

  const current = users.find((user) => user.email === email) ?? users[0];

  function switchUser(value: string) {
    setEmail(value);
    localStorage.setItem("proofgate-demo-user", value);
    // Clear any cached token so requests re-authenticate for the selected role
    localStorage.removeItem("proofgate-jwt-token");
    queryClient.clear();
    window.dispatchEvent(new Event("proofgate-user-change"));
  }

  function handleLogout() {
    localStorage.removeItem("proofgate-jwt-token");
    localStorage.removeItem("proofgate-demo-user");
    queryClient.clear();
    router.push("/login");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand-lockup" href="/workspace">
          <span className="brand-mark"><i /><i /></span>
          <b>PROOFGATE</b>
        </Link>
        <div className="sidebar-caption">POLICY / EVIDENCE / CONTROL</div>
        <div className="sidebar-rule" />
        
        <div className="sidebar-label">01&nbsp; WORKSPACE</div>
        <nav className="side-nav" aria-label="Workspace">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              <span>{item.number}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-label platform-label">02&nbsp; PLATFORM</div>
        <nav className="side-nav" aria-label="Platform">
          {platformNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${pathname === item.href ? "active" : ""}`}
            >
              <span>{item.number}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="workspace-health">
          <small>WORKSPACE HEALTH</small>
          <strong>DEMO WORKSPACE</strong>
          <span>LOCAL SYNTHETIC DATA</span>
        </div>

        <div className="sidebar-user">
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", minWidth: 0, flex: 1 }}>
            <span className="avatar">
              {current.name.split(" ").map((part) => part[0]).join("")}
            </span>
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <strong>{current.name}</strong>
              <small>{current.role.toUpperCase()}</small>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of ProofGate"
            style={{
              flexShrink: 0,
              background: "#1c231e",
              border: "1px solid #364239",
              color: "#a4b3a6",
              cursor: "pointer",
              padding: "4px 7px",
              fontSize: "0.65rem",
              fontFamily: '"IBM Plex Mono", monospace',
              letterSpacing: "0.06em",
              borderRadius: "2px",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#FF5252";
              (e.currentTarget as HTMLButtonElement).style.color = "#FF5252";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255, 82, 82, 0.1)";
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#364239";
              (e.currentTarget as HTMLButtonElement).style.color = "#a4b3a6";
              (e.currentTarget as HTMLButtonElement).style.background = "#1c231e";
            }}
          >
            LOGOUT
          </button>
        </div>
      </aside>

      <main className="workspace-main">
        <div className="utility-bar">
          <span>PROOFGATE&nbsp;&nbsp; / &nbsp;&nbsp;MERIDIAN LABS&nbsp;&nbsp; / &nbsp;&nbsp;WORKSPACE</span>
          <div>
            <span className="confidential">CONFIDENTIAL&nbsp; • &nbsp;DEMO ENVIRONMENT</span>
            <label className="user-switch">
              <span>ACT AS</span>
              <select
                aria-label="Demo user"
                value={email}
                onChange={(event) => switchUser(event.target.value)}
              >
                {users.map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.name} · {user.role}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
        <div className="workspace-content">{children}</div>
      </main>
    </div>
  );
}
