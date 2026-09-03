"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
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
const galleryImages = [
  {src:"/gallery/gallery-01.webp",title:"Good food, better together",label:"CUSTOMER MOMENTS"},
  {src:"/gallery/gallery-02.webp",title:"Crafted to refresh",label:"FROM OUR COUNTER"},
  {src:"/gallery/gallery-03.webp",title:"Celebrating every connection",label:"DHAKAIYA MOMENTS"},
  {src:"/gallery/gallery-04.webp",title:"Little bites, big smiles",label:"HAPPY CUSTOMERS"},
  {src:"/gallery/gallery-05.webp",title:"Your neighbourhood food stop",label:"MIRPUR 10"}
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
 const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 const [galleryIndex,setGalleryIndex]=useState(0);
 const galleryTouchStart=useRef<number|null>(null);
 useEffect(()=>{const timer=setInterval(()=>setGalleryIndex(index=>(index+1)%galleryImages.length),5000);return()=>clearInterval(timer)},[]);
 const moveGallery=(direction:number)=>setGalleryIndex(index=>(index+direction+galleryImages.length)%galleryImages.length);
 const showMenu = (index = 0) => {
  setPage(index);
  setMenuOpen(true);
 };
 return <main>
  <div className="notice"><span>🍔</span> Fast Bites. Big Flavour. Every Craving, One Place. <a href="tel:+8801603365308">Call 01603 365 308</a></div>
    <header className="header wrap"><a href="#home" className="logo"><img src="/brand/logo.png" alt="Dhakaiya Bites logo"/><div><b>Dhakaiya Bites</b><small>GOOD FOOD • EVERY BITE</small></div></a><nav className="desktop-nav"><a href="#home">Home</a><button className="nav-menu-button" onClick={()=>showMenu(0)}>Menu</button><Link href="/rewards">Rewards</Link><a href="#about">About</a><a href="#verify">Staff Verify</a><a href="#contact">Contact</a></nav><div className="header-actions"><Link className="btn btn-small" href="/order">Order <span>↗</span></Link><div className="mobile-menu"><button type="button" className="mobile-menu-trigger" aria-label="Open navigation" aria-expanded={mobileMenuOpen} onClick={()=>setMobileMenuOpen(open=>!open)}><span/><span/><span/></button>{mobileMenuOpen&&<><button type="button" className="mobile-menu-backdrop" aria-label="Close navigation" onClick={()=>setMobileMenuOpen(false)}/><nav className="mobile-menu-panel" aria-label="Mobile navigation"><a href="#home" onClick={()=>setMobileMenuOpen(false)}>Home</a><a href="/menu" onClick={()=>setMobileMenuOpen(false)}>Full Menu</a><Link href="/rewards" onClick={()=>setMobileMenuOpen(false)}>Rewards</Link><a href="#about" onClick={()=>setMobileMenuOpen(false)}>About Us</a><a href="#verify" onClick={()=>setMobileMenuOpen(false)}>Staff Verification</a><a href="#contact" onClick={()=>setMobileMenuOpen(false)}>Contact</a></nav></>}</div></div></header>

  <section className="hero" id="home"><div className="hero-copy wrap"><div className="copy"><div className="pill"><i/> MIRPUR&apos;S FAVOURITE FAST FOOD</div><h1>ক্ষুধা যখনই,<br/><em>Dhakaiya Bites তখনই।</em></h1><p>এক কামড়েই মন ভালো! Crispy chicken, juicy burger, rice bowl কিংবা refreshing drinks—প্রতিটি craving-এর জন্য আছে দারুণ কিছু।</p><div className="hero-tagline">FAST BITES. <b>BIG FLAVOUR.</b></div><div className="actions"><Link className="btn" href="/order">Order Now <span>↗</span></Link><a className="outline" href="/menu">Explore Full Menu</a></div><div className="stats"><span><b>40+</b><small>Menu Items</small></span><span><b>11</b><small>Categories</small></span><span><b>100%</b><small>Freshly Prepared</small></span></div></div><div className="food-stage"><div className="yellow-ring"/><img src="/brand/hot-chicken.jpg" alt="Dhakaiya Bites hot chicken"/><div className="hero-logo"><img src="/brand/logo.png" alt="Dhakaiya Bites official logo"/></div><div className="price-pop"><small>STARTING FROM</small><b>৳109</b></div><div className="fresh-pop">🔥 Fresh & Crispy</div></div></div></section>

  <section className="marquee"><div>BURGERS <b>✦</b> RICE BOWL <b>✦</b> HOT CHICKEN <b>✦</b> PASTA <b>✦</b> SEAFOOD <b>✦</b> SHAWARMA <b>✦</b> COFFEE</div></section>

  <section className="menu wrap" id="menu"><div className="heading"><div><span>WHAT ARE YOU CRAVING?</span><h2>Our crowd favourites</h2></div><button onClick={()=>showMenu()}>View full menu <b>→</b></button></div><div className="category-grid">{categories.map((c,i)=><article className="category" key={c.title}><div className="cat-photo"><img src={c.image} alt={c.title}/><span>FROM {c.from}</span></div><div className="cat-body"><h3>{c.title}</h3><ul>{c.items.map(x=><li key={x}>{x}</li>)}</ul><button onClick={()=>showMenu(Math.min(i,menuPages.length-1))}>See menu <span>→</span></button></div></article>)}</div></section>

  <section className="about" id="about"><div className="wrap about-grid"><div className="about-art"><img src="/brand/burger.jpg" alt="Dhakaiya Bites burger"/><div className="since"><b>100%</b><small>Freshly Prepared</small></div></div><div className="about-copy"><span>OUR STORY</span><h2>Good food.<br/>Good mood. <em>Every bite.</em></h2><p>Dhakaiya Bites is your neighbourhood fast-food destination in Mirpur 10. Our menu brings together bold flavours, fresh ingredients and satisfying portions—all in one place.</p><div className="checks"><span>✓ Freshly prepared</span><span>✓ Dine-in & delivery</span><span>✓ Trade licensed</span><span>✓ Wide menu selection</span></div><a className="btn" href="https://www.instagram.com/dhakaiyabites">Follow @dhakaiyabites</a></div></div></section>

  <section className="gallery-section" aria-labelledby="gallery-title">
    <div className="wrap gallery-heading"><div><span>INSIDE DHAKAIYA BITES</span><h2 id="gallery-title">Real food. Real people. <em>Real moments.</em></h2></div><p>A little look at the flavours, smiles and everyday moments that make Dhakaiya Bites special.</p></div>
    <div className="wrap gallery-slider">
      <div className="gallery-frame" onTouchStart={event=>galleryTouchStart.current=event.touches[0].clientX} onTouchEnd={event=>{if(galleryTouchStart.current===null)return;const distance=event.changedTouches[0].clientX-galleryTouchStart.current;if(Math.abs(distance)>45)moveGallery(distance>0?-1:1);galleryTouchStart.current=null}}>
        <div className="gallery-slide" key={galleryImages[galleryIndex].src}>
          <img className="gallery-backdrop" src={galleryImages[galleryIndex].src} alt="" aria-hidden="true"/>
          <img className="gallery-image" src={galleryImages[galleryIndex].src} alt={galleryImages[galleryIndex].title}/>
          <div className="gallery-caption"><small>{galleryImages[galleryIndex].label}</small><b>{galleryImages[galleryIndex].title}</b></div>
        </div>
        <button className="gallery-arrow gallery-prev" type="button" aria-label="Previous photo" onClick={()=>moveGallery(-1)}>‹</button>
        <button className="gallery-arrow gallery-next" type="button" aria-label="Next photo" onClick={()=>moveGallery(1)}>›</button>
        <div className="gallery-count"><b>{String(galleryIndex+1).padStart(2,"0")}</b><span>/ {String(galleryImages.length).padStart(2,"0")}</span></div>
      </div>
      <div className="gallery-dots">{galleryImages.map((image,index)=><button type="button" key={image.src} className={index===galleryIndex?"active":""} aria-label={`Show photo ${index+1}`} onClick={()=>setGalleryIndex(index)}/>)}</div>
    </div>
  </section>

  <section className="verify" id="verify"><div className="wrap verify-grid"><div><span className="section-tag">TRUST & SAFETY</span><h2>Verify a Dhakaiya Bites staff member</h2><p>Enter the Staff ID shown on their official ID card. We only display approved public work details.</p></div><div className="verify-card"><label>STAFF ID NUMBER</label><form onSubmit={e=>{e.preventDefault();router.push(`/verify/${id.toUpperCase().replace(/^DB-/,"")}`)}}><div><span>DB-</span><input value={id} onChange={e=>setId(e.target.value)} placeholder="1024" required/></div><button>Verify staff</button></form><small className="safe">🔒 No NID, address or private phone number is shown.</small></div></div></section>

  <section className="visit" id="contact"><div className="wrap visit-grid"><div><span>VISIT US</span><h2>Your next favourite bite is right here.</h2><p>Section 10, Lane 06, Block C, House 1<br/>Mirpur 10, Dhaka</p></div><div className="contact-card"><small>ORDER & DELIVERY</small><a href="tel:+8801603365308">01603 365 308</a><p>Open every day</p><div><a className="btn" href="tel:+8801603365308">Call to order</a><a className="map" href="https://maps.google.com/?q=Mirpur+10+Dhaka">Get directions ↗</a></div></div></div></section>
  <footer><div className="wrap footer"><div className="logo footer-logo"><img src="/brand/logo.png" alt="Dhakaiya Bites"/><div><b>Dhakaiya Bites</b><small>FAST BITES. BIG FLAVOUR.</small></div></div><div className="footer-meta"><p>© 2026 Dhakaiya Bites. All rights reserved.</p><a className="developer-credit" href="https://emranhaque.com" target="_blank" rel="noreferrer">Developed by <b>HashHype Labs Team</b></a></div><div className="footer-links"><a href="https://www.instagram.com/dhakaiyabites">Instagram</a><a href="#menu">Menu</a><a href="#verify">Verify Staff</a></div></div></footer>

    {menuOpen&&<div className="modal" role="dialog" aria-modal="true"><div className="modal-top"><div><b>Dhakaiya Bites Menu</b><small>Page {page+1} of {menuPages.length}</small></div><button onClick={()=>setMenuOpen(false)} aria-label="Close">×</button></div><div className="menu-view"><button disabled={page===0} onClick={()=>setPage(p=>p-1)}>‹</button><img src={menuPages[page]} alt={`Menu page ${page+1}`} onError={event=>{event.currentTarget.src="/brand/logo.png";}}/><button disabled={page===menuPages.length-1} onClick={()=>setPage(p=>p+1)}>›</button></div><div className="dots">{menuPages.map((_,i)=><button className={i===page?"active":""} onClick={()=>setPage(i)} key={i}>{i+1}</button>)}</div></div>}
 </main>
}
