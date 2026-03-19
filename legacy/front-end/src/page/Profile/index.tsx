import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Pencil, Settings, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { URL } from "@/config";
import { useNavigate } from "react-router-dom";
import { LogOutContext } from "@/context/LogoutProvider";
import { toast } from "sonner";
const navigationItems = [
  {
    id: "public-profile",
    label: "Public profile",
    icon: User,
    active: true,
  },
  {
    id: "setting",
    label: "Setting",
    icon: Settings,
    active: false,
  },
];
const supportItems = [
  {
    id: "help-support",
    label: "Help & Support",
    icon: HelpCircle,
  },
];

export default function Profile() {
  const navigate = useNavigate();
  const { setAuth } = useContext(LogOutContext);
  // Validate profile
  const [profile, setProfile] = useState<any>(null);
  //Get profile
  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await fetch(`${URL}/api/auth/myinfo`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Authorisation") || "",
          },
        });
        const json = await res.json();
        // console.log(json);
        setProfile({
          ...json,
          data: { ...json.data, phone_number: json.data.phone },
        });
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
  }, []);
  //PUT profile
  const putProfile = async () => {
    try {
      const res = await fetch(`${URL}/api/auth/myinfo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Authorisation") || "",
        },
        body: JSON.stringify(profile?.data),
      });
      const json = await res.json();
      console.log(json);
      navigate("/");
      if (!json.success) throw Error("Dữ liệu ko hợp lệ ❌");
      toast.success("Cập nhập tài khoản thành công  🎉");
      setAuth(null);
    } catch (error: any) {
      // console.log(error);
      toast.error(error.message);
    }
  };

  // console.log(profile);

  return (
    <div className="relative h-[130vh] w-full bg-gradient-to-b from-[#faf6f6] via-[#f7f1f1] to-[#f3eded]">
      <div className="absolute top-[80px] left-1/2 w-full max-w-6xl -translate-x-1/2 px-4 py-8 md:px-6 md:py-10 lg:px-8">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between rounded-xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur-sm md:mb-8 md:p-6">
          <div className="flex items-center gap-4 md:gap-5">
            <Avatar className="h-12 w-12 rounded-full border-4 border-[#f7ac3d] bg-white md:h-14 md:w-14">
              <AvatarFallback className="bg-transparent">
                <User className="h-6 w-6 text-[#5b2642] md:h-7 md:w-7" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-[#f7ac3d]">
                Your personal account
              </span>
              <h1 className="text-xl font-semibold text-[#5b2642] md:text-2xl">
                My Account
              </h1>
            </div>
          </div>
          <Button
            variant="outline"
            className="border-[#1b1f2426] bg-white px-3 py-1 shadow-[inset_0px_1px_0px_#ffffff40,0px_1px_0px_#1b1f240a]"
          >
            <span className="text-xs font-medium text-[#24292f] md:text-sm">
              Go to your personal profile
            </span>
          </Button>
        </header>

        {/* Main */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="flex h-max flex-col gap-4 rounded-xl border border-white/50 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
            <nav className="flex flex-col gap-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  className={`group relative flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors ${
                    item.active
                      ? "bg-[#5b2642] text-white"
                      : "text-[#5b2642] hover:bg-[#5b26420d]"
                  }`}
                >
                  <item.icon
                    className={`h-4 w-4 ${item.active ? "text-white" : "text-[#5b2642]"}`}
                  />
                  <span
                    className={`${item.active ? "font-semibold" : "font-normal"}`}
                  >
                    {item.label}
                  </span>
                  {item.active && (
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 rounded-md bg-[#5b2642]" />
                  )}
                </button>
              ))}
            </nav>

            <Separator className="bg-[#d0d7de7a]" />

            <div>
              <div className="mb-2 text-xs font-semibold tracking-wide text-[#5b2642] uppercase">
                Support
              </div>
              {supportItems.map((item) => (
                <button
                  key={item.id}
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-[#5b2642] hover:bg-[#5b26420d]"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Logout section removed */}

            {/* Profile picture card */}
            <div className="rounded-xl border border-white/50 bg-white/70 p-4 shadow-sm">
              <Label className="text-sm font-semibold text-[#5b2642]">
                Profile picture
              </Label>
              <div className="mt-3 flex flex-col items-center gap-3">
                <Avatar className="h-40 w-40 border-4 border-[#f7ac3d] bg-white">
                  <AvatarFallback className="bg-transparent">
                    <User className="h-20 w-20 text-[#5b2642]" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="h-8 border-[#d0d7de] bg-white px-3 py-0"
                >
                  <Pencil className="mr-1 h-4 w-4" />
                  <span className="text-sm">Edit</span>
                </Button>
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="rounded-xl border border-white/50 bg-white/80 p-5 shadow-sm backdrop-blur-sm md:p-6">
            <div className="mb-4 border-b border-[#d8dee4] pb-3">
              <h2 className="text-xl font-semibold text-[#5b2642] md:text-[23px]">
                Public profile
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="col-span-1 flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#5b2642]">
                  Name
                </Label>
                <Input
                  placeholder="Your name"
                  value={profile?.data?.name || ""}
                  className="h-9 border-[#d0d7de] bg-white text-sm text-[#24292f] shadow-[inset_0px_1px_0px_#d0d7de33]"
                  onChange={(e) => {
                    setProfile((pre: any) => ({
                      ...pre,
                      data: { ...(pre?.data || {}), name: e.target.value },
                    }));
                  }}
                />
                <p className="text-xs text-[#623d51]">
                  Your name may appear around GitHub where you contribute or are
                  mentioned. You can remove it at any time.
                </p>
              </div>

              {/* Phone field */}
              <div className="col-span-1 flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#5b2642]">
                  Số điện thoại
                </Label>
                <Input
                  value={profile?.data?.phone_number || ""}
                  type="tel"
                  placeholder="Nhập số điện thoại"
                  className="h-9 border-[#d0d7de] bg-white text-sm text-[#24292f] shadow-[inset_0px_1px_0px_#d0d7de33]"
                  onChange={(e) => {
                    setProfile((pre: any) => ({
                      ...pre,
                      data: {
                        ...(pre?.data || {}),
                        phone_number: e.target.value,
                      },
                    }));
                  }}
                />
                <p className="text-xs text-[#623d51]">
                  Cập nhật số điện thoại để nhận thông báo về tài khoản và
                  chuyến đi.
                </p>
              </div>

              <div className="col-span-1 flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#5b2642]">
                  Mật khẩu hiện tại
                </Label>
                <Input
                  type="password"
                  className="h-9 border-[#d0d7de] bg-white text-[32px] font-bold tracking-[0.32px] text-[#959595] shadow-[inset_0px_1px_0px_#d0d7de33]"
                  onChange={(e) => {
                    setProfile((pre: any) => ({
                      ...pre,
                      data: {
                        ...(pre?.data || {}),
                        current_password: e.target.value,
                      },
                    }));
                  }}
                />
              </div>

              <div className="col-span-1 flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#5b2642]">
                  Mật khẩu mới
                </Label>
                <Input
                  type="password"
                  className="h-9 border-[#d0d7de] bg-white text-[32px] font-bold tracking-[0.32px] text-[#959595] shadow-[inset_0px_1px_0px_#d0d7de33]"
                  onChange={(e) => {
                    setProfile((pre: any) => ({
                      ...pre,
                      data: { ...(pre?.data || {}), password: e.target.value },
                    }));
                  }}
                />
              </div>

              <div className="col-span-1 flex flex-col gap-2">
                <Label className="text-sm font-semibold text-[#5b2642]">
                  Xác nhận mật khẩu mới
                </Label>
                <Input
                  type="password"
                  className="h-9 border-[#d0d7de] bg-white text-[32px] font-bold tracking-[0.32px] text-[#959595] shadow-[inset_0px_1px_0px_#d0d7de33]"
                  onChange={(e) => {
                    setProfile((pre: any) => ({
                      ...pre,
                      data: {
                        ...(pre?.data || {}),
                        password_confirmation: e.target.value,
                      },
                    }));
                  }}
                />
              </div>

              {/* Location field removed */}
            </div>

            <p className="mt-4 text-xs text-[#57606a]">
              All of the fields on this page are optional and can be deleted at
              any time, and by filling them out, you're giving us consent to
              share this data wherever your user profile appears. Please see our{" "}
              <span className="text-[#0969da]">privacy statement</span> to learn
              more about how we use this information.
            </p>

            <div className="mt-5">
              <Button
                className="bg-[#f7ac3d] px-4 py-2 text-white shadow hover:bg-[#f7ac3d]/90"
                onClick={() => {
                  putProfile();
                }}
              >
                Update profile
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}