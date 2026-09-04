import Link from "next/link";

const menuPages = [
  "/menu/menu-01.JPG",
  "/menu/menu-02.JPG",
  "/menu/menu-03.JPG",
  "/menu/menu-04.JPG",
  "/menu/menu-05.JPG",
  "/menu/menu-06.JPG",
  "/menu/menu-07.JPG",
  "/menu/menu-08.JPG",
  "/menu/menu-09.JPG",
  "/menu/menu-10.JPG",
  "/menu/menu-11.JPG",
];

export default function FullMenuPage() {
  return (
    <main className="full-menu-page">
      <header className="full-menu-header">
        <div>
          <span>Dhakaiya Bites</span>
          <h1>Explore Our Full Menu</h1>
          <p>Fast Bites. Big Flavour. Every craving, one place.</p>
        </div>
        <nav className="full-menu-actions" aria-label="Menu page navigation">
          <Link className="full-menu-home-link" href="/" aria-label="Back Home">
            ← Back Home
          </Link>
          <Link className="full-menu-rewards-link" href="/rewards">
            Rewards <small>7 stamps → 1 free dish</small>
          </Link>
        </nav>
      </header>

      <section className="full-menu-grid">
        {menuPages.map((image, index) => (
          <article className="full-menu-card" key={image}>
            <div className="menu-page-number">Menu Page {index + 1}</div>
            <img src={image} alt={`Menu page ${index + 1}`} />
          </article>
        ))}
      </section>

      <div className="menu-order-bar">
        <div>
          <small>ORDER & DELIVERY</small>
          <strong>01603 365 308</strong>
        </div>
        <div className="menu-order-actions">
          <Link className="menu-reward-link" href="/rewards">Get Stamp</Link>
          <a className="menu-call-link" href="tel:+8801603365308">Call to Order</a>
        </div>
      </div>
    </main>
  );
}
