"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const WHATSAPP_NUMBER = "8801603365308";

export default function OrderPage() {
  const [deliveryType, setDeliveryType] = useState("Home Delivery");
  const [orderSent, setOrderSent] = useState(false);

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    const name = form.get("name");
    const phone = form.get("phone");
    const food = form.get("food");
    const quantity = form.get("quantity");
    const delivery = form.get("delivery");
    const area = form.get("area");
    const address = form.get("address");
    const payment = form.get("payment");
    const note = form.get("note");

    const message = `
🍔 *NEW ORDER — DHAKAIYA BITES*

👤 *Customer Name:* ${name}
📞 *Phone Number:* ${phone}

🍽️ *Food Items:* ${food}
🔢 *Total Quantity:* ${quantity}

🛵 *Order Type:* ${delivery}
📍 *Delivery Area:* ${area || "Not required"}
🏠 *Full Address:* ${address || "Restaurant pickup"}

💳 *Payment Method:* ${payment}
📝 *Special Instructions:* ${note || "None"}

Please confirm my order, delivery charge and total price.
    `.trim();

    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    setOrderSent(true);
    window.open(whatsappURL, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="order-page">
      <span className="order-background-circle order-circle-one" />
      <span className="order-background-circle order-circle-two" />

      <header className="order-page-header">
        <Link href="/" className="order-brand" aria-label="Back Home">
          <img src="/brand/logo.png" alt="Dhakaiya Bites logo" />
          <div>
            <b>Dhakaiya Bites</b>
            <small>GOOD FOOD • EVERY BITE</small>
          </div>
        </Link>

        <Link href="/" className="back-home">
          ← Back Home
        </Link>
      </header>

      <section className="order-page-content">
        <div className="order-intro">
          <span className="order-small-title">ORDER ONLINE</span>
          <h1>
            Your favourite bites,
            <br />
            <em>delivered fresh.</em>
          </h1>
          <p>
            আপনার পছন্দের খাবার ও delivery information দিন। Submit করার পর
            WhatsApp-এ order message তৈরি হয়ে যাবে।
          </p>

          <div className="order-benefits">
            <div>
              <span>✓</span>
              <p>
                <b>Freshly Prepared</b>
                <small>Prepared after order confirmation</small>
              </p>
            </div>
            <div>
              <span>✓</span>
              <p>
                <b>Order Confirmation</b>
                <small>Confirmation through WhatsApp</small>
              </p>
            </div>
            <div>
              <span>✓</span>
              <p>
                <b>Secure & Simple</b>
                <small>No online payment required</small>
              </p>
            </div>
          </div>

          <div className="order-contact">
            <small>Need assistance?</small>
            <a href="tel:+8801603365308">01603 365 308</a>
          </div>
        </div>

        {orderSent ? (
          <div className="order-success-card">
            <div className="success-icon">✓</div>
            <span className="success-label">ORDER MESSAGE CREATED</span>
            <h2>Thank you for your order!</h2>
            <p>
              আপনার order information WhatsApp-এ তৈরি হয়েছে। Message-টি send করলে
              আমাদের team দ্রুত total price ও delivery time confirm করবে।
            </p>
            <div className="success-note">
              <span>📱</span>
              <div>
                <b>WhatsApp confirmation required</b>
                <small>Please make sure the prepared message was sent.</small>
              </div>
            </div>
            <div className="success-actions">
              <button type="button" onClick={() => setOrderSent(false)}>
                Place Another Order
              </button>
              <Link href="/">Back to Home</Link>
            </div>
          </div>
        ) : (
        <form className="order-form-card" onSubmit={submitOrder}>
          <div className="order-form-heading">
            <span>🍔</span>
            <div>
              <h2>Place Your Order</h2>
              <p>Fill in the information below</p>
            </div>
          </div>

          <div className="order-form-grid">
            <label>
              <span>Your Name *</span>
              <input name="name" type="text" placeholder="Enter your name" required />
            </label>

            <label>
              <span>Phone Number *</span>
              <input name="phone" type="tel" placeholder="01XXXXXXXXX" required />
            </label>

            <label className="order-full-field">
              <span>Food Items *</span>
              <input name="food" type="text" placeholder="e.g. 2 Chicken Burgers, 1 Fries" required />
            </label>

            <label>
              <span>Total Quantity *</span>
              <input name="quantity" type="number" min="1" defaultValue="1" required />
            </label>

            <label>
              <span>Order Type *</span>
              <select
                name="delivery"
                value={deliveryType}
                onChange={(event) => setDeliveryType(event.target.value)}
                required
              >
                <option value="Home Delivery">Home Delivery</option>
                <option value="Restaurant Pickup">Restaurant Pickup</option>
              </select>
            </label>

            {deliveryType === "Home Delivery" && (
              <>
                <label>
                  <span>Delivery Area *</span>
                  <input name="area" type="text" placeholder="Mirpur 10, Dhaka" required />
                </label>

                <label className="order-full-field">
                  <span>Complete Delivery Address *</span>
                  <input name="address" type="text" placeholder="House, road, landmark" required />
                </label>
              </>
            )}

            <label className="order-full-field">
              <span>Payment Method *</span>
              <select name="payment" required>
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Cash at Restaurant">Cash at Restaurant</option>
                <option value="bKash — Confirm on WhatsApp">bKash — Confirm on WhatsApp</option>
              </select>
            </label>

            <label className="order-full-field">
              <span>Special Instructions</span>
              <textarea name="note" rows={4} placeholder="Less spicy, extra sauce, etc." />
            </label>
          </div>

          <div className="order-message">
            <span>✓</span>
            <p>Submit করার পর WhatsApp খুলবে। Order নিশ্চিত করতে message-টি send করবেন।</p>
          </div>

          <button className="order-submit" type="submit">
            WhatsApp-এ Order পাঠান <span>→</span>
          </button>
        </form>
        )}
      </section>
    </main>
  );
}