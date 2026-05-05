const CART_STORAGE_KEY = "athletica-cart";

const productTone = {
  Shoes: "#17d9ff",
  Football: "#38f2c4",
  "Gym Wear": "#17d9ff",
  Accessories: "#38f2c4",
};

const productShape = {
  Shoes: ({ accent }) => `
    <path d="M170 770c94-120 222-176 372-154l214 30c88 12 166 72 214 170H152c-44 0-74-32-74-68 0-12 6-24 18-34l74-62Z" fill="url(#shapeFill)" />
    <path d="M298 690h180M394 652h190M496 614h168M792 684c58 24 106 72 138 132" stroke="${accent}" stroke-opacity="0.85" stroke-width="10" stroke-linecap="round" />
  `,
  Football: ({ name, accent }) =>
    name.includes("Ball")
      ? `
        <circle cx="600" cy="492" r="236" fill="url(#shapeFill)" />
        <circle cx="600" cy="492" r="236" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="12" />
        <path d="M600 318l68 50-26 82h-84l-26-82 68-50Z" fill="rgba(255,255,255,0.24)" />
        <path d="M436 446l96 10M668 456l96-10M468 620l90-76M732 544l90 76M600 456v108" stroke="rgba(255,255,255,0.28)" stroke-width="10" stroke-linecap="round" />
      `
      : `
        <path d="M190 760c86-112 198-160 344-144l166 22c112 14 206 92 258 198H172c-42 0-70-28-70-60 0-12 4-22 14-30l74-66Z" fill="url(#shapeFill)" />
        <path d="M336 686h168M426 646h182M786 690c56 22 108 68 144 134" stroke="${accent}" stroke-opacity="0.82" stroke-width="10" stroke-linecap="round" />
      `,
  "Gym Wear": () => `
    <path d="M408 214h384l96 112-76 58-54-54v454H442V330l-54 54-76-58 96-112Z" fill="url(#shapeFill)" />
    <path d="M498 292h206v102H498Z" fill="rgba(255,255,255,0.18)" />
    <path d="M466 446h268M466 540h268M466 634h268" stroke="rgba(255,255,255,0.15)" stroke-width="9" stroke-linecap="round" />
  `,
  Accessories: ({ name }) =>
    name.includes("Bottle")
      ? `
        <path d="M488 220h224v116l38 46v360c0 58-48 106-106 106H556c-58 0-106-48-106-106V382l38-46V220Z" fill="url(#shapeFill)" />
        <rect x="542" y="164" width="116" height="76" rx="26" fill="rgba(255,255,255,0.18)" />
        <path d="M542 470h116M542 560h116M542 650h116" stroke="rgba(255,255,255,0.24)" stroke-width="9" stroke-linecap="round" />
      `
      : `
        <rect x="178" y="372" width="844" height="278" rx="88" fill="url(#shapeFill)" />
        <path d="M280 372h206l56-80h116l56 80h122l56-50h120v128" fill="none" stroke="rgba(255,255,255,0.24)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="356" cy="664" r="42" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="10" />
        <circle cx="844" cy="664" r="42" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="10" />
      `,
};

const rawProducts = [
  {
    id: 1,
    name: "Apex Velocity Runner",
    category: "Shoes",
    price: 245,
    rating: 4.9,
    reviews: 184,
  },
  {
    id: 2,
    name: "Phantom Pro FG Elite",
    category: "Football",
    price: 310,
    rating: 4.8,
    reviews: 126,
  },
  {
    id: 3,
    name: "CoreFlex Compression Set",
    category: "Gym Wear",
    price: 118,
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 4,
    name: "Transit Elite Duffel",
    category: "Accessories",
    price: 132,
    rating: 4.6,
    reviews: 78,
  },
  {
    id: 5,
    name: "Nova Street Trainer",
    category: "Shoes",
    price: 198,
    rating: 4.8,
    reviews: 141,
  },
  {
    id: 6,
    name: "Titan Weightlifting Tee",
    category: "Gym Wear",
    price: 84,
    rating: 4.5,
    reviews: 66,
  },
  {
    id: 7,
    name: "Strike Vision Ball Pack",
    category: "Football",
    price: 92,
    rating: 4.7,
    reviews: 88,
  },
  {
    id: 8,
    name: "Pulse Recovery Bottle",
    category: "Accessories",
    price: 46,
    rating: 4.6,
    reviews: 59,
  },
];

const canUseStorage = () => typeof window !== "undefined";

const svgToDataUri = (svg) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

const escapeText = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function createStorefrontPlaceholderImage({
  category = "Shoes",
  name = "Athletica Select",
  accent = productTone[category] || "#17d9ff",
}) {
  const shape = productShape[category] || productShape.Shoes;
  const productCode = String(name)
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1400">
      <defs>
        <linearGradient id="frame" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#060606" />
          <stop offset="100%" stop-color="#171717" />
        </linearGradient>
        <radialGradient id="accentGlow" cx="82%" cy="18%" r="72%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.48" />
          <stop offset="100%" stop-color="${accent}" stop-opacity="0" />
        </radialGradient>
        <linearGradient id="shapeFill" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.94" />
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0.18" />
        </linearGradient>
      </defs>
      <rect width="1200" height="1400" rx="64" fill="url(#frame)" />
      <rect width="1200" height="1400" rx="64" fill="url(#accentGlow)" />
      <rect x="50" y="50" width="1100" height="1300" rx="42" fill="none" stroke="rgba(255,255,255,0.08)" />
      <path d="M96 116h220" stroke="${accent}" stroke-opacity="0.76" stroke-width="10" stroke-linecap="round" />
      <text x="94" y="170" fill="white" fill-opacity="0.38" font-family="Inter, Poppins, sans-serif" font-size="28" letter-spacing="8">${escapeText(category.toUpperCase())}</text>
      ${shape({ accent, name })}
      <text x="92" y="1226" fill="white" fill-opacity="0.98" font-family="Inter, Poppins, sans-serif" font-size="60" font-weight="700">${escapeText(name)}</text>
      <text x="92" y="1284" fill="white" fill-opacity="0.36" font-family="Inter, Poppins, sans-serif" font-size="24" letter-spacing="8">${escapeText(category.toUpperCase())}</text>
      <text x="870" y="1242" fill="${accent}" fill-opacity="0.92" font-family="Inter, Poppins, sans-serif" font-size="74" font-weight="700">${escapeText(productCode || "AX")}</text>
      <circle cx="928" cy="322" r="112" fill="${accent}" fill-opacity="0.1" />
      <circle cx="928" cy="322" r="72" fill="none" stroke="rgba(255,255,255,0.16)" stroke-width="6" />
    </svg>
  `);
}

const isValidProduct = (product) =>
  product &&
  Number.isFinite(Number(product.id)) &&
  String(product.name || "").trim() &&
  Number(product.price) > 0 &&
  Number.isFinite(Number(product.rating)) &&
  Number(product.rating) >= 0 &&
  Number(product.rating) <= 5 &&
  Number.isFinite(Number(product.reviews)) &&
  Number(product.reviews) >= 0 &&
  productTone[product.category];

const validProducts = rawProducts
  .filter(isValidProduct)
  .map((product) => {
    const image = createStorefrontPlaceholderImage({
      category: product.category,
      name: product.name,
      accent: productTone[product.category],
    });

    return {
      ...product,
      image,
      placeholderImage: image,
      price: Number(product.price),
      rating: Number(product.rating),
      reviews: Number(product.reviews),
    };
  });

export function getValidSportsProducts() {
  return validProducts;
}

export function addProductToCart(product) {
  if (!canUseStorage() || !product) {
    return 0;
  }

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    const cart = raw ? JSON.parse(raw) : [];
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.placeholderImage,
        quantity: 1,
      });
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    return cart.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  } catch {
    return 0;
  }
}
