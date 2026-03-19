import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin, MessageCircle, Send, Twitter } from "lucide-react";

const exploreLinks = [
  "About us",
  "Travel alerts",
  "Awards",
  "Qatarisation",
  "Careers",
  "Beyond",
  "Press release",
  "Airways Cargo",
  "Sponsorship",
];

const socialIcons = [
  { Icon: Facebook, label: "Facebook" },
  { Icon: MessageCircle, label: "WhatsApp" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
];

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-[#1f1f1f] pt-14 pb-8 text-white md:pt-20">
      {}
      <div className="mx-auto w-full max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          {}
          <div className="max-w-md flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-14 w-auto object-contain"
              />
              <span className="text-2xl font-bold tracking-wide">VEXE</span>
            </div>
            <p className="text-base leading-relaxed font-medium text-white/80">
              Trực tuyến để làm cho chuyến đi của bạn đáng nhớ hơn nữa. Khám phá
              – Đặt chỗ – Lên đường.
            </p>
            <div className="flex items-center gap-4">
              {socialIcons.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="group inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition-all duration-200 hover:bg-white/10 hover:ring-white/30 focus-visible:ring-2 focus-visible:ring-[#f7ac3d] focus-visible:outline-none"
                >
                  <Icon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {}
          <nav aria-label="Khám phá" className="max-w-xs flex-1">
            <h2 className="mb-5 text-xl font-bold tracking-wide md:text-2xl">
              Khám phá
            </h2>
            <ul className="grid grid-cols-1 gap-3 text-base text-white/80">
              {exploreLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="rounded-sm transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-[#f7ac3d] focus-visible:outline-none"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {}
          <div className="max-w-md flex-1 space-y-6">
            <div>
              <h2 className="mb-4 text-xl font-bold tracking-wide md:text-2xl">
                Liên hệ
              </h2>
              <address className="text-base leading-relaxed text-white/80 not-italic">
                Ngõ 27, số nhà 27, Hoàn Kiếm - Hà Nội
              </address>
              <div className="mt-4 space-y-2 text-base font-medium">
                <a
                  href="tel:+8417198342322"
                  className="text-[#f7ac3d] hover:underline"
                >
                  +84 171 983 4232
                </a>
                <br />
                <a
                  href="mailto:hayhay@gmail.com"
                  className="text-[#f7ac3d] hover:underline"
                >
                  hayhay@gmail.com
                </a>
              </div>
            </div>
            <div>
              <p className="mb-3 text-base font-semibold tracking-wide">
                Nhận tin ưu đãi
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                className="flex rounded-xl bg-white/10 p-1 ring-1 ring-white/15 transition focus-within:ring-white/40"
              >
                <Input
                  type="email"
                  placeholder="Email của bạn"
                  required
                  className="h-12 flex-1 border-0 bg-transparent text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  className="h-12 rounded-lg bg-[#f7ac3d] px-4 font-semibold text-black transition-colors hover:bg-[#ffbb55]"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
              <p className="mt-2 text-xs text-white/50">
                Bằng việc đăng ký, bạn đồng ý với chính sách bảo mật của chúng
                tôi.
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="mt-14 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {}
        <div className="mt-6 flex flex-col gap-4 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p className="font-medium">© {year} VEXE. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6 font-medium">
            <a href="#" className="transition-colors hover:text-white">
              Điều khoản
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Bảo mật
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Cookies
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
