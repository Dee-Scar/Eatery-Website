/* ==========================================================================
   FLAME & SIZZLE BISTRO - SHARED CONTENT STORE
   --------------------------------------------------------------------------
   Single source of truth for everything the admin panel can edit. Both the
   customer site (app.js) and the admin panel (admin.js) read through
   FlameData, so an edit made in one place shows up in the other.

   Content lives in localStorage under one key. That store is per-browser, so
   to publish changes for real visitors use the admin panel's "Export" button
   and commit the downloaded data.js in place of this file.
   ========================================================================== */

const STORAGE_KEY = "flame_sizzle_data";
const LEGACY_REVIEWS_KEY = "flame_sizzle_reviews";
const SCHEMA_VERSION = 1;

/* --- Default menu catalog ------------------------------------------------ */
const DEFAULT_MENU = [
    {
        id: "shawarma-1",
        name: "Supreme Beef & Chicken Shawarma",
        category: "shawarma",
        price: 9.99,
        calories: 580,
        prepTime: 12,
        rating: 4.9,
        badge: "BESTSELLER",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        isAvailable: true,
        image: "images/shawarma.webp",
        description: "Thinly shaved flame-roasted beef & tender chicken wrapped in warm toasted pita with garlic toum, pickles, and crisp veggies."
    },
    {
        id: "shawarma-2",
        name: "Spicy Harissa Chicken Shawarma Wrap",
        category: "shawarma",
        price: 8.99,
        calories: 520,
        prepTime: 10,
        rating: 4.8,
        badge: "HOT & SPICY",
        isSpicy: true,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/shawarma.webp",
        description: "Spicy marinated chicken shawarma with red harissa sauce, jalapeños, cabbage, and homemade garlic mayo."
    },
    {
        id: "shawarma-3",
        name: "Cheesy Lamb & Beef Shawarma Melt",
        category: "shawarma",
        price: 11.50,
        calories: 640,
        prepTime: 15,
        rating: 4.9,
        badge: "CHEF'S PICK",
        isSpicy: false,
        isSpecial: true,
        isHalal: true,
        isAvailable: true,
        image: "images/shawarma.webp",
        description: "Slow-roasted spiced lamb & beef with melted cheddar cheese blend, tahini sauce, and caramelized onions."
    },
    {
        id: "fries-1",
        name: "Supreme Loaded Cheese & Bacon Fries",
        category: "fries",
        price: 8.99,
        calories: 620,
        prepTime: 8,
        rating: 4.9,
        badge: "POPULAR",
        isSpicy: false,
        isSpecial: true,
        isHalal: false,
        isAvailable: true,
        image: "images/french_fries.webp",
        description: "Hand-cut crispy double-fried russet potatoes smothered in warm cheddar sauce, bacon bits, and chopped chives."
    },
    {
        id: "fries-2",
        name: "Loaded Cheese & Jalapeño Fries",
        category: "fries",
        price: 7.99,
        calories: 560,
        prepTime: 8,
        rating: 4.8,
        badge: "DAILY DEAL",
        isSpicy: true,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/french_fries.webp",
        description: "Golden crispy fries drenched in rich cheese sauce, spicy pickled jalapeños, and smoky chipotle mayo."
    },
    {
        id: "fries-3",
        name: "Garlic Parmesan & Herb Seasoned Fries",
        category: "fries",
        price: 5.49,
        calories: 410,
        prepTime: 6,
        rating: 4.7,
        badge: "VEGGIE",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/french_fries.webp",
        description: "Crispy french fries tossed in roasted garlic oil, aged parmesan cheese, rosemary, and parsley."
    },
    {
        id: "grill-1",
        name: "Smoky Charcoal BBQ Ribs & Suya Platter",
        category: "grills",
        price: 18.99,
        calories: 890,
        prepTime: 20,
        rating: 5.0,
        badge: "BESTSELLER",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        isAvailable: true,
        image: "images/bbq_grill.webp",
        description: "Flame-grilled hickory smoked ribs and suya spiced beef skewers served with grilled corn and signature dip."
    },
    {
        id: "grill-2",
        name: "Flame-Grilled Spicy Suya Chicken Skewers",
        category: "grills",
        price: 14.50,
        calories: 610,
        prepTime: 16,
        rating: 4.9,
        badge: "SPICY FAV",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        isAvailable: true,
        image: "images/bbq_grill.webp",
        description: "Tender chicken thighs dusted in authentic West African peanut suya spice and grilled over white-hot charcoal."
    },
    {
        id: "grill-3",
        name: "Charcoal Grilled Half BBQ Chicken",
        category: "grills",
        price: 13.99,
        calories: 720,
        prepTime: 18,
        rating: 4.8,
        badge: "MUST TRY",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/bbq_grill.webp",
        description: "Marinated half chicken flame-roasted to juicy perfection, brushed with smoky sweet honey BBQ glaze."
    },
    {
        id: "burger-1",
        name: "Double Smoked Bacon Cheeseburger",
        category: "burgers",
        price: 12.99,
        calories: 780,
        prepTime: 14,
        rating: 4.9,
        badge: "POPULAR",
        isSpicy: false,
        isSpecial: true,
        isHalal: false,
        isAvailable: true,
        image: "images/burger.webp",
        description: "Two 100% Angus beef patties, double melted cheddar, crispy smoked bacon, caramelized onions on brioche."
    },
    {
        id: "burger-2",
        name: "Spicy Flame Crispy Chicken Burger",
        category: "burgers",
        price: 10.99,
        calories: 640,
        prepTime: 12,
        rating: 4.8,
        badge: "SPICY",
        isSpicy: true,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/burger.webp",
        description: "Buttermilk fried spicy chicken breast, dill pickles, crunchy coleslaw, and fiery red habanero sauce."
    },
    {
        id: "combo-1",
        name: "The Mega Grill & Shawarma Feast",
        category: "combos",
        price: 21.99,
        calories: 1250,
        prepTime: 18,
        rating: 5.0,
        badge: "25% OFF DEAL",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        isAvailable: true,
        image: "images/combo_meal.webp",
        description: "1 Supreme Shawarma Wrap, 1 Large Loaded Cheese Fries, 4 Flame BBQ Wings + 1 Gourmet Chilled Milkshake."
    },
    {
        id: "combo-2",
        name: "Double Shawarma & Fries Twin Pack",
        category: "combos",
        price: 18.50,
        calories: 1100,
        prepTime: 15,
        rating: 4.9,
        badge: "VALUE PACK",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/combo_meal.webp",
        description: "2 Choice Shawarma Wraps (Chicken or Beef) + Large Portion Golden French Fries + 2 Dipping Sauces."
    },
    {
        id: "drink-1",
        name: "Gourmet Chocolate Fudge Milkshake",
        category: "drinks",
        price: 5.99,
        calories: 420,
        prepTime: 5,
        rating: 4.9,
        badge: "SWEET TREAT",
        isSpicy: false,
        isSpecial: true,
        isHalal: true,
        isAvailable: true,
        image: "images/shake.webp",
        description: "Rich premium Belgian chocolate ice cream blended with fresh milk, whipped cream, and chocolate drizzle."
    },
    {
        id: "drink-2",
        name: "Strawberry Whipped Cream Smoothie",
        category: "drinks",
        price: 5.49,
        calories: 320,
        prepTime: 5,
        rating: 4.8,
        badge: "FRESH",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        isAvailable: true,
        image: "images/shake.webp",
        description: "Real sun-ripened strawberries blended smooth with vanilla ice cream and whipped topping."
    }
];

/* --- Default homepage deals ---------------------------------------------- */
const DEFAULT_DEALS = [
    {
        key: "main",
        enabled: true,
        itemId: "combo-1",
        badge: "SAVE 25%",
        image: "images/combo_meal.webp",
        title: "The Mega Grill & Shawarma Feast",
        description: "Includes 1 Supreme Shawarma Wrap, Large Loaded Cheese Fries, 4 Flame BBQ Wings + 1 Chilled Milkshake.",
        oldPrice: 28.50,
        newPrice: 21.99,
        buttonLabel: "Order Deal Now",
        showTimer: true
    },
    {
        key: "secondary",
        enabled: true,
        itemId: "fries-2",
        badge: "POPULAR",
        image: "images/french_fries.webp",
        title: "Loaded Cheese & Jalapeño Fries",
        description: "Double crisp fries smothered in warm melted cheddar, crispy bacon, & green onions.",
        oldPrice: 10.50,
        newPrice: 7.99,
        buttonLabel: "Add For $7.99",
        showTimer: false
    }
];

/* --- Default site settings ----------------------------------------------- */
const DEFAULT_SETTINGS = {
    announcements: [
        { text: "🔥 FLAME DEAL: Get 10% OFF your first order with code", highlight: "FLAME10" },
        { text: "🚀 FREE DELIVERY on all orders over $30!", highlight: "" },
        { text: "⏰ Open Today: 11:00 AM - 11:00 PM", highlight: "" }
    ],
    isOpen: true,
    openStatusText: "Taking orders for fast delivery & hot pickup",
    address: "452 Flame Grill Blvd, Culinary District, NY 10012",
    phonePrimary: "+1 (800) 555-FLAME",
    phoneSecondary: "(555) 749-9272",
    hoursWeekday: "Mon – Thu: 11:00 AM – 11:00 PM",
    hoursWeekend: "Fri – Sun: 11:00 AM – 1:00 AM (Late Night)",
    taxRate: 8,
    deliveryFee: 3.99,
    freeDeliveryThreshold: 30,
    promos: [
        { code: "FLAME10", percent: 10, label: "10% discount applied!" },
        { code: "FREESHIP", percent: 0, label: "Free delivery applied!" },
        { code: "SIZZLE20", percent: 20, label: "20% discount applied!" }
    ],
    adminPasscode: "flame2026"
};

/* --- Default reviews ------------------------------------------------------ */
const DEFAULT_REVIEWS = [
    {
        name: "David K.",
        stars: 5,
        tag: "Shawarma Wrap",
        comment: "Best shawarma in town hands down! The garlic toum sauce is insane and the beef is so smoky and tender."
    },
    {
        name: "Elena R.",
        stars: 5,
        tag: "Loaded Fries",
        comment: "The loaded cheese and bacon fries arrived piping hot and super crispy. Delivery took less than 20 minutes!"
    },
    {
        name: "Marcus T.",
        stars: 5,
        tag: "BBQ Ribs",
        comment: "The suya spice grilled chicken skewers have the authentic smoky pepper kick. Will definitely reorder weekly."
    },
    {
        name: "Samantha L.",
        stars: 4,
        tag: "Combo Feast",
        comment: "Huge portion size! The mega feast fed me and my roommate easily. Super fresh chocolate milkshake."
    }
];

const MENU_CATEGORIES = [
    { value: "grills", label: "Grills & BBQ" },
    { value: "shawarma", label: "Shawarma & Wraps" },
    { value: "fries", label: "Fries & Loaded Sides" },
    { value: "burgers", label: "Gourmet Burgers" },
    { value: "combos", label: "Combo Meals" },
    { value: "drinks", label: "Shakes & Drinks" }
];

const STOCK_IMAGES = [
    "images/shawarma.webp",
    "images/french_fries.webp",
    "images/bbq_grill.webp",
    "images/burger.webp",
    "images/combo_meal.webp",
    "images/shake.webp"
];

/* --- Store ---------------------------------------------------------------- */
function defaults() {
    return {
        version: SCHEMA_VERSION,
        menu: structuredClone(DEFAULT_MENU),
        deals: structuredClone(DEFAULT_DEALS),
        settings: structuredClone(DEFAULT_SETTINGS),
        reviews: structuredClone(DEFAULT_REVIEWS),
        orders: []
    };
}

/** Fills in anything a saved store predates, so older saves keep working. */
function withDefaults(saved) {
    const base = defaults();
    if (!saved || typeof saved !== "object") return base;

    return {
        version: SCHEMA_VERSION,
        menu: Array.isArray(saved.menu) && saved.menu.length ? saved.menu : base.menu,
        deals: Array.isArray(saved.deals) && saved.deals.length ? saved.deals : base.deals,
        settings: { ...base.settings, ...(saved.settings || {}) },
        reviews: Array.isArray(saved.reviews) ? saved.reviews : base.reviews,
        orders: Array.isArray(saved.orders) ? saved.orders : []
    };
}

const FlameData = {
    /** Reads the published defaults merged with any admin edits. */
    load() {
        let saved = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) saved = JSON.parse(raw);
        } catch {
            saved = null;
        }

        const data = withDefaults(saved);

        // Carry across reviews written before the unified store existed.
        if (!saved) {
            try {
                const legacy = JSON.parse(localStorage.getItem(LEGACY_REVIEWS_KEY) || "null");
                if (Array.isArray(legacy) && legacy.length) data.reviews = legacy;
            } catch {
                /* ignore malformed legacy data */
            }
        }

        return data;
    },

    save(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return { ok: true };
        } catch (error) {
            // Quota is the realistic failure here (large base64 images).
            return { ok: false, error: error && error.name === "QuotaExceededError"
                ? "Storage is full. Use image paths or URLs instead of uploading large files."
                : "Could not save changes in this browser." };
        }
    },

    reset() {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            /* ignore */
        }
        return defaults();
    },

    /** True once an admin has saved anything over the shipped defaults. */
    hasOverrides() {
        try {
            return localStorage.getItem(STORAGE_KEY) !== null;
        } catch {
            return false;
        }
    },

    defaults,
    STORAGE_KEY,
    SCHEMA_VERSION,
    MENU_CATEGORIES,
    STOCK_IMAGES
};

window.FlameData = FlameData;
