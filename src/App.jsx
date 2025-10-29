import React, { useEffect, useMemo, useState } from "react";

/**
 * Simple Chocolate Shop — Single-file React app
 * -------------------------------------------------
 * ✅ Feature highlights
 *  - Mobile-first product grid with search & category filter
 *  - Add to cart, edit quantities, remove items
 *  - Cart total with MVR currency
 *  - Checkout via WhatsApp (prefills an order message)
 *  - Cart persists in localStorage
 *  - Easy to edit PRODUCTS list below
 *
 * 🔧 Quick setup (in any React/Vite/Next project)
 * 1) Drop this file into your project and render <ChocolateShop />
 * 2) Replace WHATSAPP_NUMBER and BRAND constants below
 * 3) Replace placeholder images/URLs in PRODUCTS
 *
 * 📦 Deploy fast
 *  - Netlify/Vercel: create a new project and deploy your React app
 *  - Static export is fine; no backend required
 */

// ====== EDIT THESE TWO ======
const BRAND = "Cherry Moon"; // Shown in the header
const WHATSAPP_NUMBER = "9607000000"; // Use international format without +, e.g. 9607XXXXXX (Maldives)
// =============================

// Example categories: "Chocolate", "Nuts", "Dried Fruit", "Snacks"
const PRODUCTS = [
  {
    id: "almond-choc-100",
    name: "Almond Chocolate Bar 100g",
    price: 45, // MVR
    category: "Chocolate",
    img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476e?q=80&w=1200&auto=format&fit=crop",
    unit: "100 g",
  },
  {
    id: "hazelnut-choc-90",
    name: "Hazelnut Milk Chocolate 90g",
    price: 40,
    category: "Chocolate",
    img: "https://images.unsplash.com/photo-1616594099215-5e5dd2f3ee12?q=80&w=1200&auto=format&fit=crop",
    unit: "90 g",
  },
  {
    id: "pista-usa-250",
    name: "Pistachio USA Kernels 250g",
    price: 120,
    category: "Nuts",
    img: "https://images.unsplash.com/photo-1604908812839-7f98ae7f05e8?q=80&w=1200&auto=format&fit=crop",
    unit: "250 g",
  },
  {
    id: "apricot-tr-200",
    name: "Apricot (Turkey) 200g",
    price: 65,
    category: "Dried Fruit",
    img: "https://images.unsplash.com/photo-1621939514649-1af7cb68fde8?q=80&w=1200&auto=format&fit=crop",
    unit: "200 g",
  },
  {
    id: "mixed-cubes-200",
    name: "Mixed Fruit Cubes 200g",
    price: 55,
    category: "Snacks",
    img: "https://images.unsplash.com/photo-1572552630968-5f2c68f9632e?q=80&w=1200&auto=format&fit=crop",
    unit: "200 g",
  },
];

// Utilities
const formatMVR = (n) => `MVR ${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
const cx = (...classes) => classes.filter(Boolean).join(" ");

// Local storage helpers
const CART_KEY = "cm_choco_cart_v1";
const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};
const saveCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));

export default function ChocolateShop() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState(loadCart());
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => saveCart(cart), [cart]);

  const categories = useMemo(() => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))], []);

  const filtered = useMemo(() => {
    return PRODUCTS.filter((p) =>
      (cat === "All" || p.category === cat) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase())
    );
  }, [query, cat]);

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart]);

  const addToCart = (p, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.id === p.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: Math.min(99, next[idx].qty + qty) };
        return next;
      }
      return [...prev, { id: p.id, name: p.name, unit: p.unit, price: p.price, qty }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, qty) => setCart((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(99, qty)) } : i)));
  const removeItem = (id) => setCart((prev) => prev.filter((i) => i.id !== id));
  const clearCart = () => setCart([]);

  const makeWhatsAppLink = () => {
    const lines = [
      `New order — ${BRAND}`,
      "",
      ...cart.map((i, idx) => `${idx + 1}. ${i.name} (${i.unit}) x ${i.qty} — ${formatMVR(i.price * i.qty)}`),
      "",
      `Total: ${formatMVR(total)}`,
      "",
      "Customer details:",
      "Name:",
      "Phone:",
      "Delivery address:",
      "Notes:",
    ];
    const text = encodeURIComponent(lines.join("\n"));
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-900 text-white font-bold">{BRAND.slice(0,1)}</span>
            <div className="font-semibold text-lg">{BRAND}</div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search chocolates, nuts…"
              className="w-64 rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900"
            />
            <select
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setCartOpen((s) => !s)}
            className="relative rounded-xl border border-neutral-300 px-3 py-2 hover:bg-neutral-100"
          >
            🛒 Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-neutral-900 text-white rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                {cart.reduce((a, b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
        <div className="sm:hidden border-t border-neutral-200 px-4 pb-3 flex gap-2 bg-white">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search…"
            className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 outline-none focus:ring-2 focus:ring-neutral-900"
          />
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className="rounded-xl border border-neutral-300 px-3 py-2"
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        {/* Promo banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-700 text-white p-5">
          <div className="text-xl font-semibold">Same-day delivery in Malé & Hulhumalé</div>
          <div className="text-sm opacity-90">Order before 6:00 PM • Cash on Delivery / Bank Transfer</div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <article key={p.id} className="group rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-sm">
              <div className="aspect-square overflow-hidden bg-neutral-100">
                <img src={p.img} alt={p.name} className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
              </div>
              <div className="p-3 space-y-2">
                <h3 className="font-medium leading-tight line-clamp-2">{p.name}</h3>
                <div className="text-sm text-neutral-500">{p.unit} • {p.category}</div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">{formatMVR(p.price)}</div>
                  <button
                    className="rounded-xl bg-neutral-900 text-white px-3 py-2 text-sm hover:bg-neutral-800"
                    onClick={() => addToCart(p, 1)}
                  >
                    Add
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      <aside className={cx(
        "fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white border-l border-neutral-200 shadow-xl transition-transform duration-300 z-50",
        cartOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between">
            <div className="font-semibold">Your Cart</div>
            <button className="rounded-lg border px-3 py-1" onClick={() => setCartOpen(false)}>Close</button>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {cart.length === 0 && (
              <div className="text-center text-neutral-500 mt-10">Cart is empty. Add some treats 🍫</div>
            )}
            {cart.map((i) => (
              <div key={i.id} className="rounded-xl border border-neutral-200 p-3">
                <div className="font-medium leading-tight">{i.name}</div>
                <div className="text-sm text-neutral-500">{i.unit}</div>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button className="h-8 w-8 rounded-lg border" onClick={() => updateQty(i.id, i.qty - 1)}>-</button>
                    <input
                      type="number"
                      value={i.qty}
                      onChange={(e) => updateQty(i.id, Number(e.target.value) || 1)}
                      className="w-14 text-center rounded-lg border px-2 py-1"
                      min={1}
                      max={99}
                    />
                    <button className="h-8 w-8 rounded-lg border" onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
                  </div>
                  <div className="font-semibold">{formatMVR(i.price * i.qty)}</div>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <button className="text-red-600" onClick={() => removeItem(i.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-neutral-600">Subtotal</div>
              <div className="font-semibold">{formatMVR(total)}</div>
            </div>
            <div className="text-xs text-neutral-500">Delivery fee calculated by location. COD/Bank Transfer accepted.</div>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="flex-1 rounded-xl border px-3 py-2 hover:bg-neutral-50"
              >
                Clear
              </button>
              <a
                href={cart.length ? makeWhatsAppLink() : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={cx(
                  "flex-1 text-center rounded-xl px-3 py-2 text-white",
                  cart.length ? "bg-emerald-600 hover:bg-emerald-700" : "bg-neutral-400 cursor-not-allowed"
                )}
              >
                Checkout via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Floating cart button (mobile) */}
      <button
        onClick={() => setCartOpen(true)}
        className={cx(
          "sm:hidden fixed bottom-5 right-5 h-12 px-4 rounded-full shadow-lg text-white",
          cart.length ? "bg-neutral-900" : "bg-neutral-400"
        )}
      >
        🛒 {cart.reduce((a, b) => a + b.qty, 0)} | {formatMVR(total)}
      </button>

      {/* Footer */}
      <footer className="mt-10 border-t border-neutral-200">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-neutral-600">
          <div className="font-medium">Contact</div>
          <div>WhatsApp: +{WHATSAPP_NUMBER} • Instagram: @{BRAND.toLowerCase().replace(/\s+/g, "")}</div>
          <div className="mt-1">Open 10:00–22:00 • Malé, Maldives</div>
        </div>
      </footer>
    </div>
  );
}
