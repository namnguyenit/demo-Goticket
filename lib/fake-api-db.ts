import { randomUUID } from "node:crypto";

export type Role = "customer" | "vendor" | "admin";
export type SeatStatus = "available" | "booked";

export interface DemoUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}

interface LocationItem {
  id: number;
  name: string;
}

interface StopItem {
  id: number;
  name: string;
  address: string;
}

interface SeatItem {
  id: number;
  seat_number: string;
  status: SeatStatus;
  price: number;
}

interface CoachItem {
  id: number;
  identifier: string;
  coach_type: string;
  total_seats: number;
  seats: SeatItem[];
}

interface TripItem {
  id: number;
  origin_location_id: number;
  destination_location_id: number;
  departure_datetime: string;
  arrival_datetime: string;
  vendor_name: string;
  vendor_type: "bus" | "train";
  imageLink: string | null;
  pickTake: string | null;
  coaches: CoachItem[];
  pickup_points: StopItem[];
  dropoff_points: StopItem[];
}

interface BlogItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  thumbnail: string;
  tag: string;
  trip_ids: number[];
}

interface BookingItem {
  id: number;
  booking_code: string;
  user_id: number;
  trip_id: number;
  seat_ids: number[];
  pickup_stop_id: number;
  dropoff_stop_id: number;
  total_price: number;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

const locations: LocationItem[] = [
  { id: 1, name: "Ho Chi Minh" },
  { id: 2, name: "Da Nang" },
  { id: 3, name: "Ha Noi" },
  { id: 4, name: "Nha Trang" },
  { id: 5, name: "Can Tho" },
];

const users: DemoUser[] = [
  { id: 1, name: "Demo Customer", email: "customer@demo.local", phone: "0901000001", password: "123456", role: "customer" },
  { id: 2, name: "Demo Admin", email: "admin@demo.local", phone: "0901000002", password: "123456", role: "admin" },
  { id: 3, name: "Demo Vendor", email: "vendor@demo.local", phone: "0901000003", password: "123456", role: "vendor" },
];

let seatSeq = 10000;

function buildSeats(prefix: string, from: number, to: number, price: number, booked: number[] = []): SeatItem[] {
  const seats: SeatItem[] = [];
  for (let i = from; i <= to; i += 1) {
    seatSeq += 1;
    seats.push({
      id: seatSeq,
      seat_number: `${prefix}${String(i).padStart(2, "0")}`,
      status: booked.includes(i) ? "booked" : "available",
      price,
    });
  }
  return seats;
}

const trips: TripItem[] = [
  {
    id: 101,
    origin_location_id: 1,
    destination_location_id: 2,
    departure_datetime: "2026-03-20T08:00:00+07:00",
    arrival_datetime: "2026-03-20T19:00:00+07:00",
    vendor_name: "GoBus Express",
    vendor_type: "bus",
    imageLink: "/trip-logo.png",
    pickTake: "Ben xe Mien Dong - Da Nang Center",
    coaches: [
      {
        id: 501,
        identifier: "Coach-01",
        coach_type: "sleeper",
        total_seats: 34,
        seats: buildSeats("A", 1, 34, 420000, [3, 7, 12, 15]),
      },
    ],
    pickup_points: [
      { id: 1001, name: "Ben xe Mien Dong", address: "292 Dinh Bo Linh, Binh Thanh" },
      { id: 1002, name: "Nga tu Thu Duc", address: "QL13, Thu Duc" },
    ],
    dropoff_points: [
      { id: 1003, name: "Da Nang Center", address: "Hai Chau, Da Nang" },
      { id: 1004, name: "Da Nang Station", address: "Thanh Khe, Da Nang" },
    ],
  },
  {
    id: 102,
    origin_location_id: 2,
    destination_location_id: 3,
    departure_datetime: "2026-03-20T21:30:00+07:00",
    arrival_datetime: "2026-03-21T10:00:00+07:00",
    vendor_name: "SkyRail Vietnam",
    vendor_type: "train",
    imageLink: "/trip-logo.png",
    pickTake: "Da Nang Station - Ha Noi Station",
    coaches: [
      {
        id: 601,
        identifier: "VIP-A",
        coach_type: "seat_VIP",
        total_seats: 24,
        seats: buildSeats("V", 1, 24, 560000, [2, 4, 6]),
      },
      {
        id: 602,
        identifier: "SOFT-B",
        coach_type: "seat_soft",
        total_seats: 40,
        seats: buildSeats("S", 1, 40, 480000, [1, 5, 10, 11]),
      },
    ],
    pickup_points: [
      { id: 1101, name: "Da Nang Station", address: "Thanh Khe, Da Nang" },
    ],
    dropoff_points: [
      { id: 1102, name: "Ha Noi Station", address: "Le Duan, Ha Noi" },
      { id: 1103, name: "Gia Lam Station", address: "Ngoc Lam, Ha Noi" },
    ],
  },
  {
    id: 103,
    origin_location_id: 1,
    destination_location_id: 4,
    departure_datetime: "2026-03-21T07:00:00+07:00",
    arrival_datetime: "2026-03-21T15:30:00+07:00",
    vendor_name: "Mekong Trips",
    vendor_type: "bus",
    imageLink: "/trip-logo.png",
    pickTake: "District 1 - Nha Trang City",
    coaches: [
      {
        id: 503,
        identifier: "Coach-03",
        coach_type: "sleeper_vip",
        total_seats: 22,
        seats: buildSeats("B", 1, 22, 390000, [8, 9, 10]),
      },
    ],
    pickup_points: [
      { id: 1201, name: "District 1", address: "Quan 1, Ho Chi Minh" },
    ],
    dropoff_points: [
      { id: 1202, name: "Nha Trang Center", address: "Tran Phu, Nha Trang" },
    ],
  },
];

let tripSeq = 1000;
let coachSeq = 700;
let stopSeq = 2000;

function buildBusCoaches(basePrice: number, variant: number): CoachItem[] {
  const booked = [2 + (variant % 5), 7 + (variant % 6), 15 + (variant % 4)];
  coachSeq += 1;
  return [
    {
      id: coachSeq,
      identifier: `Coach-${coachSeq}`,
      coach_type: variant % 2 === 0 ? "sleeper" : "sleeper_vip",
      total_seats: 34,
      seats: buildSeats("A", 1, 34, basePrice, booked),
    },
  ];
}

function buildTrainCoaches(basePrice: number, variant: number): CoachItem[] {
  coachSeq += 1;
  const vip: CoachItem = {
    id: coachSeq,
    identifier: `VIP-${coachSeq}`,
    coach_type: "seat_VIP",
    total_seats: 24,
    seats: buildSeats("V", 1, 24, basePrice + 90000, [1 + (variant % 5), 4 + (variant % 7)]),
  };

  coachSeq += 1;
  const soft: CoachItem = {
    id: coachSeq,
    identifier: `SOFT-${coachSeq}`,
    coach_type: "seat_soft",
    total_seats: 40,
    seats: buildSeats("S", 1, 40, basePrice, [3 + (variant % 6), 12 + (variant % 8), 20 + (variant % 5)]),
  };

  return [vip, soft];
}

function generateExtraTrips(): TripItem[] {
  const extra: TripItem[] = [];
  const departures = [
    { day: 20, hour: 6, minute: 30 },
    { day: 20, hour: 13, minute: 45 },
    { day: 21, hour: 21, minute: 15 },
  ];

  for (const origin of locations) {
    for (const destination of locations) {
      if (origin.id === destination.id) {
        continue;
      }

      for (const [slotIndex, slot] of departures.entries()) {
        for (const vehicleType of ["bus", "train"] as const) {
          tripSeq += 1;
          const variant = tripSeq + slotIndex + origin.id + destination.id;
          const basePrice = 220000 + (Math.abs(origin.id - destination.id) * 70000) + (slotIndex * 25000);
          const durationHours = vehicleType === "train" ? 9 + (variant % 4) : 6 + (variant % 3);

          const depart = new Date(Date.UTC(2026, 2, slot.day, slot.hour - 7, slot.minute, 0));
          const arrive = new Date(depart.getTime() + durationHours * 60 * 60 * 1000);

          stopSeq += 1;
          const pickupMain: StopItem = {
            id: stopSeq,
            name: `${origin.name} Main Stop`,
            address: `${origin.name} Terminal A`,
          };

          stopSeq += 1;
          const pickupSub: StopItem = {
            id: stopSeq,
            name: `${origin.name} Center`,
            address: `${origin.name} Center Station`,
          };

          stopSeq += 1;
          const dropMain: StopItem = {
            id: stopSeq,
            name: `${destination.name} Main Stop`,
            address: `${destination.name} Terminal B`,
          };

          stopSeq += 1;
          const dropSub: StopItem = {
            id: stopSeq,
            name: `${destination.name} Downtown`,
            address: `${destination.name} Downtown Station`,
          };

          extra.push({
            id: tripSeq,
            origin_location_id: origin.id,
            destination_location_id: destination.id,
            departure_datetime: depart.toISOString(),
            arrival_datetime: arrive.toISOString(),
            vendor_name: vehicleType === "train" ? "SkyRail Vietnam" : "GoBus Express",
            vendor_type: vehicleType,
            imageLink: "/trip-logo.png",
            pickTake: `${origin.name} - ${destination.name}`,
            coaches: vehicleType === "train" ? buildTrainCoaches(basePrice, variant) : buildBusCoaches(basePrice, variant),
            pickup_points: [pickupMain, pickupSub],
            dropoff_points: [dropMain, dropSub],
          });
        }
      }
    }
  }

  return extra;
}

trips.push(...generateExtraTrips());

const blogs: BlogItem[] = [
  {
    id: 1,
    title: "Top 5 hanh trinh dep nhat nam 2026",
    excerpt: "Tong hop cac cung duong duoc dat ve nhieu nhat trong nam.",
    content:
      "Cung Ho Chi Minh - Da Nang va Da Nang - Ha Noi tiep tuc la lua chon hang dau nho lich trinh on dinh va dich vu chat luong. Khi dat ve som, ban co the chon duoc khung gio dep va vi tri ghe phu hop. Goi y: nen uu tien dat vao cuoi tuan truoc 2-3 ngay de tranh het cho.",
    author: "GoTicket Editorial",
    published_at: "2026-03-10T09:00:00+07:00",
    thumbnail: "/HomePage/deal-1.jpg",
    tag: "Diem den",
    trip_ids: [101, 102],
  },
  {
    id: 2,
    title: "Kinh nghiem dat ghe train VIP",
    excerpt: "Huong dan chon toa VIP de co trai nghiem thoai mai hon.",
    content:
      "Nen dat som tu 3-5 ngay truoc chuyen di. Vi tri toa gan khoang giua thuong it rung lac va nhieu cho trong hon. Neu di gia dinh, hay chon cung mot toa de thuan tien di chuyen va quan sat hanh ly.",
    author: "Travel Team",
    published_at: "2026-03-14T11:00:00+07:00",
    thumbnail: "/HomePage/deal-2.jpg",
    tag: "Kinh nghiem",
    trip_ids: [102],
  },
  {
    id: 3,
    title: "Checklist truoc khi len xe duong dai",
    excerpt: "5 buoc nho giup chuyen di an toan va thoai mai hon.",
    content:
      "Truoc gio khoi hanh, ban nen kiem tra giay to tuy than, xac nhan diem don, va den truoc it nhat 20 phut. Chuan bi nuoc uong, tai nghe, va san pham chong say xe neu can. Mot chiec tui nho gon se giup ban thao tac nhanh hon khi len xuong xe.",
    author: "Safety Team",
    published_at: "2026-03-16T08:30:00+07:00",
    thumbnail: "/HomePage/deal-3.jpg",
    tag: "An toan",
    trip_ids: [101, 103],
  },
  {
    id: 4,
    title: "Goi y lich trinh cuoi tuan Ho Chi Minh - Nha Trang",
    excerpt: "Lich trinh 2 ngay 1 dem toi uu chi phi cho nguoi moi.",
    content:
      "Neu ban khoi hanh toi thu Sau, den sang thu Bay la vua dep de tham quan bai bien va thu am thuc dia phuong. Chu Nhat co the ghe cac diem trung tam truoc khi ve lai thanh pho. Dat ve khu hoi chieu se giup tiet kiem hon.",
    author: "GoTicket Editorial",
    published_at: "2026-03-17T14:20:00+07:00",
    thumbnail: "/HomePage/deal-4.jpg",
    tag: "Lich trinh",
    trip_ids: [103],
  },
];

const bookings: BookingItem[] = [];
const tokens = new Map<string, number>();

let userSeq = 100;
let bookingSeq = 1000;

export function apiSuccess(data: unknown, message = "OK", status = 200) {
  return { success: true, status, message, data };
}

export function apiError(message = "Error", status = 400, data: unknown = null) {
  return { success: false, status, message, data };
}

export function listLocations() {
  return locations;
}

export function listBlogs() {
  return blogs;
}

export function getBlogById(id: number) {
  return blogs.find((blog) => blog.id === id) ?? null;
}

export function findUserByEmail(email: string) {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export function registerUser(payload: { name: string; email: string; phone: string; password: string }) {
  const exists = findUserByEmail(payload.email);
  if (exists) {
    return { error: "Email already exists" };
  }

  userSeq += 1;
  const user: DemoUser = {
    id: userSeq,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    password: payload.password,
    role: "customer",
  };
  users.push(user);
  return { user };
}

export function login(email: string, password: string) {
  const user = findUserByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }

  const token = `demo-${user.id}-${randomUUID()}`;
  tokens.set(token, user.id);
  return { token, user };
}

export function getUserByToken(authorizationHeader: string | null) {
  if (!authorizationHeader) {
    return null;
  }

  const token = authorizationHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) {
    return null;
  }

  const userId = tokens.get(token);
  if (!userId) {
    return null;
  }

  return users.find((user) => user.id === userId) ?? null;
}

export function updateUserByToken(authorizationHeader: string | null, payload: Partial<Pick<DemoUser, "name" | "phone" | "email">>) {
  const user = getUserByToken(authorizationHeader);
  if (!user) {
    return null;
  }

  if (payload.name) user.name = payload.name;
  if (payload.phone) user.phone = payload.phone;
  if (payload.email) user.email = payload.email;
  return user;
}

function getLocationName(id: number) {
  return locations.find((item) => item.id === id)?.name ?? "Unknown";
}

function tripPrice(trip: TripItem) {
  const all = trip.coaches.flatMap((coach) => coach.seats).map((seat) => seat.price);
  return all.length ? Math.min(...all) : 0;
}

function tripEmptySeats(trip: TripItem) {
  return trip.coaches.flatMap((coach) => coach.seats).filter((seat) => seat.status === "available").length;
}

function inTimeSlots(dateISO: string, slots: string[]) {
  if (!slots.length) return true;
  const date = new Date(dateISO);
  const mins = date.getHours() * 60 + date.getMinutes();
  return slots.some((slot) => {
    const [start, end] = slot.split("-");
    if (!start || !end) return true;
    const [sh, sm] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);
    const startM = sh * 60 + sm;
    const endM = eh * 60 + em;
    return mins >= startM && mins <= endM;
  });
}

export function searchTrips(query: URLSearchParams) {
  const origin = query.get("origin_location")?.toLowerCase() ?? "";
  const destination = query.get("destination_location")?.toLowerCase() ?? "";
  const vehicleType = (query.get("vehicle_type") ?? "").toLowerCase();
  const priceMin = Number(query.get("price_min") ?? 0);
  const priceMax = Number(query.get("price_max") ?? Number.MAX_SAFE_INTEGER);
  const timeSlots = query.getAll("time_slots[]");
  const coachTypes = query.getAll("coach_types[]").map((item) => item.toLowerCase());

  const perPage = Math.max(1, Math.min(50, Number(query.get("per_page") ?? 12)));
  const page = Math.max(1, Number(query.get("page") ?? 1));

  const filtered = trips.filter((trip) => {
    const originName = getLocationName(trip.origin_location_id).toLowerCase();
    const destinationName = getLocationName(trip.destination_location_id).toLowerCase();
    const price = tripPrice(trip);

    const byOrigin = origin ? originName.includes(origin) : true;
    const byDestination = destination ? destinationName.includes(destination) : true;
    const byVehicle = vehicleType ? trip.vendor_type === vehicleType : true;
    // Demo mode: date picker is visual-only, do not filter trips by date.
    const byDate = true;
    const byPrice = price >= priceMin && price <= priceMax;
    const byTime = inTimeSlots(trip.departure_datetime, timeSlots);
    const byCoachType = coachTypes.length
      ? trip.coaches.some((coach) => coachTypes.includes(coach.coach_type.toLowerCase()))
      : true;

    return byOrigin && byDestination && byVehicle && byDate && byPrice && byTime && byCoachType;
  });

  const start = (page - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

  return {
    data: pageItems.map((trip) => ({
      id: trip.id,
      trip: `${getLocationName(trip.origin_location_id)} - ${getLocationName(trip.destination_location_id)}`,
      imageLink: trip.imageLink,
      pickTake: trip.pickTake,
      departureDate: trip.departure_datetime,
      emptyNumber: tripEmptySeats(trip),
      vendorName: trip.vendor_name,
      vendorType: trip.vendor_type,
      coaches: trip.coaches,
      price: tripPrice(trip),
    })),
    links: {
      first: "#",
      last: "#",
      prev: page > 1 ? "#" : null,
      next: start + perPage < filtered.length ? "#" : null,
    },
    meta: {
      current_page: page,
      last_page: Math.max(1, Math.ceil(filtered.length / perPage)),
      per_page: perPage,
      total: filtered.length,
    },
  };
}

export function getTripById(id: number) {
  return trips.find((trip) => trip.id === id) ?? null;
}

export function getTripStops(id: number) {
  const trip = getTripById(id);
  if (!trip) return null;
  return {
    pickup_points: trip.pickup_points,
    dropoff_points: trip.dropoff_points,
  };
}

function findSeatById(trip: TripItem, seatId: number) {
  for (const coach of trip.coaches) {
    const seat = coach.seats.find((item) => item.id === seatId);
    if (seat) return seat;
  }
  return null;
}

export function initiateBooking(user: DemoUser, payload: { trip_id: number; seat_ids: number[] }) {
  const trip = getTripById(payload.trip_id);
  if (!trip) {
    return { error: "Trip not found" };
  }

  const selectedSeats = payload.seat_ids
    .map((seatId) => findSeatById(trip, seatId))
    .filter((seat): seat is SeatItem => !!seat && seat.status !== "booked");

  if (!selectedSeats.length) {
    return { error: "No valid seats selected" };
  }

  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return {
    data: {
      user_info: {
        name: user.name,
        email: user.email,
        phone_number: user.phone,
      },
      trip_info: {
        id: trip.id,
        vendor_name: trip.vendor_name,
        departure_datetime: trip.departure_datetime,
        arrival_datetime: trip.arrival_datetime,
      },
      booking_details: {
        selected_seats: selectedSeats,
        total_price: total,
      },
    },
  };
}

export function confirmBooking(user: DemoUser, payload: { trip_id: number; seat_ids: number[]; pickup_stop_id: number; dropoff_stop_id: number }) {
  const trip = getTripById(payload.trip_id);
  if (!trip) {
    return { error: "Trip not found" };
  }

  const selectedSeats: SeatItem[] = [];
  for (const seatId of payload.seat_ids) {
    const seat = findSeatById(trip, seatId);
    if (!seat || seat.status === "booked") {
      return { error: `Seat ${seatId} is not available` };
    }
    selectedSeats.push(seat);
  }

  for (const seat of selectedSeats) {
    seat.status = "booked";
  }

  const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  bookingSeq += 1;
  const booking: BookingItem = {
    id: bookingSeq,
    booking_code: `BK${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}${bookingSeq}`,
    user_id: user.id,
    trip_id: trip.id,
    seat_ids: selectedSeats.map((seat) => seat.id),
    pickup_stop_id: payload.pickup_stop_id,
    dropoff_stop_id: payload.dropoff_stop_id,
    total_price: total,
    status: "confirmed",
    created_at: new Date().toISOString(),
  };

  bookings.push(booking);

  return {
    booking,
  };
}
