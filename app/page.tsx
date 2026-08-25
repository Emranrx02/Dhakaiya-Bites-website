"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";

const categories = [
  {
    title: "Burgers",
    image: "/menu/menu-01.JPG",
    items: [
      "Little Star Burger",
      "Classic Chicken Burger",
      "Chicken Crispy Burger",
      "BBQ Chicken Cheese Burger",
    ],
    from: "৳119",
  },
  {
    title: "Rice Bowls",
    image: "/menu/menu-02.JPG",
    items: [
      "Crispy Rice Bowl",
      "Chilli Onion Rice Bowl",
      "Dhakaiya Special Bowl",
      "Seafood Rice",
    ],
    from: "৳149",
  },
  {
    title: "Hot Chicken",
    image: "/menu/menu-04.JPG",
    items: [
      "1 Piece Hot Chicken",
      "2 Pieces Hot Chicken",
      "4 Pieces Hot Chicken",
      "6 Pieces Hot Chicken",
    ],
    from: "৳109",
  },
  {
    title: "Set Menu",
    image: "/menu/menu-03.JPG",
    items: [
      "Thai Platter",
      "Korean Lollipop Platter",
      "Chicken Manchurian Bite",
      "Family Platter",
    ],
    from: "৳249",
  },
  {
    title: "Seafood & Chicken",
    image: "/menu/menu-05.JPG",
    items: [
      "Prawn Fry",
      "Fish Finger",
      "Crispy Wings",
      "BBQ Lollipop",
    ],
    from: "৳179",
  },
  {
    title: "Drinks",
    image: "/menu/menu-11.JPG",
    items: [
      "Citrus Mint",
      "Chocolate Milkshake",
      "Cold Coffee",
      "Lassi",
    ],
    from: "৳39",
  },
];
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

export default function Home(){
 const router=useRouter();
 const [menuOpen, setMenuOpen] = useState(false);
 const [page, setPage] = useState(0);
 const [id, setId] = useState("");
 const showMenu = (index = 0) => {
  setPage(index);
  setMenuOpen(true);
 };
 return <main>
  <div className="notice"><span>🍔</span> Fast Bites. Big Flavour. Every Craving, One Place. <a href="tel:01303583641">Call 01303583641</a></div>
    <header className="header wrap"><a href="#home" className="logo"><img src="/brand/logo.png" alt="Dhakaiya Bites logo"/><div><b>Dhakaiya Bites</b><small>GOOD FOOD • EVERY BITE</small></div></a><nav><a href="#home">Home</a><button className="nav-menu-button" onClick={()=>showMenu(0)}>Menu</button><a href="#about">About</a><a href="#verify">Staff Verify</a><a href="#contact">Contact</a></nav><a className="btn btn-small" href="tel:01303583641">Order Now <span>↗</span></a></header>

  <section className="hero" id="home"><div className="hero-copy wrap"><div className="copy"><div className="pill"><i/> MIRPUR&apos;S FAVOURITE FAST FOOD</div><h1>ক্ষুধা যখনই,<br/><em>Dhakaiya Bites তখনই।</em></h1><p>এক কামড়েই মন ভালো! Crispy chicken, juicy burger, rice bowl কিংবা refreshing drinks—প্রতিটি craving-এর জন্য আছে দারুণ কিছু।</p><div className="hero-tagline">FAST BITES. <b>BIG FLAVOUR.</b></div><div className="actions"><a className="btn" href="tel:01303583641">Order Now <span>→</span></a><a className="outline" href="/menu">Explore Full Menu</a></div><div className="stats"><span><b>40+</b><small>Menu Items</small></span><span><b>11</b><small>Categories</small></span><span><b>100%</b><small>Freshly Prepared</small></span></div></div><div className="food-stage"><div className="yellow-ring"/><img src="/brand/hot-chicken.jpg" alt="Dhakaiya Bites hot chicken"/><div className="hero-logo"><img src="/brand/logo.png" alt="Dhakaiya Bites official logo"/></div><div className="price-pop"><small>STARTING FROM</small><b>৳109</b></div><div className="fresh-pop">🔥 Fresh & Crispy</div></div></div></section>

  <section className="marquee"><div>BURGERS <b>✦</b> RICE BOWL <b>✦</b> HOT CHICKEN <b>✦</b> PASTA <b>✦</b> SEAFOOD <b>✦</b> SHAWARMA <b>✦</b> COFFEE</div></section>

  <section className="menu wrap" id="menu"><div className="heading"><div><span>WHAT ARE YOU CRAVING?</span><h2>Our crowd favourites</h2></div><button onClick={()=>showMenu()}>View full menu <b>→</b></button></div><div className="category-grid">{categories.map((c,i)=><article className="category" key={c.title}><div className="cat-photo"><img src={c.image} alt={c.title}/><span>FROM {c.from}</span></div><div className="cat-body"><h3>{c.title}</h3><ul>{c.items.map(x=><li key={x}>{x}</li>)}</ul><button onClick={()=>showMenu(Math.min(i,menuPages.length-1))}>See menu <span>→</span></button></div></article>)}</div></section>

  <section className="about" id="about"><div className="wrap about-grid"><div className="about-art"><img src="/brand/burger.jpg" alt="Dhakaiya Bites burger"/><div className="since"><b>100%</b><small>Freshly Prepared</small></div></div><div className="about-copy"><span>OUR STORY</span><h2>Good food.<br/>Good mood. <em>Every bite.</em></h2><p>Dhakaiya Bites is your neighbourhood fast-food destination in Mirpur 10. Our menu brings together bold flavours, fresh ingredients and satisfying portions—all in one place.</p><div className="checks"><span>✓ Freshly prepared</span><span>✓ Dine-in & delivery</span><span>✓ Trade licensed</span><span>✓ Wide menu selection</span></div><a className="btn" href="https://www.instagram.com/dhakaiyabites">Follow @dhakaiyabites</a></div></div></section>

  <section className="verify" id="verify"><div className="wrap verify-grid"><div><span className="section-tag">TRUST & SAFETY</span><h2>Verify a Dhakaiya Bites staff member</h2><p>Enter the Staff ID shown on their official ID card. We only display approved public work details.</p></div><div className="verify-card"><label>STAFF ID NUMBER</label><form onSubmit={e=>{e.preventDefault();router.push(`/verify/${id.toUpperCase().replace(/^DB-/,"")}`)}}><div><span>DB-</span><input value={id} onChange={e=>setId(e.target.value)} placeholder="1024" required/></div><button>Verify staff</button></form><small className="safe">🔒 No NID, address or private phone number is shown.</small></div></div></section>

  <section className="visit" id="contact"><div className="wrap visit-grid"><div><span>VISIT US</span><h2>Your next favourite bite is right here.</h2><p>Section 10, Lane 06, Block C, House 1<br/>Mirpur 10, Dhaka</p></div><div className="contact-card"><small>ORDER & DELIVERY</small><a href="tel:01303583641">01303 583 641</a><p>Open every day</p><div><a className="btn" href="tel:01303583641">Call to order</a><a className="map" href="https://maps.google.com/?q=Mirpur+10+Dhaka">Get directions ↗</a></div></div></div></section>
  <footer><div className="wrap footer"><div className="logo footer-logo"><img src="/brand/logo.png" alt="Dhakaiya Bites"/><div><b>Dhakaiya Bites</b><small>FAST BITES. BIG FLAVOUR.</small></div></div><p>© 2026 Dhakaiya Bites. All rights reserved.</p><div><a href="https://www.instagram.com/dhakaiyabites">Instagram</a><a href="#menu">Menu</a><a href="#verify">Verify Staff</a></div></div></footer>

    {menuOpen&&<div className="modal" role="dialog" aria-modal="true"><div className="modal-top"><div><b>Dhakaiya Bites Menu</b><small>Page {page+1} of {menuPages.length}</small></div><button onClick={()=>setMenuOpen(false)} aria-label="Close">×</button></div><div className="menu-view"><button disabled={page===0} onClick={()=>setPage(p=>p-1)}>‹</button><img src={menuPages[page]} alt={`Menu page ${page+1}`} onError={event=>{event.currentTarget.src="/brand/logo.png";}}/><button disabled={page===menuPages.length-1} onClick={()=>setPage(p=>p+1)}>›</button></div><div className="dots">{menuPages.map((_,i)=><button className={i===page?"active":""} onClick={()=>setPage(i)} key={i}>{i+1}</button>)}</div></div>}
 </main>
}
