import RoleNav from "@/components/RoleNav";

const copiedProjects = [
  {
    name: "front-end",
    path: "nextjs-demo/legacy/front-end",
    description: "UI and logic for customer portal (source copied as requested).",
  },
  {
    name: "admin-dashboard",
    path: "nextjs-demo/legacy/admin-dashboard",
    description: "UI and logic for admin dashboard (source copied as requested).",
  },
  {
    name: "vendor-front-end",
    path: "nextjs-demo/legacy/vendor-front-end",
    description: "UI and logic for vendor dashboard (source copied as requested).",
  },
];

export default function LegacyPage() {
  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">Legacy Source Copies</h1>
          <p className="subtle">Toan bo source 3 giao dien da duoc copy vao thu muc legacy.</p>
        </div>
        <RoleNav current="legacy" />
      </header>

      <section className="grid cols-3">
        {copiedProjects.map((project) => (
          <article className="card" key={project.name}>
            <h3>{project.name}</h3>
            <p className="subtle">{project.description}</p>
            <p>
              <code>{project.path}</code>
            </p>
          </article>
        ))}
      </section>

      <section className="note" style={{ marginTop: 14 }}>
        Cac source nay duoc giu de doi chieu UI/logic goc, con phan demo deploy Vercel su dung Next.js pages + fake data.
      </section>
    </main>
  );
}
