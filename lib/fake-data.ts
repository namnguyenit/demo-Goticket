export type UserRole = "customer" | "vendor" | "admin";
export type VendorStatus = "active" | "pending" | "suspended";
export type TripStatus = "scheduled" | "ongoing" | "completed" | "cancelled";
export type BookingStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "success" | "failed" | "pending";

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
}

export interface Vendor {
  id: number;
  userId: number;
  companyName: string;
  address: string;
  status: VendorStatus;
}

export interface Location {
  id: number;
  name: string;
}

export interface RouteEntity {
  id: number;
  originLocationId: number;
  destinationLocationId: number;
}

export interface Vehicle {
  id: number;
  vendorId: number;
  name: string;
  vehicleType: "bus" | "train";
  licensePlate?: string;
  totalSeats: number;
}

export interface Trip {
  id: number;
  vendorRouteId: number;
  vendorId: number;
  routeId: number;
  departureDatetime: string;
  arrivalDatetime: string;
  basePrice: number;
  status: TripStatus;
  availableSeats: number;
}

export interface Booking {
  id: number;
  userId: number;
  tripId: number;
  bookingCode: string;
  totalPrice: number;
  status: BookingStatus;
  seats: string[];
}

export interface Payment {
  id: number;
  bookingId: number;
  transactionId: string;
  amount: number;
  paymentMethod: "momo" | "vnpay" | "bank";
  status: PaymentStatus;
  paidAt: string | null;
}

export interface Review {
  id: number;
  tripId: number;
  userId: number;
  bookingId: number;
  rating: number;
  comment: string;
}

export const locations: Location[] = [
  { id: 1, name: "Ho Chi Minh" },
  { id: 2, name: "Da Nang" },
  { id: 3, name: "Ha Noi" },
  { id: 4, name: "Nha Trang" },
  { id: 5, name: "Can Tho" },
  { id: 6, name: "Hue" },
];

export const routes: RouteEntity[] = [
  { id: 1, originLocationId: 1, destinationLocationId: 2 },
  { id: 2, originLocationId: 2, destinationLocationId: 3 },
  { id: 3, originLocationId: 1, destinationLocationId: 4 },
  { id: 4, originLocationId: 5, destinationLocationId: 1 },
  { id: 5, originLocationId: 6, destinationLocationId: 3 },
];

export const users: User[] = [
  { id: 1, name: "Super Admin", email: "admin@goticket.demo", phoneNumber: "0901000001", role: "admin" },
  { id: 2, name: "Nhut Tran", email: "nhut@goticket.demo", phoneNumber: "0901000002", role: "customer" },
  { id: 3, name: "Linh Pham", email: "linh@goticket.demo", phoneNumber: "0901000003", role: "customer" },
  { id: 4, name: "Tuan Nguyen", email: "tuan@goticket.demo", phoneNumber: "0901000004", role: "vendor" },
  { id: 5, name: "Hanh Le", email: "hanh@goticket.demo", phoneNumber: "0901000005", role: "vendor" },
  { id: 6, name: "Bao Vu", email: "bao@goticket.demo", phoneNumber: "0901000006", role: "customer" },
  { id: 7, name: "Mai Do", email: "mai@goticket.demo", phoneNumber: "0901000007", role: "customer" },
  { id: 8, name: "Khanh Ho", email: "khanh@goticket.demo", phoneNumber: "0901000008", role: "customer" },
];

export const vendors: Vendor[] = [
  { id: 1, userId: 4, companyName: "GoBus Express", address: "12 Nguyen Hue, HCM", status: "active" },
  { id: 2, userId: 5, companyName: "SkyRail Vietnam", address: "88 Tran Phu, Da Nang", status: "active" },
  { id: 3, userId: 8, companyName: "Mekong Trips", address: "22 Hai Ba Trung, Can Tho", status: "pending" },
];

export const vehicles: Vehicle[] = [
  { id: 1, vendorId: 1, name: "GoBus Limousine 01", vehicleType: "bus", licensePlate: "51B-12345", totalSeats: 34 },
  { id: 2, vendorId: 1, name: "GoBus Sleeper 02", vehicleType: "bus", licensePlate: "51B-88991", totalSeats: 40 },
  { id: 3, vendorId: 2, name: "SkyRail Carriage A", vehicleType: "train", totalSeats: 80 },
  { id: 4, vendorId: 2, name: "SkyRail Carriage B", vehicleType: "train", totalSeats: 72 },
  { id: 5, vendorId: 3, name: "Mekong Bus Mini", vehicleType: "bus", licensePlate: "65A-55667", totalSeats: 29 },
];

export const trips: Trip[] = [
  {
    id: 1,
    vendorRouteId: 1001,
    vendorId: 1,
    routeId: 1,
    departureDatetime: "2026-03-20T08:00:00+07:00",
    arrivalDatetime: "2026-03-20T20:00:00+07:00",
    basePrice: 420000,
    status: "scheduled",
    availableSeats: 12,
  },
  {
    id: 2,
    vendorRouteId: 1002,
    vendorId: 2,
    routeId: 2,
    departureDatetime: "2026-03-20T21:30:00+07:00",
    arrivalDatetime: "2026-03-21T10:10:00+07:00",
    basePrice: 560000,
    status: "ongoing",
    availableSeats: 30,
  },
  {
    id: 3,
    vendorRouteId: 1003,
    vendorId: 1,
    routeId: 3,
    departureDatetime: "2026-03-21T07:15:00+07:00",
    arrivalDatetime: "2026-03-21T16:45:00+07:00",
    basePrice: 390000,
    status: "scheduled",
    availableSeats: 8,
  },
  {
    id: 4,
    vendorRouteId: 1004,
    vendorId: 3,
    routeId: 4,
    departureDatetime: "2026-03-22T09:00:00+07:00",
    arrivalDatetime: "2026-03-22T13:10:00+07:00",
    basePrice: 220000,
    status: "cancelled",
    availableSeats: 0,
  },
  {
    id: 5,
    vendorRouteId: 1005,
    vendorId: 2,
    routeId: 5,
    departureDatetime: "2026-03-22T18:00:00+07:00",
    arrivalDatetime: "2026-03-22T21:20:00+07:00",
    basePrice: 350000,
    status: "completed",
    availableSeats: 0,
  },
];

export const bookings: Booking[] = [
  { id: 1, userId: 2, tripId: 1, bookingCode: "GT-1001", totalPrice: 840000, status: "confirmed", seats: ["A01", "A02"] },
  { id: 2, userId: 3, tripId: 2, bookingCode: "GT-1002", totalPrice: 560000, status: "pending", seats: ["B04"] },
  { id: 3, userId: 6, tripId: 3, bookingCode: "GT-1003", totalPrice: 780000, status: "confirmed", seats: ["C10", "C11"] },
  { id: 4, userId: 7, tripId: 4, bookingCode: "GT-1004", totalPrice: 220000, status: "cancelled", seats: ["D08"] },
  { id: 5, userId: 2, tripId: 5, bookingCode: "GT-1005", totalPrice: 350000, status: "confirmed", seats: ["A06"] },
];

export const payments: Payment[] = [
  { id: 1, bookingId: 1, transactionId: "MOMO-A81", amount: 840000, paymentMethod: "momo", status: "success", paidAt: "2026-03-17T15:20:00+07:00" },
  { id: 2, bookingId: 2, transactionId: "VNPAY-B22", amount: 560000, paymentMethod: "vnpay", status: "pending", paidAt: null },
  { id: 3, bookingId: 3, transactionId: "BANK-C88", amount: 780000, paymentMethod: "bank", status: "success", paidAt: "2026-03-16T10:05:00+07:00" },
  { id: 4, bookingId: 4, transactionId: "MOMO-D90", amount: 220000, paymentMethod: "momo", status: "failed", paidAt: null },
  { id: 5, bookingId: 5, transactionId: "VNPAY-E11", amount: 350000, paymentMethod: "vnpay", status: "success", paidAt: "2026-03-15T08:40:00+07:00" },
];

export const reviews: Review[] = [
  { id: 1, tripId: 5, userId: 2, bookingId: 5, rating: 5, comment: "Xe sach, dung gio, nhan vien than thien." },
  { id: 2, tripId: 3, userId: 6, bookingId: 3, rating: 4, comment: "Chat luong on, can them lua chon bua an." },
];

export function getLocationName(id: number): string {
  return locations.find((location) => location.id === id)?.name ?? "Unknown";
}

export function getRouteLabel(routeId: number): string {
  const route = routes.find((item) => item.id === routeId);
  if (!route) {
    return "Unknown route";
  }

  return `${getLocationName(route.originLocationId)} -> ${getLocationName(route.destinationLocationId)}`;
}

export function getVendorName(vendorId: number): string {
  return vendors.find((vendor) => vendor.id === vendorId)?.companyName ?? "Unknown vendor";
}

export function getUserName(userId: number): string {
  return users.find((user) => user.id === userId)?.name ?? "Unknown user";
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
