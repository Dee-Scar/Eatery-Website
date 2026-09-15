// --- 1. CONTENT FROM THE SHARED STORE (see data.js / admin panel) ---
const content = window.FlameData.load();

/** Menu items customers can actually order right now. */
function menuItems() {
    return content.menu.filter(item => item.isAvailable !== false);
}

function findMenuItem(id) {
    return content.menu.find(item => item.id === id);
}

function settings() {
    return content.settings;
}

// --- 2. ORDER CONFIGURATION (single source of truth for pricing) ---
const PORTION_SIZES = [
    { label: "Regular Portion", extra: 0 },
    { label: "Large Portion", extra: 2.50 },
    { label: "Monster Feast", extra: 4.99 }
];

const SAUCES = ["Creamy Garlic Toum", "Spicy Harissa Mayo", "Smoky Hickory BBQ", "Warm Cheddar Dip"];

const ADDONS = [
    { name: "Extra Suya Meat / Chicken", price: 3.50 },
    { name: "Melted Cheddar Cheese", price: 1.50 },
    { name: "Pickled Jalapeño Peppers", price: 0.75 },
    { name: "Crispy Fried Onions", price: 0.75 },
    { name: "Crispy Smoked Bacon Bits", price: 2.00 }
];

const STORAGE_KEYS = {
    cart: "flame_sizzle_cart"
};

// Pricing rules are admin-editable; read them fresh on every calculation.
function taxRate() {
    return (Number(settings().taxRate) || 0) / 100;
}

function deliveryFee() {
    return Number(settings().deliveryFee) || 0;
}

function freeDeliveryThreshold() {
    return Number(settings().freeDeliveryThreshold) || 0;
}

// --- 3. REVIEWS come from the shared store (see loadSavedReviews) ---
/*
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
]; */

// --- 4. GLOBAL APPLICATION STATE ---
const state = {
    cart: [],
    appliedPromo: null,
    activeCategory: "all",
    searchTerm: "",
    sortBy: "featured",
    filterSpicy: false,
    filterSpecial: false,
    filterHalal: true,
    customizingItem: null,
    customizerForm: {
        qty: 1,
        size: PORTION_SIZES[0].label,
        sizeExtraPrice: 0,
        sauces: [SAUCES[0]],
        addons: [],
        notes: ""
    },
    activeOrder: null,
    trackerTimer: null,
    dealTimer: null,
    reviews: []
};

// --- 5. DOM ELEMENTS ---
const elements = {
    menuGrid: document.getElementById("menu-grid"),
    menuSearch: document.getElementById("menu-search"),
    menuSort: document.getElementById("menu-sort"),
    menuResultsCount: document.getElementById("menu-results-count"),
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
    freeDeliveryMeter: document.getElementById("free-delivery-meter"),
    freeDeliveryLabel: document.getElementById("free-delivery-label"),
    freeDeliveryFill: document.getElementById("free-delivery-fill"),

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
    closeReceiptBtn: document.getElementById("close-receipt-btn"),
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
    callCourierBtn: document.getElementById("call-courier-btn"),

    // Reviews
    reviewsGrid: document.getElementById("reviews-grid"),
    openReviewModalBtn: document.getElementById("open-review-modal-btn"),
    reviewOverlay: document.getElementById("review-modal-overlay"),
    closeReviewBtn: document.getElementById("close-review-btn"),
    writeReviewForm: document.getElementById("write-review-form"),
    starPicker: document.getElementById("star-picker"),
    starPickerBtns: document.querySelectorAll("#star-picker button"),

    // Chrome
    header: document.getElementById("header"),
    backToTopBtn: document.getElementById("back-to-top"),
    newsletterForm: document.getElementById("newsletter-form"),
    newsletterEmail: document.getElementById("newsletter-email"),
    footerYear: document.getElementById("footer-year"),
    toastContainer: document.getElementById("toast-container")
};

// --- 6. SHARED HELPERS ---
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function money(amount) {
    return `$${Number(amount).toFixed(2)}`;
}

function readStorage(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* Storage unavailable (private mode / quota) — the app still works in memory. */
    }
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// --- 7. MODAL / DRAWER MANAGER ---
const openOverlays = [];

function focusableIn(container) {
    return Array.from(
        container.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
    ).filter(el => el.offsetParent !== null || el === document.activeElement);
}

function openOverlay(overlay) {
    if (!overlay || overlay.classList.contains("active")) return;

    overlay.dataset.returnFocusId = document.activeElement && document.activeElement.id ? document.activeElement.id : "";
    overlay.classList.add("active");
    overlay.setAttribute("aria-hidden", "false");
    openOverlays.push(overlay);
    document.body.classList.add("overlay-open");

    // Move focus into the dialog so keyboard and screen-reader users land in the right place.
    window.requestAnimationFrame(() => {
        const targets = focusableIn(overlay);
        if (targets.length) targets[0].focus();
    });
}

function closeOverlay(overlay) {
    if (!overlay || !overlay.classList.contains("active")) return;

    overlay.classList.remove("active");
    overlay.setAttribute("aria-hidden", "true");

    const index = openOverlays.indexOf(overlay);
    if (index > -1) openOverlays.splice(index, 1);
    if (openOverlays.length === 0) document.body.classList.remove("overlay-open");

    const returnId = overlay.dataset.returnFocusId;
    if (returnId) {
        const returnEl = document.getElementById(returnId);
        if (returnEl) returnEl.focus();
    }
}

function setupOverlayBehaviour() {
    document.querySelectorAll(".modal-overlay, .drawer-overlay").forEach(overlay => {
        // Click on the dim backdrop (never on the panel itself) dismisses the dialog.
        overlay.addEventListener("mousedown", event => {
            if (event.target === overlay) closeOverlay(overlay);
        });
    });

    document.addEventListener("keydown", event => {
        if (!openOverlays.length) return;
        const top = openOverlays[openOverlays.length - 1];

        if (event.key === "Escape") {
            event.preventDefault();
            closeOverlay(top);
            return;
        }

        if (event.key === "Tab") {
            const targets = focusableIn(top);
            if (!targets.length) return;
            const first = targets[0];
            const last = targets[targets.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

// --- 8. INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
    renderAnnouncements();
    renderDeals();
    renderSiteSettings();
    loadSavedReviews();
    loadSavedCart();
    renderMenu();
    renderReviews();
    renderCartDrawer();
    setupOverlayBehaviour();
    setupEventListeners();
    setupScrollBehaviour();
    setupRevealAnimations();
    startDailyDealTimer();

    if (elements.footerYear) {
        elements.footerYear.textContent = String(new Date().getFullYear());
    }
});

// --- 9. MENU RENDER, SEARCH, FILTER & SORT ---
function getVisibleMenuItems() {
    const term = state.searchTerm.trim().toLowerCase();

    const filtered = menuItems().filter(item => {
        if (state.activeCategory !== "all" && item.category !== state.activeCategory) return false;
        if (state.filterSpicy && !item.isSpicy) return false;
        if (state.filterSpecial && !item.isSpecial) return false;
        if (state.filterHalal && !item.isHalal) return false;

        if (term) {
            const haystack = `${item.name} ${item.description} ${item.category} ${item.badge}`.toLowerCase();
            if (!haystack.includes(term)) return false;
        }
        return true;
    });

    const sorters = {
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        rating: (a, b) => b.rating - a.rating,
        fastest: (a, b) => a.prepTime - b.prepTime
    };

    return sorters[state.sortBy] ? filtered.slice().sort(sorters[state.sortBy]) : filtered;
}

function renderMenu() {
    const filtered = getVisibleMenuItems();

    if (elements.menuResultsCount) {
        elements.menuResultsCount.textContent = filtered.length
            ? `${filtered.length} item${filtered.length === 1 ? "" : "s"} available`
            : "No matching items";
    }

    if (filtered.length === 0) {
        elements.menuGrid.innerHTML = `
            <div class="empty-state">
                <p class="empty-icon" aria-hidden="true">🔍</p>
                <h3>No Food Items Found</h3>
                <p>Try adjusting your search keywords or preference filters.</p>
                <button class="btn btn-secondary" type="button" id="reset-menu-filters">Reset all filters</button>
            </div>
        `;
        const resetBtn = document.getElementById("reset-menu-filters");
        if (resetBtn) resetBtn.addEventListener("click", resetMenuFilters);
        return;
    }

    elements.menuGrid.innerHTML = filtered.map(item => `
        <article class="food-card reveal is-visible">
            <div class="card-img-wrapper">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="card-img" loading="lazy" decoding="async" width="600" height="400">
                <span class="card-badge-tag">${escapeHtml(item.badge)}</span>
            </div>
            <div class="card-body">
                <div class="card-title-row">
                    <h3>${escapeHtml(item.name)}</h3>
                    <span class="rating-pill">${item.rating.toFixed(1)} ★</span>
                </div>
                <p class="card-desc">${escapeHtml(item.description)}</p>
                <p class="card-meta-bar">
                    <span>🔥 ${item.calories} kcal</span>
                    <span>⏱️ ${item.prepTime} mins</span>
                    <span>${item.isSpicy ? "🌶️ Spicy" : "😋 Mild"}</span>
                </p>
                <div class="card-footer">
                    <span class="card-price">${money(item.price)}</span>
                    <div class="card-actions">
                        <button class="btn btn-sm btn-outline customize-btn" type="button" data-id="${escapeHtml(item.id)}">
                            ⚙️ Customize
                        </button>
                        <button class="btn btn-sm btn-primary quick-add-btn" type="button" data-id="${escapeHtml(item.id)}">
                            + Add
                        </button>
                    </div>
                </div>
            </div>
        </article>
    `).join("");
}

function resetMenuFilters() {
    state.activeCategory = "all";
    state.searchTerm = "";
    state.sortBy = "featured";
    state.filterSpicy = false;
    state.filterSpecial = false;

    if (elements.menuSearch) elements.menuSearch.value = "";
    if (elements.menuSort) elements.menuSort.value = "featured";
    if (elements.filterSpicyCheck) elements.filterSpicyCheck.checked = false;
    if (elements.filterSpecialCheck) elements.filterSpecialCheck.checked = false;

    elements.categoryPills.forEach(pill => {
        const isAll = pill.dataset.category === "all";
        pill.classList.toggle("active", isAll);
        pill.setAttribute("aria-selected", String(isAll));
    });

    renderMenu();
}

// --- 10. CUSTOMIZER MODAL LOGIC ---
function openCustomizerModal(itemId) {
    const item = findMenuItem(itemId);
    if (!item) return;

    state.customizingItem = item;
    state.customizerForm = {
        qty: 1,
        size: PORTION_SIZES[0].label,
        sizeExtraPrice: 0,
        sauces: [SAUCES[0]],
        addons: [],
        notes: ""
    };

    elements.customItemImg.src = item.image;
    elements.customItemImg.alt = item.name;
    elements.customItemName.textContent = item.name;
    elements.customItemDesc.textContent = item.description;
    elements.customItemCal.textContent = `🔥 ${item.calories} kcal`;
    elements.customItemPrep.textContent = `⏱️ ${item.prepTime} mins`;
    elements.customNotes.value = "";
    elements.customQtyDisplay.textContent = "1";

    elements.sizeOptionsContainer.innerHTML = PORTION_SIZES.map((size, idx) => `
        <label class="opt-label">
            <span class="opt-main">
                <input type="radio" name="custom-size" value="${escapeHtml(size.label)}" data-extra="${size.extra}" ${idx === 0 ? "checked" : ""}>
                <span>${escapeHtml(size.label)}</span>
            </span>
            <span class="opt-price">${size.extra ? `+${money(size.extra)}` : "Included"}</span>
        </label>
    `).join("");

    elements.sauceOptionsContainer.innerHTML = SAUCES.map((sauce, idx) => `
        <label class="opt-label">
            <span class="opt-main">
                <input type="checkbox" name="custom-sauce" value="${escapeHtml(sauce)}" ${idx === 0 ? "checked" : ""}>
                <span>${escapeHtml(sauce)}</span>
            </span>
            <span class="opt-price opt-free">FREE</span>
        </label>
    `).join("");

    elements.addonsOptionsContainer.innerHTML = ADDONS.map(addon => `
        <label class="opt-label">
            <span class="opt-main">
                <input type="checkbox" name="custom-addon" value="${escapeHtml(addon.name)}" data-price="${addon.price}">
                <span>${escapeHtml(addon.name)}</span>
            </span>
            <span class="opt-price opt-paid">+${money(addon.price)}</span>
        </label>
    `).join("");

    syncCustomizerSelections();
    openOverlay(elements.customizerOverlay);
}

/** Reads every control in the customizer back into state and repaints the live price. */
function syncCustomizerSelections() {
    if (!state.customizingItem) return;

    const checkedSize = elements.sizeOptionsContainer.querySelector("input[type=radio]:checked");
    state.customizerForm.size = checkedSize ? checkedSize.value : PORTION_SIZES[0].label;
    state.customizerForm.sizeExtraPrice = checkedSize ? parseFloat(checkedSize.dataset.extra) || 0 : 0;

    state.customizerForm.sauces = Array.from(
        elements.sauceOptionsContainer.querySelectorAll("input[type=checkbox]:checked")
    ).map(cb => cb.value);

    state.customizerForm.addons = Array.from(
        elements.addonsOptionsContainer.querySelectorAll("input[type=checkbox]:checked")
    ).map(cb => cb.value);

    elements.customCalculatedPrice.textContent = money(customizerUnitPrice() * state.customizerForm.qty);
}

function customizerUnitPrice() {
    const addonsTotal = state.customizerForm.addons.reduce((sum, name) => {
        const addon = ADDONS.find(a => a.name === name);
        return sum + (addon ? addon.price : 0);
    }, 0);

    return state.customizingItem.price + (state.customizerForm.sizeExtraPrice || 0) + addonsTotal;
}

// --- 11. CART MANAGEMENT LOGIC ---
function loadSavedCart() {
    state.cart = readStorage(STORAGE_KEYS.cart, []);
}

function saveCart() {
    writeStorage(STORAGE_KEYS.cart, state.cart);
}

function quickAddToCart(itemId) {
    const item = findMenuItem(itemId);
    if (!item) return;

    addCartItem({
        id: item.id,
        cartItemId: `${item.id}-${Date.now()}`,
        name: item.name,
        unitBasePrice: item.price,
        qty: 1,
        size: PORTION_SIZES[0].label,
        sauces: [SAUCES[0]],
        addons: [],
        notes: "",
        image: item.image
    });

    showToast(`Added ${item.name} to cart!`);
}

function addCartItem(cartObj) {
    // Identical configurations merge into one line rather than stacking duplicates.
    const existingIndex = state.cart.findIndex(c =>
        c.id === cartObj.id &&
        c.size === cartObj.size &&
        c.notes === cartObj.notes &&
        JSON.stringify(c.sauces) === JSON.stringify(cartObj.sauces) &&
        JSON.stringify(c.addons) === JSON.stringify(cartObj.addons)
    );

    if (existingIndex > -1) {
        state.cart[existingIndex].qty += cartObj.qty;
    } else {
        state.cart.push(cartObj);
    }

    saveCart();
    renderCartDrawer();
}

function cartSubtotal() {
    return state.cart.reduce((sum, item) => sum + item.unitBasePrice * item.qty, 0);
}

function cartTotals() {
    const subtotal = cartSubtotal();
    const discount = state.appliedPromo ? subtotal * (state.appliedPromo.percent / 100) : 0;
    const netSubtotal = subtotal - discount;
    const tax = netSubtotal * taxRate();

    const freeDelivery =
        state.cart.length === 0 ||
        subtotal >= freeDeliveryThreshold() ||
        (state.appliedPromo && state.appliedPromo.code === "FREESHIP");

    const delivery = freeDelivery ? 0 : deliveryFee();

    return { subtotal, discount, netSubtotal, tax, delivery, freeDelivery, grandTotal: netSubtotal + tax + delivery };
}

function renderCartDrawer() {
    const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
    elements.cartCountBadge.textContent = String(totalQty);
    elements.cartToggleBtn.setAttribute(
        "aria-label",
        totalQty ? `View shopping cart, ${totalQty} item${totalQty === 1 ? "" : "s"}` : "View shopping cart, empty"
    );

    if (state.cart.length === 0) {
        elements.cartItemsContainer.innerHTML = `
            <div class="empty-state empty-cart">
                <p class="empty-icon" aria-hidden="true">🛒</p>
                <h3>Your Cart is Empty</h3>
                <p>Discover our flame grills and shawarmas to add tasty treats!</p>
            </div>
        `;
    } else {
        elements.cartItemsContainer.innerHTML = state.cart.map(item => {
            const details = [item.size]
                .concat(item.sauces.length ? item.sauces.join(", ") : [])
                .concat(item.addons.length ? `+ ${item.addons.join(", ")}` : [])
                .join(" • ");

            return `
                <div class="cart-item-card">
                    <img src="${escapeHtml(item.image)}" alt="" class="cart-item-img" width="60" height="60">
                    <div class="cart-item-info">
                        <div class="cart-item-head">
                            <h3>${escapeHtml(item.name)}</h3>
                            <button class="cart-remove-btn" type="button" data-cart-id="${escapeHtml(item.cartItemId)}" aria-label="Remove ${escapeHtml(item.name)} from cart">&times;</button>
                        </div>
                        <p class="cart-item-details">${escapeHtml(details)}</p>
                        ${item.notes ? `<p class="cart-item-note">📝 ${escapeHtml(item.notes)}</p>` : ""}
                        <div class="cart-item-bottom">
                            <span class="cart-item-price">${money(item.unitBasePrice * item.qty)}</span>
                            <div class="quantity-picker quantity-picker-sm">
                                <button class="cart-qty-btn" type="button" data-cart-id="${escapeHtml(item.cartItemId)}" data-action="minus" aria-label="Decrease quantity of ${escapeHtml(item.name)}">-</button>
                                <span>${item.qty}</span>
                                <button class="cart-qty-btn" type="button" data-cart-id="${escapeHtml(item.cartItemId)}" data-action="plus" aria-label="Increase quantity of ${escapeHtml(item.name)}">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    const totals = cartTotals();

    elements.cartSubtotal.textContent = money(totals.subtotal);
    elements.cartTax.textContent = money(totals.tax);
    elements.cartGrandTotal.textContent = money(totals.grandTotal);

    if (totals.delivery === 0) {
        elements.cartDelivery.innerHTML = '<span class="free-tag">FREE</span>';
    } else {
        elements.cartDelivery.textContent = money(totals.delivery);
    }

    if (state.appliedPromo && state.appliedPromo.percent > 0) {
        elements.discountRow.hidden = false;
        elements.discountPercent.textContent = `${state.appliedPromo.percent}%`;
        elements.cartDiscount.textContent = `-${money(totals.discount)}`;
    } else {
        elements.discountRow.hidden = true;
    }

    elements.proceedCheckoutBtn.disabled = state.cart.length === 0;
    renderFreeDeliveryMeter(totals);
}

function renderFreeDeliveryMeter(totals) {
    if (!elements.freeDeliveryMeter) return;

    if (state.cart.length === 0) {
        elements.freeDeliveryMeter.hidden = true;
        return;
    }

    elements.freeDeliveryMeter.hidden = false;
    const threshold = freeDeliveryThreshold();
    const progress = threshold > 0 ? Math.min(100, (totals.subtotal / threshold) * 100) : 100;
    elements.freeDeliveryFill.style.width = `${progress}%`;

    if (totals.subtotal >= threshold) {
        elements.freeDeliveryMeter.classList.add("is-complete");
        elements.freeDeliveryLabel.textContent = "🎉 You've unlocked free delivery!";
    } else {
        elements.freeDeliveryMeter.classList.remove("is-complete");
        elements.freeDeliveryLabel.textContent = `Add ${money(threshold - totals.subtotal)} more for free delivery`;
    }
}

function updateCartQuantity(cartItemId, action) {
    const idx = state.cart.findIndex(c => c.cartItemId === cartItemId);
    if (idx === -1) return;

    if (action === "plus") {
        state.cart[idx].qty += 1;
    } else {
        state.cart[idx].qty -= 1;
        if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
    }

    saveCart();
    renderCartDrawer();
}

function removeCartItem(cartItemId) {
    const idx = state.cart.findIndex(c => c.cartItemId === cartItemId);
    if (idx === -1) return;

    const [removed] = state.cart.splice(idx, 1);
    saveCart();
    renderCartDrawer();
    showToast(`Removed ${removed.name} from cart.`);
}

// --- 12. EVENT LISTENERS SETUP ---
function setupEventListeners() {
    setupNavigation();
    setupMenuControls();
    setupCartControls();
    setupCustomizerControls();
    setupCheckoutControls();
    setupTrackerControls();
    setupReviewControls();
    setupNewsletter();
}

function setupNavigation() {
    const hamburger = document.getElementById("menu-hamburger");
    const navMenu = document.getElementById("nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            const isOpen = navMenu.classList.toggle("active");
            hamburger.classList.toggle("active", isOpen);
            hamburger.setAttribute("aria-expanded", String(isOpen));
            hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
        });

        document.querySelectorAll(".nav-link").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                hamburger.setAttribute("aria-label", "Open navigation menu");
            });
        });
    }

    // Footer menu links jump to the menu with that category pre-selected.
    document.querySelectorAll("[data-jump-category]").forEach(link => {
        link.addEventListener("click", () => {
            const category = link.dataset.jumpCategory;
            const pill = document.querySelector(`.cat-pill[data-category="${category}"]`);
            if (pill) pill.click();
        });
    });
}

function setupMenuControls() {
    elements.categoryPills.forEach(pill => {
        pill.addEventListener("click", () => {
            elements.categoryPills.forEach(p => {
                p.classList.remove("active");
                p.setAttribute("aria-selected", "false");
            });
            pill.classList.add("active");
            pill.setAttribute("aria-selected", "true");
            state.activeCategory = pill.dataset.category;
            renderMenu();
        });
    });

    if (elements.menuSearch) {
        elements.menuSearch.addEventListener("input", event => {
            state.searchTerm = event.target.value;
            renderMenu();
        });
    }

    if (elements.menuSort) {
        elements.menuSort.addEventListener("change", event => {
            state.sortBy = event.target.value;
            renderMenu();
        });
    }

    elements.filterSpicyCheck.addEventListener("change", event => {
        state.filterSpicy = event.target.checked;
        renderMenu();
    });
    elements.filterSpecialCheck.addEventListener("change", event => {
        state.filterSpecial = event.target.checked;
        renderMenu();
    });
    elements.filterHalalCheck.addEventListener("change", event => {
        state.filterHalal = event.target.checked;
        renderMenu();
    });

    // Delegated so dynamically rendered cards never need listener re-binding.
    elements.menuGrid.addEventListener("click", event => {
        const customizeBtn = event.target.closest(".customize-btn");
        if (customizeBtn) {
            openCustomizerModal(customizeBtn.dataset.id);
            return;
        }
        const addBtn = event.target.closest(".quick-add-btn");
        if (addBtn) quickAddToCart(addBtn.dataset.id);
    });

    document.querySelectorAll(".quick-add-hero").forEach(btn => {
        btn.addEventListener("click", () => quickAddToCart(btn.dataset.id));
    });

    const dealsGrid = document.getElementById("deals-grid");
    if (dealsGrid) {
        dealsGrid.addEventListener("click", event => {
            const dealBtn = event.target.closest(".add-deal-btn");
            if (dealBtn) quickAddToCart(dealBtn.dataset.id);
        });
    }
}

function setupCartControls() {
    elements.cartToggleBtn.addEventListener("click", () => openOverlay(elements.cartDrawerOverlay));
    elements.closeCartBtn.addEventListener("click", () => closeOverlay(elements.cartDrawerOverlay));

    elements.cartItemsContainer.addEventListener("click", event => {
        const removeBtn = event.target.closest(".cart-remove-btn");
        if (removeBtn) {
            removeCartItem(removeBtn.dataset.cartId);
            return;
        }
        const qtyBtn = event.target.closest(".cart-qty-btn");
        if (qtyBtn) updateCartQuantity(qtyBtn.dataset.cartId, qtyBtn.dataset.action);
    });

    elements.applyPromoBtn.addEventListener("click", applyPromoCode);
    elements.promoInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            applyPromoCode();
        }
    });

    elements.proceedCheckoutBtn.addEventListener("click", () => {
        if (state.cart.length === 0) {
            showToast("Your cart is empty — add items first.");
            return;
        }
        closeOverlay(elements.cartDrawerOverlay);
        elements.checkoutFinalTotal.textContent = money(cartTotals().grandTotal);
        openOverlay(elements.checkoutOverlay);
    });
}

function applyPromoCode() {
    const code = elements.promoInput.value.trim().toUpperCase();
    const promo = (settings().promos || []).find(p => String(p.code).toUpperCase() === code);

    if (promo) {
        state.appliedPromo = promo;
        elements.promoStatusMsg.className = "promo-status is-valid";
        elements.promoStatusMsg.textContent = `✔ ${promo.label}`;
        showToast(`Promo code ${promo.code} applied!`);
    } else {
        state.appliedPromo = null;
        elements.promoStatusMsg.className = "promo-status is-invalid";
        elements.promoStatusMsg.textContent = code ? "✖ Invalid promo code" : "✖ Enter a promo code first";
    }

    renderCartDrawer();
}

function setupCustomizerControls() {
    elements.closeCustomizerBtn.addEventListener("click", () => closeOverlay(elements.customizerOverlay));

    // One delegated listener covers size, sauce and add-on controls.
    elements.customizerOverlay.addEventListener("change", event => {
        if (event.target.matches("input[name=custom-size], input[name=custom-sauce], input[name=custom-addon]")) {
            syncCustomizerSelections();
        }
    });

    elements.qtyMinusBtn.addEventListener("click", () => {
        if (state.customizerForm.qty > 1) {
            state.customizerForm.qty -= 1;
            elements.customQtyDisplay.textContent = String(state.customizerForm.qty);
            syncCustomizerSelections();
        }
    });

    elements.qtyPlusBtn.addEventListener("click", () => {
        if (state.customizerForm.qty >= 20) return;
        state.customizerForm.qty += 1;
        elements.customQtyDisplay.textContent = String(state.customizerForm.qty);
        syncCustomizerSelections();
    });

    elements.addCartConfirmBtn.addEventListener("click", () => {
        if (!state.customizingItem) return;

        syncCustomizerSelections();
        const item = state.customizingItem;

        addCartItem({
            id: item.id,
            cartItemId: `${item.id}-${Date.now()}`,
            name: item.name,
            unitBasePrice: customizerUnitPrice(),
            qty: state.customizerForm.qty,
            size: state.customizerForm.size,
            sauces: [...state.customizerForm.sauces],
            addons: [...state.customizerForm.addons],
            notes: elements.customNotes.value.trim(),
            image: item.image
        });

        closeOverlay(elements.customizerOverlay);
        showToast(`Added ${item.name} to your order!`);
    });
}

function setupCheckoutControls() {
    elements.closeCheckoutBtn.addEventListener("click", () => closeOverlay(elements.checkoutOverlay));

    document.querySelectorAll(".toggle-option").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".toggle-option").forEach(b => {
                b.classList.remove("active");
                b.setAttribute("aria-pressed", "false");
            });
            btn.classList.add("active");
            btn.setAttribute("aria-pressed", "true");

            const addressGroup = document.getElementById("address-group");
            const addressInput = document.getElementById("cust-address");
            const isPickup = btn.dataset.type === "pickup";

            addressGroup.hidden = isPickup;
            addressInput.toggleAttribute("required", !isPickup);
        });
    });

    document.querySelectorAll(".pay-card").forEach(card => {
        const radio = card.querySelector("input");
        radio.addEventListener("change", () => {
            document.querySelectorAll(".pay-card").forEach(c => c.classList.remove("active"));
            if (radio.checked) card.classList.add("active");
        });
    });

    elements.checkoutForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!elements.checkoutForm.reportValidity()) return;
        if (state.cart.length === 0) {
            showToast("Your cart is empty — add items first.");
            return;
        }

        placeOrder();
    });

    elements.closeReceiptBtn.addEventListener("click", () => closeOverlay(elements.receiptOverlay));
    elements.viewOrderTrackerBtn.addEventListener("click", () => {
        closeOverlay(elements.receiptOverlay);
        openTrackerModal();
    });
    elements.printReceiptBtn.addEventListener("click", () => window.print());
}

function placeOrder() {
    const orderId = `#FS-${Math.floor(10000 + Math.random() * 90000)}`;
    const name = document.getElementById("cust-name").value.trim();
    const phone = document.getElementById("cust-phone").value.trim();
    const isPickup = document.querySelector(".toggle-option.active")?.dataset.type === "pickup";
    const address = isPickup ? "Restaurant Pickup" : document.getElementById("cust-address").value.trim();
    const totals = cartTotals();

    state.activeOrder = {
        orderId,
        name,
        phone,
        address,
        items: [...state.cart],
        total: money(totals.grandTotal),
        status: "preparing",
        eta: 22
    };

    elements.receiptOrderId.textContent = orderId;
    elements.receiptTimestamp.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    elements.receiptCustomerInfo.innerHTML = `
        <p><strong>Customer:</strong> ${escapeHtml(name)} (${escapeHtml(phone)})</p>
        <p><strong>${isPickup ? "Collection" : "Address"}:</strong> ${escapeHtml(address)}</p>
    `;
    elements.receiptItemsList.innerHTML = state.cart.map(item => `
        <p class="receipt-item-row">
            <span>${item.qty}× ${escapeHtml(item.name)} (${escapeHtml(item.size)})</span>
            <strong>${money(item.unitBasePrice * item.qty)}</strong>
        </p>
    `).join("");
    elements.receiptTotalsLines.innerHTML = `
        <p class="receipt-item-row"><span>Subtotal</span><span>${money(totals.subtotal)}</span></p>
        ${totals.discount > 0 ? `<p class="receipt-item-row"><span>Discount</span><span>-${money(totals.discount)}</span></p>` : ""}
        <p class="receipt-item-row"><span>Est. Tax</span><span>${money(totals.tax)}</span></p>
        <p class="receipt-item-row"><span>Delivery</span><span>${totals.delivery === 0 ? "FREE" : money(totals.delivery)}</span></p>
        <p class="receipt-item-row receipt-total-row"><span>TOTAL PAID</span><span>${money(totals.grandTotal)}</span></p>
    `;

    recordOrder({
        orderId,
        name,
        phone,
        address,
        type: isPickup ? "pickup" : "delivery",
        placedAt: new Date().toISOString(),
        items: state.cart.map(i => ({ name: i.name, qty: i.qty, size: i.size, lineTotal: +(i.unitBasePrice * i.qty).toFixed(2) })),
        subtotal: +totals.subtotal.toFixed(2),
        discount: +totals.discount.toFixed(2),
        tax: +totals.tax.toFixed(2),
        delivery: +totals.delivery.toFixed(2),
        total: +totals.grandTotal.toFixed(2),
        status: "preparing"
    });

    state.cart = [];
    state.appliedPromo = null;
    elements.promoInput.value = "";
    elements.promoStatusMsg.textContent = "";
    elements.promoStatusMsg.className = "promo-status";
    saveCart();
    renderCartDrawer();
    elements.checkoutForm.reset();

    closeOverlay(elements.checkoutOverlay);
    openOverlay(elements.receiptOverlay);
    showToast("🎉 Order placed successfully!");
}

// --- 13. ORDER TRACKER SIMULATOR ---
function setupTrackerControls() {
    elements.openTrackerBtn.addEventListener("click", openTrackerModal);
    elements.closeTrackerBtn.addEventListener("click", () => closeOverlay(elements.trackerOverlay));

    elements.callCourierBtn.addEventListener("click", () => {
        showToast("Connecting your call to courier Marcus Vance…");
    });

    // Stop the simulation whenever the tracker leaves the screen.
    const observer = new MutationObserver(() => {
        if (!elements.trackerOverlay.classList.contains("active") && state.trackerTimer) {
            clearInterval(state.trackerTimer);
            state.trackerTimer = null;
        }
    });
    observer.observe(elements.trackerOverlay, { attributes: true, attributeFilter: ["class"] });
}

function openTrackerModal() {
    if (!state.activeOrder) {
        state.activeOrder = {
            orderId: "#FS-84912",
            name: "Customer",
            items: [],
            total: money(21.99),
            status: "preparing",
            eta: 22
        };
    }

    elements.trackerOrderNum.textContent = `Order ${state.activeOrder.orderId}`;
    openOverlay(elements.trackerOverlay);
    simulateTrackerTimeline();
}

function simulateTrackerTimeline() {
    if (state.trackerTimer) clearInterval(state.trackerTimer);

    let minutesLeft = 22;
    updateTrackerUI(2, `${minutesLeft} Mins`, "Your order is sizzling on the grill in our kitchen!");

    state.trackerTimer = setInterval(() => {
        minutesLeft -= 1;

        if (minutesLeft > 15) {
            updateTrackerUI(2, `${minutesLeft} Mins`, "Your order is sizzling on the grill in our kitchen!");
        } else if (minutesLeft > 5) {
            updateTrackerUI(3, `${minutesLeft} Mins`, "Courier Marcus Vance is riding to your address!");
        } else if (minutesLeft > 0) {
            updateTrackerUI(3, `${minutesLeft} Mins`, "Courier is arriving at your doorstep!");
        } else {
            updateTrackerUI(4, "DELIVERED!", "Enjoy your sizzling hot Flame & Sizzle meal!");
            clearInterval(state.trackerTimer);
            state.trackerTimer = null;
        }
    }, 4000); // Fast simulation tick for demo purposes.
}

function updateTrackerUI(activeStep, etaText, subMsg) {
    elements.etaCountdown.textContent = etaText;
    elements.etaSubStatus.textContent = subMsg;

    const barFill = document.getElementById("tracker-bar-fill");
    if (barFill) {
        const percentages = { 1: "0%", 2: "33%", 3: "66%", 4: "100%" };
        barFill.style.width = percentages[activeStep] || "33%";
    }

    for (let i = 1; i <= 4; i += 1) {
        const stepEl = document.getElementById(`step-${i}`);
        if (!stepEl) continue;

        stepEl.classList.toggle("step-done", i < activeStep);
        stepEl.classList.toggle("step-active", i === activeStep);
    }
}

// --- 14. REVIEWS ---
function setupReviewControls() {
    elements.openReviewModalBtn.addEventListener("click", () => openOverlay(elements.reviewOverlay));
    elements.closeReviewBtn.addEventListener("click", () => closeOverlay(elements.reviewOverlay));

    elements.starPickerBtns.forEach(star => {
        star.addEventListener("click", () => {
            const rating = parseInt(star.dataset.rating, 10);
            elements.starPicker.dataset.selected = String(rating);
            elements.starPickerBtns.forEach(s => {
                s.classList.toggle("active", parseInt(s.dataset.rating, 10) <= rating);
            });
        });
    });

    elements.writeReviewForm.addEventListener("submit", event => {
        event.preventDefault();
        if (!elements.writeReviewForm.reportValidity()) return;

        const name = document.getElementById("rev-name").value.trim();
        const tag = document.getElementById("rev-tag").value;
        const comment = document.getElementById("rev-comment").value.trim();
        const stars = parseInt(elements.starPicker.dataset.selected, 10) || 5;

        state.reviews.unshift({ name, stars, tag, comment });
        saveReviews();
        renderReviews();

        elements.writeReviewForm.reset();
        elements.starPicker.dataset.selected = "5";
        elements.starPickerBtns.forEach(s => s.classList.add("active"));

        closeOverlay(elements.reviewOverlay);
        showToast("Thank you for your feedback! ⭐");
    });
}

function loadSavedReviews() {
    state.reviews = Array.isArray(content.reviews) ? content.reviews : [];
}

function saveReviews() {
    content.reviews = state.reviews;
    window.FlameData.save(content);
}

function renderReviews() {
    elements.reviewsGrid.innerHTML = state.reviews.map(rev => {
        const stars = Math.max(1, Math.min(5, Number(rev.stars) || 5));
        return `
            <article class="review-card reveal is-visible">
                <div class="rev-header">
                    <span class="rev-author">${escapeHtml(rev.name)}</span>
                    <span class="rev-stars" aria-label="${stars} out of 5 stars">${"★".repeat(stars)}<span class="rev-stars-dim">${"★".repeat(5 - stars)}</span></span>
                </div>
                <span class="rev-tag">${escapeHtml(rev.tag)}</span>
                <p class="rev-text">“${escapeHtml(rev.comment)}”</p>
            </article>
        `;
    }).join("");
}

// --- 15. NEWSLETTER ---
function setupNewsletter() {
    if (!elements.newsletterForm) return;

    elements.newsletterForm.addEventListener("submit", event => {
        event.preventDefault();
        const email = elements.newsletterEmail.value.trim();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showToast("Please enter a valid email address.");
            elements.newsletterEmail.focus();
            return;
        }

        elements.newsletterForm.reset();
        showToast("You're on the VIP list — check your inbox! 🎁");
    });
}

// --- 16. SCROLL BEHAVIOUR: STICKY HEADER, SCROLLSPY, BACK TO TOP ---
function setupScrollBehaviour() {
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    const navLinks = Array.from(document.querySelectorAll(".nav-link"));

    const onScroll = () => {
        const scrolled = window.scrollY > 24;
        elements.header.classList.toggle("is-scrolled", scrolled);
        if (elements.backToTopBtn) {
            elements.backToTopBtn.classList.toggle("is-visible", window.scrollY > 600);
        }

        // Highlight the section currently occupying the top third of the viewport.
        const marker = window.scrollY + window.innerHeight * 0.3;
        let currentId = sections.length ? sections[0].id : "";
        sections.forEach(section => {
            if (section.offsetTop <= marker) currentId = section.id;
        });

        navLinks.forEach(link => {
            const isActive = link.getAttribute("href") === `#${currentId}`;
            link.classList.toggle("active", isActive);
            if (isActive) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    if (elements.backToTopBtn) {
        elements.backToTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        });
    }
}

// --- 17. SCROLL REVEAL ANIMATIONS ---
function setupRevealAnimations() {
    const revealables = document.querySelectorAll(".reveal:not(.is-visible)");

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
        revealables.forEach(el => el.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.12 });

    revealables.forEach(el => observer.observe(el));
}

// --- 18. DAILY DEAL COUNTDOWN ---
function startDailyDealTimer() {
    const timerEl = document.getElementById("deal-timer");
    if (!timerEl) return;

    // Always counts down to midnight so the offer stays believable on every visit.
    const tick = () => {
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);

        const totalSeconds = Math.max(0, Math.floor((midnight - now) / 1000));
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
        const s = String(totalSeconds % 60).padStart(2, "0");

        timerEl.textContent = `${h} : ${m} : ${s}`;
    };

    tick();
    if (state.dealTimer) clearInterval(state.dealTimer);
    state.dealTimer = setInterval(tick, 1000);
}

// --- 19. TOAST ALERTS ---
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerHTML = `<span aria-hidden="true">🔥</span><span>${escapeHtml(message)}</span>`;
    elements.toastContainer.appendChild(toast);

    // Force the transition to run from the hidden state.
    window.requestAnimationFrame(() => toast.classList.add("is-visible"));

    setTimeout(() => {
        toast.classList.remove("is-visible");
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/* ==========================================================================
   20. ADMIN-DRIVEN CONTENT RENDERING
   Everything below paints the parts of the page the admin panel controls.
   ========================================================================== */

function renderAnnouncements() {
    const track = document.getElementById("announcement-track");
    if (!track) return;

    const items = (settings().announcements || []).filter(a => a && a.text);
    if (!items.length) {
        const bar = track.closest(".announcement-bar");
        if (bar) bar.hidden = true;
        return;
    }

    const strip = items.map(a => {
        const highlight = a.highlight ? ` <mark>${escapeHtml(a.highlight)}</mark>` : "";
        return `<span>${escapeHtml(a.text)}${highlight}</span><span class="dot" aria-hidden="true">•</span>`;
    }).join("");

    // Two identical halves let the marquee loop seamlessly at -50%.
    track.innerHTML =
        `<div class="announcement-content">${strip}</div>` +
        `<div class="announcement-content" aria-hidden="true">${strip}</div>`;
}

function renderDeals() {
    const grid = document.getElementById("deals-grid");
    if (!grid) return;

    const deals = (content.deals || []).filter(d => d && d.enabled !== false);
    const section = document.getElementById("deals");

    if (!deals.length) {
        if (section) section.hidden = true;
        return;
    }
    if (section) section.hidden = false;

    grid.innerHTML = deals.map((deal, index) => {
        const timer = deal.showTimer
            ? `<p class="deal-timer-box">
                   <span>Offer Ends In:</span>
                   <span class="countdown-timer" id="deal-timer">00 : 00 : 00</span>
               </p>`
            : "";
        const oldPrice = Number(deal.oldPrice) > 0
            ? `<span class="old-price">${money(deal.oldPrice)}</span>`
            : "";

        return `
            <article class="deal-card ${index === 0 ? "deal-main" : "deal-secondary"} reveal">
                <span class="deal-badge">${escapeHtml(deal.badge || "DEAL")}</span>
                <div class="deal-img-box">
                    <img src="${escapeHtml(deal.image)}" alt="${escapeHtml(deal.title)}" loading="lazy" decoding="async" width="600" height="400">
                </div>
                <div class="deal-info">
                    ${timer}
                    <h3>${escapeHtml(deal.title)}</h3>
                    <p>${escapeHtml(deal.description)}</p>
                    <div class="deal-price-row">
                        ${oldPrice}
                        <span class="new-price">${money(deal.newPrice)}</span>
                        <button class="btn btn-primary add-deal-btn" type="button" data-id="${escapeHtml(deal.itemId)}">
                            ${escapeHtml(deal.buttonLabel || "Order Now")}
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function renderSiteSettings() {
    const s = settings();

    const setText = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    setText("site-address", s.address);
    setText("site-hours-weekday", s.hoursWeekday);
    setText("site-hours-weekend", s.hoursWeekend);

    const phones = document.getElementById("site-phones");
    if (phones) {
        const toTel = value => `tel:${String(value).replace(/[^\d+]/g, "")}`;
        phones.innerHTML =
            `<a href="${escapeHtml(toTel(s.phonePrimary))}">${escapeHtml(s.phonePrimary)}</a>` +
            (s.phoneSecondary ? ` / <a href="${escapeHtml(toTel(s.phoneSecondary))}">${escapeHtml(s.phoneSecondary)}</a>` : "");
    }

    const statusBox = document.getElementById("open-status-box");
    if (statusBox) {
        statusBox.classList.toggle("is-closed", !s.isOpen);
        setText("open-status-title", s.isOpen ? "OPEN NOW" : "CURRENTLY CLOSED");
        setText(
            "open-status-sub",
            s.isOpen ? s.openStatusText : "We are closed right now — browse the menu and order when we reopen."
        );
    }
}

/** Keeps a record of every placed order so the admin panel can list them. */
function recordOrder(order) {
    if (!Array.isArray(content.orders)) content.orders = [];
    content.orders.unshift(order);
    content.orders = content.orders.slice(0, 200); // cap so storage cannot grow without bound
    window.FlameData.save(content);
}
