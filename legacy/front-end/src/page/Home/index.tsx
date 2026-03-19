import style from "./Home.module.css";
import AddressOption from "../../components/AddressOption";
import Assets from "../../assets";
import type { JSX } from "react";

function Home() {

  return (
    <>
      <div className="h-screen w-screen select-none">
        <div className={style.welcome}>
          <div className={style.warp}>
            <div className={style.caption}>
              A Lifetime of Discounts? It's Genius.
            </div>
            <div className={style.content}>
              Get rewarded for your travels – unlock instant savings of 10% or
              more with a free Geairinfo.com account
            </div>
            <div className="text-white">Let's go. Booking trip right now !</div>
          </div>
        </div>
      </div>
      <div className="relative h-[20vh] w-[70vw]">
        <div className="absolute left-[50%] h-[35vh] w-[70vw] translate-x-[-50%] translate-y-[-150px]">
          <AddressOption></AddressOption>
        </div>
      </div>
      <HomeContact />
      <HomeDeals />
    </>
  );
}

export default Home;

interface HomeContactItemType {
  Icon: JSX.Element;
  title?: string;
  content?: string;
}

function HomeContactItem({ Icon, title, content }: HomeContactItemType) {
  return (
    <>
      <div className="flex h-full w-full items-center justify-center gap-x-2 rounded-md bg-white outline-[#62224368] transition select-none hover:outline-4">
        <div className="aspect-square w-16">{Icon}</div>
        <div className="w-[55%]">
          <div className="text-lg font-bold">{title}</div>
          <div className="text-sm text-gray-400">{content}</div>
        </div>
      </div>
    </>
  );
}

function HomeContact() {
  return (
    <>
      <div
        className={
          "gird grid h-[30vh] w-screen grid-cols-[repeat(3,25%)] grid-rows-[65%] content-center justify-center gap-x-8"
        }
      >
        <HomeContactItem
          Icon={<Assets.Messenger color="#622243" />}
          title="Chúng tôi luôn sẵn sàng"
          content="Gọi +84368843600 để liên hệ với nhân viên"
        />
        <HomeContactItem
          Icon={<Assets.Road color="#622243" />}
          title="Chuyến đi"
          content="Gọi +84368843600 để đặt chuyến, tư vấn dịch vụ"
        />
        <HomeContactItem
          Icon={<Assets.Refund color="#622243" />}
          title="Hoàn trả"
          content="Gọi +84368843600 tìm hiểu về chính sách hoàn trả, đền bù,..."
        />
      </div>
    </>
  );
}

interface HomeDealType {
  imgSrc: string;
  name: string;
  date: string;
  price: string;
}

function HomeDealItems({ imgSrc, name, date, price }: HomeDealType) {
  return (
    <>
      <div className="flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-300 hover:scale-[1.01]">
        <img
          className="mt-[-20px] h-[50%] w-[90%] rounded-xl object-cover select-none"
          src={imgSrc}
          alt="offer deal"
        />
        <div className="mt-5 flex h-[30%] w-[80%] flex-col justify-between">
          <div className="">
            <div className="text-xl font-bold">{name}</div>
            <div className="text-[#622243]">{date}</div>
          </div>
          <div className="font-bold">{price}</div>
        </div>
      </div>
    </>
  );
}

function HomeDeals() {
  return (
    <>
      <div className="flex h-[130vh] w-screen flex-col items-center">
        <div className="flex h-[15%] w-[83%] flex-col justify-center gap-y-1">
          <div className="text-sm text-[#ffa903] uppercase">Offer Deals</div>
          <div className="text-2xl font-bold">Travel Offer Deals</div>
        </div>
        <div className="grid h-[80%] w-[80%] grid-cols-2 gap-x-8">
          {}
          <div className="flex flex-col items-center gap-y-[5%] overflow-hidden rounded-xl bg-white shadow-md transition-transform duration-500 hover:scale-[1.01]">
            <img
              className="h-[70%] object-cover select-none"
              src="/HomePage/deal-1.jpg"
              alt="offer deal"
            />
            <div className="flex h-[20%] w-[80%] flex-col justify-between">
              <div className="">
                <div className="text-2xl font-bold">Lào Cai đến Yên Bái</div>
                <div className="text-[#622243]">21/10/12</div>
              </div>
              <div className="text-lg font-bold">360.000 đ</div>
            </div>
          </div>
          {}
          <div className="grid grid-cols-2 grid-rows-2 gap-8">
            <HomeDealItems
              imgSrc="/HomePage/deal-2.jpg"
              name="Hà Nội - Cà Mau"
              date="21/10/12"
              price="2.000.000đ"
            />
            <HomeDealItems
              imgSrc="/HomePage/deal-3.jpg"
              name="Sapa - Lai Châu"
              date="full time"
              price="1.400.000đ"
            />
            <HomeDealItems
              imgSrc="/HomePage/deal-4.jpg"
              name="Lào Cai - Yên Bái"
              date="full time"
              price="900.000đ"
            />
            <HomeDealItems
              imgSrc="/HomePage/deal-5.jpg"
              name="Hạ Long Bãi Cháy"
              date="full time"
              price="1.200.000đ - 3.000.000đ"
            />
          </div>
        </div>
      </div>
    </>
  );
}
