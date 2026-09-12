(function () {
  const CATEGORY_META = {
    Cosmetics: { description: "Skincare, personal care and beauty products", image: "assets/images/cosmetics-category.jpg" },
    Sundries: { description: "Everyday health products", image: "assets/images/sundries-category.jpg" },
    Diagnostics: { description: "Testing and diagnostic supplies", image: "assets/images/diagnostics-category.jpg" },
    "Medical Devices": { description: "Healthcare equipment", image: "assets/images/medical-devices-category.jpg" }
  };
  const BRANCH_META = { "Nyanama Trading Centre": "Nyanama", "Lebron Shopping Complex, Nalumunye": "Nalumunye" };
  let active = null, lastFocused = null;
  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHtml = value => String(value).replace(/[&<>\"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
  function ensurePicker() {
    if (document.getElementById("jopeem-picker")) return;
    const picker = document.createElement("div"); picker.id = "jopeem-picker"; picker.className = "jopeem-picker"; picker.hidden = true;
    picker.innerHTML = `<div class="jopeem-picker-backdrop" data-picker-close></div><section class="jopeem-picker-panel" role="dialog" aria-modal="true" aria-labelledby="jopeem-picker-title"><div class="jopeem-picker-handle" aria-hidden="true"></div><div class="jopeem-picker-head"><div><p class="eyebrow">Jopeem selection</p><h2 id="jopeem-picker-title"></h2><p id="jopeem-picker-description"></p></div><button type="button" class="jopeem-picker-close" data-picker-close aria-label="Close">×</button></div><div class="jopeem-picker-options" id="jopeem-picker-options"></div></section>`;
    document.body.append(picker);
    picker.addEventListener("click", event => { if (event.target.closest("[data-picker-close]")) closePicker(); const option = event.target.closest("[data-picker-option]"); if (option && active) chooseOption(option.dataset.pickerOption); });
  }
  function selectKind(select) { if (select.id === "mobile-category") return "category"; if (select.id === "mobile-subcategory") return "subcategory"; if (select.dataset.assistantField === "branch" || select.name === "branch") return "branch"; if (select.id === "feedback-type") return "feedback"; return "branch"; }
  function optionDescription(value, kind) { if (kind === "category") return CATEGORY_META[value]?.description || "Browse Jopeem products"; if (kind === "branch") return BRANCH_META[value] || "Jopeem Pharmacy branch"; return ""; }
  function optionIcon(value, kind) { if (kind === "category" && CATEGORY_META[value]) return `<img src="${CATEGORY_META[value].image}" alt="">`; if (kind === "branch") return `<span class="jopeem-option-location" aria-hidden="true">⌖</span>`; return ""; }
  function syncTrigger(select) { const trigger = select.previousElementSibling; if (!trigger?.matches(".jopeem-select-trigger")) return; const option = [...select.options].find(item => item.value === select.value) || select.options[0]; trigger.querySelector(".jopeem-select-value").textContent = option ? option.textContent : "Choose an option"; trigger.setAttribute("aria-label", option ? option.textContent : "Choose an option"); trigger.setAttribute("aria-expanded", "false"); }
  function enhanceSelect(select) {
    if (!select || select.dataset.jopeemEnhanced === "true" || select.closest(".jopeem-picker")) return;
    select.dataset.jopeemEnhanced = "true"; const kind = selectKind(select); select.classList.add("jopeem-native-sync");
    const trigger = document.createElement("button"); trigger.type = "button"; trigger.className = "jopeem-select-trigger"; trigger.dataset.jopeemSelect = select.id || select.name || kind; trigger.setAttribute("aria-haspopup", "dialog"); trigger.innerHTML = `<span class="jopeem-select-value"></span><span class="jopeem-select-chevron" aria-hidden="true">⌄</span>`;
    select.parentNode.insertBefore(trigger, select); trigger.addEventListener("click", () => openPicker(select, trigger, kind)); select.addEventListener("change", () => syncTrigger(select)); syncTrigger(select);
  }
  function openPicker(select, trigger, kind) {
    ensurePicker(); lastFocused = trigger; active = { select, trigger, kind }; const picker = document.getElementById("jopeem-picker");
    const title = kind === "category" ? "Choose a category" : kind === "subcategory" ? "Choose a subcategory" : kind === "branch" ? "Choose your branch" : "Choose a topic";
    const description = kind === "category" ? "Browse Jopeem product categories" : kind === "branch" ? "Choose the Jopeem branch that works best for you" : "Select one option to continue";
    $("#jopeem-picker-title").textContent = title; $("#jopeem-picker-description").textContent = description;
    $("#jopeem-picker-options").innerHTML = [...select.options].map(option => { const selected = option.value === select.value, desc = option.dataset.description || optionDescription(option.value, kind); return `<button type="button" class="jopeem-picker-option ${selected ? "is-selected" : ""}" data-picker-option="${escapeHtml(option.value)}" aria-pressed="${selected}">${optionIcon(option.value, kind)}<span class="jopeem-picker-option-copy"><b>${escapeHtml(option.textContent)}</b>${desc ? `<small>${escapeHtml(desc)}</small>` : ""}</span><span class="jopeem-picker-option-mark" aria-hidden="true">${selected ? "✓" : "›"}</span></button>`; }).join("");
    picker.hidden = false; document.body.classList.add("jopeem-picker-open"); trigger.setAttribute("aria-expanded", "true"); requestAnimationFrame(() => $(".jopeem-picker-option", picker)?.focus());
  }
  function chooseOption(value) { if (!active) return; active.select.value = value; active.select.dispatchEvent(new Event("change", { bubbles: true })); closePicker(); }
  function closePicker() { const picker = document.getElementById("jopeem-picker"); if (!picker || picker.hidden) return; picker.hidden = true; document.body.classList.remove("jopeem-picker-open"); if (active?.trigger) active.trigger.setAttribute("aria-expanded", "false"); const restore = active?.trigger || lastFocused; active = null; if (restore && document.contains(restore)) restore.focus(); }
  function initSelectors(root = document) { root.querySelectorAll("select").forEach(enhanceSelect); }
  function initMegaMenu() {
    document.querySelectorAll(".site-header nav a").forEach(link => { if (!/products/i.test(link.textContent) || link.parentElement.classList.contains("jopeem-products-menu")) return; const wrapper = document.createElement("div"); wrapper.className = "jopeem-products-menu"; link.parentNode.insertBefore(wrapper, link); wrapper.append(link); const panel = document.createElement("div"); panel.className = "jopeem-products-mega"; panel.setAttribute("aria-label", "Shop by category"); panel.innerHTML = `<div class="jopeem-products-mega-head"><b>Shop by category</b><span>Explore our product categories</span></div><div class="jopeem-products-mega-grid">${Object.entries(CATEGORY_META).map(([key, meta]) => `<a href="products.html?category=${key === "Medical Devices" ? "medical-devices" : key.toLowerCase()}" class="jopeem-mega-card" data-category="${key}"><img src="${meta.image}" alt=""><span><b>${key === "Sundries" ? "Health Essentials" : key}</b><small>${meta.description}</small></span><i aria-hidden="true">›</i></a>`).join("")}<a href="#" class="jopeem-mega-card jopeem-mega-medicine medicine-enquiry-trigger"><span class="jopeem-mega-icon" aria-hidden="true">⌕</span><span><b>Find a Medicine</b><small>Ask our pharmacy team about availability</small></span><i aria-hidden="true">›</i></a></div><form class="jopeem-mega-search" action="products.html" method="get" role="search"><label for="jopeem-mega-product-search" data-i18n="products.search">Search products</label><div><input id="jopeem-mega-product-search" name="search" type="search" placeholder="Search by product name" data-i18n-placeholder="products.searchPlaceholder" autocomplete="off"><button type="submit" aria-label="Search products" data-i18n-aria-label="products.search">⌕</button></div></form>`; wrapper.append(panel); });
  }
  document.addEventListener("keydown", event => { if (event.key === "Escape" && active) closePicker(); });
  document.addEventListener("DOMContentLoaded", () => { initSelectors(); initMegaMenu(); new MutationObserver(() => initSelectors()).observe(document.body, { childList: true, subtree: true }); }, { once: true });
})();
