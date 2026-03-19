import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import {
  User,
  MapPin,
  CreditCard,
  Ticket,
  ArrowRight,
  Clock,
  Bus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { URL } from "@/config";

const paymentMethods: {
  id: string;
  icon: "credit-card" | "wallet" | "qr-code";
  title: string;
  description: string;
}[] = [
  {
    id: "credit-card",
    icon: "credit-card",
    title: "Thẻ tín dụng/ghi nợ",
    description: "Thanh toán bằng thẻ nội địa hoặc quốc tế",
  },
  {
    id: "wallet",
    icon: "wallet",
    title: "Ví điện tử",
    description: "Thanh toán qua Momo, ZaloPay...",
  },
  {
    id: "vnpay",
    icon: "qr-code",
    title: "VNPay QR",
    description: "Quét mã QR để thanh toán",
  },
];

interface InfoCheckout {
  name: string;
  phone: string;
  email: string;
  method: string;
  trip: {
    id: number | null;
    vendorName: string;
    departureTime: string;
    arrivalTime: string;
  };
  seats: { id: number; seat_number: string; status: string }[];
  pickup: {
    id: number;
    name: string;
    from: string;
  } | null;
  dropoff: {
    id: number;
    name: string;
    to: string;
  } | null;
  totalPrice: number;
}

const initInfo = {
  name: "",
  phone: "",
  email: "",
  method: "",
  trip: {
    id: null,
    vendorName: "",
    departureTime: "",
    arrivalTime: "",
  },
  seats: [],
  pickup: null,
  dropoff: null,
  totalPrice: 0,
};

function CheckOut() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state;

  const { data, loading, error, post } = useFetch(URL);

  const [info, setInfo] = useState<InfoCheckout>(initInfo);

  useEffect(() => {
    if (error && !localStorage.getItem("Authorisation")) {
      navigate("/sign-in", { replace: false });
    }
  }, [error]);

  useEffect(() => {
    const initBooking = async () => {
      await post(
        "/api/bookings/initiate",
        {
          trip_id: params.tripID,
          seat_ids: params.seats.reduce((acc: any, cur: any) => {
            if (cur.status == "temp") {
              acc.push(cur.id);
            }
            return acc;
          }, []),
        },
        {
          Authorization: localStorage.getItem("Authorisation") || "",
        },
      );
    };
    initBooking();
  }, []);

  useEffect(() => {
    if (data?.success == true) {
      setInfo((pre) => ({
        ...pre,
        name: data.data.user_info.name,
        email: data.data.user_info.email,
        phone: data.data.user_info.phone_number,
        trip: {
          ...pre.trip,
          id: params.tripID,
          vendorName: data.data.trip_info.vendor_name,
          departureTime: data.data.trip_info.departure_datetime,
          arrivalTime: data.data.trip_info.arrival_datetime,
        },
        totalPrice: data.data.booking_details.total_price,
      }));
    }
  }, [data]);

  const {
    data: dataStops,
    loading: loadingStops,
    error: errorStops,
    get: getStops,
  } = useFetch(URL);

  useEffect(() => {
    getStops(`/api/trips/${params.tripID}/stops`, {
      Authorization: localStorage.getItem("Authorisation") || "",
    });
  }, []);

  useEffect(() => {
    setInfo((pre) => ({ ...pre, seats: params.seats }));
  }, [location]);

  const {
    data: dataConfirm,
    loading: loadingConfirm,
    error: errorConfirm,
    post: postConfirm,
  } = useFetch(URL);

  useEffect(() => {
    if (dataConfirm?.success && !error) {
      navigate("/success", { replace: true });
    }
  }, [dataConfirm]);

  return (
    <>
      <div className="min-h-screen w-full bg-gradient-to-b from-[#faf6f6] via-[#f7f1f1] to-[#f3eded]">
        {}
        <div className="relative h-[260px] w-full bg-[url(/book-page-bg.jpg)] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:text-6xl">
              Thanh Toán
            </div>
          </div>
        </div>
        {}
        <div className="mx-auto w-full max-w-[1180px] px-4 py-8 md:px-6 md:py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-5 md:gap-7 lg:grid-cols-[1fr_400px] lg:gap-8">
            {}
            <div className="flex flex-col gap-8">
              <Card className="overflow-hidden rounded-xl border border-[#ffffff1a] bg-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <div className="flex h-14 items-center gap-3 bg-[#5b2642] px-5 md:h-16 md:gap-4 md:px-7">
                  <User
                    className="h-7 w-7 text-white md:h-9 md:w-9"
                    strokeWidth={1.5}
                  />
                  <h2 className="[font-family:'Inter-Bold',Helvetica] text-xl leading-[normal] font-bold tracking-[0] whitespace-nowrap text-white md:text-2xl">
                    Thông tin hành khách
                  </h2>
                </div>
                <CardContent className="p-5 md:p-6">
                  <div className="flex flex-col gap-5">
                    {error && (
                      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                      </div>
                    )}
                    {loading && (
                      <div className="text-sm text-[#5b2642]">
                        Đang tải thông tin hành khách...
                      </div>
                    )}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="flex flex-col gap-2.5">
                        <Label className="[font-family:'Inter-SemiBold',Helvetica] text-xs leading-[normal] font-semibold tracking-[0] text-[#5b2642] md:text-sm">
                          Họ và tên
                        </Label>
                        <Input
                          className="h-10 rounded-[10px] border border-[#dcdcdc] bg-white/70 focus-visible:ring-2 focus-visible:ring-[#F7AC3D] md:h-11"
                          type="text"
                          value={info.name}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <Label className="[font-family:'Inter-SemiBold',Helvetica] text-xs leading-[normal] font-semibold tracking-[0] text-[#5b2642] md:text-sm">
                          Số điện thoại
                        </Label>
                        <Input
                          className="h-10 rounded-[10px] border border-[#dcdcdc] bg-white/70 focus-visible:ring-2 focus-visible:ring-[#F7AC3D] md:h-11"
                          type="tel"
                          value={info.phone}
                        />
                      </div>
                      <div className="flex flex-col gap-2.5">
                        <Label className="[font-family:'Inter-SemiBold',Helvetica] text-xs leading-[normal] font-semibold tracking-[0] text-[#5b2642] md:text-sm">
                          Email
                        </Label>
                        <Input
                          className="h-10 rounded-[10px] border border-[#dcdcdc] bg-white/70 focus-visible:ring-2 focus-visible:ring-[#F7AC3D] md:h-11"
                          type="email"
                          value={info.email}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label
                        htmlFor="pickup-point"
                        className="[font-family:'Inter-SemiBold',Helvetica] text-sm leading-[normal] font-semibold tracking-[0] text-[#5b2642] md:text-base"
                      >
                        Chọn điểm đón *
                      </Label>
                      <div className="relative">
                        <Select
                          onValueChange={(e) => {
                            setInfo((pre) => ({
                              ...pre,
                              pickup: JSON.parse(e),
                            }));
                          }}
                        >
                          <SelectTrigger
                            id="pickup-point"
                            className="h-10 rounded-[10px] border border-[#dcdcdc] bg-white/70 pl-[48px] focus-visible:ring-2 focus-visible:ring-[#F7AC3D] md:h-11"
                          >
                            <SelectValue
                              placeholder="Chọn từ danh sách điểm đón có sẵn"
                              className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold text-[#00000082] md:text-base"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {dataStops?.success &&
                              dataStops.data?.pickup_points &&
                              dataStops.data.pickup_points.map((item: any) => (
                                <SelectItem
                                  value={JSON.stringify({
                                    id: item.id,
                                    name: item.name,
                                    from: item.address,
                                  })}
                                  key={item.id}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#5b2642] md:h-5 md:w-5" />
                        {loadingStops && (
                          <div className="mt-2 text-xs text-[#5b2642]">
                            Đang tải điểm đón...
                          </div>
                        )}
                        {errorStops && (
                          <div className="mt-2 text-xs text-red-600">
                            Không tải được điểm đón
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Label
                        htmlFor="dropoff-point"
                        className="[font-family:'Inter-SemiBold',Helvetica] text-sm leading-[normal] font-semibold tracking-[0] text-[#5b2642] md:text-base"
                      >
                        Chọn điểm trả *
                      </Label>
                      <div className="relative">
                        <Select
                          onValueChange={(e) => {
                            setInfo((pre) => ({
                              ...pre,
                              dropoff: JSON.parse(e),
                            }));
                          }}
                        >
                          <SelectTrigger
                            id="dropoff-point"
                            className="h-10 rounded-[10px] border border-[#dcdcdc] bg-white/70 pl-[48px] focus-visible:ring-2 focus-visible:ring-[#F7AC3D] md:h-11"
                          >
                            <SelectValue
                              placeholder="Chọn từ danh sách điểm trả có sẵn"
                              className="[font-family:'Inter-SemiBold',Helvetica] text-sm font-semibold text-[#00000082] md:text-base"
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {dataStops?.success &&
                              dataStops.data?.dropoff_points &&
                              dataStops.data.dropoff_points.map((item: any) => (
                                <SelectItem
                                  value={JSON.stringify({
                                    id: item.id,
                                    name: item.name,
                                    to: item.address,
                                  })}
                                  key={item.id}
                                >
                                  {item.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                        <MapPin className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-[#5b2642] md:h-5 md:w-5" />
                        {loadingStops && (
                          <div className="mt-2 text-xs text-[#5b2642]">
                            Đang tải điểm trả...
                          </div>
                        )}
                        {errorStops && (
                          <div className="mt-2 text-xs text-red-600">
                            Không tải được điểm trả
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border border-[#ffffff1a] bg-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.05)] backdrop-blur-sm">
                <div className="flex h-14 items-center bg-[#5b2642] px-5 md:h-16 md:px-10">
                  <CreditCard className="mr-3 h-[26px] w-[26px] text-white md:h-7 md:w-7" />
                  <h2 className="[font-family:'Inter-Bold',Helvetica] text-xl leading-[normal] font-bold tracking-[0] whitespace-nowrap text-white md:text-2xl">
                    Chọn phương thức thanh toán
                  </h2>
                </div>
                <CardContent className="p-5 md:p-6">
                  {loading && (
                    <div className="mb-3 text-sm text-[#5b2642]">
                      Đang tải phương thức thanh toán...
                    </div>
                  )}
                  {error && (
                    <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </div>
                  )}
                  <RadioGroup
                    defaultValue="credit-card"
                    className="flex flex-col gap-3 md:gap-4"
                  >
                    {paymentMethods.map((method) => (
                      <label
                        key={method.id}
                        htmlFor={method.id}
                        className="flex h-12 cursor-pointer items-center rounded-[10px] border border-[#dcdcdc] bg-white/70 px-3 transition-colors hover:border-[#c9c9c9] md:h-[54px]"
                      >
                        <RadioGroupItem
                          value={method.id}
                          id={method.id}
                          className="h-4 w-4 rounded-[10px]"
                        />
                        <div className="ml-3 flex items-center gap-4 md:gap-5">
                          {method.icon === "credit-card" && (
                            <CreditCard className="h-5 w-5 text-[#5b2642] md:h-6 md:w-6" />
                          )}
                          {method.icon === "wallet" && (
                            <div className="flex h-6 w-6 items-center justify-center md:h-[26px] md:w-[26px]">
                              <img
                                src=""
                                alt={method.title}
                                className="h-full w-full"
                              />
                            </div>
                          )}
                          {method.icon === "qr-code" && (
                            <div className="flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
                              <img
                                src=""
                                alt={method.title}
                                className="h-full w-full"
                              />
                            </div>
                          )}
                          <div className="flex flex-col gap-[3px]">
                            <Label
                              htmlFor={method.id}
                              className="cursor-pointer [font-family:'Inter-SemiBold',Helvetica] text-sm leading-[normal] font-semibold tracking-[0] text-[#5b2642] md:text-base"
                            >
                              {method.title}
                            </Label>
                            <span className="[font-family:'Inter-SemiBold',Helvetica] text-[10px] leading-[normal] font-semibold tracking-[0] text-[#5b2642ad] md:text-xs">
                              {method.description}
                            </span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {}
            <Card className="h-max overflow-hidden rounded-xl border border-[#ffffff1a] bg-white/40 shadow-[0_4px_14px_rgba(0,0,0,0.05)] backdrop-blur-sm lg:sticky lg:top-6">
              <div className="flex h-14 items-center gap-3 bg-[#5b2642] px-5 md:h-16 md:gap-4 md:px-6">
                <Ticket
                  className="h-7 w-7 text-white md:h-9 md:w-9"
                  strokeWidth={1.5}
                />
                <h2 className="[font-family:'Inter-Bold',Helvetica] text-xl leading-[normal] font-bold tracking-[0] text-white md:text-2xl">
                  Tóm tắt chuyến đi
                </h2>
              </div>
              <CardContent className="p-5 md:p-6">
                <div className="flex flex-col gap-5 md:gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="[font-family:'Inter-SemiBold',Helvetica] text-xs text-[#6b6b6b] md:text-sm">
                      Điểm đi
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-[#5b2642] md:h-6 md:w-6" />
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] text-[#5b2642] md:text-base">
                        {info.pickup ? info.pickup.from : "Hãy chọn điểm đón"}
                      </span>
                    </div>

                    <div className="mt-1 [font-family:'Inter-SemiBold',Helvetica] text-xs text-[#6b6b6b] md:text-sm">
                      Điểm đến
                    </div>
                    <div className="flex items-center gap-3">
                      <ArrowRight className="h-5 w-5 text-[#5b2642] md:h-6 md:w-6" />
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] text-[#5b2642] md:text-base">
                        {info.dropoff ? info.dropoff.to : "Hãy chọn điểm đến"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:gap-4">
                    <Clock className="h-5 w-5 text-[#5b2642] md:h-6 md:w-6" />
                    <div className="flex items-center gap-3 md:gap-4">
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#5b2642] md:text-base">
                        {new Date(info.trip.departureTime).toLocaleTimeString()}
                      </span>
                      <div className="flex h-5 w-5 items-center justify-center md:h-6 md:w-6">
                        <div className="h-[2px] w-[2px] rounded-full bg-[#5b2642]" />
                      </div>
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#5b2642] md:text-base">
                        {new Date(info.trip.departureTime).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <Bus className="h-5 w-5 text-[#5b2642] md:h-6 md:w-6" />
                    <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#5b2642] md:text-base">
                      {info.trip.vendorName}
                    </span>
                  </div>
                  <div className="my-4 h-px bg-[#cccccc]" />
                  <div className="flex flex-col gap-3">
                    <h3 className="[font-family:'Inter-Medium',Helvetica] text-lg leading-[normal] font-medium tracking-[0] text-[#5b2642] md:text-xl">
                      Chi tiết chỗ ngồi
                    </h3>
                    <div className="flex h-[46px] items-center rounded-[10px] border border-[#0000002a] bg-[#f5f5f7] px-4 md:h-[52px] md:px-5">
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] text-[#5b2642] md:text-base">
                        Ghế:{" "}
                        {info?.seats.length &&
                          info.seats
                            .reduce((acc, cur) => {
                              if (cur.status == "temp") {
                                acc += cur.seat_number + ", ";
                              }
                              return acc;
                            }, "")
                            .slice(0, -2)}
                      </span>
                    </div>
                  </div>
                  <div className="my-4 h-px bg-[#cccccc]" />
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#0000009e] md:text-base">
                        Giá vé:
                      </span>
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#0000009e] md:text-base">
                        {info.totalPrice.toLocaleString()}đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#0000009e] md:text-base">
                        Phụ phí:
                      </span>
                      <span className="[font-family:'Inter-Medium',Helvetica] text-sm leading-[normal] font-medium tracking-[0] whitespace-nowrap text-[#0000009e] md:text-base">
                        0đ
                      </span>
                    </div>
                  </div>
                  <div className="my-4 h-px bg-[#cccccc]" />
                  <div className="flex items-center justify-between">
                    <span className="[font-family:'Inter-SemiBold',Helvetica] text-lg leading-[normal] font-semibold tracking-[0] whitespace-nowrap text-[#5b2642] md:text-xl">
                      Tổng cộng
                    </span>
                    <span className="[font-family:'Inter-Bold',Helvetica] text-xl leading-[normal] font-bold tracking-[0] text-[#5b2642] md:text-2xl">
                      {info.totalPrice.toLocaleString()}đ
                    </span>
                  </div>
                  <Button
                    className="mt-5 h-12 w-full rounded-[10px] bg-gradient-to-r from-[#f59e0b] to-[#f59e0b] hover:from-[#d97706] hover:to-[#d97706] md:mt-6 md:h-14"
                    disabled={loadingConfirm}
                    onClick={() => {
                      postConfirm(
                        "/api/bookings/confirm",
                        {
                          trip_id: params.tripID,
                          seat_ids: params.seats.reduce(
                            (acc: any, cur: any) => {
                              if (cur.status == "temp") {
                                acc.push(cur.id);
                              }
                              return acc;
                            },
                            [],
                          ),
                          pickup_stop_id: info.pickup?.id,
                          dropoff_stop_id: info.dropoff?.id,
                        },
                        {
                          Authorization:
                            localStorage.getItem("Authorisation") || "",
                        },
                      );
                    }}
                  >
                    {loadingConfirm ? (
                      <div className="flex items-center justify-center gap-2 text-white">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                        <span className="[font-family:'Inter-Bold',Helvetica] text-base leading-[normal] font-bold tracking-[0] whitespace-nowrap md:text-lg">
                          Đang xác nhận...
                        </span>
                      </div>
                    ) : (
                      <span className="[font-family:'Inter-Bold',Helvetica] text-base leading-[normal] font-bold tracking-[0] whitespace-nowrap text-white md:text-lg">
                        Xác nhận và Thanh toán
                      </span>
                    )}
                  </Button>
                  {errorConfirm && (
                    <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {errorConfirm}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default CheckOut;
