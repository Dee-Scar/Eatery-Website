/* ==========================================================================
   FLAME & SIZZLE BISTRO - ADMIN CONSOLE
   --------------------------------------------------------------------------
   Edits the shared content store in data.js. Everything saved here is read by
   the customer site (app.js) on its next load.
   ========================================================================== */

const SESSION_KEY = "flame_sizzle_admin_unlocked";

let data = window.FlameData.load();
let editingItemId = null;
let confirmAction = null;

/* --- Helpers -------------------------------------------------------------- */
const $ = id => document.getElementById(id);

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function money(amount) {
    return `$${Number(amount || 0).toFixed(2)}`;
}

function showToast(message, isError = false) {
    const toast = document.createElement("div");
    toast.className = `toast${isError ? " toast-error" : ""}`;
    toast.innerHTML = `<span aria-hidden="true">${isError ? "⚠️" : "✅"}</span><span>${escapeHtml(message)}</span>`;
    $("toast-container").appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("is-visible"));
    setTimeout(() => {
        toast.classList.remove("is-visible");
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/** Persists the working copy and reflects the outcome in the header. */
function persist(message) {
    const result = window.FlameData.save(data);
    const state = $("save-state");

    if (!result.ok) {
        state.textContent = "Not saved";
        state.className = "save-state is-error";
        showToast(result.error, true);
        return false;
    }

    state.textContent = `Saved ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    state.className = "save-state is-ok";
    if (message) showToast(message);
    updatePublishHint();
    return true;
}

function confirmThen(message, onConfirm, okLabel = "Delete") {
    $("confirm-message").textContent = message;
    $("confirm-ok").textContent = okLabel;
    confirmAction = onConfirm;
    openAdminModal($("confirm-modal"));
}

function openAdminModal(modal) {
    modal.hidden = false;
    document.body.classList.add("admin-modal-open");
    const first = modal.querySelector("input, select, textarea, button");
    if (first) requestAnimationFrame(() => first.focus());
}

function closeAdminModal(modal) {
    modal.hidden = true;
    if (!document.querySelector(".admin-modal-overlay:not([hidden])")) {
        document.body.classList.remove("admin-modal-open");
    }
}

/* --- Passcode gate -------------------------------------------------------- */
function initGate() {
    const unlocked = sessionStorage.getItem(SESSION_KEY) === "1";
    if (unlocked) return unlockConsole();

    $("gate-form").addEventListener("submit", event => {
        event.preventDefault();
        const entered = $("gate-passcode").value;

        if (entered === data.settings.adminPasscode) {
            try {
                sessionStorage.setItem(SESSION_KEY, "1");
            } catch {
                /* session storage unavailable — unlock for this page view only */
            }
            unlockConsole();
        } else {
            $("gate-error").hidden = false;
            $("gate-passcode").value = "";
            $("gate-passcode").focus();
        }
    });

    $("gate-passcode").focus();
}

function unlockConsole() {
    $("admin-gate").hidden = true;
    $("admin-shell").hidden = false;
    renderAll();
}

/* --- Navigation ----------------------------------------------------------- */
function initNav() {
    document.querySelectorAll(".admin-tab").forEach(tab => {
        tab.addEventListener("click", () => showPanel(tab.dataset.panel));
    });

    document.querySelectorAll("[data-goto]").forEach(btn => {
        btn.addEventListener("click", () => showPanel(btn.dataset.goto));
    });

    const toggle = $("admin-nav-toggle");
    toggle.addEventListener("click", () => {
        const open = $("admin-sidebar").classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
    });

    $("logout-btn").addEventListener("click", () => {
        try {
            sessionStorage.removeItem(SESSION_KEY);
        } catch {
            /* ignore */
        }
        location.reload();
    });
}

function showPanel(name) {
    document.querySelectorAll(".admin-tab").forEach(t => t.classList.toggle("active", t.dataset.panel === name));
    document.querySelectorAll(".admin-panel").forEach(p => {
        const match = p.id === `panel-${name}`;
        p.hidden = !match;
        p.classList.toggle("active", match);
    });
    $("admin-sidebar").classList.remove("is-open");
    $("admin-nav-toggle").setAttribute("aria-expanded", "false");
    $("admin-main").scrollTo({ top: 0 });
}

/* --- Render all ----------------------------------------------------------- */
function renderAll() {
    renderDashboard();
    renderMenuTable();
    renderDealsEditor();
    renderReviewsEditor();
    renderOrders();
    fillSettingsForm();
    updatePublishHint();
    updateStorageUsage();
}

function updatePublishHint() {
    $("dash-publish-hint").hidden = !window.FlameData.hasOverrides();
}

/* --- Dashboard ------------------------------------------------------------ */
function renderDashboard() {
    const available = data.menu.filter(i => i.isAvailable !== false).length;
    const revenue = data.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const avgRating = data.reviews.length
        ? (data.reviews.reduce((s, r) => s + (Number(r.stars) || 0), 0) / data.reviews.length).toFixed(1)
        : "—";

    const stats = [
        { label: "Menu Items", value: data.menu.length, sub: `${available} visible` },
        { label: "Active Deals", value: data.deals.filter(d => d.enabled !== false).length, sub: `of ${data.deals.length}` },
        { label: "Orders", value: data.orders.length, sub: "from this browser" },
        { label: "Revenue", value: money(revenue), sub: "all recorded orders" },
        { label: "Reviews", value: data.reviews.length, sub: `avg ${avgRating} ★` },
        { label: "Status", value: data.settings.isOpen ? "Open" : "Closed", sub: "storefront" }
    ];

    $("dash-stats").innerHTML = stats.map(s => `
        <div class="stat-card">
            <span class="stat-value">${escapeHtml(s.value)}</span>
            <span class="stat-label">${escapeHtml(s.label)}</span>
            <span class="stat-sub">${escapeHtml(s.sub)}</span>
        </div>
    `).join("");

    const recent = data.orders.slice(0, 5);
    $("dash-orders").innerHTML = recent.length
        ? `<div class="table-wrap"><table class="admin-table">
              <thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Type</th><th scope="col">Total</th></tr></thead>
              <tbody>${recent.map(o => `
                <tr>
                  <td><strong>${escapeHtml(o.orderId)}</strong></td>
                  <td>${escapeHtml(o.name)}</td>
                  <td>${escapeHtml(o.type || "delivery")}</td>
                  <td><strong>${money(o.total)}</strong></td>
                </tr>`).join("")}
              </tbody></table></div>`
        : `<p class="empty-note">No orders yet. Place one from the storefront to see it here.</p>`;
}

/* --- Menu table ----------------------------------------------------------- */
function initMenuPanel() {
    const categorySelect = $("admin-menu-category");
    categorySelect.innerHTML =
        `<option value="all">All categories</option>` +
        window.FlameData.MENU_CATEGORIES.map(c => `<option value="${c.value}">${escapeHtml(c.label)}</option>`).join("");

    $("admin-menu-search").addEventListener("input", renderMenuTable);
    categorySelect.addEventListener("change", renderMenuTable);
    $("add-item-btn").addEventListener("click", () => openItemEditor(null));

    $("admin-menu-body").addEventListener("click", event => {
        const btn = event.target.closest("button[data-action]");
        if (!btn) return;
        const { action, id } = btn.dataset;

        if (action === "edit") openItemEditor(id);
        if (action === "duplicate") duplicateItem(id);
        if (action === "delete") {
            const item = data.menu.find(i => i.id === id);
            confirmThen(`Delete “${item.name}”? It will disappear from the customer menu.`, () => deleteItem(id));
        }
    });

    $("admin-menu-body").addEventListener("change", event => {
        const toggle = event.target.closest("input[data-toggle-id]");
        if (!toggle) return;
        const item = data.menu.find(i => i.id === toggle.dataset.toggleId);
        if (!item) return;
        item.isAvailable = toggle.checked;
        persist(`${item.name} is now ${toggle.checked ? "visible" : "hidden"}.`);
        renderDashboard();
    });
}

function renderMenuTable() {
    const term = $("admin-menu-search").value.trim().toLowerCase();
    const category = $("admin-menu-category").value;

    const rows = data.menu.filter(item => {
        if (category !== "all" && item.category !== category) return false;
        if (term && !`${item.name} ${item.description}`.toLowerCase().includes(term)) return false;
        return true;
    });

    $("admin-menu-count").textContent = `${rows.length} of ${data.menu.length} items`;

    $("admin-menu-body").innerHTML = rows.length
        ? rows.map(item => {
            const tags = [
                item.isSpicy ? '<span class="pill pill-spicy">Spicy</span>' : "",
                item.isSpecial ? '<span class="pill pill-special">Special</span>' : "",
                item.isHalal ? '<span class="pill pill-halal">Halal</span>' : ""
            ].join("");

            return `
                <tr${item.isAvailable === false ? ' class="row-hidden"' : ""}>
                    <td>
                        <div class="cell-item">
                            <img src="${escapeHtml(item.image)}" alt="" width="44" height="44" loading="lazy">
                            <div>
                                <strong>${escapeHtml(item.name)}</strong>
                                <span class="cell-sub">${escapeHtml(item.badge || "")}</span>
                            </div>
                        </div>
                    </td>
                    <td>${escapeHtml(categoryLabel(item.category))}</td>
                    <td><strong>${money(item.price)}</strong></td>
                    <td>${Number(item.rating || 0).toFixed(1)} ★</td>
                    <td><div class="pill-row">${tags || '<span class="cell-sub">—</span>'}</div></td>
                    <td>
                        <label class="mini-switch">
                            <input type="checkbox" data-toggle-id="${escapeHtml(item.id)}" ${item.isAvailable !== false ? "checked" : ""}>
                            <span class="sr-only">Visible on site</span>
                            <span class="mini-switch-track" aria-hidden="true"></span>
                        </label>
                    </td>
                    <td>
                        <div class="row-actions">
                            <button class="btn btn-outline btn-sm" type="button" data-action="edit" data-id="${escapeHtml(item.id)}">Edit</button>
                            <button class="btn btn-outline btn-sm" type="button" data-action="duplicate" data-id="${escapeHtml(item.id)}">Copy</button>
                            <button class="btn btn-outline btn-sm btn-danger-ghost" type="button" data-action="delete" data-id="${escapeHtml(item.id)}">Delete</button>
                        </div>
                    </td>
                </tr>`;
        }).join("")
        : `<tr><td colspan="7"><p class="empty-note">No items match that search.</p></td></tr>`;
}

function categoryLabel(value) {
    const found = window.FlameData.MENU_CATEGORIES.find(c => c.value === value);
    return found ? found.label : value;
}

function makeItemId(name) {
    const base = String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 28) || "item";
    let id = base;
    let n = 2;
    while (data.menu.some(i => i.id === id)) id = `${base}-${n++}`;
    return id;
}

function duplicateItem(id) {
    const item = data.menu.find(i => i.id === id);
    if (!item) return;

    const copy = structuredClone(item);
    copy.name = `${item.name} (Copy)`;
    copy.id = makeItemId(copy.name);
    copy.isAvailable = false; // start hidden so a half-finished copy never hits the live menu
    data.menu.splice(data.menu.indexOf(item) + 1, 0, copy);

    persist("Item duplicated — it starts hidden.");
    renderMenuTable();
    renderDashboard();
}

function deleteItem(id) {
    const index = data.menu.findIndex(i => i.id === id);
    if (index === -1) return;
    const [removed] = data.menu.splice(index, 1);
    persist(`Deleted ${removed.name}.`);
    renderMenuTable();
    renderDashboard();
}

/* --- Item editor modal ---------------------------------------------------- */
function initItemEditor() {
    $("item-category").innerHTML = window.FlameData.MENU_CATEGORIES
        .map(c => `<option value="${c.value}">${escapeHtml(c.label)}</option>`).join("");

    $("item-image-select").innerHTML =
        window.FlameData.STOCK_IMAGES.map(src => `<option value="${escapeHtml(src)}">${escapeHtml(src.replace("images/", ""))}</option>`).join("") +
        `<option value="__custom">Custom path or URL…</option>`;

    $("item-image-select").addEventListener("change", event => {
        const custom = event.target.value === "__custom";
        $("item-image-custom-field").hidden = !custom;
        if (!custom) setImagePreview(event.target.value);
        else setImagePreview($("item-image-url").value);
    });

    $("item-image-url").addEventListener("input", event => setImagePreview(event.target.value));

    $("item-image-file").addEventListener("change", event => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        if (file.size > 300 * 1024) {
            $("item-image-note").textContent = `That file is ${Math.round(file.size / 1024)} KB — too large for browser storage. Use a path or URL instead.`;
            event.target.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            $("item-image-select").value = "__custom";
            $("item-image-custom-field").hidden = false;
            $("item-image-url").value = reader.result;
            setImagePreview(reader.result);
            $("item-image-note").textContent = `Embedded ${Math.round(file.size / 1024)} KB image.`;
        };
        reader.readAsDataURL(file);
    });

    $("item-modal-close").addEventListener("click", () => closeAdminModal($("item-modal")));
    $("item-cancel-btn").addEventListener("click", () => closeAdminModal($("item-modal")));
    $("item-form").addEventListener("submit", saveItemFromForm);
}

function setImagePreview(src) {
    const preview = $("item-image-preview");
    preview.src = src || "";
    preview.style.visibility = src ? "visible" : "hidden";
}

function openItemEditor(id) {
    editingItemId = id;
    const item = id ? data.menu.find(i => i.id === id) : null;

    $("item-modal-title").textContent = item ? "Edit Item" : "Add Menu Item";
    $("item-form-error").hidden = true;
    $("item-image-note").textContent = "";
    $("item-image-file").value = "";

    $("item-name").value = item ? item.name : "";
    $("item-desc").value = item ? item.description : "";
    $("item-category").value = item ? item.category : window.FlameData.MENU_CATEGORIES[0].value;
    $("item-badge").value = item ? item.badge || "" : "";
    $("item-price").value = item ? item.price : "";
    $("item-calories").value = item ? item.calories : "";
    $("item-prep").value = item ? item.prepTime : "";
    $("item-rating").value = item ? item.rating : "4.8";

    const image = item ? item.image : window.FlameData.STOCK_IMAGES[0];
    const isStock = window.FlameData.STOCK_IMAGES.includes(image);
    $("item-image-select").value = isStock ? image : "__custom";
    $("item-image-custom-field").hidden = isStock;
    $("item-image-url").value = isStock ? "" : image;
    setImagePreview(image);

    $("item-spicy").checked = item ? !!item.isSpicy : false;
    $("item-special").checked = item ? !!item.isSpecial : false;
    $("item-halal").checked = item ? item.isHalal !== false : true;
    $("item-available").checked = item ? item.isAvailable !== false : true;

    openAdminModal($("item-modal"));
}

function saveItemFromForm(event) {
    event.preventDefault();

    const name = $("item-name").value.trim();
    const description = $("item-desc").value.trim();
    const price = parseFloat($("item-price").value);

    const fail = message => {
        const box = $("item-form-error");
        box.textContent = message;
        box.hidden = false;
    };

    if (!name) return fail("Please give the item a name.");
    if (!description) return fail("Please add a short description.");
    if (!Number.isFinite(price) || price < 0) return fail("Enter a valid price.");

    const selected = $("item-image-select").value;
    const image = selected === "__custom" ? $("item-image-url").value.trim() : selected;
    if (!image) return fail("Choose an image or enter an image path.");

    const fields = {
        name,
        description,
        category: $("item-category").value,
        badge: $("item-badge").value.trim().toUpperCase() || "NEW",
        price: +price.toFixed(2),
        calories: parseInt($("item-calories").value, 10) || 0,
        prepTime: parseInt($("item-prep").value, 10) || 10,
        rating: Math.max(0, Math.min(5, parseFloat($("item-rating").value) || 4.8)),
        image,
        isSpicy: $("item-spicy").checked,
        isSpecial: $("item-special").checked,
        isHalal: $("item-halal").checked,
        isAvailable: $("item-available").checked
    };

    if (editingItemId) {
        const item = data.menu.find(i => i.id === editingItemId);
        Object.assign(item, fields);
    } else {
        data.menu.push({ id: makeItemId(name), ...fields });
    }

    if (persist(editingItemId ? "Item updated." : "Item added.")) {
        closeAdminModal($("item-modal"));
        renderMenuTable();
        renderDashboard();
    }
}

/* --- Deals editor --------------------------------------------------------- */
function renderDealsEditor() {
    const itemOptions = data.menu
        .map(i => `<option value="${escapeHtml(i.id)}">${escapeHtml(i.name)}</option>`).join("");

    $("deals-editor").innerHTML = data.deals.map((deal, index) => `
        <div class="admin-card" data-deal-index="${index}">
            <div class="deal-card-head">
                <h3>${index === 0 ? "Main Deal" : "Secondary Deal"}</h3>
                <label class="switch-row compact">
                    <input type="checkbox" data-deal-field="enabled" ${deal.enabled !== false ? "checked" : ""}>
                    <span>Show on site</span>
                </label>
            </div>

            <div class="field">
                <label>Title</label>
                <input type="text" data-deal-field="title" value="${escapeHtml(deal.title)}" maxlength="80">
            </div>
            <div class="field">
                <label>Description</label>
                <textarea data-deal-field="description" maxlength="240">${escapeHtml(deal.description)}</textarea>
            </div>
            <div class="field-row">
                <div class="field">
                    <label>Badge</label>
                    <input type="text" data-deal-field="badge" value="${escapeHtml(deal.badge)}" maxlength="20">
                </div>
                <div class="field">
                    <label>Was price ($)</label>
                    <input type="number" data-deal-field="oldPrice" value="${deal.oldPrice}" min="0" step="0.01">
                </div>
                <div class="field">
                    <label>Now price ($)</label>
                    <input type="number" data-deal-field="newPrice" value="${deal.newPrice}" min="0" step="0.01">
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <label>Adds this item to cart</label>
                    <select data-deal-field="itemId">${itemOptions}</select>
                </div>
                <div class="field">
                    <label>Button label</label>
                    <input type="text" data-deal-field="buttonLabel" value="${escapeHtml(deal.buttonLabel)}" maxlength="30">
                </div>
                <div class="field">
                    <label>Image</label>
                    <select data-deal-field="image">
                        ${window.FlameData.STOCK_IMAGES.map(src =>
                            `<option value="${escapeHtml(src)}">${escapeHtml(src.replace("images/", ""))}</option>`).join("")}
                    </select>
                </div>
            </div>
            <label class="switch-row compact">
                <input type="checkbox" data-deal-field="showTimer" ${deal.showTimer ? "checked" : ""}>
                <span>Show countdown timer</span>
            </label>
        </div>
    `).join("") + `<div class="sticky-save"><button class="btn btn-primary btn-lg" type="button" id="save-deals-btn">Save Deals</button></div>`;

    // Selects need their value set after injection.
    data.deals.forEach((deal, index) => {
        const card = document.querySelector(`[data-deal-index="${index}"]`);
        card.querySelector('[data-deal-field="itemId"]').value = deal.itemId;
        const imageSelect = card.querySelector('[data-deal-field="image"]');
        if (!window.FlameData.STOCK_IMAGES.includes(deal.image)) {
            imageSelect.insertAdjacentHTML("beforeend", `<option value="${escapeHtml(deal.image)}">${escapeHtml(deal.image)}</option>`);
        }
        imageSelect.value = deal.image;
    });

    $("save-deals-btn").addEventListener("click", saveDeals);
}

function saveDeals() {
    data.deals.forEach((deal, index) => {
        const card = document.querySelector(`[data-deal-index="${index}"]`);
        card.querySelectorAll("[data-deal-field]").forEach(field => {
            const key = field.dataset.dealField;
            if (field.type === "checkbox") deal[key] = field.checked;
            else if (field.type === "number") deal[key] = parseFloat(field.value) || 0;
            else deal[key] = field.value.trim();
        });
    });

    persist("Deals updated.");
    renderDashboard();
}

/* --- Reviews editor ------------------------------------------------------- */
function renderReviewsEditor() {
    $("reviews-editor").innerHTML = data.reviews.length
        ? data.reviews.map((rev, index) => `
            <div class="admin-card review-row">
                <div class="review-row-main">
                    <div class="review-row-head">
                        <strong>${escapeHtml(rev.name)}</strong>
                        <span class="review-stars">${"★".repeat(Math.max(1, Math.min(5, rev.stars)))}</span>
                        <span class="pill pill-special">${escapeHtml(rev.tag)}</span>
                    </div>
                    <p>${escapeHtml(rev.comment)}</p>
                </div>
                <button class="btn btn-outline btn-sm btn-danger-ghost" type="button" data-review-index="${index}">Delete</button>
            </div>
        `).join("")
        : `<p class="empty-note">No reviews yet.</p>`;

    $("reviews-editor").querySelectorAll("[data-review-index]").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = Number(btn.dataset.reviewIndex);
            confirmThen(`Delete the review by ${data.reviews[index].name}?`, () => {
                data.reviews.splice(index, 1);
                persist("Review deleted.");
                renderReviewsEditor();
                renderDashboard();
            });
        });
    });
}

function initReviewsPanel() {
    $("add-review-btn").addEventListener("click", () => {
        data.reviews.unshift({
            name: "New Reviewer",
            stars: 5,
            tag: "Shawarma Wrap",
            comment: "Edit this review text, or delete it."
        });
        persist("Review added — edit it from the site's review form or here.");
        renderReviewsEditor();
        renderDashboard();
    });
}

/* --- Orders --------------------------------------------------------------- */
function renderOrders() {
    $("orders-list").innerHTML = data.orders.length
        ? data.orders.map(order => `
            <details class="admin-card order-row">
                <summary>
                    <span class="order-id">${escapeHtml(order.orderId)}</span>
                    <span class="order-name">${escapeHtml(order.name)}</span>
                    <span class="pill ${order.type === "pickup" ? "pill-halal" : "pill-special"}">${escapeHtml(order.type || "delivery")}</span>
                    <span class="order-total">${money(order.total)}</span>
                </summary>
                <div class="order-detail">
                    <p><strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
                    <p><strong>Address:</strong> ${escapeHtml(order.address)}</p>
                    <p><strong>Placed:</strong> ${escapeHtml(new Date(order.placedAt).toLocaleString())}</p>
                    <ul class="order-items">
                        ${(order.items || []).map(i =>
                            `<li><span>${i.qty}× ${escapeHtml(i.name)} <em>(${escapeHtml(i.size)})</em></span><span>${money(i.lineTotal)}</span></li>`).join("")}
                    </ul>
                    <p class="order-totals">
                        Subtotal ${money(order.subtotal)} ·
                        ${order.discount ? `Discount -${money(order.discount)} · ` : ""}
                        Tax ${money(order.tax)} ·
                        Delivery ${order.delivery ? money(order.delivery) : "FREE"} ·
                        <strong>Total ${money(order.total)}</strong>
                    </p>
                </div>
            </details>
        `).join("")
        : `<p class="empty-note">No orders recorded yet. Orders placed on the storefront in this browser show up here.</p>`;
}

function initOrdersPanel() {
    $("clear-orders-btn").addEventListener("click", () => {
        if (!data.orders.length) return showToast("There are no orders to clear.");
        confirmThen("Delete every recorded order? This cannot be undone.", () => {
            data.orders = [];
            persist("Orders cleared.");
            renderOrders();
            renderDashboard();
        }, "Clear orders");
    });
}

/* --- Settings ------------------------------------------------------------- */
function fillSettingsForm() {
    const s = data.settings;
    $("set-isopen").checked = !!s.isOpen;
    $("set-openstatus").value = s.openStatusText;
    $("set-address").value = s.address;
    $("set-phone1").value = s.phonePrimary;
    $("set-phone2").value = s.phoneSecondary;
    $("set-hours1").value = s.hoursWeekday;
    $("set-hours2").value = s.hoursWeekend;
    $("set-tax").value = s.taxRate;
    $("set-delivery").value = s.deliveryFee;
    $("set-threshold").value = s.freeDeliveryThreshold;
    $("set-passcode").value = s.adminPasscode;

    renderAnnouncementsEditor();
    renderPromosEditor();
}

function renderAnnouncementsEditor() {
    $("announcements-editor").innerHTML = data.settings.announcements.map((a, index) => `
        <div class="repeat-row" data-ann-index="${index}">
            <div class="field">
                <label class="sr-only">Message ${index + 1}</label>
                <input type="text" data-ann-field="text" value="${escapeHtml(a.text)}" placeholder="Message text" maxlength="120">
            </div>
            <div class="field narrow">
                <label class="sr-only">Highlighted code ${index + 1}</label>
                <input type="text" data-ann-field="highlight" value="${escapeHtml(a.highlight || "")}" placeholder="CODE (optional)" maxlength="20">
            </div>
            <button class="btn btn-outline btn-sm btn-danger-ghost" type="button" data-remove-ann="${index}" aria-label="Remove message ${index + 1}">&times;</button>
        </div>
    `).join("");

    $("announcements-editor").querySelectorAll("[data-remove-ann]").forEach(btn => {
        btn.addEventListener("click", () => {
            data.settings.announcements.splice(Number(btn.dataset.removeAnn), 1);
            renderAnnouncementsEditor();
        });
    });
}

function renderPromosEditor() {
    $("promos-editor").innerHTML = data.settings.promos.map((p, index) => `
        <div class="repeat-row" data-promo-index="${index}">
            <div class="field narrow">
                <label class="sr-only">Code ${index + 1}</label>
                <input type="text" data-promo-field="code" value="${escapeHtml(p.code)}" placeholder="CODE" maxlength="20">
            </div>
            <div class="field narrow">
                <label class="sr-only">Percent ${index + 1}</label>
                <input type="number" data-promo-field="percent" value="${p.percent}" min="0" max="100" placeholder="%">
            </div>
            <div class="field">
                <label class="sr-only">Message ${index + 1}</label>
                <input type="text" data-promo-field="label" value="${escapeHtml(p.label)}" placeholder="Confirmation message" maxlength="60">
            </div>
            <button class="btn btn-outline btn-sm btn-danger-ghost" type="button" data-remove-promo="${index}" aria-label="Remove promo ${index + 1}">&times;</button>
        </div>
    `).join("");

    $("promos-editor").querySelectorAll("[data-remove-promo]").forEach(btn => {
        btn.addEventListener("click", () => {
            data.settings.promos.splice(Number(btn.dataset.removePromo), 1);
            renderPromosEditor();
        });
    });
}

function initSettingsPanel() {
    $("add-announcement-btn").addEventListener("click", () => {
        readAnnouncementsFromForm();
        data.settings.announcements.push({ text: "New announcement", highlight: "" });
        renderAnnouncementsEditor();
    });

    $("add-promo-btn").addEventListener("click", () => {
        readPromosFromForm();
        data.settings.promos.push({ code: "NEWCODE", percent: 10, label: "10% discount applied!" });
        renderPromosEditor();
    });

    $("settings-form").addEventListener("submit", event => {
        event.preventDefault();

        const tax = parseFloat($("set-tax").value);
        const fee = parseFloat($("set-delivery").value);
        const threshold = parseFloat($("set-threshold").value);

        if (!Number.isFinite(tax) || tax < 0 || tax > 40) return showToast("Tax must be between 0 and 40%.", true);
        if (!Number.isFinite(fee) || fee < 0) return showToast("Delivery fee must be zero or more.", true);
        if (!Number.isFinite(threshold) || threshold < 0) return showToast("Free delivery threshold must be zero or more.", true);
        if (!$("set-passcode").value.trim()) return showToast("Passcode cannot be empty.", true);

        Object.assign(data.settings, {
            isOpen: $("set-isopen").checked,
            openStatusText: $("set-openstatus").value.trim(),
            address: $("set-address").value.trim(),
            phonePrimary: $("set-phone1").value.trim(),
            phoneSecondary: $("set-phone2").value.trim(),
            hoursWeekday: $("set-hours1").value.trim(),
            hoursWeekend: $("set-hours2").value.trim(),
            taxRate: tax,
            deliveryFee: fee,
            freeDeliveryThreshold: threshold,
            adminPasscode: $("set-passcode").value.trim()
        });

        readAnnouncementsFromForm();
        readPromosFromForm();

        persist("Settings saved.");
        renderDashboard();
    });
}

function readAnnouncementsFromForm() {
    data.settings.announcements = [...$("announcements-editor").querySelectorAll("[data-ann-index]")]
        .map(row => ({
            text: row.querySelector('[data-ann-field="text"]').value.trim(),
            highlight: row.querySelector('[data-ann-field="highlight"]').value.trim()
        }))
        .filter(a => a.text);
}

function readPromosFromForm() {
    data.settings.promos = [...$("promos-editor").querySelectorAll("[data-promo-index]")]
        .map(row => ({
            code: row.querySelector('[data-promo-field="code"]').value.trim().toUpperCase(),
            percent: parseFloat(row.querySelector('[data-promo-field="percent"]').value) || 0,
            label: row.querySelector('[data-promo-field="label"]').value.trim() || "Promo applied!"
        }))
        .filter(p => p.code);
}

/* --- Publish & backup ----------------------------------------------------- */
function download(filename, text, mime = "text/plain") {
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/** Rebuilds data.js with the current content baked in as the shipped defaults. */
function buildDataJs() {
    const json = key => JSON.stringify(data[key], null, 4);

    return `/* ==========================================================================
   FLAME & SIZZLE BISTRO - SHARED CONTENT STORE
   Generated by the admin console on ${new Date().toISOString()}.
   Replace data.js in your project with this file to publish these changes.
   ========================================================================== */

const STORAGE_KEY = "flame_sizzle_data";
const LEGACY_REVIEWS_KEY = "flame_sizzle_reviews";
const SCHEMA_VERSION = ${window.FlameData.SCHEMA_VERSION};

const DEFAULT_MENU = ${json("menu")};

const DEFAULT_DEALS = ${json("deals")};

const DEFAULT_SETTINGS = ${json("settings")};

const DEFAULT_REVIEWS = ${json("reviews")};

const MENU_CATEGORIES = ${JSON.stringify(window.FlameData.MENU_CATEGORIES, null, 4)};

const STOCK_IMAGES = ${JSON.stringify(window.FlameData.STOCK_IMAGES, null, 4)};

${STORE_RUNTIME_SOURCE}
`;
}

// The store runtime is identical between the shipped and generated file.
const STORE_RUNTIME_SOURCE = `function defaults() {
    return {
        version: SCHEMA_VERSION,
        menu: structuredClone(DEFAULT_MENU),
        deals: structuredClone(DEFAULT_DEALS),
        settings: structuredClone(DEFAULT_SETTINGS),
        reviews: structuredClone(DEFAULT_REVIEWS),
        orders: []
    };
}

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
    load() {
        let saved = null;
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) saved = JSON.parse(raw);
        } catch {
            saved = null;
        }

        const data = withDefaults(saved);

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

window.FlameData = FlameData;`;

function updateStorageUsage() {
    try {
        const bytes = new Blob([localStorage.getItem(window.FlameData.STORAGE_KEY) || ""]).size;
        $("storage-usage").textContent = bytes
            ? `Currently using ${(bytes / 1024).toFixed(1)} KB of browser storage.`
            : "No local edits stored — the site is showing shipped defaults.";
    } catch {
        $("storage-usage").textContent = "";
    }
}

function initDataPanel() {
    $("download-datajs-btn").addEventListener("click", () => {
        download("data.js", buildDataJs(), "text/javascript");
        showToast("data.js downloaded — commit it to publish.");
    });

    $("export-json-btn").addEventListener("click", () => {
        const stamp = new Date().toISOString().slice(0, 10);
        download(`flame-sizzle-backup-${stamp}.json`, JSON.stringify(data, null, 2), "application/json");
        showToast("Backup downloaded.");
    });

    $("import-json-input").addEventListener("change", event => {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            let parsed;
            try {
                parsed = JSON.parse(reader.result);
            } catch {
                showToast("That file is not valid JSON.", true);
                event.target.value = "";
                return;
            }

            if (!parsed || !Array.isArray(parsed.menu)) {
                showToast("That backup is missing its menu data.", true);
                event.target.value = "";
                return;
            }

            confirmThen("Replace all current content with this backup?", () => {
                // Round-trip through the store so the backup is merged against
                // current defaults and any missing fields are filled in.
                window.FlameData.save(parsed);
                data = window.FlameData.load();
                persist("Backup restored.");
                renderAll();
            }, "Restore");

            event.target.value = "";
        };
        reader.readAsText(file);
    });

    $("reset-data-btn").addEventListener("click", () => {
        confirmThen(
            "Discard every local edit and restore the content shipped in data.js?",
            () => {
                data = window.FlameData.reset();
                showToast("Reset to shipped defaults.");
                $("save-state").textContent = "";
                renderAll();
            },
            "Reset everything"
        );
    });
}

/* --- Confirm dialog ------------------------------------------------------- */
function initConfirm() {
    $("confirm-cancel").addEventListener("click", () => {
        confirmAction = null;
        closeAdminModal($("confirm-modal"));
    });

    $("confirm-ok").addEventListener("click", () => {
        const action = confirmAction;
        confirmAction = null;
        closeAdminModal($("confirm-modal"));
        if (action) action();
    });

    document.querySelectorAll(".admin-modal-overlay").forEach(overlay => {
        overlay.addEventListener("mousedown", event => {
            if (event.target === overlay) closeAdminModal(overlay);
        });
    });

    document.addEventListener("keydown", event => {
        if (event.key !== "Escape") return;
        const open = document.querySelector(".admin-modal-overlay:not([hidden])");
        if (open) closeAdminModal(open);
    });
}

/* --- Boot ----------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initMenuPanel();
    initItemEditor();
    initReviewsPanel();
    initOrdersPanel();
    initSettingsPanel();
    initDataPanel();
    initConfirm();
    initGate();
});
