import Link from "next/link";

export default function RoleNav({ current }: { current?: string }) {
  return (
    <nav className="nav">
      <Link href="/" className={`link-btn ${current === "home" ? "active" : ""}`}>
        Home Demo
      </Link>
      <Link href="/customer" className={`link-btn ${current === "customer" ? "active" : ""}`}>
        User Portal
      </Link>
      <Link href="/admin" className={`link-btn ${current === "admin" ? "active" : ""}`}>
        Admin Dashboard
      </Link>
      <Link href="/vendor" className={`link-btn ${current === "vendor" ? "active" : ""}`}>
        Vendor Portal
      </Link>
      <Link href="/legacy" className={`link-btn ${current === "legacy" ? "active" : ""}`}>
        Legacy Source Copies
      </Link>
    </nav>
  );
}
