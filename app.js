const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const state={category:'Cosmetics',subgroup:'all',search:'',limit:18,catalog:{},cart:JSON.parse(localStorage.getItem('jopeem-cart')||'[]'),number:localStorage.getItem('jopeem-number')||'256788570123',branch:localStorage.getItem('jopeem-branch')||'Nyanama Trading Centre'};
const escapeHtml=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wa=(text='Hello Jopeem Pharmacy, I would like some assistance.')=>`https://wa.me/${state.number}?text=${encodeURIComponent(text)}`;
function setWaLinks(){ $$('.wa-link').forEach(a=>a.href=wa()); }
function parseCatalog(md){
  ['Cosmetics','Sundries','Diagnostics','Medical Devices'].forEach((cat,i,all)=>{
    const start=md.indexOf(`### ${cat} (`), end=i<all.length-1?md.indexOf(`### ${all[i+1]} (`,start):md.length;
    const block=md.slice(start,end), groups={}; let group='All';
    block.split('\n').forEach(line=>{const h=line.match(/^#### (.+?) \(\d+\)$/);if(h){group=h[1];groups[group]=[]}else if(line.startsWith('- ')&&groups[group])groups[group].push(line.slice(2).trim())});
    state.catalog[cat]=groups;
  });
}
async function loadCatalog(){try{const md=await fetch('assets/source-data.md').then(r=>{if(!r.ok)throw Error();return r.text()});parseCatalog(md);renderCatalog()}catch(e){$('#product-grid').innerHTML='<p class="loading">Catalog preview needs a local web server. Please contact us on WhatsApp for availability.</p>'}}
function categoryItems(){return Object.entries(state.catalog[state.category]||{}).flatMap(([group,items])=>items.map(name=>({name,group,category:state.category}))).filter(x=>(state.subgroup==='all'||x.group===state.subgroup)&&x.name.toLowerCase().includes(state.search.toLowerCase()))}
function displayCategory(cat){return cat==="Sundries"?"Health Essentials":cat}
function categoryCardClass(cat){return {"Cosmetics":"product-cosmetics","Sundries":"product-health-essentials","Diagnostics":"product-diagnostics","Medical Devices":"product-medical-devices"}[cat]||"product-default"}
function displayGroup(group){const labels={"Skincare (Face & Body)":"Skincare","General Health & Miscellaneous":"General Health","Injection, IV & Catheter Supplies":"Injection & IV Supplies","Family Planning & Sexual Wellness":"Family Planning","Diapers & Incontinence":"Diapers & Incontinence"};return labels[group]||group}
function renderCatalog(){
  const groups=Object.keys(state.catalog[state.category]||{});
  const filter=$("#subgroup-filter");
  filter.innerHTML="<option value=\"all\">All</option>"+groups.map(g=>`<option value="${escapeHtml(g)}">${escapeHtml(displayGroup(g))}</option>`).join("");
  filter.value=state.subgroup;
  $("#subgroup-chips").innerHTML=[{value:"all",label:"All"},...groups.map(g=>({value:g,label:displayGroup(g)}))].map(x=>`<button type="button" data-subgroup="${encodeURIComponent(x.value)}" aria-pressed="${state.subgroup===x.value}">${escapeHtml(x.label)}</button>`).join("");
  $("#selected-category-title").textContent=displayCategory(state.category);
  const items=categoryItems(),shown=Math.min(state.limit,items.length);
  $("#result-count").textContent=items.length?`Showing ${shown} of ${items.length} products`:"No matching products";
  $("#product-grid").innerHTML=items.length?items.slice(0,state.limit).map(x=>`<article class="product-card ${categoryCardClass(x.category)}"><h3>${escapeHtml(x.name)}</h3><small>${escapeHtml(displayGroup(x.group))}</small><button data-add="${encodeURIComponent(x.name)}" data-group="${encodeURIComponent(x.category)}">Add Product</button></article>`).join(""):`<div class="catalog-empty"><b>No matching products found.</b><p>Try another search or ask our pharmacy team to help confirm availability.</p><a class="button button-outline wa-link" href="#">Ask our pharmacy team</a></div>`;
  $("#load-more").hidden=state.limit>=items.length;
  setWaLinks();
}
function saveCart(){localStorage.setItem('jopeem-cart',JSON.stringify(state.cart));renderCart()}
function renderCart(){const count=state.cart.reduce((n,x)=>n+x.qty,0);$$('.cart-count').forEach(x=>x.textContent=count);$('#cart-items').innerHTML=state.cart.length?state.cart.map((x,i)=>`<div class="cart-row"><b>${escapeHtml(x.name)}</b><div class="qty"><button data-qty="${i}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${i}" data-delta="1">+</button></div><button class="remove" data-remove="${i}">Remove</button></div>`).join(''):'<div class="cart-empty"><b>Your checkout is empty</b><p>Browse the catalog and add products for a quick WhatsApp enquiry.</p></div>';$('#start-checkout').disabled=!state.cart.length}
function showBagToast(name){const toast=document.querySelector("#bag-toast");if(!toast)return;toast.textContent=name+" added to checkout";toast.classList.remove("show");requestAnimationFrame(()=>toast.classList.add("show"));clearTimeout(showBagToast.timer);showBagToast.timer=setTimeout(()=>toast.classList.remove("show"),2600)}
function addItem(name,category){const found=state.cart.find(x=>x.name===name);found?found.qty++:state.cart.push({name,category,qty:1});saveCart();showBagToast(name)}
function closeCart(){document.body.classList.remove('cart-open','locked');$('.cart-drawer').setAttribute('aria-hidden','true')}
document.addEventListener('click',e=>{
  const add=e.target.closest("[data-add]");if(add)addItem(decodeURIComponent(add.dataset.add),decodeURIComponent(add.dataset.group));
  const subgroup=e.target.closest("[data-subgroup]");if(subgroup){state.subgroup=decodeURIComponent(subgroup.dataset.subgroup);state.limit=18;renderCatalog()}
  if(e.target.closest('[data-open-cart]')){document.body.classList.add('cart-open','locked');$('.cart-drawer').setAttribute('aria-hidden','false')}
  if(e.target.closest('[data-close-cart]'))closeCart();
  const qty=e.target.closest('[data-qty]');if(qty){const i=+qty.dataset.qty;state.cart[i].qty+=+qty.dataset.delta;if(state.cart[i].qty<1)state.cart.splice(i,1);saveCart()}
  const remove=e.target.closest('[data-remove]');if(remove){state.cart.splice(+remove.dataset.remove,1);saveCart()}
  const close=e.target.closest('[data-close-dialog]');if(close)close.closest('dialog').close();
  const branch=e.target.closest('[data-select-branch]');if(branch){state.branch=branch.dataset.selectBranch;state.number=branch.dataset.number;localStorage.setItem('jopeem-branch',state.branch);localStorage.setItem('jopeem-number',state.number);localStorage.setItem('jopeem-branch-set','1');setWaLinks();branch.closest('dialog').close()}
});
$$(".catalog-category-card").forEach(b=>b.onclick=()=>{$$(".catalog-category-card").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-selected","false")});b.classList.add("active");b.setAttribute("aria-selected","true");state.category=b.dataset.category;state.subgroup="all";state.search="";state.limit=18;$("#product-search").value="";renderCatalog();const results=$("#catalog-results"),reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;requestAnimationFrame(()=>results.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"}))});
$('#product-search').oninput=e=>{state.search=e.target.value;state.limit=18;renderCatalog()};$('#subgroup-filter').onchange=e=>{state.subgroup=e.target.value;state.limit=18;renderCatalog()};$('#load-more').onclick=()=>{state.limit+=18;renderCatalog()};
$('.menu-button').onclick=e=>{const open=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)};$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
$('#clear-cart').onclick=()=>{state.cart=[];saveCart()};$('#start-checkout').onclick=()=>{closeCart();$('#checkout-dialog').showModal()};
$('#checkout-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),items=state.cart.map(x=>`• ${x.name} × ${x.qty}`).join('\n');const msg=`Hello Jopeem Pharmacy, I would like to submit an order enquiry.\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nPreferred branch: ${d.get('branch')}\n\nItems:\n${items}\n\nNotes: ${d.get('notes')||'None'}\n\nPlease confirm prices and availability.`;window.open(wa(msg),'_blank','noopener')};
setWaLinks();renderCart();loadCatalog();
setTimeout(()=>{if(!localStorage.getItem('jopeem-branch-set'))$('#branch-dialog').showModal();else if(!sessionStorage.getItem('jopeem-consult-seen')){$('#consult-dialog').showModal();sessionStorage.setItem('jopeem-consult-seen','1')}},900);
$('#branch-dialog').addEventListener('close',()=>{if(!sessionStorage.getItem('jopeem-consult-seen'))setTimeout(()=>{$('#consult-dialog').showModal();sessionStorage.setItem('jopeem-consult-seen','1')},5000)});

const contactFab=$(".contact-fab"),contactMenu=$("#contact-menu"),contactBackdrop=$(".contact-panel-backdrop");
if(contactFab&&contactMenu){
  const contactClose=$(".contact-menu-close",contactMenu);
  const setContactMenu=(open,restoreFocus=true)=>{
    const wasOpen=contactMenu.classList.contains("open");
    if(open&&document.querySelector("dialog[open]"))return;
    if(open){
      closeCart();
      $("#nav").classList.remove("open");
      $(".menu-button").setAttribute("aria-expanded","false");
    }
    contactMenu.classList.toggle("open",open);
    contactBackdrop.classList.toggle("open",open);
    document.body.classList.toggle("contact-open",open);
    contactMenu.setAttribute("aria-hidden",String(!open));
    contactMenu.setAttribute("aria-modal","false");
    contactFab.setAttribute("aria-expanded",String(open));
    contactFab.setAttribute("aria-label",open?"Close Jopeem contact options":"Open Jopeem contact options");
    if(open)requestAnimationFrame(()=>contactClose.focus());
    else if(wasOpen&&restoreFocus)contactFab.focus();
  };
  contactFab.addEventListener("click",e=>{e.stopPropagation();setContactMenu(!contactMenu.classList.contains("open"))});
  contactMenu.addEventListener("click",e=>e.stopPropagation());
  $$("[data-contact-close]").forEach(el=>el.addEventListener("click",()=>setContactMenu(false)));
  $$(".contact-option",contactMenu).forEach(link=>link.addEventListener("click",()=>setContactMenu(false,false)));
  document.addEventListener("click",e=>{if(contactMenu.classList.contains("open")&&!e.target.closest(".contact-launcher"))setContactMenu(false,false)});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&contactMenu.classList.contains("open"))setContactMenu(false)});
}

const galleryPreview=document.querySelector("[data-gallery]");
if(galleryPreview&&"IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  galleryPreview.classList.add("gallery-will-animate");
  const galleryObserver=new IntersectionObserver(entries=>{
    if(entries[0].isIntersecting){galleryPreview.classList.add("gallery-visible");galleryObserver.disconnect()}
  },{threshold:.18,rootMargin:"0px 0px -8% 0px"});
  galleryObserver.observe(galleryPreview);
}

const medicineDialog=$("#medicine-dialog"),medicineForm=$("#medicine-enquiry-form");
if(medicineDialog&&medicineForm){
  $$(".medicine-enquiry-trigger").forEach(trigger=>trigger.addEventListener("click",event=>{
    event.preventDefault();
    medicineForm.reset();
    medicineForm.elements.branch.value=state.branch;
    medicineDialog.showModal();
    requestAnimationFrame(()=>medicineForm.elements.medicine.focus());
  }));
  medicineForm.addEventListener("submit",event=>{
    event.preventDefault();
    const details=new FormData(medicineForm);
    const medicine=String(details.get("medicine")||"").trim();
    const medicineFormValue=String(details.get("form")||"").trim();
    const branch=String(details.get("branch"));
    const number=branch==="Lebron Shopping Complex, Nalumunye"?"256777094870":"256788570123";
    const message=`Hello Jopeem Pharmacy, I would like to check medicine availability.\n\nMedicine: ${medicine}\nStrength/form: ${medicineFormValue||"Not specified"}\nPreferred branch: ${branch}\n\nPlease confirm availability and pricing.`;
    medicineDialog.close();
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`,"_blank","noopener");
  });
}
