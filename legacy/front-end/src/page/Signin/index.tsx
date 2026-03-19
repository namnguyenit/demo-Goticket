import { useContext, useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useNavigate } from "react-router-dom";
import { URL } from "@/config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EyeIcon, LockIcon, UserIcon } from "lucide-react";
import { LogOutContext } from "@/context/LogoutProvider";

interface SigninType {
  email: string | null;
  password: string | null;
}
const initSign: SigninType = { email: null, password: null };
function Signin() {
  const { setLogout } = useContext(LogOutContext);

  const [info, setInfo] = useState(initSign);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { data, post, loading, error } = useFetch<any>(URL);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    post("/api/auth/login", info, { Authorisation: "Bearer your_token_here" });
  };

  useEffect(() => {
    if (data?.success) {
      localStorage.setItem(
        "Authorisation",
        "Bearer " + data.data.authorisation.token,
      );
      setLogout(false);
      navigate("/", { replace: true });
    }
  }, [data]);

  return (
    <div className="relative flex min-h-[130vh] w-full flex-col overflow-hidden bg-gradient-to-br from-[#fffdf7] via-[#fff4d4] to-[#fbe1f0]">
      {}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#fdbf00]/30 blur-3xl md:h-96 md:w-96" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#6d0236]/25 blur-3xl md:h-[500px] md:w-[500px]" />
        {}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(255,255,255,0.7),transparent_65%)]" />
        {}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.15)_0%,rgba(255,255,255,0)_45%,rgba(255,255,255,0.12)_75%)] mix-blend-overlay" />
        {}
        <div className="absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(60deg,rgba(255,255,255,0.7)_0px,rgba(255,255,255,0.7)_1px,transparent_1px,transparent_6px)]" />
      </div>
      {}
      <section className="relative flex h-72 w-full items-center justify-center overflow-hidden bg-[url(/book-page-bg.jpg)] bg-cover bg-center after:absolute after:inset-0 after:bg-black/40 md:h-80">
        <div className="relative z-10 flex items-center justify-center px-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-4xl">
            Đăng nhập
          </h1>
        </div>
      </section>

      {}
      <section className="relative z-10 -mt-20 flex w-full grow items-start justify-center px-4 pb-12 md:-mt-24">
        <Card className="w-full max-w-md rounded-3xl border border-white/40 bg-white/70 shadow-xl backdrop-blur-md">
          <CardContent className="p-6 md:p-8">
            <header className="mb-6 text-center md:mb-8">
              <h2 className="text-xl font-bold text-[#5b2642] md:text-2xl">
                Chào mừng trở lại
              </h2>
              <p className="mt-2 text-sm text-[#555] md:text-base">
                Đăng nhập để tiếp tục hành trình của bạn
              </p>
            </header>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold tracking-wide text-[#5b2642]/70 uppercase md:text-sm"
                >
                  Tài khoản / Email
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#5b2642]/50">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <Input
                    id="email"
                    type="text"
                    placeholder="you@example.com"
                    className="h-11 w-full rounded-lg border border-[#d6d6d6] bg-white/80 pr-3 pl-10 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-[#fdbf00] md:h-12 md:text-base"
                    value={info.email ?? ""}
                    onChange={(e) =>
                      setInfo((p) => ({ ...p, email: e.target.value }))
                    }
                    autoComplete="username"
                    required
                  />
                </div>
              </div>
              {}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold tracking-wide text-[#5b2642]/70 uppercase md:text-sm"
                >
                  Mật khẩu
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[#5b2642]/50">
                    <LockIcon className="h-4 w-4" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="h-11 w-full rounded-lg border border-[#d6d6d6] bg-white/80 pr-10 pl-10 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-[#fdbf00] md:h-12 md:text-base"
                    value={info.password ?? ""}
                    onChange={(e) =>
                      setInfo((p) => ({ ...p, password: e.target.value }))
                    }
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-[#5b2642]/50 transition hover:text-[#5b2642]"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#6d0236] underline-offset-4 hover:underline md:text-sm"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
              </div>
              {error && (
                <div className="-mt-1 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 md:text-sm">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                className="h-11 rounded-lg bg-[#fdbf00] text-sm font-semibold text-black shadow hover:bg-[#ffc933] focus-visible:ring-2 focus-visible:ring-[#fdbf00] disabled:opacity-60 md:h-12 md:text-base"
                disabled={loading || !info.email || !info.password}
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
                    Đang đăng nhập...
                  </span>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
              <div className="pt-1 text-center text-xs text-[#444] md:text-sm">
                <span>Chưa có tài khoản? </span>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/sign-up");
                  }}
                  className="font-semibold text-[#6d0236] underline-offset-4 hover:underline"
                >
                  Đăng kí ngay
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default Signin;
