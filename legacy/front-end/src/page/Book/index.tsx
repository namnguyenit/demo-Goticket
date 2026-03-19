import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState, useContext } from "react";
import AddressOption from "../../components/AddressOption";
import {
  MapPin,
  Clock,
  BusFront,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import clsx from "clsx";
import { URL } from "@/config";
import { LogOutContext } from "@/context/LogoutProvider";
import { useFetch } from "@/hooks/useFetch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function Book() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const json = JSON.parse(decodeURIComponent(params.get("data") || "null"));

  const { data, loading, error, get } = useFetch(URL);
  const [searchQuery, setSearchQuery] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(12);

  const PRICE_MIN_CAP = 0;
  const PRICE_MAX_CAP = 2000000;
  const [priceMin, setPriceMin] = useState<number>(PRICE_MIN_CAP);
  const [priceMax, setPriceMax] = useState<number>(PRICE_MAX_CAP);
  const TIME_OPTIONS = [
    { label: "00:00 - 05:59", value: "00:00-05:59" },
    { label: "06:00 - 11:59", value: "06:00-11:59" },
    { label: "12:00 - 17:59", value: "12:00-17:59" },
    { label: "18:00 - 23:59", value: "18:00-23:59" },
  ];
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const isTrainTab = (json?.vehicle || '').toLowerCase() === 'train';
  const COACH_OPTIONS = [
    { label: 'Ghế mềm', value: 'seat_soft' },
    { label: 'Ghế VIP', value: 'seat_VIP' },
    { label: 'Giường nằm', value: 'sleeper' },
  ];
  const [coachTypes, setCoachTypes] = useState<string[]>([]);

  const applyFilters = (opts?: { timeSlots?: string[]; priceMin?: number; priceMax?: number; coachTypes?: string[] }) => {
    const date = json?.date
      ? new Date(json.date).toLocaleDateString("en-CA", { timeZone: "Asia/Ho_Chi_Minh" })
      : undefined;
    const params = new URLSearchParams();
    if (json?.region?.from && json?.region?.to) {
      params.set('origin_location', json.region.from.name);
      params.set('destination_location', json.region.to.name);
    }
    if (date) params.set('date', date);
    if (json?.vehicle) params.set('vehicle_type', json.vehicle);
    const pmin = opts?.priceMin ?? priceMin;
    const pmax = opts?.priceMax ?? priceMax;
    if (pmin > PRICE_MIN_CAP) params.set('price_min', String(pmin));
    if (pmax < PRICE_MAX_CAP) params.set('price_max', String(pmax));
    const ts = opts?.timeSlots ?? timeSlots;
    ts.forEach((v) => params.append('time_slots[]', v));
    const cts = opts?.coachTypes ?? coachTypes;
    if (!isTrainTab) cts.forEach(ct => params.append('coach_types[]', ct));

    const q = params.toString();
    if (q) {
      setSearchQuery(q);
      setPage(1);
      get(`/api/trips/search?${q}&per_page=${perPage}&page=1`);
    }
  };

  useEffect(() => {
    const date = json?.date
      ? new Date(json.date).toLocaleDateString("en-CA", {
          timeZone: "Asia/Ho_Chi_Minh",
        })
      : undefined;

    const params: Record<string, string> = {};
    if (json?.region?.from && json?.region?.to) {
      params.origin_location = json.region.from.name;
      params.destination_location = json.region.to.name;
    }
    if (date) params.date = date;
    if (json?.vehicle) params.vehicle_type = json.vehicle;

    const query = new URLSearchParams(params).toString();
    if (query) {
      setSearchQuery(query);
      setPage(1);
      get(`/api/trips/search?${query}&per_page=${perPage}&page=1`);
    }
  }, [location, perPage]);

  const payload = data?.data;
  const items = useMemo(() => {
    if (!payload) return [] as any[];
    if (Array.isArray(payload)) return payload as any[];
    if (Array.isArray(payload?.data)) return payload.data as any[];
    return [] as any[];
  }, [payload]);

  const meta = useMemo(() => {
    if (!payload) return null as any;
    if (payload?.meta) return payload.meta as any;
    const keys = ["current_page", "last_page", "per_page", "total"];
    const hasBasic = keys.every((k) => Object.prototype.hasOwnProperty.call(payload, k));
    return hasBasic ? (payload as any) : null;
  }, [payload]);

  const currentPage = meta?.current_page ?? page ?? 1;
  const lastPage = meta?.last_page ?? 1;

  useEffect(() => {
    if (meta?.current_page && meta.current_page !== page) {
      setPage(meta.current_page);
    }
  }, [meta]);

  const handlePageChange = (p: number) => {
    if (!searchQuery) return;
    if (p < 1 || (lastPage && p > lastPage)) return;
    setPage(p);
    get(`/api/trips/search?${searchQuery}&per_page=${perPage}&page=${p}`);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  };

  const pageNumbers = useMemo(() => {
    const lp = Number(lastPage || 1);
    const cp = Number(currentPage || 1);
    const windowSize = 10;
    if (lp <= windowSize) {
      return Array.from({ length: lp }, (_, i) => i + 1);
    }
    let start = cp - Math.floor(windowSize / 2);
    if (start < 1) start = 1;
    let end = start + windowSize - 1;
    if (end > lp) {
      end = lp;
      start = lp - windowSize + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, lastPage]);

  return (
    <>
      <div className="flex w-screen flex-col items-center">
        <div className="after-overlay relative h-[450px] w-full bg-[url(/book-page-bg.jpg)] bg-cover bg-center">
          <div className="absolute bottom-1/2 left-1/2 z-10 grid h-1/3 w-1/3 -translate-x-1/2 translate-y-3/8 grid-rows-1 items-center text-center">
            <div className="text-6xl font-bold text-white">Booking List</div>
          </div>
        </div>
        <div className="relative h-[10vh] w-[70vw]">
          <div className="absolute left-[50%] h-[35vh] w-[70vw] translate-x-[-50%] translate-y-[-150px]">
            <AddressOption />
          </div>
        </div>
        {}
        <div className="my-25 grid w-[70%] grid-cols-[1fr_3fr] gap-8">
          {}
          <div className="grid grid-cols-1 content-start">
            <div className="flex h-14 items-center justify-center bg-[#57112f] text-3xl font-bold text-white">
              Filters
            </div>
            {}
            <div className="dash-bottom grid h-52 grid-rows-[30%_50%] content-evenly bg-white">
              <div className="dash-bottom flex h-4/5 w-4/5 items-center self-center justify-self-center text-xl font-bold text-[#57112f]">
                Khoảng giá
              </div>
              <div className="self-center justify-self-center w-4/5">
                <input
                  type="range"
                  min={PRICE_MIN_CAP}
                  max={PRICE_MAX_CAP}
                  step={10000}
                  value={priceMin}
                  onChange={(e)=> {
                    const v = Number(e.target.value);
                    const nextMin = v > priceMax ? priceMax : v;
                    setPriceMin(nextMin);
                    applyFilters({ priceMin: nextMin });
                  }}
                  className="w-full"
                />
                <input
                  type="range"
                  min={PRICE_MIN_CAP}
                  max={PRICE_MAX_CAP}
                  step={10000}
                  value={priceMax}
                  onChange={(e)=> {
                    const v = Number(e.target.value);
                    const nextMax = v < priceMin ? priceMin : v;
                    setPriceMax(nextMax);
                    applyFilters({ priceMax: nextMax });
                  }}
                  className="w-full mt-2"
                />
                <div className="mt-2 text-sm text-[#57112f]">
                  Giá: {priceMin.toLocaleString('vi-VN')}đ - {priceMax.toLocaleString('vi-VN')}đ
                </div>
                <button className="mt-3 rounded-md bg-[#F7AC3D] px-3 py-1 text-white hover:bg-[#6a314b]" onClick={()=>applyFilters()}>Tìm kiếm</button>
              </div>
            </div>
            <div className="dash-bottom grid content-evenly bg-white" style={{height: isTrainTab ? '260px' : '380px'}}>
              <div className="dash-bottom flex h-14 w-4/5 items-center self-center justify-self-center text-xl font-bold text-[#57112f]">
                Thời Gian Khởi Hành
              </div>
              <div className="grid w-4/5 gap-3 justify-self-center">
                {TIME_OPTIONS.map((t)=> (
                  <label key={t.value} className="hover-scale grid h-12 w-full grid-cols-[24px_1fr] items-center gap-3 bg-[#ebebee] px-3 rounded">
                    <input type="checkbox" checked={timeSlots.includes(t.value)} onChange={(e)=> {
                      setTimeSlots(prev => {
                        const next = e.target.checked ? [...prev, t.value] : prev.filter(v=>v!==t.value);
                        applyFilters({ timeSlots: next });
                        return next;
                      });
                    }} />
                    <div className="ml-1 font-bold text-[#57112f]">{t.label}</div>
                  </label>
                ))}
              </div>
            </div>
            {!isTrainTab && (
              <div className="dash-bottom grid h-[260px] content-evenly bg-white">
                <div className="dash-bottom flex h-14 w-4/5 items-center self-center justify-self-center text-xl font-bold text-[#57112f]">
                  Loại ghế
                </div>
                <div className="grid w-4/5 gap-3 justify-self-center">
                  {COACH_OPTIONS.map(opt => (
                    <label key={opt.value} className="flex items-center gap-3">
                      <input type="checkbox" checked={coachTypes.includes(opt.value)} onChange={(e)=> {
                        setCoachTypes(prev => {
                          const next = e.target.checked ? [...prev, opt.value] : prev.filter(v=>v!==opt.value);
                          applyFilters({ coachTypes: next });
                          return next;
                        });
                      }} />
                      <span className="text-[#57112f]">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          {}
          <div>
            {error && (
              <div
                className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
                aria-live="polite"
              >
                Không tải được danh sách chuyến. Vui lòng thử lại.
                <button
                  className="ml-3 rounded-md bg-[#F7AC3D] px-3 py-1 text-white hover:bg-[#6a314b]"
                  onClick={() =>
                    searchQuery && get(`/api/trips/search?${searchQuery}&per_page=${perPage}&page=${page}`)
                  }
                >
                  Thử lại
                </button>
              </div>
            )}

            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="grid h-[180px] animate-pulse grid-cols-[20%_50%_30%] rounded-2xl bg-white shadow-sm"
                  >
                    <div className="flex flex-col items-center justify-evenly p-4">
                      <div className="h-24 w-2/3 rounded bg-gray-200" />
                      <div className="mt-2 h-4 w-3/4 rounded bg-gray-200" />
                    </div>
                    <div className="grid grid-rows-[40%_40%] content-evenly p-4">
                      <div className="space-y-2">
                        <div className="h-5 w-2/3 rounded bg-gray-200" />
                        <div className="h-4 w-1/2 rounded bg-gray-200" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-5 w-1/2 rounded bg-gray-200" />
                          <div className="h-4 w-2/3 rounded bg-gray-200" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-5 w-1/3 rounded bg-gray-200" />
                          <div className="h-4 w-1/2 rounded bg-gray-200" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-evenly border-l-2 p-4">
                      <div className="h-6 w-24 rounded bg-gray-200" />
                      <div className="h-8 w-24 rounded bg-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && lastPage > 1 && (
              <div className="mb-4 flex items-center justify-center gap-2">
                <button
                  className={clsx(
                    "mr-2 rounded px-2 py-1 text-sm",
                    currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"
                  )}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </button>
                {pageNumbers.map((p) => (
                  <button
                    key={`p-top-${p}`}
                    className={clsx(
                      "rounded px-2 py-1 text-sm",
                      p === currentPage ? "text-black font-semibold" : "text-blue-600 hover:underline"
                    )}
                    onClick={() => handlePageChange(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className={clsx(
                    "ml-2 rounded px-2 py-1 text-sm",
                    currentPage === lastPage ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"
                  )}
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Tiếp
                </button>
              </div>
            )}

            {!loading && !error && items && items.length > 0 && (
              <>
                {items.map((item: any, index: any) => (
                  <Ticket data={item} key={index} />
                ))}
              </>
            )}

            {!loading && !error && (!items || items.length === 0) && (
              <div className="rounded-md border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
                Không có chuyến phù hợp với tiêu chí tìm kiếm.
              </div>
            )}

            {!loading && !error && (
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="text-sm text-[#57112f]">
                  {meta?.total ? (
                    <>
                      Hiển thị {items.length > 0 ? (currentPage - 1) * (meta?.per_page ?? perPage) + 1 : 0}
                      -{(currentPage - 1) * (meta?.per_page ?? perPage) + items.length} trong tổng {meta?.total} kết quả
                    </>
                  ) : null}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="text-sm">Mỗi trang</div>
                    <PerPageSelect value={String(perPage)} onChange={(v)=>{ setPerPage(Number(v)); setPage(1); }} />
                  </div>
                  {lastPage > 1 && (
                    <div className="flex items-center gap-2">
                      <div className="text-sm">Trang</div>
                      <PageSelect value={String(currentPage)} count={lastPage} onChange={(v)=> handlePageChange(Number(v))} />
                    </div>
                  )}
                </div>
              </div>
            )}

            {!loading && !error && lastPage > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  className={clsx(
                    "mr-2 rounded px-2 py-1 text-sm",
                    currentPage === 1 ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"
                  )}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Trước
                </button>
                {pageNumbers.map((p) => (
                  <button
                    key={`p-${p}`}
                    className={clsx(
                      "rounded px-2 py-1 text-sm",
                      p === currentPage ? "text-black font-semibold" : "text-blue-600 hover:underline"
                    )}
                    onClick={() => handlePageChange(p)}
                    aria-current={p === currentPage ? "page" : undefined}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className={clsx(
                    "ml-2 rounded px-2 py-1 text-sm",
                    currentPage === lastPage ? "cursor-not-allowed text-gray-400" : "text-blue-600 hover:underline"
                  )}
                  disabled={currentPage === lastPage}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Tiếp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PerPageSelect({ value, onChange }: { value: string; onChange: (v: string)=>void }){
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-20">
        <SelectValue placeholder="12" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Per page</SelectLabel>
          {[6,12,24,36,48].map((n)=> (
            <SelectItem key={n} value={String(n)}>{n}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function PageSelect({ value, count, onChange }: { value: string; count: number; onChange: (v: string)=>void }){
  const pages = Array.from({ length: count }, (_, i) => String(i+1));
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="min-w-24">
        <SelectValue placeholder="1" />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectGroup>
          <SelectLabel>Chọn trang</SelectLabel>
          {pages.map((p)=> (
            <SelectItem key={p} value={p}>Trang {p}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default Book;

interface TicketProps {
  data: {
    id: number;
    trip: string;
    imageLink: string;
    pickTake: string;
    departureDate: Date;
    emptyNumber: number;
    vendorName: string;
    vendorType: string;
    price: number;
  };
}
interface InitTrip {
  tripID: number | null;
  seats: { id: number; seat_number: string; status: string; price: string }[];
  from: string;
  to: string;
  totalPrice: number;
}

function Ticket({ data }: TicketProps) {
  const navigate = useNavigate();
  const { logout } = useContext(LogOutContext);

  const [book, setBook] = useState<boolean>(false);

  const { data: seatDatas, loading: seatLoading, error, get } = useFetch(URL);

  const isTrain = (data.vendorType || '').toLowerCase() === 'train';
  const [coaches, setCoaches] = useState<any[]>([]);
  const [selectedCoach, setSelectedCoach] = useState<number>(-1);
  const coachTypeLabel = (t?: string) => {
    if (!t) return 'Toa';
    if (t === 'seat_soft') return 'Ghế mềm điều hòa';
    if (t === 'seat_VIP' || t === 'seat_Vip') return 'Ghế VIP';
    return t;
  };

  useEffect(() => {
    book && get(`/api/trips/${data.id}`);
  }, [book]);

  const [initTrip, setInitTrip] =useState<InitTrip>({
    tripID: data.id,
    seats: [],
    from: "",
    to: "",
    totalPrice: 0,
  });

  useEffect(() => {
    const list = Array.isArray(seatDatas?.data?.coaches) ? seatDatas?.data?.coaches : [];
    setCoaches(list);
    setSelectedCoach(list.length ? -1 : -1);
    setInitTrip((prev) => ({
      ...prev,
      seats: list[0]?.seats || [],
      totalPrice: 0,
    }));
  }, [seatDatas]);

  const sortedSeats = useMemo(() => {
    const arr = Array.isArray(initTrip.seats) ? [...initTrip.seats] : [];
    return arr.sort((a: any, b: any) => {
      const an = parseInt(String(a.seat_number || a.number || a.id));
      const bn = parseInt(String(b.seat_number || b.number || b.id));
      return (isNaN(an) ? 0 : an) - (isNaN(bn) ? 0 : bn);
    });
  }, [initTrip.seats]);
  const half = Math.ceil(sortedSeats.length / 2);
  const leftSeats = sortedSeats.slice(0, half);
  const rightSeats = sortedSeats.slice(half);

  const renderSeatTile = (item: any, key?: number) => (
    <button
      key={key}
      disabled={item.status === 'booked'}
      aria-pressed={item.status === 'temp'}
      onClick={() => {
        if(item.status === 'booked') return;
        setInitTrip((prev) => {
          const findSeat = prev.seats.findIndex((seat) => seat.id == item.id);
          const updateSeats = [...prev.seats].map((it) => ({ ...it }));
          if (updateSeats[findSeat].status == 'available') {
            updateSeats[findSeat].status = 'temp';
          } else if (updateSeats[findSeat].status == 'temp') {
            updateSeats[findSeat].status = 'available';
          }
          return {
            ...prev,
            seats: updateSeats,
            totalPrice: updateSeats.reduce((acc, cur) => {
              if (cur.status == 'temp') acc += parseInt(cur.price);
              return acc;
            }, 0),
          };
        });
      }}
      className={clsx(
        'relative flex h-10 w-10 items-center justify-center rounded-md border text-sm transition-colors',
        item.status === 'available' && 'bg-white text-[#57112f] border-[#8b6b7a] hover:bg-[#faf7f8]',
        item.status === 'temp' && 'bg-[#f6a83a] text-white border-[#c27c18]',
        item.status === 'booked' && 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
      )}
      title={`Ghế ${item.seat_number}`}
    >
      <span className="pointer-events-none select-none text-[11px] font-semibold">{item.seat_number}</span>
    </button>
  );

  return (
    <>
      <div className="mb-5">
        {}
        <div className="mb-5 grid h-[180px] grid-cols-[20%_50%_30%] rounded-2xl bg-white shadow-sm">
          {}
          <div className="flex flex-col items-center justify-evenly">
            <img
              className="w-2/3 rounded-sm object-cover object-center"
              src={data.imageLink || "trip-logo.png"}
              alt="Trip Logo"
            />
            <div className="flex w-[80%] text-center text-sm font-bold text-[#6a314b]">
              {data.vendorName}
            </div>
          </div>
          {}
          <div className="grid grid-rows-[40%_40%] content-evenly">
            <div className="flex flex-col justify-evenly">
              <div className="text-lg font-bold text-[#6a314b]">{data.trip}</div>
              <div className="flex">
                <MapPin className="mr-2" color="#aaa" />
                <div className="text-[#aaa]">{data.pickTake || "Điểm đón - trả"}</div>
              </div>
            </div>
            <div className="grid grid-cols-[45%_45%] justify-between">
              <div className="flex flex-col justify-evenly">
                <div className="flex">
                  <Clock color="#6a314b" className="mr-2" />
                  <div className="text-lg font-bold text-[#6a314b]">
                    {data.departureDate
                      ? new Date(data.departureDate).toLocaleTimeString("en-GB", {
                          timeZone: "Asia/Ho_Chi_Minh",
                        })
                      : undefined}
                  </div>
                </div>
                <div className="text-[#aaa]">
                  <span className="mr-1.5">Thời gian:</span>
                  {data.departureDate
                    ? new Date(data.departureDate).toLocaleDateString("en-CA", {
                        timeZone: "Asia/Ho_Chi_Minh",
                      })
                    : undefined}
                </div>
              </div>
              <div className="flex flex-col justify-evenly">
                <div className="flex items-center">
                  <div className="mr-2 text-lg font-bold text-[#F7AC3D]">
                    {data.emptyNumber}
                  </div>
                  <div className="font-bold">chỗ trống</div>
                </div>
                <div className="flex">
                  <BusFront color="#6a314b" className="mr-2" />
                  <div className="text-[#aaa]">{data.vendorType}</div>
                </div>
              </div>
            </div>
          </div>
          {}
          <div className="flex flex-col items-center justify-evenly border-l-2">
            <div className="text-2xl font-bold text-red-500">
              {data.price ? data.price.toLocaleString("vi-VN") : null} đ
            </div>
            <div
              className="flex h-2/10 w-1/2 items-center justify-center rounded-2xl bg-[#F7AC3D] font-bold text-white transition-colors duration-500 hover:bg-[#6a314b]"
              onClick={() => {
                const token = localStorage.getItem('Authorisation');
                const isLoggedIn = !!token && logout === false;
                if (!isLoggedIn) {
                  navigate('/sign-in', { replace: true });
                  return;
                }
                setBook(!book);
              }}
            >
              Đặt Vé
            </div>
          </div>
        </div>
        {}
        <div
          className={clsx(
            "relative overflow-hidden rounded-2xl bg-white shadow-sm transition-[height] duration-500 ease-in",
            book ? "h-[450px]" : "h-0",
          )}
        >
          <div className="absolute top-0 left-0 grid h-[450px] w-full grid-rows-[70%_10%_15%] content-center justify-items-center">
            {}
            <div className="flex w-[80%] justify-between">
              {!seatLoading && seatDatas && !error ? (
                isTrain && selectedCoach === -1 ? (
                  <div className="w-full">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-xl font-semibold text-[#6a314b]">Chọn toa tàu</div>
                      <div className="flex gap-2">
                        <button className="rounded-full border px-2 py-1 text-[#6a314b]">
                          <ChevronLeft size={16} />
                        </button>
                        <button className="rounded-full border px-2 py-1 text-[#6a314b]">
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      {coaches.map((c: any, i: number) => {
                        const seats = Array.isArray(c.seats) ? c.seats : [];
                        const total = seats.length || c.total_seats || 0;
                        const available = seats.filter((s: any) => s.status === 'available').length;
                        const minPrice = seats.reduce((m: number, s: any) => {
                          const p = parseInt(s.price || '0');
                          return Number.isFinite(p) && p > 0 ? Math.min(m, p) : m;
                        }, Number.MAX_SAFE_INTEGER);
                        return (
                          <button
                            key={i}
                            className="rounded-2xl border border-gray-200 p-4 text-left hover:shadow-md"
                            onClick={() => {
                              setSelectedCoach(i);
                              setInitTrip((prev) => ({ ...prev, seats: seats, totalPrice: 0 }));
                            }}
                          >
                            <div className="flex items-start justify-between">
                              <div className="text-lg font-semibold text-[#57112f]">Toa {c.identifier || i + 1}</div>
                              <div className="rounded-full border px-2 text-xs text-gray-600">{available}/{total}</div>
                            </div>
                            <div className="mt-2 inline-block rounded-full border px-3 py-1 text-xs text-gray-700">
                              {coachTypeLabel(c.coach_type)}
                            </div>
                            <div className="mt-3 text-sm text-red-500">
                              Từ {minPrice === Number.MAX_SAFE_INTEGER ? '-' : minPrice.toLocaleString('vi-VN')} VND
                              <span className="ml-1 text-gray-600">Còn {available} chỗ</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="text-xl font-semibold text-[#6a314b]">
                        Sơ đồ chỗ ngồi {isTrain ? ` - Toa ${coaches[selectedCoach]?.identifier || selectedCoach + 1}` : ''}
                      </div>
                      {isTrain && (
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-[#eef2f7] px-3 py-1 text-sm text-[#6a314b]">
                            {coachTypeLabel(coaches[selectedCoach]?.coach_type)}
                          </div>
                        </div>
                      )}
                    </div>

                    {isTrain ? (
                      <div className="flex w-full gap-6">
                        <div className="w-1/2 rounded-2xl border border-[#5b264233] p-4">
                          <div className="grid gap-3">
                            {Array.from({ length: Math.ceil(leftSeats.length / 4) }, (_, r) => (
                              <div key={r} className="grid grid-cols-4 gap-3">
                                {leftSeats.slice(r * 4, r * 4 + 4).map((s, i) => renderSeatTile(s, i))}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="w-1/2 rounded-2xl border border-[#5b264233] p-4">
                          <div className="grid gap-3">
                            {Array.from({ length: Math.ceil(rightSeats.length / 4) }, (_, r) => (
                              <div key={r} className="grid grid-cols-4 gap-3">
                                {rightSeats.slice(r * 4, r * 4 + 4).map((s, i) => renderSeatTile(s, i))}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex w-full justify-between">
                        <div className="flex w-[40%] flex-col items-center justify-evenly">
                          <div className="flex h-[40px] w-[120px] items-center justify-center rounded-full bg-[#6a314b] text-white">
                            Tầng 1
                          </div>
                          <div className="grid w-full grid-cols-[50px_50px_50px] grid-rows-[repeat(7,30px)] justify-between gap-[6px]">
                            <div className="col-start-2 row-start-7"></div>
                            {initTrip.seats
                              .slice(0, initTrip.seats.length / 2)
                              .map((item, index) => (
                                <div
                                  className={clsx(
                                    "flex h-[30px] items-center justify-center rounded-full text-sm hover:outline-2 hover:outline-[#6a314b7d]",
                                    item.status == "available" && "bg-white text-[#57112f] border border-[#b497a5]",
                                    item.status == "temp" && "bg-[#f6a83a] text-white",
                                    item.status == "booked" && "bg-gray-300 text-gray-500",
                                  )}
                                  key={index}
                                  onClick={() => {
                                    setInitTrip((prev) => {
                                      const findSeat = prev.seats.findIndex((seat) => seat.id == item.id);
                                      const updateSeats = [...prev.seats].map((it) => ({ ...it }));
                                      if (updateSeats[findSeat].status == "available") {
                                        updateSeats[findSeat].status = "temp";
                                      } else if (updateSeats[findSeat].status == "temp") {
                                        updateSeats[findSeat].status = "available";
                                      }
                                      return {
                                        ...prev,
                                        seats: updateSeats,
                                        totalPrice: updateSeats.reduce((acc, cur) => {
                                          if (cur.status == "temp") acc += parseInt(cur.price);
                                          return acc;
                                        }, 0),
                                      };
                                    });
                                  }}
                                >
                                  {item.seat_number}
                                </div>
                              ))}
                          </div>
                        </div>
                        <div className="flex w-[40%] flex-col items-center justify-evenly">
                          <div className="flex h-[40px] w-[120px] items-center justify-center rounded-full bg-[#6a314b] text-white">
                            Tầng 2
                          </div>
                          <div className="grid w-full grid-cols-[50px_50px_50px] grid-rows-[repeat(7,30px)] justify-between gap-[6px]">
                            <div className="col-start-2 row-start-7"></div>
                            {initTrip.seats
                              .slice(initTrip.seats.length / 2)
                              .map((item, index) => (
                                <div
                                  className={clsx(
                                    "flex h-[30px] items-center justify-center rounded-full text-sm hover:outline-2 hover:outline-[#6a314b7d]",
                                    item.status == "available" && "bg-white text-[#57112f] border border-[#b497a5]",
                                    item.status == "temp" && "bg-[#f6a83a] text-white",
                                    item.status == "booked" && "bg-gray-300 text-gray-500",
                                  )}
                                  key={index}
                                  onClick={() => {
                                    setInitTrip((prev) => {
                                      const findSeat = prev.seats.findIndex((seat) => seat.id == item.id);
                                      const updateSeats = [...prev.seats].map((it) => ({ ...it }));
                                      if (updateSeats[findSeat].status == "available") {
                                        updateSeats[findSeat].status = "temp";
                                      } else if (updateSeats[findSeat].status == "temp") {
                                        updateSeats[findSeat].status = "available";
                                      }
                                      return {
                                        ...prev,
                                        seats: updateSeats,
                                        totalPrice: updateSeats.reduce((acc, cur) => {
                                          if (cur.status == "temp") acc += parseInt(cur.price);
                                          return acc;
                                        }, 0),
                                      };
                                    });
                                  }}
                                >
                                  {item.seat_number}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : seatLoading ? (
                <div className="flex size-full flex-col items-center justify-center text-gray-400">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-[#6a314b]" />
                  <div className="mt-2 text-sm text-[#6a314b]">Đang tải sơ đồ ghế...</div>
                </div>
              ) : error ? (
                <div className="flex size-full flex-col items-center justify-center">
                  <div
                    className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
                    role="alert"
                    aria-live="polite"
                  >
                    Không tải được dữ liệu ghế. Vui lòng thử lại.
                  </div>
                  <button
                    className="mt-3 rounded-md bg-[#F7AC3D] px-3 py-1 text-white hover:bg-[#6a314b]"
                    onClick={() => get(`/api/trips/${data.id}`)}
                  >
                    Thử lại
                  </button>
                </div>
              ) : null}
            </div>

            {}
            <div className="flex w-[85%] items-center justify-between">
              <div className="flex gap-5">
                <div className="flex items-center gap-1">
                  <div className="h-[15px] w-[25px] rounded bg-white border border-[#b497a5]"></div>
                  <div className="text-xs text-[#555]">Trống</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-[15px] w-[25px] rounded bg-gray-300"></div>
                  <div className="text-xs text-[#555]">Đã đặt</div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="h-[15px] w-[25px] rounded bg-[#f6a83a]"></div>
                  <div className="text-xs text-[#555]">Đang chọn</div>
                </div>
              </div>
              {isTrain && selectedCoach !== -1 && (
                <button className="rounded-full border px-3 py-1 text-sm text-[#6a314b]" onClick={() => setSelectedCoach(-1)}>
                  ← Đổi toa
                </button>
              )}
            </div>
            {}
            <div className="flex w-[80%] items-center justify-between">
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <div className="text-[#555]">Ghế đã chọn: </div>
                  <div>
                    {initTrip.seats.filter(s=>s.status==="temp").map(s=>s.seat_number).join(', ')}
                  </div>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <div className="text-[#555]">Tổng tiền:</div>
                  <div className="font-semibold text-[#6a314b]">
                    {initTrip.totalPrice.toLocaleString('vi-VN')}<span>đ</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isTrain && selectedCoach === -1 ? (
                  <button className="rounded-full bg-[#F7AC3D] px-5 py-2 font-bold text-white hover:bg-[#6a314b]" onClick={() => setSelectedCoach(0)}>
                    Tiếp tục
                  </button>
                ) : (
                  <>
                    <button className="rounded-full bg-gray-200 px-5 py-2 font-bold text-[#6a314b] hover:bg-gray-300" onClick={() => setSelectedCoach(-1)}>
                      Hủy
                    </button>
                    <button
                      className={clsx("rounded-full px-5 py-2 font-bold text-white", initTrip.seats.some(s=>s.status==='temp') ? 'bg-[#F7AC3D] hover:bg-[#6a314b]' : 'bg-gray-300 cursor-not-allowed')}
                      disabled={!initTrip.seats.some(s=>s.status==='temp')}
                      onClick={() => navigate('/check-out', { state: initTrip })}
                    >
                      Chọn
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
