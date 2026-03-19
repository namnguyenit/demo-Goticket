import RoleNav from "@/components/RoleNav";
import {
  bookings,
  getUserName,
  getVendorName,
  trips,
  users,
  vendors,
} from "@/lib/fake-data";

export default function AdminPage() {
  const customerCount = users.filter((user) => user.role === "customer").length;
  const vendorUserCount = users.filter((user) => user.role === "vendor").length;
  const activeVendors = vendors.filter((vendor) => vendor.status === "active").length;

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">Admin Dashboard Demo</h1>
          <p className="subtle">Tong quan he thong dat xe voi so lieu fake.</p>
        </div>
        <RoleNav current="admin" />
      </header>

      <section className="grid cols-3">
        <article className="card">
          <h3>Customers</h3>
          <div className="kpi">{customerCount}</div>
        </article>
        <article className="card">
          <h3>Vendor Accounts</h3>
          <div className="kpi">{vendorUserCount}</div>
        </article>
        <article className="card">
          <h3>Active Vendors</h3>
          <div className="kpi">{activeVendors}</div>
        </article>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Danh sach vendor</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Owner</th>
                <th>Address</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => {
                const owner = users.find((item) => item.id === vendor.userId);
                const statusClass =
                  vendor.status === "active" ? "ok" : vendor.status === "pending" ? "warn" : "bad";

                return (
                  <tr key={vendor.id}>
                    <td>{vendor.companyName}</td>
                    <td>{owner?.name ?? "Unknown"}</td>
                    <td>{vendor.address}</td>
                    <td>
                      <span className={`badge ${statusClass}`}>{vendor.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Recent Bookings</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Customer</th>
                <th>Vendor</th>
                <th>Trip ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const trip = trips.find((item) => item.id === booking.tripId);
                const statusClass =
                  booking.status === "confirmed"
                    ? "ok"
                    : booking.status === "pending"
                      ? "warn"
                      : "bad";

                return (
                  <tr key={booking.id}>
                    <td>{booking.bookingCode}</td>
                    <td>{getUserName(booking.userId)}</td>
                    <td>{trip ? getVendorName(trip.vendorId) : "Unknown"}</td>
                    <td>{booking.tripId}</td>
                    <td>
                      <span className={`badge ${statusClass}`}>{booking.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
