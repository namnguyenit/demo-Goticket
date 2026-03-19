import Link from "next/link";
import { listBlogs } from "@/lib/fake-api-db";

export const dynamic = "force-dynamic";

export default function BlogPage() {
  const blogs = listBlogs().slice().sort((a, b) => +new Date(b.published_at) - +new Date(a.published_at));

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">Blog GoTicket</h1>
          <p className="subtle">Tin tuc, kinh nghiem di chuyen va cam nang dat ve.</p>
        </div>
        <Link href="/" className="link-btn">
          Ve trang dat ve
        </Link>
      </header>

      <section className="grid cols-2">
        {blogs.map((blog) => (
          <article className="card" key={blog.id}>
            <img
              src={blog.thumbnail}
              alt={blog.title}
              style={{ width: "100%", height: 210, objectFit: "cover", borderRadius: 10, marginBottom: 12 }}
            />
            <div style={{ marginBottom: 8 }}>
              <span className="badge warn">{blog.tag}</span>
            </div>
            <h3 style={{ marginBottom: 8 }}>{blog.title}</h3>
            <p className="subtle" style={{ marginBottom: 10 }}>
              {blog.excerpt}
            </p>
            <p style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
              {blog.author} • {new Date(blog.published_at).toLocaleDateString("vi-VN")}
            </p>
            <Link href={`/blog/${blog.id}`} className="link-btn active">
              Doc chi tiet
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
