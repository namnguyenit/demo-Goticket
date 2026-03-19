import { Card, CardContent } from "@/components/ui/card";
import { Clock, Heart, Shield, Users } from "lucide-react";

interface ValueCardItem {
  id: number;
  icon: any;
  title: string;
  description: string;
}

const valueCards: ValueCardItem[] = [
  {
    id: 1,
    icon: Clock,
    title: "Trải nghiệm liền mạch",
    description:
      "Từ khám phá đến tham gia – mọi bước trong hành trình sự kiện của bạn đều được tối ưu để suôn sẻ và thú vị.",
  },
  {
    id: 2,
    icon: Shield,
    title: "Niềm tin & Bảo mật",
    description:
      "Thông tin cá nhân và giao dịch được bảo vệ bằng các tiêu chuẩn bảo mật hàng đầu ngành.",
  },
  {
    id: 3,
    icon: Heart,
    title: "Đam mê dẫn lối",
    description:
      "Chúng tôi đam mê sự kiện và cam kết giúp bạn tạo nên những kỷ niệm đáng nhớ.",
  },
  {
    id: 4,
    icon: Users,
    title: "Cộng đồng là trên hết",
    description:
      "Kết nối con người qua những trải nghiệm chung giàu cảm xúc và ý nghĩa.",
  },
];

function About() {
  return (
    <>
      <div className="w-full">
        {}
        <section className="relative flex h-[320px] w-full items-center justify-center overflow-hidden bg-[url(/book-page-bg.jpg)] bg-cover bg-center after:absolute after:inset-0 after:bg-[#003580]/80">
          <div className="relative z-10 flex items-center justify-center px-6 text-center">
            <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight text-white md:text-5xl">
              Giới thiệu về chúng tôi
            </h1>
          </div>
        </section>

        {}
        <section className="mx-auto w-full max-w-6xl px-6 py-14 md:px-8 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-start md:gap-16">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#5b2642] md:text-4xl">
                Sứ mệnh & Giá trị
              </h2>
              <p className="text-sm leading-relaxed text-[#333] md:text-base">
                Chúng tôi theo đuổi sứ mệnh giúp việc khám phá và tham gia sự
                kiện trở nên dễ dàng, thú vị và đáng nhớ cho mọi người ở mọi
                nơi. GoTicket không ngừng cải tiến để mở rộng dịch vụ và nâng
                cao trải nghiệm người dùng.
              </p>
              <p className="text-sm leading-relaxed text-[#444] md:text-base">
                Minh bạch – Bảo mật – Kết nối cộng đồng là nền tảng để chúng tôi
                tạo dựng niềm tin lâu dài.
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              {valueCards.slice(0, 2).map((c) => (
                <Card
                  key={c.id}
                  className="rounded-xl border border-white/40 bg-white/70 shadow-sm backdrop-blur-sm transition hover:shadow-md"
                >
                  <CardContent className="flex flex-col gap-3 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b2642]/10 text-[#5b2642]">
                      <c.icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-semibold text-[#5b2642] md:text-lg">
                      {c.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-[#555] md:text-sm">
                      {c.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {}
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 md:px-8 md:pb-24">
          <div className="mb-10 flex flex-col gap-3 text-center">
            <h2 className="text-2xl font-bold text-[#5b2642] md:text-3xl">
              Giá trị cốt lõi
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-[#555] md:text-base">
              Những điều định hình cách chúng tôi xây dựng nền tảng và phục vụ
              cộng đồng.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {valueCards.map((c) => (
              <Card
                key={c.id}
                className="group relative overflow-hidden rounded-xl border border-white/40 bg-white/70 shadow-sm backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <CardContent className="flex h-full flex-col gap-4 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#5b2642]/10 text-[#5b2642]">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#5b2642] md:text-base">
                    {c.title}
                  </h3>
                  <p className="flex-1 text-xs leading-relaxed text-[#555] md:text-sm">
                    {c.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default About;
