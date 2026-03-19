import clsx from "clsx";
import Assets from "../../assets";
import { useEffect, useState } from "react";
import {
  Bus,
  Train,
  Circle,
  MapPin,
  CalendarCheck,
  ArrowRightLeft,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFetch } from "@/hooks/useFetch";
import { useLocation, useNavigate } from "react-router-dom";

import { URL } from "@/config";

const initSchedule = {
  region: null,
  date: undefined,
  vehicle: "bus",
};

interface schedule {
  region: {
    from: { name: string; id: number } | null;
    to: { name: string; id: number } | null;
  } | null;
  date: Date | undefined;
  vehicle: string;
}

function AddressOption() {
  const navigate = useNavigate();
  const { data, loading, error, get } = useFetch<any>(URL);

  const region = data?.data;

  useEffect(() => {
    get("/api/routes/location");
  }, [get]);

  const [schedule, setSchedule] = useState<schedule>(initSchedule);
  const [toggleAddress, setToggleAddress] = useState(false);
  const [indexNav, setIndexNav] = useState(0);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const isSearchDisabled =
    loading || !(((schedule.region?.from && schedule.region?.to)) || !!schedule.date);

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const data = JSON.parse(decodeURIComponent(params.get("data") || "null"));
    if (data) setSchedule(data);
  }, [location]);

  return (
    <>
      <div className="grid h-[245px] w-full grid-rows-[50px]">
        {}
        <div className="relative overflow-hidden rounded-t-2xl bg-[#5B2642]">
          {}
          {loading && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 rounded-md bg-white/90 px-3 py-1.5 text-sm text-[#5B2642] shadow">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#5B2642]/40 border-t-[#5B2642]" />
              Đang tải địa điểm...
            </div>
          )}
          {error && (
            <div
              className="absolute top-3 right-3 z-10 flex items-center gap-3 rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700 shadow"
              role="alert"
              aria-live="polite"
            >
              Không tải được địa điểm.
              <button
                className="rounded bg-[#F7AC3D] px-2 py-1 text-white hover:bg-[#6a314b]"
                onClick={() => get("/api/routes/location")}
              >
                Thử lại
              </button>
            </div>
          )}
          <div className="absolute top-0 left-0 z-1 grid size-full auto-cols-[20%] grid-flow-col">
            <div
              className="flex size-full items-center justify-center gap-[5%]"
              onClick={() => {
                setIndexNav(0);
                setSchedule((prev) => ({ ...prev, vehicle: "bus" }));
              }}
            >
              <div className="">
                <Bus
                  className="transition-colors duration-500"
                  color={indexNav === 0 ? "#5B2642" : "#fff"}
                  strokeWidth={1}
                  size={30}
                />
              </div>
              <div
                className={clsx(
                  "text-xl font-bold transition-colors duration-500",
                  indexNav === 0 ? "text-[#5B2642]" : "text-white",
                )}
              >
                Bus
              </div>
            </div>
            <div
              className="flex items-center justify-center gap-[5%]"
              onClick={() => {
                setIndexNav(1);
                setSchedule((prev) => ({ ...prev, vehicle: "train" }));
              }}
            >
              <div className="">
                <Train
                  className="transition-colors duration-500"
                  color={indexNav === 1 ? "#5B2642" : "#fff"}
                  strokeWidth={1}
                  size={30}
                />
              </div>
              <div
                className={clsx(
                  "text-xl font-bold transition-colors duration-500",
                  indexNav === 1 ? "text-[#5B2642]" : "text-white",
                )}
              >
                Train
              </div>
            </div>
          </div>
          <div
            className={clsx(
              "absolute bottom-0 transition-[left] duration-500",
              indexNav == 0 && "left-[calc(0*20%-(370px-20%)/2)]",
              indexNav == 1 && "left-[calc(1*20%-(370px-20%)/2)]",
            )}
          >
            <Assets.TabIcon />
          </div>
        </div>

        <div className="grid grid-rows-[60%_40%] rounded-b-2xl bg-white">
          {}
          <div className="grid h-[80%] w-[90%] grid-cols-3 self-end justify-self-center">
            {}
            <div className="relative grid auto-cols-[min-content_1fr] grid-flow-col items-center gap-2.5 rounded-l-2xl bg-[#FFF1E3] outline outline-[#aaa]">
              <div className="absolute top-1.5 left-2.5 text-xs text-[#aaa]">
                Nơi xuất phát
              </div>
              <div className="flex w-7 justify-end">
                <Circle size={15} strokeWidth={3} color="#5B2642" />
              </div>
              <div className="font-bold text-[#5B2642]">
                {schedule.region?.from
                  ? schedule.region.from.name
                  : "Chọn điểm đi"}
              </div>
              <div className="absolute top-0 left-0 z-1 size-full rounded-l-2xl hover:outline-3 hover:outline-[#5b26427e]">
                <Select
                  onValueChange={(e) => {
                    setSchedule((prev) => ({
                      ...prev,
                      region: {
                        from: JSON.parse(e),
                        to: prev.region?.to || null,
                      },
                    }));
                  }}
                >
                  {}
                  <SelectTrigger className="!h-full !w-full border-0 bg-transparent px-2 py-0 text-left opacity-0 shadow-none focus-visible:border-0 focus-visible:ring-0">
                    <SelectValue
                      placeholder={
                        loading
                          ? "Đang tải..."
                          : error
                            ? "Lỗi tải dữ liệu"
                            : "Chọn điểm đi"
                      }
                    />
                  </SelectTrigger>
                  {}
                  <SelectContent align="start" className="min-w-full">
                    <SelectGroup>
                      <SelectLabel>Điểm đón</SelectLabel>

                      {region ? (
                        region.map((item: any) => (
                          <SelectItem
                            value={JSON.stringify({
                              name: item.name,
                              id: item.id,
                            })}
                            key={item.id}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {}
            <div className="relative grid auto-cols-[min-content_1fr] grid-flow-col items-center gap-2.5 bg-[#FFF1E3] outline outline-[#aaa]">
              <div
                className={clsx(
                  "absolute top-1/2 left-0 z-2 -translate-1/2 rounded-full bg-white p-2 transition-transform duration-300",
                  toggleAddress ? "rotate-180" : "",
                )}
                onClick={() => {
                  setToggleAddress(!toggleAddress);
                }}
              >
                <ArrowRightLeft size={20} />
              </div>
              <div className="absolute top-1.5 left-2.5 text-xs text-[#aaa]">
                Nơi đến
              </div>
              <div className="flex w-10 justify-end">
                <MapPin size={15} strokeWidth={3} color="#5B2642" />
              </div>
              <div className="font-bold text-[#5B2642]">
                {schedule.region?.to
                  ? schedule.region.to.name
                  : "Chọn điểm đến"}
              </div>
              <div className="absolute top-0 left-0 z-1 size-full hover:outline-3 hover:outline-[#5b26427e]">
                <Select
                  onValueChange={(e) => {
                    setSchedule((prev) => ({
                      ...prev,
                      region: {
                        from: prev.region?.from || null,
                        to: JSON.parse(e),
                      },
                    }));
                  }}
                >
                  {}
                  <SelectTrigger className="!h-full !w-full border-0 bg-transparent px-2 py-0 text-left opacity-0 shadow-none focus-visible:border-0 focus-visible:ring-0">
                    <SelectValue
                      placeholder={
                        loading
                          ? "Đang tải..."
                          : error
                            ? "Lỗi tải dữ liệu"
                            : "Chọn điểm đến"
                      }
                    />
                  </SelectTrigger>
                  {}
                  <SelectContent align="start" className="min-w-full">
                    <SelectGroup>
                      <SelectLabel>Điểm đến</SelectLabel>
                      {region ? (
                        region.map((item: any) => (
                          <SelectItem
                            value={JSON.stringify({
                              name: item.name,
                              id: item.id,
                            })}
                            key={item.id}
                          >
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {}
            <div className="relative grid auto-cols-[min-content_1fr] grid-flow-col items-center gap-2.5 rounded-r-2xl bg-[#FFF1E3] outline outline-[#aaa]">
              <div className="absolute top-1.5 left-2.5 text-xs text-[#aaa]">
                Lịch xuất phát
              </div>
              <div className="flex w-7 justify-end">
                <CalendarCheck size={15} strokeWidth={3} color="#5B2642" />
              </div>
              <div className="absolute top-0 left-0 z-1 size-full rounded-r-2xl hover:outline-3 hover:outline-[#5b26427e]">
                <div className="flex size-full flex-col gap-3">
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="ml-6 size-full justify-between border-0 bg-[transparent] text-base font-bold text-[#5B2642] hover:bg-[transparent] hover:text-[#5B2642]"
                      >
                        {schedule.date
                          ? new Date(schedule.date).toLocaleDateString(
                              "en-CA",
                              {
                                timeZone: "Asia/Ho_Chi_Minh",
                              },
                            )
                          : "Chọn lịch"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden bg-[#fff9f3] p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setDate(date);
                          setOpen(false);

                          setSchedule((prev) => ({
                            ...prev,
                            date: date,
                          }));
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
          <div
            className={clsx(
              "mr-[5%] flex h-1/2 w-1/8 items-center justify-center self-center justify-self-end rounded-full bg-[#F7AC3D] text-sm font-bold text-white transition-colors duration-500",
              isSearchDisabled
                ? "cursor-not-allowed opacity-60"
                : "hover:bg-[#5b2642]",
            )}
            onClick={() => {
              if (isSearchDisabled) return;
              navigate(
                `/book?data=${encodeURIComponent(JSON.stringify(schedule))}`,
              );
            }}
            aria-disabled={isSearchDisabled}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/60 border-t-white" />
                Đang tải...
              </div>
            ) : (
              "Tìm kiếm"
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AddressOption;
