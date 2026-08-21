const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
const state={category:'Cosmetics',subgroup:'all',search:'',limit:18,catalog:{},cart:JSON.parse(localStorage.getItem('jopeem-cart')||'[]'),number:'256788570123',branch:'Nyanama Trading Centre'};
const BRANCHES={
  "Nyanama Trading Centre":{key:"nyanama",short:"Nyanama",hours:"7:00 AM–12 Midnight",notice:"Nyanama until 12 Midnight",phone:"256702774852",phoneDisplay:"0702 774 852",whatsapp:"256788570123",openMinutes:420,closeMinutes:1440,closeLabel:"12 Midnight"},
  "Lebron Shopping Complex, Nalumunye":{key:"nalumunye",short:"Nalumunye",hours:"7:00 AM–10:00 PM",notice:"Nalumunye until 10:00 PM",phone:"256756744345",phoneDisplay:"0756 744 345",whatsapp:"256777094870",openMinutes:420,closeMinutes:1320,closeLabel:"10:00 PM"}
};
const escapeHtml=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wa=(text='Hello Jopeem Pharmacy, I would like some assistance.')=>`https://wa.me/${state.number}?text=${encodeURIComponent(text)}`;
function setWaLinks(){ document.querySelectorAll(".wa-link").forEach(a=>a.href=wa()); document.querySelectorAll("[data-wa-message]").forEach(a=>a.href=wa(a.dataset.waMessage)); }
function applyBranch(name){
  const branchName=BRANCHES[name]?name:"Nyanama Trading Centre",config=BRANCHES[branchName];
  state.branch=branchName;state.number=config.whatsapp;
  const notice=document.querySelector("[data-notice-branch]");if(notice)notice.textContent=config.short;
  const heroBranch=$("[data-hero-branch]"),heroHours=$("[data-hero-hours]");
  if(heroBranch)heroBranch.textContent=branchName;
  $$("[data-branch-call]").forEach(link=>link.href=`tel:+${config.phone}`);
  const callText=$("[data-branch-call-text]");if(callText)callText.textContent=`Speak with our team · ${config.phoneDisplay}`;
  const closingBranch=$("[data-closing-branch]"),closingHours=$("[data-closing-hours]");
  if(closingBranch)closingBranch.textContent=branchName;if(closingHours)closingHours.textContent=config.hours;
  $$("form select[name=branch]").forEach(select=>select.value=branchName);
  $$("[data-branch-card]").forEach(card=>{
    const selected=card.dataset.branchCard===config.key;
    card.classList.toggle("selected-branch",selected);
    const label=$("[data-branch-label]",card);if(label)label.textContent=selected?"Preferred branch":card.dataset.branchCard==="nyanama"?"Main branch":"Other branch";
    const action=$(".branch-wa-link",card);if(action){action.classList.toggle("button-primary",selected);action.classList.toggle("button-outline",!selected);action.textContent=selected?"Message preferred branch":"Message this branch"}
  });
  $$("[data-select-branch]").forEach(button=>{const selected=button.dataset.selectBranch===branchName;button.classList.toggle("selected",selected);button.setAttribute("aria-pressed",String(selected))});
  setWaLinks();updateBranchStatus();
}
function parseCatalog(md){
  ['Cosmetics','Sundries','Diagnostics','Medical Devices'].forEach((cat,i,all)=>{
    const start=md.indexOf(`### ${cat} (`), end=i<all.length-1?md.indexOf(`### ${all[i+1]} (`,start):md.length;
    const block=md.slice(start,end), groups={}; let group='All';
    block.split('\n').forEach(line=>{const h=line.match(/^#### (.+?) \(\d+\)$/);if(h){group=h[1];groups[group]=[]}else if(line.startsWith('- ')&&groups[group])groups[group].push(line.slice(2).trim())});
    state.catalog[cat]=groups;
  });
}
async function loadCatalog(){try{const md=await fetch('assets/source-data.md').then(r=>{if(!r.ok)throw Error();return r.text()});parseCatalog(md);renderCatalog()}catch(e){$('#product-grid').innerHTML='<p class="loading">Catalog preview needs a local web server. Please contact us on WhatsApp for availability.</p>'}}
function categoryItems(){
  return Object.entries(state.catalog[state.category]||{}).flatMap(([group,items])=>items.map(item=>{
    const product=typeof item==="string"?{name:item}:item||{};
    return {name:String(product.name||""),group,category:state.category,image:String(product.image||product.imageUrl||"").trim()};
  })).filter(x=>(state.subgroup==="all"||x.group===state.subgroup)&&x.name.toLowerCase().includes(state.search.toLowerCase()));
}
function displayCategory(cat){return cat==="Sundries"?"Health Essentials":cat}
function categoryCardClass(cat){return {"Cosmetics":"product-cosmetics","Sundries":"product-health-essentials","Diagnostics":"product-diagnostics","Medical Devices":"product-medical-devices"}[cat]||"product-default"}
function displayGroup(group){const labels={"Skincare (Face & Body)":"Skincare","General Health & Miscellaneous":"General Health","Injection, IV & Catheter Supplies":"Injection & IV Supplies","Family Planning & Sexual Wellness":"Family Planning","Diapers & Incontinence":"Diapers & Incontinence"};return labels[group]||group}
function productVisualMeta(category,group){
  const value=`${category} ${group}`.toLowerCase();
  let motif="orbits";
  if(/skin|lip|soap|body|deodorant|shaving|hair/i.test(value))motif="curves";
  else if(/baby|diaper|wipe|feminine/i.test(value))motif="soft-dots";
  else if(/oral|ppe|hygiene|wound|dressing|first aid/i.test(value))motif="grid";
  else if(/diagnostic|test|laboratory|monitor/i.test(value))motif="measure";
  else if(/device|orthopedic|support|catheter|injection|iv|suture/i.test(value))motif="technical";
  const theme={Cosmetics:"cosmetics",Sundries:"essentials",Diagnostics:"diagnostics","Medical Devices":"devices"}[category]||"essentials";
  const shown=displayGroup(group);
  const label=shown.length<=24?shown:displayCategory(category);
  return {theme,motif,label};
}
function productVisual(product){
  const meta=productVisualMeta(product.category,product.group);
  const image=product.image?`<img data-product-image src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy">`:"";
  return `<div class="product-visual visual-theme-${meta.theme} motif-${meta.motif}${product.image?" has-image":""}"><div class="product-visual-placeholder" aria-hidden="true"><span class="product-visual-shape"></span><small>${escapeHtml(meta.label)}</small></div>${image}</div>`;
}

function renderCatalog(){
  const groups=Object.keys(state.catalog[state.category]||{});
  const filter=$("#subgroup-filter");
  filter.innerHTML="<option value=\"all\">All</option>"+groups.map(g=>`<option value="${escapeHtml(g)}">${escapeHtml(displayGroup(g))}</option>`).join("");
  filter.value=state.subgroup;
  $("#subgroup-chips").innerHTML=[{value:"all",label:"All"},...groups.map(g=>({value:g,label:displayGroup(g)}))].map(x=>`<button type="button" data-subgroup="${encodeURIComponent(x.value)}" aria-pressed="${state.subgroup===x.value}">${escapeHtml(x.label)}</button>`).join("");
  $("#selected-category-title").textContent=displayCategory(state.category);
  const items=categoryItems(),shown=Math.min(state.limit,items.length);
  $("#result-count").textContent=items.length?`Showing ${shown} of ${items.length} products`:"No matching products";
  const grid=$("#product-grid");
  grid.innerHTML=items.length?items.slice(0,state.limit).map(x=>`<article class="product-card ${categoryCardClass(x.category)}">${productVisual(x)}<h3 title="${escapeHtml(x.name)}">${escapeHtml(x.name)}</h3><small class="product-subgroup">${escapeHtml(displayGroup(x.group))}</small><button data-add="${encodeURIComponent(x.name)}" data-group="${encodeURIComponent(x.category)}">Add Product</button></article>`).join(""):`<div class="catalog-empty"><b>No matching products found.</b><p>Try another search or ask our pharmacy team to help confirm availability.</p><a class="button button-outline wa-link" href="#">Ask our pharmacy team</a></div>`;
  grid.querySelectorAll("[data-product-image]").forEach(img=>img.addEventListener("error",()=>{const visual=img.closest(".product-visual");if(visual)visual.classList.remove("has-image");img.remove()},{once:true}));
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
  const branch=e.target.closest("[data-select-branch]");if(branch){applyBranch(branch.dataset.selectBranch);branch.closest("dialog").close()}
  const openBranch=e.target.closest("[data-open-branch]");if(openBranch){const dialog=document.querySelector("#branch-dialog");applyBranch(state.branch);if(!dialog.open)dialog.showModal()}
  const composerTrigger=e.target.closest("[data-wa-compose]");if(composerTrigger){e.preventDefault();openWhatsAppComposer(composerTrigger.dataset.waContext||"general")}
});
$$(".catalog-category-card").forEach(b=>b.onclick=()=>{$$(".catalog-category-card").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-selected","false")});b.classList.add("active");b.setAttribute("aria-selected","true");state.category=b.dataset.category;state.subgroup="all";state.search="";state.limit=18;$("#product-search").value="";renderCatalog();const results=$("#catalog-results"),reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;requestAnimationFrame(()=>results.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"}))});
$('#product-search').oninput=e=>{state.search=e.target.value;state.limit=18;renderCatalog()};$('#subgroup-filter').onchange=e=>{state.subgroup=e.target.value;state.limit=18;renderCatalog()};$('#load-more').onclick=()=>{state.limit+=18;renderCatalog()};
$('.menu-button').onclick=e=>{const open=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)};$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
document.querySelector("#clear-cart").onclick=()=>{state.cart=[];saveCart()};document.querySelector("#start-checkout").onclick=()=>{closeCart();document.querySelector("#checkout-form").elements.branch.value=state.branch;document.querySelector("#checkout-dialog").showModal()};
$('#checkout-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),items=state.cart.map(x=>`• ${x.name} × ${x.qty}`).join('\n');const msg=`Hello Jopeem Pharmacy, I would like to submit an order enquiry.\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nPreferred branch: ${d.get('branch')}\n\nItems:\n${items}\n\nNotes: ${d.get('notes')||'None'}\n\nPlease confirm prices and availability.`;window.open(wa(msg),'_blank','noopener')};
applyBranch(state.branch);renderCart();loadCatalog();setInterval(updateBranchStatus,1000);
setTimeout(()=>document.querySelector("#branch-dialog").showModal(),900);

const whatsappComposer=document.querySelector("#whatsapp-composer"),whatsappComposerForm=document.querySelector("#whatsapp-composer-form");
const composerMessages={general:"Hello Jopeem Pharmacy, I would like some assistance.",help:"Hello Jopeem Pharmacy, I need help finding a medicine or choosing the appropriate pharmacy service."};
function updateComposerPreview(){const message=whatsappComposerForm.elements.message.value;document.querySelector("[data-message-preview]").textContent=message;document.querySelector("[data-message-count]").textContent=message.length}
function openWhatsAppComposer(context){
  const openDialog=document.querySelector("dialog[open]");if(openDialog)openDialog.close();
  closeCart();whatsappComposerForm.elements.branch.value=state.branch;whatsappComposerForm.elements.message.value=composerMessages[context]||composerMessages.general;updateComposerPreview();whatsappComposer.showModal();
}
whatsappComposerForm.elements.message.addEventListener("input",updateComposerPreview);
whatsappComposerForm.elements.branch.addEventListener("change",event=>applyBranch(event.target.value));
whatsappComposerForm.addEventListener("submit",event=>{event.preventDefault();const message=whatsappComposerForm.elements.message.value.trim();if(!message)return;whatsappComposer.close();window.open(wa(message),"_blank","noopener")});

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


const productEnquiryDialog=document.querySelector("#product-enquiry-dialog"),productEnquiryForm=document.querySelector("#product-enquiry-form");
if(productEnquiryDialog&&productEnquiryForm){
  document.querySelectorAll(".product-enquiry-trigger").forEach(trigger=>trigger.addEventListener("click",()=>{
    productEnquiryForm.reset();
    productEnquiryForm.elements.branch.value=state.branch;
    productEnquiryDialog.showModal();
  }));
  productEnquiryForm.addEventListener("submit",event=>{
    event.preventDefault();
    const details=new FormData(productEnquiryForm);
    const product=String(details.get("product")||"").trim();
    const productDetails=String(details.get("details")||"").trim();
    const branch=String(details.get("branch"));
    const number=branch==="Lebron Shopping Complex, Nalumunye"?"256777094870":"256788570123";
    const message=`Hello Jopeem Pharmacy, I would like to check product availability.\n\nProduct: ${product}\nSize, brand or details: ${productDetails||"Not specified"}\nPreferred branch: ${branch}\n\nPlease confirm availability and pricing.`;
    productEnquiryDialog.close();
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`,"_blank","noopener");
  });
}


function kampalaSeconds(){
  const parts=new Intl.DateTimeFormat("en-GB",{timeZone:"Africa/Kampala",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).formatToParts(new Date());
  const hour=Number(parts.find(part=>part.type==="hour").value);
  const minute=Number(parts.find(part=>part.type==="minute").value);
  const second=Number(parts.find(part=>part.type==="second").value);
  return hour*3600+minute*60+second;
}
function remainingTime(totalSeconds){
  const hours=Math.floor(totalSeconds/3600);
  const minutes=Math.floor((totalSeconds%3600)/60);
  const seconds=totalSeconds%60;
  return `${hours?`${hours}h `:""}${minutes?`${minutes}m `:""}${seconds}s`;
}
function updateBranchStatus(){
  const config=BRANCHES[state.branch]||BRANCHES["Nyanama Trading Centre"];
  const seconds=kampalaSeconds();
  const openSeconds=config.openMinutes*60,closeSeconds=config.closeMinutes*60;
  const isOpen=seconds>=openSeconds&&seconds<closeSeconds;
  const compact=window.matchMedia("(max-width: 520px)").matches;
  const untilOpen=seconds<openSeconds?openSeconds-seconds:86400-seconds+openSeconds;
  const status=isOpen
    ?(compact?`Open · ${config.closeLabel} · ${remainingTime(closeSeconds-seconds)} left`:`Open now · Closes at ${config.closeLabel} · ${remainingTime(closeSeconds-seconds)} left`)
    :(compact?`Closed · 7:00 AM · ${remainingTime(untilOpen)} left`:`Closed · Opens at 7:00 AM · ${remainingTime(untilOpen)} left`);
  const noticeStatus=document.querySelector("[data-notice-status]");
  const heroHours=document.querySelector("[data-hero-hours]");
  const dot=document.querySelector("[data-notice-dot]");
  if(noticeStatus)noticeStatus.textContent=status;
  if(heroHours)heroHours.textContent=status;
  if(dot)dot.classList.toggle("is-closed",!isOpen);
}
