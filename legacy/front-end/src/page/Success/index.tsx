import { CheckCircle } from "lucide-react";

function Success() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-gradient-to-br from-[#f2e8d6] via-[#f0dadc] to-[#e8cfe1]">
      {}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {}
        <div className="absolute inset-0 bg-black/[.06] md:bg-black/10" />
        {}
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#fdbf00]/30 blur-3xl md:h-96 md:w-96" />
        <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-[#6d0236]/25 blur-3xl md:h-[500px] md:w-[500px]" />
        {}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.25)_35%,rgba(255,255,255,0.12)_55%,transparent_62%)]" />
        {}
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.04)_0%,rgba(255,255,255,0)_45%,rgba(255,255,255,0.03)_75%)] mix-blend-overlay" />
        {}
        <div className="absolute inset-0 opacity-[0.07] [background:repeating-linear-gradient(60deg,rgba(255,255,255,0.7)_0px,rgba(255,255,255,0.7)_1px,transparent_1px,transparent_6px)]" />
        {}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.22)_100%)]" />
      </div>
      {}
      <section className="relative z-0 flex flex-1 items-center justify-center px-4 pt-24 pb-16 md:pt-28">
        <div className="relative flex flex-col items-center gap-4 md:gap-6">
          {}
          <div className="pointer-events-none absolute -inset-24 -z-10 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),rgba(16,185,129,0)_60%)] blur-3xl" />
          {}
          <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-emerald-500/15 ring-8 ring-emerald-500/10 md:h-40 md:w-40">
            <CheckCircle
              className="h-16 w-16 text-emerald-600 md:h-24 md:w-24"
              strokeWidth={3}
            />
            {}
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-pink-500" />
            <span className="absolute right-6 -bottom-2 h-2.5 w-2.5 rounded-full bg-yellow-400" />
            <span className="absolute top-6 -left-2 h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="absolute top-2 left-10 h-2 w-2 rotate-45 bg-orange-400" />
          </div>
          <h2 className="text-center text-2xl font-extrabold text-[#5b2642] md:text-3xl">
            Đặt vé thành công
          </h2>
          <p className="text-center text-xs text-[#6b6b6b] md:text-sm">
            Cảm ơn bạn đã đặt vé với GoTicket
          </p>
        </div>
      </section>
    </div>
  );
}

export default Success;
