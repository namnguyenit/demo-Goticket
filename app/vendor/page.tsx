import RoleNav from "@/components/RoleNav";
import {
  bookings,
  formatVnd,
  getRouteLabel,
  trips,
  users,
  vehicles,
  vendors,
} from "@/lib/fake-data";

export default function VendorPage() {
  const selectedVendor = vendors[0];
  const vendorTrips = trips.filter((trip) => trip.vendorId === selectedVendor.id);
  const vendorVehicleCount = vehicles.filter((vehicle) => vehicle.vendorId === selectedVendor.id).length;
  const vendorBookings = bookings.filter((booking) =>
    vendorTrips.some((trip) => trip.id === booking.tripId),
  );

  return (
    <main className="page">
      <header className="header">
        <div>
          <h1 className="title">Vendor Portal Demo</h1>
          <p className="subtle">Giao dien nha xe: quan ly phuong tien, chuyen va don hang.</p>
        </div>
        <RoleNav current="vendor" />
      </header>

      <section className="note">
        Dang demo voi nha xe <strong>{selectedVendor.companyName}</strong> ({vendorVehicleCount} phuong tien)
      </section>

      <section className="grid cols-3" style={{ marginTop: 14 }}>
        <article className="card">
          <h3>Total Trips</h3>
          <div className="kpi">{vendorTrips.length}</div>
        </article>
        <article className="card">
          <h3>Total Bookings</h3>
          <div className="kpi">{vendorBookings.length}</div>
        </article>
        <article className="card">
          <h3>Revenue</h3>
          <div className="kpi">{formatVnd(vendorBookings.reduce((sum, item) => sum + item.totalPrice, 0))}</div>
        </article>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Danh sach phuong tien</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ten xe</th>
                <th>Loai</th>
                <th>Bien so</th>
                <th>Tong ghe</th>
              </tr>
            </thead>
            <tbody>
              {vehicles
                .filter((vehicle) => vehicle.vendorId === selectedVendor.id)
                .map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.name}</td>
                    <td>{vehicle.vehicleType}</td>
                    <td>{vehicle.licensePlate ?? "-"}</td>
                    <td>{vehicle.totalSeats}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card" style={{ marginTop: 14 }}>
        <h3>Booking cua nha xe</h3>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Customer</th>
                <th>Tuyen</th>
                <th>Tong tien</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vendorBookings.map((booking) => {
                const trip = trips.find((item) => item.id === booking.tripId);
                const user = users.find((item) => item.id === booking.userId);
                const statusClass =
                  booking.status === "confirmed"
                    ? "ok"
                    : booking.status === "pending"
                      ? "warn"
                      : "bad";

                return (
                  <tr key={booking.id}>
                    <td>{booking.bookingCode}</td>
                    <td>{user?.name ?? "Unknown"}</td>
                    <td>{trip ? getRouteLabel(trip.routeId) : "Unknown"}</td>
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
