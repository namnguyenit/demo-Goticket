import RoleNav from "@/components/RoleNav";
import { formatVnd } from "@/lib/fake-data";
import styles from "./home.module.css";

const deals = [
  {
    image: "/HomePage/deal-1.jpg",
    name: "Lao Cai den Yen Bai",
    date: "21/10/12",
    price: 360000,
    large: true,
  },
  {
    image: "/HomePage/deal-2.jpg",
    name: "Ha Noi - Ca Mau",
    date: "21/10/12",
    price: 2000000,
  },
  {
    image: "/HomePage/deal-3.jpg",
    name: "Sapa - Lai Chau",
    date: "Full time",
    price: 1400000,
  },
  {
    image: "/HomePage/deal-4.jpg",
    name: "Lao Cai - Yen Bai",
    date: "Full time",
    price: 900000,
  },
  {
    image: "/HomePage/deal-5.jpg",
    name: "Ha Long Bai Chay",
    date: "Full time",
    price: 1200000,
  },
];

export default function HomePage() {
  return (
    <main className={styles.home}>
      <div className={styles.topNavWrap}>
        <RoleNav current="home" />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.copy}>
            <h1 className={styles.caption}>A Lifetime of Discounts? It&apos;s Genius.</h1>
            <p className={styles.content}>
              Get rewarded for your travels - unlock instant savings of 10% or more with a free Geairinfo.com
              account.
            </p>
            <p className={styles.cta}>Let&apos;s go. Booking trip right now!</p>
          </div>
        </div>
      </section>

      <section className={styles.searchSlot}>
        <div className={styles.searchCard}>
          <div className={styles.searchTabs}>
            <button className={`${styles.tab} ${styles.tabActive}`}>Bus</button>
            <button className={styles.tab}>Train</button>
          </div>

          <div className={styles.searchFields}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Noi xuat phat</span>
              <span className={styles.fieldValue}>Ho Chi Minh</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Noi den</span>
              <span className={styles.fieldValue}>Da Nang</span>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>Ngay di</span>
              <span className={styles.fieldValue}>20/03/2026</span>
            </div>
            <button className={styles.searchBtn}>Tim chuyen</button>
          </div>
        </div>
      </section>

      <section className={styles.sectionWrap}>
        <div className={styles.contactGrid}>
          <article className={styles.contactCard}>
            <div className={styles.contactIcon}>M</div>
            <div>
              <h3 className={styles.contactTitle}>Chung toi luon san sang</h3>
              <p className={styles.contactText}>Goi +84368843600 de lien he voi nhan vien.</p>
            </div>
          </article>

          <article className={styles.contactCard}>
            <div className={styles.contactIcon}>R</div>
            <div>
              <h3 className={styles.contactTitle}>Chuyen di</h3>
              <p className={styles.contactText}>Goi +84368843600 de dat chuyen, tu van dich vu.</p>
            </div>
          </article>

          <article className={styles.contactCard}>
            <div className={styles.contactIcon}>$</div>
            <div>
              <h3 className={styles.contactTitle}>Hoan tra</h3>
              <p className={styles.contactText}>Tu van chinh sach hoan tra va den bu cho khach hang.</p>
            </div>
          </article>
        </div>
      </section>

      <section className={`${styles.sectionWrap} ${styles.deals}`}>
        <div className={styles.dealsKicker}>Offer deals</div>
        <h2 className={styles.dealsTitle}>Travel Offer Deals</h2>

        <div className={styles.dealGrid}>
          <article className={styles.bigDeal}>
            <img src={deals[0].image} alt={deals[0].name} />
            <div className={styles.dealBody}>
              <h3 className={styles.dealName}>{deals[0].name}</h3>
              <div className={styles.dealMeta}>{deals[0].date}</div>
              <div className={styles.dealPrice}>{formatVnd(deals[0].price)}</div>
            </div>
          </article>

          <div className={styles.smallGrid}>
            {deals.slice(1).map((deal) => (
              <article key={deal.name} className={styles.smallDeal}>
                <img src={deal.image} alt={deal.name} />
                <div className={styles.dealBody}>
                  <h3 className={styles.smallName}>{deal.name}</h3>
                  <div className={styles.dealMeta}>{deal.date}</div>
                  <div className={styles.dealPrice}>{formatVnd(deal.price)}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
