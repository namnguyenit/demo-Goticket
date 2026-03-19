import RoleNav from "@/components/RoleNav";
import {
  bookings,
  formatVnd,
  getRouteLabel,
  getVendorName,
  trips,
  users,
} from "@/lib/fake-data";

export default function CustomerPage() {
  const customer = users.find((user) => user.role === "customer");

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">User Portal Demo</h1>
          <p className="subtle">Giao dien khach hang: tim chuyen, dat cho, theo doi ve.</p>
        </div>
        <RoleNav current="customer" />
      </header>

      <section className="note">Dang demo voi user: <strong>{customer?.name}</strong> ({customer?.email})</section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Chuyen xe noi bat</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Tuyen</th>
                <th>Nha xe</th>
                <th>Khoi hanh</th>
                <th>Gia co ban</th>
                <th>Cho trong</th>
                <th>Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((trip) => {
                const statusClass =
                  trip.status === "cancelled"
                    ? "bad"
                    : trip.status === "scheduled"
                      ? "ok"
                      : "warn";

                return (
                  <tr key={trip.id}>
                    <td>{getRouteLabel(trip.routeId)}</td>
                    <td>{getVendorName(trip.vendorId)}</td>
                    <td>{new Date(trip.departureDatetime).toLocaleString("vi-VN")}</td>
                    <td>{formatVnd(trip.basePrice)}</td>
                    <td>{trip.availableSeats}</td>
                    <td>
                      <span className={`badge ${statusClass}`}>{trip.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Lich su dat ve</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ma dat cho</th>
                <th>Chuyen</th>
                <th>Ghe</th>
                <th>Tong tien</th>
                <th>Trang thai</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const trip = trips.find((item) => item.id === booking.tripId);
                const statusClass =
                  booking.status === "confirmed"
                    ? "ok"
                    : booking.status === "cancelled"
                      ? "bad"
                      : "warn";

                return (
                  <tr key={booking.id}>
                    <td>{booking.bookingCode}</td>
                    <td>{trip ? getRouteLabel(trip.routeId) : "Unknown"}</td>
                    <td>{booking.seats.join(", ")}</td>
                    <td>{formatVnd(booking.totalPrice)}</td>
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
