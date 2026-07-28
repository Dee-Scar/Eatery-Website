/* ==========================================================================
   FLAME & SIZZLE BISTRO - FULL APPLICATION LOGIC
   ========================================================================== */

// --- 1. FOOD MENU CATALOG DATA ---
const MENU_ITEMS = [
    {
        id: "shawarma-1",
        name: "Supreme Beef & Chicken Shawarma",
        category: "shawarma",
        price: 9.99,
        calories: 580,
        prepTime: "12 mins",
        rating: "4.9 ★",
        badge: "BESTSELLER",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        image: "images/shawarma.png",
        description: "Thinly shaved flame-roasted beef & tender chicken wrapped in warm toasted pita with garlic toum, pickles, and crisp veggies."
    },
    {
        id: "shawarma-2",
        name: "Spicy Harissa Chicken Shawarma Wrap",
        category: "shawarma",
        price: 8.99,
        calories: 520,
        prepTime: "10 mins",
        rating: "4.8 ★",
        badge: "HOT & SPICY",
        isSpicy: true,
        isSpecial: false,
        isHalal: true,
        image: "images/shawarma.png",
        description: "Spicy marinated chicken shawarma with red harissa sauce, jalapeños, cabbage, and homemade garlic mayo."
    },
    {
        id: "shawarma-3",
        name: "Cheesy Lamb & Beef Shawarma Melt",
        category: "shawarma",
        price: 11.50,
        calories: 640,
        prepTime: "15 mins",
        rating: "4.9 ★",
        badge: "CHEF'S PICK",
        isSpicy: false,
        isSpecial: true,
        isHalal: true,
        image: "images/shawarma.png",
        description: "Slow-roasted spiced lamb & beef with melted cheddar cheese blend, tahini sauce, and caramelized onions."
    },
    {
        id: "fries-1",
        name: "Supreme Loaded Cheese & Bacon Fries",
        category: "fries",
        price: 8.99,
        calories: 620,
        prepTime: "8 mins",
        rating: "4.9 ★",
        badge: "POPULAR",
        isSpicy: false,
        isSpecial: true,
        isHalal: false,
        image: "images/french_fries.png",
        description: "Hand-cut crispy double-fried russet potatoes smothered in warm cheddar sauce, bacon bits, and chopped chives."
    },
    {
        id: "fries-2",
        name: "Loaded Cheese & Jalapeño Fries",
        category: "fries",
        price: 7.99,
        calories: 560,
        prepTime: "8 mins",
        rating: "4.8 ★",
        badge: "DAILY DEAL",
        isSpicy: true,
        isSpecial: false,
        isHalal: true,
        image: "images/french_fries.png",
        description: "Golden crispy fries drenched in rich cheese sauce, spicy pickled jalapeños, and smoky chipotle mayo."
    },
    {
        id: "fries-3",
        name: "Garlic Parmesan & Herb Seasoned Fries",
        category: "fries",
        price: 5.49,
        calories: 410,
        prepTime: "6 mins",
        rating: "4.7 ★",
        badge: "VEGGIE",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        image: "images/french_fries.png",
        description: "Crispy french fries tossed in roasted garlic oil, aged parmesan cheese, rosemary, and parsley."
    },
    {
        id: "grill-1",
        name: "Smoky Charcoal BBQ Ribs & Suya Platter",
        category: "grills",
        price: 18.99,
        calories: 890,
        prepTime: "20 mins",
        rating: "5.0 ★",
        badge: "BESTSELLER",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        image: "images/bbq_grill.png",
        description: "Flame-grilled hickory smoked ribs and suya spiced beef skewers served with grilled corn and signature dip."
    },
    {
        id: "grill-2",
        name: "Flame-Grilled Spicy Suya Chicken Skewers",
        category: "grills",
        price: 14.50,
        calories: 610,
        prepTime: "16 mins",
        rating: "4.9 ★",
        badge: "SPICY FAV",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        image: "images/bbq_grill.png",
        description: "Tender chicken thighs dusted in authentic West African peanut suya spice and grilled over white-hot charcoal."
    },
    {
        id: "grill-3",
        name: "Charcoal Grilled Half BBQ Chicken",
        category: "grills",
        price: 13.99,
        calories: 720,
        prepTime: "18 mins",
        rating: "4.8 ★",
        badge: "MUST TRY",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        image: "images/bbq_grill.png",
        description: "Marinated half chicken flame-roasted to juicy perfection, brushed with smoky sweet honey BBQ glaze."
    },
    {
        id: "burger-1",
        name: "Double Smoked Bacon Cheeseburger",
        category: "burgers",
        price: 12.99,
        calories: 780,
        prepTime: "14 mins",
        rating: "4.9 ★",
        badge: "POPULAR",
        isSpicy: false,
        isSpecial: true,
        isHalal: false,
        image: "images/burger.png",
        description: "Two 100% Angus beef patties, double melted cheddar, crispy smoked bacon, caramelized onions on brioche."
    },
    {
        id: "burger-2",
        name: "Spicy Flame Crispy Chicken Burger",
        category: "burgers",
        price: 10.99,
        calories: 640,
        prepTime: "12 mins",
        rating: "4.8 ★",
        badge: "SPICY",
        isSpicy: true,
        isSpecial: false,
        isHalal: true,
        image: "images/burger.png",
        description: "Buttermilk fried spicy chicken breast, dill pickles, crunchy coleslaw, and fiery red habanero sauce."
    },
    {
        id: "combo-1",
        name: "The Mega Grill & Shawarma Feast",
        category: "combos",
        price: 21.99,
        calories: 1250,
        prepTime: "18 mins",
        rating: "5.0 ★",
        badge: "25% OFF DEAL",
        isSpicy: true,
        isSpecial: true,
        isHalal: true,
        image: "images/combo_meal.png",
        description: "1 Supreme Shawarma Wrap, 1 Large Loaded Cheese Fries, 4 Flame BBQ Wings + 1 Gourmet Chilled Milkshake."
    },
    {
        id: "combo-2",
        name: "Double Shawarma & Fries Twin Pack",
        category: "combos",
        price: 18.50,
        calories: 1100,
        prepTime: "15 mins",
        rating: "4.9 ★",
        badge: "VALUE PACK",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        image: "images/combo_meal.png",
        description: "2 Choice Shawarma Wraps (Chicken or Beef) + Large Portion Golden French Fries + 2 Dipping Sauces."
    },
    {
        id: "drink-1",
        name: "Gourmet Chocolate Fudge Milkshake",
        category: "drinks",
        price: 5.99,
        calories: 420,
        prepTime: "5 mins",
        rating: "4.9 ★",
        badge: "SWEET TREAT",
        isSpicy: false,
        isSpecial: true,
        isHalal: true,
        image: "images/shake.png",
        description: "Rich premium Belgian chocolate ice cream blended with fresh milk, whipped cream, and chocolate drizzle."
    },
    {
        id: "drink-2",
        name: "Strawberry Whipped Cream Smoothie",
        category: "drinks",
        price: 5.49,
        calories: 320,
        prepTime: "5 mins",
        rating: "4.8 ★",
        badge: "FRESH",
        isSpicy: false,
        isSpecial: false,
        isHalal: true,
        image: "images/shake.png",
        description: "Real sun-ripened strawberries blended smooth with vanilla ice cream and whipped topping."
    }
];

// --- 2. INITIAL REVIEWS LIST ---
const INITIAL_REVIEWS = [
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

// --- 3. GLOBAL APPLICATION STATE ---
const state = {
    cart: [],
    appliedPromo: null,
    activeCategory: "all",
    filterSpicy: false,
    filterSpecial: false,
    filterHalal: true,
    customizingItem: null,
    customizerForm: {
        qty: 1,
        size: "Regular",
        sizeExtraPrice: 0,
        sauces: ["Garlic Toum"],
        addons: [],
        notes: ""
    },
    activeOrder: null,
    trackerTimer: null,
    reviews: []
};

// --- 4. DOM ELEMENTS ---
const elements = {
    menuGrid: document.getElementById("menu-grid"),
    menuSearch: document.getElementById("menu-search"),
    categoryPills: document.querySelectorAll(".cat-pill"),
    filterSpicyCheck: document.getElementById("filter-spicy"),
    filterSpecialCheck: document.getElementById("filter-special"),
    filterHalalCheck: document.getElementById("filter-halal"),
    
    // Cart Drawer
    cartToggleBtn: document.getElementById("cart-toggle-btn"),
    cartCountBadge: document.getElementById("cart-count"),
    cartDrawerOverlay: document.getElementById("cart-drawer-overlay"),
    closeCartBtn: document.getElementById("close-cart-btn"),
    cartItemsContainer: document.getElementById("cart-items-container"),
    promoInput: document.getElementById("promo-input"),
    applyPromoBtn: document.getElementById("apply-promo-btn"),
    promoStatusMsg: document.getElementById("promo-status-msg"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    discountRow: document.getElementById("discount-row"),
    discountPercent: document.getElementById("discount-percent"),
    cartDiscount: document.getElementById("cart-discount"),
    cartTax: document.getElementById("cart-tax"),
    cartDelivery: document.getElementById("cart-delivery"),
    cartGrandTotal: document.getElementById("cart-grand-total"),
    proceedCheckoutBtn: document.getElementById("proceed-checkout-btn"),

    // Item Customizer Modal
    customizerOverlay: document.getElementById("customizer-modal-overlay"),
    closeCustomizerBtn: document.getElementById("close-customizer-btn"),
    customItemImg: document.getElementById("custom-item-img"),
    customItemName: document.getElementById("custom-item-name"),
    customItemDesc: document.getElementById("custom-item-desc"),
    customItemCal: document.getElementById("custom-item-cal"),
    customItemPrep: document.getElementById("custom-item-prep"),
    sizeOptionsContainer: document.getElementById("size-options-container"),
    sauceOptionsContainer: document.getElementById("sauce-options-container"),
    addonsOptionsContainer: document.getElementById("addons-options-container"),
    customNotes: document.getElementById("custom-notes"),
    qtyMinusBtn: document.getElementById("qty-minus"),
    qtyPlusBtn: document.getElementById("qty-plus"),
    customQtyDisplay: document.getElementById("custom-qty"),
    addCartConfirmBtn: document.getElementById("add-to-cart-confirm-btn"),
    customCalculatedPrice: document.getElementById("custom-calculated-price"),

    // Checkout Modal
    checkoutOverlay: document.getElementById("checkout-modal-overlay"),
    closeCheckoutBtn: document.getElementById("close-checkout-btn"),
    checkoutForm: document.getElementById("checkout-form"),
    checkoutFinalTotal: document.getElementById("checkout-final-total"),

    // Receipt Modal
    receiptOverlay: document.getElementById("receipt-modal-overlay"),
    receiptOrderId: document.getElementById("receipt-order-id"),
    receiptTimestamp: document.getElementById("receipt-timestamp"),
    receiptCustomerInfo: document.getElementById("receipt-customer-info"),
    receiptItemsList: document.getElementById("receipt-items-list"),
    receiptTotalsLines: document.getElementById("receipt-totals-lines"),
    viewOrderTrackerBtn: document.getElementById("view-order-tracker-btn"),
    printReceiptBtn: document.getElementById("print-receipt-btn"),

    // Tracker Modal
    trackerOverlay: document.getElementById("tracker-modal-overlay"),
    closeTrackerBtn: document.getElementById("close-tracker-btn"),
    openTrackerBtn: document.getElementById("open-tracker-btn"),
    trackerOrderNum: document.getElementById("tracker-order-num"),
    etaCountdown: document.getElementById("eta-countdown"),
    etaSubStatus: document.getElementById("eta-sub-status"),

    // Reviews
    reviewsGrid: document.getElementById("reviews-grid"),
    openReviewModalBtn: document.getElementById("open-review-modal-btn"),
    reviewOverlay: document.getElementById("review-modal-overlay"),
    closeReviewBtn: document.getElementById("close-review-btn"),
    writeReviewForm: document.getElementById("write-review-form"),
    starPickerSpans: document.querySelectorAll("#star-picker span"),

    // Toast Container
    toastContainer: document.getElementById("toast-container")
};

// --- 5. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    loadSavedReviews();
    renderMenu();
    renderReviews();
    setupEventListeners();
    startDailyDealTimer();
});

// --- 6. MENU RENDER & FILTER LOGIC ---
function renderMenu() {
    let filtered = MENU_ITEMS.filter(item => {
        // Category filter
        if (state.activeCategory !== "all" && item.category !== state.activeCategory) {
            return false;
        }
        // Checkbox filters
        if (state.filterSpicy && !item.isSpicy) return false;
        if (state.filterSpecial && !item.isSpecial) return false;
        if (state.filterHalal && !item.isHalal) return false;

        return true;
    });

    if (filtered.length === 0) {
        elements.menuGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 3rem; margin-bottom: 12px;">🔍</p>
                <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 8px;">No Food Items Found</h3>
                <p style="color: var(--text-muted);">Try adjusting your search keywords or preference filters.</p>
            </div>
        `;
        return;
    }

    elements.menuGrid.innerHTML = filtered.map(item => `
        <div class="food-card">
            <div class="card-img-wrapper">
                <img src="${item.image}" alt="${item.name}" class="card-img" loading="lazy">
                <span class="card-badge-tag">${item.badge}</span>
            </div>
            <div class="card-body">
                <div class="card-title-row">
                    <h3>${item.name}</h3>
                    <span class="rating-pill">${item.rating}</span>
                </div>
                <p class="card-desc">${item.description}</p>
                <div class="card-meta-bar">
                    <span>🔥 ${item.calories} kcal</span>
                    <span>⏱️ ${item.prepTime}</span>
                    <span>${item.isSpicy ? '🌶️ Spicy' : '😋 Mild'}</span>
                </div>
                <div class="card-footer">
                    <span class="card-price">$${item.price.toFixed(2)}</span>
                    <div class="card-actions">
                        <button class="btn btn-sm btn-outline customize-btn" data-id="${item.id}">
                            ⚙️ Customize
                        </button>
                        <button class="btn btn-sm btn-primary quick-add-btn" data-id="${item.id}">
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Attach button listeners inside grid
    document.querySelectorAll(".customize-btn").forEach(btn => {
        btn.addEventListener("click", () => openCustomizerModal(btn.dataset.id));
    });

    document.querySelectorAll(".quick-add-btn").forEach(btn => {
        btn.addEventListener("click", () => quickAddToCart(btn.dataset.id));
    });
}

// --- 7. CUSTOMIZER MODAL LOGIC ---
function openCustomizerModal(itemId) {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    state.customizingItem = item;
    state.customizerForm = {
        qty: 1,
        size: "Regular",
        sizeExtraPrice: 0,
        sauces: ["Garlic Toum"],
        addons: [],
        notes: ""
    };

    // Header info
    elements.customItemImg.src = item.image;
    elements.customItemName.textContent = item.name;
    elements.customItemDesc.textContent = item.description;
    elements.customItemCal.textContent = `🔥 ${item.calories} kcal`;
    elements.customItemPrep.textContent = `⏱️ ${item.prepTime}`;
    elements.customNotes.value = "";
    elements.customQtyDisplay.textContent = "1";

    // Size Options
    const sizes = [
        { label: "Regular Portion", extra: 0 },
        { label: "Large Portion (+ $2.50)", extra: 2.50 },
        { label: "Monster Feast (+ $4.99)", extra: 4.99 }
    ];
    elements.sizeOptionsContainer.innerHTML = sizes.map((s, idx) => `
        <label class="opt-label">
            <div>
                <input type="radio" name="custom-size" value="${s.label}" data-extra="${s.extra}" ${idx === 0 ? 'checked' : ''}>
                <span>${s.label}</span>
            </div>
        </label>
    `).join('');

    // Sauces Options
    const sauces = ["Creamy Garlic Toum", "Spicy Harissa Mayo", "Smoky Hickory BBQ", "Warm Cheddar Dip"];
    elements.sauceOptionsContainer.innerHTML = sauces.map((sauce, idx) => `
        <label class="opt-label">
            <div>
                <input type="checkbox" name="custom-sauce" value="${sauce}" ${idx === 0 ? 'checked' : ''}>
                <span>${sauce}</span>
            </div>
            <span style="font-size:0.75rem; color:var(--text-muted);">FREE</span>
        </label>
    `).join('');

    // Addons Options
    const addons = [
        { name: "Extra Suya Meat / Chicken", price: 3.50 },
        { name: "Melted Cheddar Cheese", price: 1.50 },
        { name: "Pickled Jalapeño Peppers", price: 0.75 },
        { name: "Crispy Fried Onions", price: 0.75 },
        { name: "Crispy Smoked Bacon Bits", price: 2.00 }
    ];
    elements.addonsOptionsContainer.innerHTML = addons.map(add => `
        <label class="opt-label">
            <div>
                <input type="checkbox" name="custom-addon" value="${add.name}" data-price="${add.price}">
                <span>${add.name}</span>
            </div>
            <span style="font-weight:700; color:var(--secondary); font-size:0.82rem;">+$${add.price.toFixed(2)}</span>
        </label>
    `).join('');

    updateCustomizerPrice();

    // Show modal
    elements.customizerOverlay.classList.add("active");

    // Listeners for choices inside customizer
    elements.sizeOptionsContainer.querySelectorAll("input[type=radio]").forEach(radio => {
        radio.addEventListener("change", (e) => {
            state.customizerForm.size = e.target.value;
            state.customizerForm.sizeExtraPrice = parseFloat(e.target.dataset.extra);
            updateCustomizerPrice();
        });
    });

    elements.addonsOptionsContainer.querySelectorAll("input[type=checkbox]").forEach(cb => {
        cb.addEventListener("change", updateCustomizerPrice);
    });
}

function updateCustomizerPrice() {
    if (!state.customizingItem) return;
    
    let base = state.customizingItem.price;
    let extraSize = state.customizerForm.sizeExtraPrice || 0;

    let addonsPrice = 0;
    const selectedAddons = [];
    elements.addonsOptionsContainer.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
        addonsPrice += parseFloat(cb.dataset.price);
        selectedAddons.push(cb.value);
    });
    state.customizerForm.addons = selectedAddons;

    const selectedSauces = [];
    elements.sauceOptionsContainer.querySelectorAll("input[type=checkbox]:checked").forEach(cb => {
        selectedSauces.push(cb.value);
    });
    state.customizerForm.sauces = selectedSauces;

    let unitPrice = base + extraSize + addonsPrice;
    let totalPrice = unitPrice * state.customizerForm.qty;

    elements.customCalculatedPrice.textContent = `$${totalPrice.toFixed(2)}`;
}

// --- 8. CART MANAGEMENT LOGIC ---
function quickAddToCart(itemId) {
    const item = MENU_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    addCartItem({
        id: item.id,
        cartItemId: item.id + "-" + Date.now(),
        name: item.name,
        price: item.price,
        unitBasePrice: item.price,
        qty: 1,
        size: "Regular",
        sauces: ["Garlic Toum"],
        addons: [],
        notes: "",
        image: item.image
    });

    showToast(`Added ${item.name} to cart! 🔥`);
}

function addCartItem(cartObj) {
    // Check if duplicate with same options exists
    const existingIndex = state.cart.findIndex(c => 
        c.id === cartObj.id && 
        c.size === cartObj.size &&
        JSON.stringify(c.sauces) === JSON.stringify(cartObj.sauces) &&
        JSON.stringify(c.addons) === JSON.stringify(cartObj.addons)
    );

    if (existingIndex > -1) {
        state.cart[existingIndex].qty += cartObj.qty;
    } else {
        state.cart.push(cartObj);
    }

    renderCartDrawer();
}

function renderCartDrawer() {
    // Update badge
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    elements.cartCountBadge.textContent = totalQty;

    if (state.cart.length === 0) {
        elements.cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px 10px;">
                <p style="font-size: 2.8rem; margin-bottom: 12px;">🛒</p>
                <h4 style="font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 6px;">Your Cart is Empty</h4>
                <p style="color: var(--text-muted); font-size: 0.85rem;">Discover our flame grills and shawarmas to add tasty treats!</p>
            </div>
        `;
        elements.cartSubtotal.textContent = "$0.00";
        elements.cartTax.textContent = "$0.00";
        elements.cartDelivery.textContent = "$0.00";
        elements.cartGrandTotal.textContent = "$0.00";
        elements.discountRow.style.display = "none";
        return;
    }

    elements.cartItemsContainer.innerHTML = state.cart.map(item => {
        let detailsText = item.size;
        if (item.sauces.length > 0) detailsText += ` • ${item.sauces.join(", ")}`;
        if (item.addons.length > 0) detailsText += ` • +${item.addons.join(", ")}`;

        return `
            <div class="cart-item-card">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p class="cart-item-details">${detailsText}</p>
                    <div class="cart-item-bottom">
                        <span class="cart-item-price">$${(item.unitBasePrice * item.qty).toFixed(2)}</span>
                        <div class="quantity-picker" style="transform: scale(0.85); transform-origin: right center;">
                            <button class="cart-qty-btn" data-cart-id="${item.cartItemId}" data-action="minus">-</button>
                            <span>${item.qty}</span>
                            <button class="cart-qty-btn" data-cart-id="${item.cartItemId}" data-action="plus">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Attach listeners inside cart items
    document.querySelectorAll(".cart-qty-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const cartId = btn.dataset.cartId;
            const action = btn.dataset.action;
            updateCartQuantity(cartId, action);
        });
    });

    // Compute Totals
    const subtotal = state.cart.reduce((sum, item) => sum + (item.unitBasePrice * item.qty), 0);
    
    let discountAmount = 0;
    if (state.appliedPromo) {
        discountAmount = subtotal * (state.appliedPromo.percent / 100);
        elements.discountRow.style.display = "flex";
        elements.discountPercent.textContent = `${state.appliedPromo.percent}%`;
        elements.cartDiscount.textContent = `-$${discountAmount.toFixed(2)}`;
    } else {
        elements.discountRow.style.display = "none";
    }

    const netSubtotal = subtotal - discountAmount;
    const tax = netSubtotal * 0.08; // 8% sales tax
    
    // Free delivery if subtotal > $30 or FREESHIP promo
    let delivery = 3.99;
    if (subtotal >= 30.00 || (state.appliedPromo && state.appliedPromo.code === 'FREESHIP')) {
        delivery = 0.00;
        elements.cartDelivery.innerHTML = `<span style="color:#00E676; font-weight:700;">FREE</span>`;
    } else {
        elements.cartDelivery.textContent = `$${delivery.toFixed(2)}`;
    }

    const grandTotal = netSubtotal + tax + delivery;

    elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    elements.cartTax.textContent = `$${tax.toFixed(2)}`;
    elements.cartGrandTotal.textContent = `$${grandTotal.toFixed(2)}`;
}

function updateCartQuantity(cartItemId, action) {
    const idx = state.cart.findIndex(c => c.cartItemId === cartItemId);
    if (idx === -1) return;

    if (action === "plus") {
        state.cart[idx].qty += 1;
    } else if (action === "minus") {
        state.cart[idx].qty -= 1;
        if (state.cart[idx].qty <= 0) {
            state.cart.splice(idx, 1);
        }
    }
    renderCartDrawer();
}

// --- 9. EVENT LISTENERS SETUP ---
function setupEventListeners() {
    // Mobile Hamburger Menu Toggle
    const hamburger = document.getElementById("menu-hamburger");
    const navMenu = document.getElementById("nav-menu");
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            });
        });
    }

    // Menu Category Pills
    elements.categoryPills.forEach(pill => {
        pill.addEventListener("click", () => {
            elements.categoryPills.forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            state.activeCategory = pill.dataset.category;
            renderMenu();
        });
    });

    // Checkboxes
    elements.filterSpicyCheck.addEventListener("change", (e) => {
        state.filterSpicy = e.target.checked;
        renderMenu();
    });
    elements.filterSpecialCheck.addEventListener("change", (e) => {
        state.filterSpecial = e.target.checked;
        renderMenu();
    });
    elements.filterHalalCheck.addEventListener("change", (e) => {
        state.filterHalal = e.target.checked;
        renderMenu();
    });

    // Quick Add Hero item
    document.querySelectorAll(".quick-add-hero, .add-deal-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const itemId = btn.dataset.id;
            quickAddToCart(itemId);
        });
    });

    // Cart Drawer Toggle
    elements.cartToggleBtn.addEventListener("click", () => {
        elements.cartDrawerOverlay.classList.add("active");
    });
    elements.closeCartBtn.addEventListener("click", () => {
        elements.cartDrawerOverlay.classList.remove("active");
    });
    elements.cartDrawerOverlay.addEventListener("click", (e) => {
        if (e.target === elements.cartDrawerOverlay) {
            elements.cartDrawerOverlay.classList.remove("active");
        }
    });

    // Customizer Modal Quantity buttons
    elements.qtyMinusBtn.addEventListener("click", () => {
        if (state.customizerForm.qty > 1) {
            state.customizerForm.qty -= 1;
            elements.customQtyDisplay.textContent = state.customizerForm.qty;
            updateCustomizerPrice();
        }
    });
    elements.qtyPlusBtn.addEventListener("click", () => {
        state.customizerForm.qty += 1;
        elements.customQtyDisplay.textContent = state.customizerForm.qty;
        updateCustomizerPrice();
    });

    // Add to Cart Confirm in Customizer
    elements.addCartConfirmBtn.addEventListener("click", () => {
        if (!state.customizingItem) return;
        
        let base = state.customizingItem.price;
        let extraSize = state.customizerForm.sizeExtraPrice || 0;
        let addonsPrice = state.customizerForm.addons.reduce((sum, name) => {
            if (name.includes("Extra Suya")) return sum + 3.50;
            if (name.includes("Cheddar Cheese")) return sum + 1.50;
            if (name.includes("Jalapeño")) return sum + 0.75;
            if (name.includes("Onions")) return sum + 0.75;
            if (name.includes("Bacon")) return sum + 2.00;
            return sum;
        }, 0);

        let unitBasePrice = base + extraSize + addonsPrice;

        addCartItem({
            id: state.customizingItem.id,
            cartItemId: state.customizingItem.id + "-" + Date.now(),
            name: state.customizingItem.name,
            price: unitBasePrice * state.customizerForm.qty,
            unitBasePrice: unitBasePrice,
            qty: state.customizerForm.qty,
            size: state.customizerForm.size,
            sauces: [...state.customizerForm.sauces],
            addons: [...state.customizerForm.addons],
            notes: elements.customNotes.value,
            image: state.customizingItem.image
        });

        elements.customizerOverlay.classList.remove("active");
        showToast(`Added ${state.customizingItem.name} to order! 🌯`);
    });

    elements.closeCustomizerBtn.addEventListener("click", () => {
        elements.customizerOverlay.classList.remove("active");
    });

    // Apply Promo Code
    elements.applyPromoBtn.addEventListener("click", () => {
        const code = elements.promoInput.value.trim().toUpperCase();
        if (code === "FLAME10") {
            state.appliedPromo = { code: "FLAME10", percent: 10 };
            elements.promoStatusMsg.innerHTML = `<span style="color:#00E676; font-size:0.8rem;">✔ 10% Discount applied!</span>`;
            showToast("Promo Code FLAME10 applied!");
        } else if (code === "FREESHIP") {
            state.appliedPromo = { code: "FREESHIP", percent: 0 };
            elements.promoStatusMsg.innerHTML = `<span style="color:#00E676; font-size:0.8rem;">✔ Free Shipping applied!</span>`;
            showToast("Free Shipping Promo applied!");
        } else {
            elements.promoStatusMsg.innerHTML = `<span style="color:#FF1744; font-size:0.8rem;">✖ Invalid promo code</span>`;
        }
        renderCartDrawer();
    });

    // Proceed to Checkout
    elements.proceedCheckoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) {
            showToast("Your cart is empty! Add items first.");
            return;
        }
        elements.cartDrawerOverlay.classList.remove("active");
        elements.checkoutFinalTotal.textContent = elements.cartGrandTotal.textContent;
        elements.checkoutOverlay.classList.add("active");
    });

    elements.closeCheckoutBtn.addEventListener("click", () => {
        elements.checkoutOverlay.classList.remove("active");
    });

    // Order Type Toggle in Checkout
    document.querySelectorAll(".toggle-option").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".toggle-option").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const addressGroup = document.getElementById("address-group");
            if (btn.dataset.type === "pickup") {
                addressGroup.style.display = "none";
                document.getElementById("cust-address").removeAttribute("required");
            } else {
                addressGroup.style.display = "block";
                document.getElementById("cust-address").setAttribute("required", "true");
            }
        });
    });

    // Payment Cards click handler
    document.querySelectorAll(".pay-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".pay-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            card.querySelector("input").checked = true;
        });
    });

    // Submit Checkout Form
    elements.checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const orderId = "#FS-" + Math.floor(10000 + Math.random() * 90000);
        const name = document.getElementById("cust-name").value;
        const phone = document.getElementById("cust-phone").value;
        const address = document.getElementById("cust-address").value || "Restaurant Pickup";
        const total = elements.checkoutFinalTotal.textContent;

        state.activeOrder = {
            orderId,
            name,
            phone,
            address,
            items: [...state.cart],
            total,
            status: "preparing",
            eta: 25
        };

        // Render Receipt Modal
        elements.receiptOrderId.textContent = orderId;
        elements.receiptTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        elements.receiptCustomerInfo.innerHTML = `
            <p><strong>Customer:</strong> ${name} (${phone})</p>
            <p><strong>Address:</strong> ${address}</p>
        `;
        elements.receiptItemsList.innerHTML = state.cart.map(item => `
            <div class="receipt-item-row">
                <span>${item.qty}x ${item.name} (${item.size})</span>
                <strong>$${(item.unitBasePrice * item.qty).toFixed(2)}</strong>
            </div>
        `).join('');
        elements.receiptTotalsLines.innerHTML = `
            <div class="receipt-item-row" style="margin-top:10px; font-weight:800; font-size:1rem; color:var(--secondary);">
                <span>TOTAL PAID</span>
                <span>${total}</span>
            </div>
        `;

        // Clear Cart
        state.cart = [];
        renderCartDrawer();

        elements.checkoutOverlay.classList.remove("active");
        elements.receiptOverlay.classList.add("active");

        showToast("🎉 Order Placed Successfully!");
    });

    // Receipt buttons
    elements.viewOrderTrackerBtn.addEventListener("click", () => {
        elements.receiptOverlay.classList.remove("active");
        openTrackerModal();
    });
    elements.printReceiptBtn.addEventListener("click", () => {
        window.print();
    });

    // Tracker Modal Toggle
    elements.openTrackerBtn.addEventListener("click", openTrackerModal);
    elements.closeTrackerBtn.addEventListener("click", () => {
        elements.trackerOverlay.classList.remove("active");
    });

    // Reviews Modal
    elements.openReviewModalBtn.addEventListener("click", () => {
        elements.reviewOverlay.classList.add("active");
    });
    elements.closeReviewBtn.addEventListener("click", () => {
        elements.reviewOverlay.classList.remove("active");
    });

    // Star Picker in Review Modal
    elements.starPickerSpans.forEach(star => {
        star.addEventListener("click", () => {
            const rating = parseInt(star.dataset.rating);
            elements.starPickerSpans.forEach(s => {
                const r = parseInt(s.dataset.rating);
                if (r <= rating) s.classList.add("active");
                else s.classList.remove("active");
            });
            elements.starPickerSpans[0].parentElement.dataset.selected = rating;
        });
    });

    // Write Review Submit
    elements.writeReviewForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("rev-name").value;
        const tag = document.getElementById("rev-tag").value;
        const comment = document.getElementById("rev-comment").value;
        const stars = parseInt(document.querySelector("#star-picker span.active:last-of-type")?.dataset.rating || 5);

        const newReview = { name, stars, tag, comment };
        state.reviews.unshift(newReview);
        saveReviews();
        renderReviews();

        elements.writeReviewForm.reset();
        elements.reviewOverlay.classList.remove("active");
        showToast("Thank you for your feedback! ⭐");
    });
}

// --- 10. ORDER TRACKER SIMULATOR ---
function openTrackerModal() {
    if (!state.activeOrder) {
        state.activeOrder = {
            orderId: "#FS-84912",
            name: "Customer",
            items: [],
            total: "$21.99",
            status: "preparing",
            eta: 22
        };
    }

    elements.trackerOrderNum.textContent = `Order ${state.activeOrder.orderId}`;
    elements.trackerOverlay.classList.add("active");
    simulateTrackerTimeline();
}

function simulateTrackerTimeline() {
    let step = 2; // Preparing
    updateTrackerUI(step, "22 Mins", "Your order is sizzling grilled in kitchen!");

    if (state.trackerTimer) clearInterval(state.trackerTimer);

    let minutesLeft = 22;
    state.trackerTimer = setInterval(() => {
        minutesLeft -= 1;
        if (minutesLeft > 15) {
            updateTrackerUI(2, `${minutesLeft} Mins`, "Your order is sizzling grilled in kitchen!");
        } else if (minutesLeft > 5) {
            updateTrackerUI(3, `${minutesLeft} Mins`, "Courier Marcus Vance is riding to your address!");
        } else if (minutesLeft > 0) {
            updateTrackerUI(3, `${minutesLeft} Mins`, "Courier is arriving at your doorstep!");
        } else {
            updateTrackerUI(4, "DELIVERED!", "Enjoy your sizzling hot Flame & Sizzle meal!");
            clearInterval(state.trackerTimer);
        }
    }, 4000); // Fast simulation tick
}

function updateTrackerUI(activeStep, etaText, subMsg) {
    elements.etaCountdown.textContent = etaText;
    elements.etaSubStatus.textContent = subMsg;

    const barFill = document.getElementById("tracker-bar-fill");
    if (barFill) {
        const percentages = { 1: "0%", 2: "33%", 3: "66%", 4: "100%" };
        barFill.style.width = percentages[activeStep] || "33%";
    }

    for (let i = 1; i <= 4; i++) {
        const stepEl = document.getElementById(`step-${i}`);
        if (stepEl) {
            if (i < activeStep) {
                stepEl.className = "tracker-step step-done";
            } else if (i === activeStep) {
                stepEl.className = "tracker-step step-active";
            } else {
                stepEl.className = "tracker-step";
            }
        }
    }
}

// --- 11. REVIEWS & DAILY DEAL TIMER ---
function loadSavedReviews() {
    const saved = localStorage.getItem("flame_sizzle_reviews");
    if (saved) {
        state.reviews = JSON.parse(saved);
    } else {
        state.reviews = [...INITIAL_REVIEWS];
    }
}

function saveReviews() {
    localStorage.setItem("flame_sizzle_reviews", JSON.stringify(state.reviews));
}

function renderReviews() {
    elements.reviewsGrid.innerHTML = state.reviews.map(rev => `
        <div class="review-card">
            <div class="rev-header">
                <span class="rev-author">${rev.name}</span>
                <span class="rev-stars">${'★'.repeat(rev.stars)}</span>
            </div>
            <span class="rev-tag">${rev.tag}</span>
            <p class="rev-text">"${rev.comment}"</p>
        </div>
    `).join('');
}

function startDailyDealTimer() {
    const timerEl = document.getElementById("deal-timer");
    if (!timerEl) return;
    
    let totalSeconds = 4 * 3600 + 28 * 60 + 15; // 04:28:15

    setInterval(() => {
        totalSeconds -= 1;
        if (totalSeconds < 0) totalSeconds = 24 * 3600;

        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');

        timerEl.textContent = `${h} : ${m} : ${s}`;
    }, 1000);
}

// --- 12. TOAST ALERTS HELPER ---
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span>🔥</span> <span>${message}</span>`;
    elements.toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
