import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogById, getTripById } from "@/lib/fake-api-db";

export const dynamic = "force-dynamic";

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = getBlogById(Number(id));

  if (!blog) {
    notFound();
  }

  const relatedTrips = blog.trip_ids
    .map((tripId) => getTripById(tripId))
    .filter((trip) => !!trip)
    .map((trip) => ({
      id: trip.id,
      route: `${trip.origin_location_id} -> ${trip.destination_location_id}`,
      vendor: trip.vendor_name,
      depart: trip.departure_datetime,
    }));

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">{blog.title}</h1>
          <p className="subtle">
            {blog.author} • {new Date(blog.published_at).toLocaleString("vi-VN")}
          </p>
        </div>
        <div className="nav">
          <Link href="/blog" className="link-btn">
            Tat ca bai viet
          </Link>
          <Link href="/" className="link-btn">
            Ve trang dat ve
          </Link>
        </div>
      </header>

      <article className="card" style={{ marginBottom: 14 }}>
        <img
          src={blog.thumbnail}
          alt={blog.title}
          style={{ width: "100%", maxHeight: 420, objectFit: "cover", borderRadius: 12, marginBottom: 14 }}
        />
        <p style={{ lineHeight: 1.75, margin: 0 }}>{blog.content}</p>
      </article>

      <section className="card">
        <h3>Chuyen lien quan</h3>
        {relatedTrips.length === 0 ? (
          <p className="subtle">Chua co du lieu chuyen lien quan.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Trip ID</th>
                  <th>Nha xe</th>
                  <th>Khoi hanh</th>
                </tr>
              </thead>
              <tbody>
                {relatedTrips.map((trip) => (
                  <tr key={trip.id}>
                    <td>{trip.id}</td>
                    <td>{trip.vendor}</td>
                    <td>{new Date(trip.depart).toLocaleString("vi-VN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
