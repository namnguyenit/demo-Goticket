import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { URL } from "@/config";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { data, loading, error, post } = useFetch(URL);

  useEffect(() => {
    if (data && data?.success == true) {
      navigate("/sign-in");
    }
  }, [data]);

  const formFields = [
    {
      id: "fullname",
      label: "Họ và tên",
      icon: User,
      type: "text",
      showToggle: false,
    },
    {
      id: "password",
      label: "Mật khẩu",
      icon: Lock,
      type: "password",
      showToggle: true,
      showState: showPassword,
      setShowState: setShowPassword,
    },
    {
      id: "confirmPassword",
      label: "Xác nhận mật khẩu",
      icon: Lock,
      type: "password",
      showToggle: true,
      showState: showConfirmPassword,
      setShowState: setShowConfirmPassword,
    },
    {
      id: "phone",
      label: "Số điện thoại",
      icon: Phone,
      type: "tel",
      showToggle: false,
    },
    {
      id: "email",
      label: "Email",
      icon: Mail,
      type: "email",
      showToggle: false,
    },
  ];
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#fffdf7] via-[#fff4d4] to-[#fbe1f0]">
      {}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#fdbf00]/30 blur-3xl md:h-96 md:w-96" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#6d0236]/25 blur-3xl md:h-[500px] md:w-[500px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.65),transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_45%,rgba(255,255,255,0.12)_75%)] mix-blend-overlay" />
        <div className="absolute inset-0 opacity-[0.06] [background:repeating-linear-gradient(60deg,rgba(255,255,255,0.7)_0px,rgba(255,255,255,0.7)_1px,transparent_1px,transparent_6px)]" />
      </div>
      {}
      <section className="relative flex h-[260px] w-full items-center justify-center overflow-hidden bg-[url(/book-page-bg.jpg)] bg-cover bg-center after:absolute after:inset-0 after:bg-black/40">
        <div className="relative z-10 items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Tạo tài khoản
          </h1>
        </div>
      </section>

      {}
      <section className="mx-auto w-full max-w-xl px-6 py-10 md:py-14">
        <div className="rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur-md md:p-8">
          <header className="mb-6 text-center md:mb-8">
            <h2 className="text-xl font-bold text-[#5b2642] md:text-2xl">
              Chào mừng đến với GoTicket
            </h2>
            <p className="mt-2 text-sm text-[#555] md:text-base">
              Điền thông tin để bắt đầu hành trình của bạn
            </p>
          </header>
          <form
            className="flex flex-col gap-5"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const fd = new FormData(form);
              const payload = {
                name: String(fd.get("fullname") || ""),
                password: String(fd.get("password") || ""),
                confirmPassword: String(fd.get("confirmPassword") || ""),
                phone: String(fd.get("phone") || ""),
                email: String(fd.get("email") || ""),
              };
              if (payload.password !== payload.confirmPassword) {
                alert("Mật khẩu xác nhận không khớp");
                return;
              }
              post("/api/auth/register", {
                name: payload.name,
                phone: payload.phone,
                email: payload.email,
                password: payload.password,
                password_confirmation: payload.confirmPassword,
              });
            }}
          >
            {formFields.map((field) => {
              const IconComponent = field.icon;
              const isPassword = field.showToggle;
              const type = isPassword
                ? field.showState
                  ? "text"
                  : "password"
                : field.type;
              return (
                <div key={field.id} className="flex flex-col gap-2">
                  <Label
                    htmlFor={field.id}
                    className="text-xs font-semibold tracking-wide text-[#5b2642]/80 uppercase md:text-sm"
                  >
                    {field.label}
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#5b2642]/60">
                      <IconComponent className="h-4 w-4" />
                    </span>
                    <Input
                      id={field.id}
                      name={field.id}
                      type={type}
                      required
                      className="h-11 w-full rounded-lg border border-[#d5d5d5] bg-white/70 pr-10 pl-10 text-sm focus-visible:ring-2 focus-visible:ring-[#fdbf00] md:h-12 md:text-base"
                      aria-required="true"
                    />
                    {isPassword && (
                      <button
                        type="button"
                        onClick={() => field.setShowState?.(!field.showState)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-[#5b2642]/60 transition hover:text-[#5b2642]"
                        aria-label={
                          field.showState ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                        }
                      >
                        {field.showState ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {error && (
              <div className="-mt-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 md:text-sm">
                {!data?.success && "Lỗi nhập liệu"}
              </div>
            )}
            <Button
              type="submit"
              className="mt-2 h-11 rounded-lg bg-[#fdbf00] text-sm font-semibold text-black shadow hover:bg-[#ffc933] focus-visible:ring-2 focus-visible:ring-[#fdbf00] disabled:opacity-60 md:h-12 md:text-base"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Đang đăng ký...
                </span>
              ) : (
                "Đăng ký"
              )}
            </Button>
          </form>
          <div className="mt-6 text-center text-sm md:mt-7 md:text-base">
            <span className="text-[#444]">Đã có tài khoản? </span>
            <a
              href="/sign-in"
              className="font-semibold text-[#5b2642] underline-offset-4 hover:underline"
            >
              Đăng nhập ngay
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
