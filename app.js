const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
function readStoredCart(){try{const value=JSON.parse(localStorage.getItem('jopeem-cart')||'[]');return Array.isArray(value)?value:[]}catch{return[]}}
const state={category:'Cosmetics',subgroup:'all',search:'',limit:18,catalog:{},cart:readStoredCart(),number:'256788570123',branch:'Nyanama Trading Centre'};
const BRANCHES={
  "Nyanama Trading Centre":{key:"nyanama",short:"Nyanama",hours:"7:00 AM–12 Midnight",notice:"Nyanama until 12 Midnight",phone:"256702774852",phoneDisplay:"0702 774 852",whatsapp:"256788570123",openMinutes:420,closeMinutes:1440,closeLabel:"12 Midnight",lat:0.27092,lng:32.55366,mapEmbedUrl:"https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3989.7737160787146!2d32.55108507766623!3d0.2709253640879764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwMTYnMTUuMyJOIDMywrAzMycxMy4yIkU!5e0!3m2!1sen!2sug!4v1788962420904!5m2!1sen!2sug"},
  "Lebron Shopping Complex, Nalumunye":{key:"nalumunye",short:"Nalumunye",hours:"7:00 AM–10:00 PM",notice:"Nalumunye until 10:00 PM",phone:"256756744345",phoneDisplay:"0756 744 345",whatsapp:"256777094870",openMinutes:420,closeMinutes:1320,closeLabel:"10:00 PM",lat:0.26641,lng:32.53006,mapEmbedUrl:"https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3989.7751887389795!2d32.527485077666256!3d0.2664153640945249!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMMKwMTUnNTkuMSJOIDMywrAzMSc0OC4yIkU!5e0!3m2!1sen!2sug!4v1788962294353!5m2!1sen!2sug"}
};
const escapeHtml=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PREFERENCES_KEY='jopeem-preferences',PREFERENCES_VERSION=1,SAFE_PREFERENCE_CATEGORIES=new Set(['Cosmetics']),SAFE_PREFERENCE_GROUPS=new Set(['Shaving','Oral Care']);
const preferenceDefaults=()=>({version:PREFERENCES_VERSION,enabled:null,preferredBranch:'',categories:{},subgroups:{},recentItems:[],updatedAt:0});
function loadPreferences(){
  const fallback=preferenceDefaults();
  try{
    const raw=JSON.parse(localStorage.getItem(PREFERENCES_KEY)||'null');
    if(!raw||raw.version!==PREFERENCES_VERSION)return fallback;
    const result={...fallback,...raw,categories:{...(raw.categories||{})},subgroups:{...(raw.subgroups||{})},recentItems:Array.isArray(raw.recentItems)?raw.recentItems.slice(0,6):[]};
    Object.keys(result.categories).forEach(key=>{if(!SAFE_PREFERENCE_CATEGORIES.has(key))delete result.categories[key]});
    Object.keys(result.subgroups).forEach(key=>{if(!SAFE_PREFERENCE_GROUPS.has(key))delete result.subgroups[key]});
    if(result.enabled===false)result.preferredBranch='';
    result.recentItems=result.recentItems.filter(item=>(item&&SAFE_PREFERENCE_CATEGORIES.has(item.category))||(item&&SAFE_PREFERENCE_GROUPS.has(item.group))).slice(0,6);
    return result;
  }catch{return fallback}
}
let preferences=loadPreferences(),pendingPreferenceSignal=null;
if(preferences.preferredBranch&&BRANCHES[preferences.preferredBranch])state.branch=preferences.preferredBranch;
function savePreferences(){try{preferences.updatedAt=Date.now();localStorage.setItem(PREFERENCES_KEY,JSON.stringify(preferences))}catch{}}
function preferenceEnabled(){return preferences.enabled===true}
function isSafeProduct(category,group){return SAFE_PREFERENCE_CATEGORIES.has(category)||(category==='Sundries'&&SAFE_PREFERENCE_GROUPS.has(group))}
function ageScore(entry){const days=Math.max(0,(Date.now()-(entry.updatedAt||Date.now()))/86400000);return Math.max(0,Number(entry.score||0)*Math.pow(.85,days/30))}
function preferenceSignal(signal){
  if(!signal||!isSafeProduct(signal.category,signal.group))return;
  if(!preferenceEnabled()){
    if(preferences.enabled===null){pendingPreferenceSignal=signal;window.__jopeemPendingPreferenceSignal=signal;showPreferencePrompt()}
    return;
  }
  const bucket=signal.type==='category'?preferences.categories:preferences.subgroups;
  const key=signal.type==='category'?signal.category:signal.group;
  if(signal.type==='product'){
    const existing=preferences.recentItems.filter(item=>item.name!==signal.name);
    preferences.recentItems=[{name:signal.name,category:signal.category,group:signal.group,updatedAt:Date.now()},...existing].slice(0,6);
  }else{
    const current=bucket[key]||{score:0,updatedAt:0};
    bucket[key]={category:signal.category,score:Math.min(20,ageScore(current)+signal.weight),updatedAt:Date.now()};
  }
  savePreferences();renderQuickAccess();
}
function recordCategoryInterest(category){if(SAFE_PREFERENCE_CATEGORIES.has(category))preferenceSignal({type:'category',category,group:'',weight:1})}
function recordSubgroupInterest(category,group){if(group!=='all'&&isSafeProduct(category,group))preferenceSignal({type:'subgroup',category,group,weight:1.5})}
function recordProductInterest(product){if(isSafeProduct(product.category,product.group))preferenceSignal({type:'product',category:product.category,group:product.group,name:product.name,weight:3})}
function showPreferencePrompt(){
  const area=$('#quick-access'),items=$('#quick-access-items');
  if(!area||preferences.enabled!==null)return;
  area.hidden=false;
  items.innerHTML='<div class="quick-access-prompt"><b>Make future visits quicker?</b><p>We can remember safe browsing preferences on this device only. <button type="button" class="text-button" id="prompt-enable">Allow</button> <button type="button" class="text-button" id="prompt-decline">No thanks</button></p></div>';
}
function activatePreferences(){
  preferences.enabled=true;savePreferences();
  const signal=window.__jopeemPendingPreferenceSignal;
  window.__jopeemPendingPreferenceSignal=null;pendingPreferenceSignal=null;
  renderQuickAccess();
  if(signal)preferenceSignal(signal);
  const dialog=$('#preferences-dialog');if(dialog&&dialog.open)dialog.close();
}
function disablePreferences(){preferences.enabled=false;preferences.preferredBranch='';pendingPreferenceSignal=null;window.__jopeemPendingPreferenceSignal=null;savePreferences();renderQuickAccess();const dialog=$('#preferences-dialog');if(dialog&&dialog.open)dialog.close()}
function clearPreferences(){
  try{localStorage.removeItem(PREFERENCES_KEY)}catch{}
  preferences=preferenceDefaults();pendingPreferenceSignal=null;window.__jopeemPendingPreferenceSignal=null;state.branch='Nyanama Trading Centre';applyBranch(state.branch,false);renderQuickAccess();updatePreferencesDialog()
}
function renderQuickAccess(){
  const area=$('#quick-access'),items=$('#quick-access-items');
  if(!area||!items)return;
  if(preferences.enabled!==true){area.hidden=true;return}
  const categories=Object.entries(preferences.categories).map(([key,value])=>({key,score:ageScore(value)})).filter(x=>x.score>.2).sort((a,b)=>b.score-a.score).slice(0,2);
  const groups=Object.entries(preferences.subgroups).map(([key,value])=>({key,category:value.category||'Sundries',score:ageScore(value)})).filter(x=>x.score>.2).sort((a,b)=>b.score-a.score).slice(0,2);
  const recent=preferences.recentItems.slice(0,6),cards=[];
  if(preferences.preferredBranch&&BRANCHES[preferences.preferredBranch])cards.push('<button type="button" class="quick-access-card" data-quick-branch="'+escapeHtml(preferences.preferredBranch)+'"><small>Your usual branch</small><b>'+escapeHtml(BRANCHES[preferences.preferredBranch].short)+'</b><span>Use this branch</span></button>');
  categories.forEach(x=>cards.push('<button type="button" class="quick-access-card" data-quick-category="'+escapeHtml(x.key)+'"><small>Category</small><b>'+escapeHtml(displayCategory(x.key))+'</b><span>Open this category</span></button>'));
  groups.forEach(x=>cards.push('<button type="button" class="quick-access-card" data-quick-category="'+escapeHtml(x.category)+'" data-quick-group="'+escapeHtml(x.key)+'"><small>Subgroup</small><b>'+escapeHtml(displayGroup(x.key))+'</b><span>Browse this subgroup</span></button>'));
  recent.forEach(x=>cards.push('<button type="button" class="quick-access-card" data-quick-product="'+escapeHtml(x.name)+'" data-quick-category="'+escapeHtml(x.category)+'" data-quick-group="'+escapeHtml(x.group)+'"><small>Recent interest</small><b>'+escapeHtml(x.name)+'</b><span>'+escapeHtml(displayCategory(x.category))+' · '+escapeHtml(displayGroup(x.group))+'</span></button>'));
  if(!cards.length){area.hidden=true;return}
  area.hidden=false;items.innerHTML=cards.join('');
}
function openCatalogContext(category,group='all',search=''){
  const validCategory=state.catalog[category]?category:'Cosmetics';
  state.category=validCategory;state.subgroup=group||'all';state.search=search||'';state.limit=18;
  $$('.catalog-category-card').forEach(button=>{const active=button.dataset.category===validCategory;button.classList.toggle('active',active);button.setAttribute('aria-selected',String(active))});
  const input=$('#product-search');if(input)input.value=state.search;
  renderCatalog();
  const results=$('#catalog-results'),reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  requestAnimationFrame(()=>results&&results.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'}));
}
function updatePreferencesDialog(){
  const dialog=$('#preferences-dialog'),status=$('#preferences-state'),enable=$('#enable-preferences'),disable=$('#disable-preferences');
  if(!dialog||!status)return;
  if(preferences.enabled===true){status.textContent='Personalization is on for this device.';enable.hidden=true;disable.hidden=false}
  else if(preferences.enabled===false){status.textContent='Personalization is disabled. The catalog and checkout still work normally.';enable.hidden=false;disable.hidden=true}
  else{status.textContent='No browsing preferences have been saved yet.';enable.hidden=false;disable.hidden=false}
}
function openPreferences(){const dialog=$('#preferences-dialog');if(dialog){updatePreferencesDialog();dialog.showModal()}}
function maybeShowPreferenceDialog(){const dialog=$('#preferences-dialog'),branchDialog=$('#branch-dialog');if(!dialog||preferences.enabled===true||dialog.open)return;if(branchDialog&&branchDialog.open){setTimeout(maybeShowPreferenceDialog,350);return}updatePreferencesDialog();dialog.showModal()}

const wa=(text='Hello Jopeem Pharmacy, I would like some assistance.')=>`https://wa.me/${state.number}?text=${encodeURIComponent(text)}`;
function setWaLinks(){ document.querySelectorAll(".wa-link").forEach(a=>a.href=wa()); document.querySelectorAll("[data-wa-message]").forEach(a=>a.href=wa(a.dataset.waMessage)); }
function applyBranch(name,remember=false){
  const branchName=BRANCHES[name]?name:"Nyanama Trading Centre",config=BRANCHES[branchName];
  state.branch=branchName;state.number=config.whatsapp;if(remember&&preferenceEnabled()){preferences.preferredBranch=branchName;savePreferences();renderQuickAccess()}
  const notice=document.querySelector("[data-notice-branch]");if(notice)notice.textContent=config.short;
  const heroBranch=$("[data-hero-branch]"),heroHours=$("[data-hero-hours]");
  if(heroBranch)heroBranch.textContent=branchName;
  $$("[data-branch-call]").forEach(link=>link.href=`tel:+${config.phone}`);
  const callText=document.querySelector("[data-branch-call-text]");if(callText)callText.textContent=config.key==="nyanama"?"Choose Airtel or MTN":"Speak with our team · "+config.phoneDisplay;
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
  if(branchMapController)focusBranchOnMap(branchName);
}
let branchMapController=null;
function branchDirectionsUrl(branch){
  return "https://www.google.com/maps/dir/?api=1&destination="+encodeURIComponent(branch.lat+","+branch.lng)+"&travelmode=driving";
}
function branchMapEmbedUrl(branch){
  return branch.mapEmbedUrl;
}
function setFocusedBranchCard(name){
  $$("[data-branch-card]").forEach(card=>{
    const branchName=Object.keys(BRANCHES).find(key=>BRANCHES[key].key===card.dataset.branchCard);
    card.classList.toggle("map-focused",branchName===name);
  });
  $$("[data-map-branch]").forEach(button=>{
    const active=button.dataset.mapBranch===BRANCHES[name]?.key;
    button.classList.toggle("active",active);
    button.setAttribute("aria-pressed",String(active));
  });
}
function updateBranchMap(name){
  const branch=BRANCHES[name],frame=$("#branch-map-frame"),status=$("#branch-map-status");
  if(!branch||!frame)return;
  setFocusedBranchCard(name);
  const nextUrl=branchMapEmbedUrl(branch);
  if(frame.src!==nextUrl)frame.src=nextUrl;
  frame.title="Jopeem Pharmacy "+name+" map";
  const directions=$(".branch-directions",$$("[data-branch-card]").find(card=>card.dataset.branchCard===branch.key));
  if(directions)directions.href=branchDirectionsUrl(branch);
  if(status)status.textContent="Showing "+name+" · "+branch.hours+".";
}
function focusBranchOnMap(name){
  if(branchMapController)branchMapController.focus(name);
}
function initBranchMap(){
  const frame=$("#branch-map-frame"),status=$("#branch-map-status");
  if(!frame)return;
  const initialName=Object.keys(BRANCHES).find(name=>BRANCHES[name].key===state.branch)||"Nyanama Trading Centre";
  frame.addEventListener("error",()=>{
    if(status)status.textContent="The map is unavailable right now. Branch details and directions remain available below.";
  });
  $$("[data-map-branch]").forEach(button=>{
    button.addEventListener("click",()=>focusBranchOnMap(button.dataset.mapBranch==="nalumunye"?"Lebron Shopping Complex, Nalumunye":"Nyanama Trading Centre"));
  });
  $$("[data-branch-card]").forEach(card=>{
    const name=Object.keys(BRANCHES).find(key=>BRANCHES[key].key===card.dataset.branchCard);
    if(name)card.addEventListener("click",event=>{
      if(event.target.closest("a,button"))return;
      focusBranchOnMap(name);
    });
  });
  branchMapController={focus:updateBranchMap};
  updateBranchMap(initialName);
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
function saveCart(){try{localStorage.setItem('jopeem-cart',JSON.stringify(state.cart))}catch{}renderCart()}
function renderCart(){const count=state.cart.reduce((n,x)=>n+x.qty,0);$$('.cart-count').forEach(x=>x.textContent=count);$('#cart-items').innerHTML=state.cart.length?state.cart.map((x,i)=>`<div class="cart-row"><b>${escapeHtml(x.name)}</b><div class="qty"><button data-qty="${i}" data-delta="-1">−</button><span>${x.qty}</span><button data-qty="${i}" data-delta="1">+</button></div><button class="remove" data-remove="${i}">Remove</button></div>`).join(''):'<div class="cart-empty"><b>Your checkout is empty</b><p>Browse the catalog and add products for a quick WhatsApp enquiry.</p></div>';$('#start-checkout').disabled=!state.cart.length}
function showBagToast(name){const toast=document.querySelector("#bag-toast");if(!toast)return;toast.textContent=name+" added to checkout";toast.classList.remove("show");requestAnimationFrame(()=>toast.classList.add("show"));clearTimeout(showBagToast.timer);showBagToast.timer=setTimeout(()=>toast.classList.remove("show"),2600)}
function addItem(name,category){const found=state.cart.find(x=>x.name===name);found?found.qty++:state.cart.push({name,category,qty:1});saveCart();showBagToast(name)}
function closeCart(){document.body.classList.remove('cart-open','locked');$('.cart-drawer').setAttribute('aria-hidden','true')}
document.addEventListener('click',e=>{
  const add=e.target.closest("[data-add]");if(add){const productName=decodeURIComponent(add.dataset.add),productCategory=decodeURIComponent(add.dataset.group),product=categoryItems().find(item=>item.name===productName&&item.category===productCategory);addItem(productName,productCategory);if(product)preferenceSignal({type:"product",category:product.category,group:product.group,name:product.name,weight:3})}
  const subgroup=e.target.closest("[data-subgroup]");if(subgroup){state.subgroup=decodeURIComponent(subgroup.dataset.subgroup);state.limit=18;renderCatalog();recordSubgroupInterest(state.category,state.subgroup)}
  if(e.target.closest('[data-open-cart]')){document.body.classList.add('cart-open','locked');$('.cart-drawer').setAttribute('aria-hidden','false')}
  if(e.target.closest('[data-close-cart]'))closeCart();
  const qty=e.target.closest('[data-qty]');if(qty){const i=+qty.dataset.qty;state.cart[i].qty+=+qty.dataset.delta;if(state.cart[i].qty<1)state.cart.splice(i,1);saveCart()}
  const remove=e.target.closest('[data-remove]');if(remove){state.cart.splice(+remove.dataset.remove,1);saveCart()}
  const close=e.target.closest('[data-close-dialog]');if(close)close.closest('dialog').close();
  const branch=e.target.closest("[data-select-branch]");if(branch){applyBranch(branch.dataset.selectBranch,true);branch.closest("dialog").close()}
  const quick=e.target.closest("[data-quick-category],[data-quick-group],[data-quick-product],[data-quick-branch]");if(quick){if(quick.dataset.quickBranch){applyBranch(quick.dataset.quickBranch,true);document.querySelector("#contact").scrollIntoView({behavior:"smooth",block:"start"})}else if(quick.dataset.quickProduct){openCatalogContext(quick.dataset.quickCategory,quick.dataset.quickGroup,quick.dataset.quickProduct)}else if(quick.dataset.quickGroup){openCatalogContext(quick.dataset.quickCategory,quick.dataset.quickGroup)}else if(quick.dataset.quickCategory){openCatalogContext(quick.dataset.quickCategory)}}
  if(e.target.closest("#prompt-enable")){activatePreferences()}
  if(e.target.closest("#prompt-decline")){disablePreferences()}
  if(e.target.closest("#open-preferences")||e.target.closest("#open-preferences-footer")){openPreferences()}
  if(e.target.closest("#enable-preferences")){activatePreferences()}
  if(e.target.closest("#disable-preferences")){disablePreferences()}
  if(e.target.closest("#clear-preferences")){clearPreferences()}
  const openBranch=e.target.closest("[data-open-branch]");if(openBranch){const dialog=document.querySelector("#branch-dialog");applyBranch(state.branch);if(!dialog.open)dialog.showModal()}
  const composerTrigger=e.target.closest("[data-wa-compose]");if(composerTrigger){e.preventDefault();openWhatsAppComposer(composerTrigger.dataset.waContext||"general")}
});
$$(".catalog-category-card").forEach(b=>b.onclick=()=>{$$(".catalog-category-card").forEach(x=>{x.classList.remove("active");x.setAttribute("aria-selected","false")});b.classList.add("active");b.setAttribute("aria-selected","true");state.category=b.dataset.category;state.subgroup="all";recordCategoryInterest(state.category);state.search="";state.limit=18;$("#product-search").value="";renderCatalog();const results=$("#catalog-results"),reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;requestAnimationFrame(()=>results.scrollIntoView({behavior:reduceMotion?"auto":"smooth",block:"start"}))});
$('#product-search').oninput=e=>{state.search=e.target.value;state.limit=18;renderCatalog()};$('#subgroup-filter').onchange=e=>{state.subgroup=e.target.value;state.limit=18;renderCatalog();recordSubgroupInterest(state.category,state.subgroup)};$('#load-more').onclick=()=>{state.limit+=18;renderCatalog()};
$('.menu-button').onclick=e=>{const open=$('#nav').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',open)};$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
document.querySelector("#clear-cart").onclick=()=>{state.cart=[];saveCart()};
document.querySelector("#branch-dialog")?.addEventListener("close",()=>setTimeout(maybeShowPreferenceDialog,150));
$$("select[name=branch]").forEach(select=>select.addEventListener("change",event=>applyBranch(event.target.value,true)));document.querySelector("#start-checkout").onclick=()=>{closeCart();document.querySelector("#checkout-form").elements.branch.value=state.branch;document.querySelector("#checkout-dialog").showModal()};
$('#checkout-form').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target),items=state.cart.map(x=>`• ${x.name} × ${x.qty}`).join('\n');const msg=`Hello Jopeem Pharmacy, I would like to submit an order enquiry.\n\nName: ${d.get('name')}\nPhone: ${d.get('phone')}\nPreferred branch: ${d.get('branch')}\n\nItems:\n${items}\n\nNotes: ${d.get('notes')||'None'}\n\nPlease confirm prices and availability.`;window.open(wa(msg),'_blank','noopener')};
applyBranch(state.branch,false);renderCart();renderQuickAccess();initBranchMap();loadCatalog();setInterval(updateBranchStatus,1000);
if(!preferences.preferredBranch)setTimeout(()=>document.querySelector("#branch-dialog").showModal(),900);
setTimeout(maybeShowPreferenceDialog,preferences.preferredBranch?1100:1500);

const whatsappComposer=document.querySelector("#whatsapp-composer"),whatsappComposerForm=document.querySelector("#whatsapp-composer-form");
const composerMessages={general:"Hello Jopeem Pharmacy, I would like some assistance.",help:"Hello Jopeem Pharmacy, I need help finding a medicine or choosing the appropriate pharmacy service."};
function updateComposerPreview(){const message=whatsappComposerForm.elements.message.value;document.querySelector("[data-message-preview]").textContent=message;document.querySelector("[data-message-count]").textContent=message.length}
function openWhatsAppComposer(context){
  const openDialog=document.querySelector("dialog[open]");if(openDialog)openDialog.close();
  closeCart();whatsappComposerForm.elements.branch.value=state.branch;whatsappComposerForm.elements.message.value=composerMessages[context]||composerMessages.general;updateComposerPreview();whatsappComposer.showModal();
}
whatsappComposerForm.elements.message.addEventListener("input",updateComposerPreview);
whatsappComposerForm.elements.branch.addEventListener("change",event=>applyBranch(event.target.value,true));
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
  const fabCall=document.querySelector("[data-fab-call]");
  if(fabCall)fabCall.addEventListener("click",()=>{
    if(state.branch==="Nyanama Trading Centre"){setContactMenu(false,false);document.querySelector("#call-options-dialog").showModal()}
    else{setContactMenu(false,false);window.location.href="tel:+"+BRANCHES[state.branch].phone}
  });
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


/* Lightweight coordinated motion; content stays visible until initialization. */
(function initVisualPolish(){
  const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
  document.documentElement.classList.add("motion-ready");
  const header=document.querySelector(".site-header");
  const syncHeader=()=>header&&header.classList.toggle("is-scrolled",window.scrollY>24);
  syncHeader();window.addEventListener("scroll",syncHeader,{passive:true});
  const singles=[".quick-actions-head",".section-heading",".catalog-intro",".browse-catalog-heading",".service-subheading",".catalog-subheading",".about-intro",".about-purpose",".about-guides-head",".contact-bar",".closing-cta"];
  const groups=[".quick-actions-grid",".trust-strip",".health-services-grid",".medicine-form-grid",".catalog-category-grid",".about-values",".branch-grid"];
  document.querySelectorAll(singles.join(",")).forEach(el=>el.classList.add("reveal"));
  document.querySelectorAll(groups.join(",")).forEach(el=>el.classList.add("reveal-group"));
  document.querySelectorAll(".service-feature,.counselling-feature,.medicine-finder,.services-help,.services-catalog-bridge,.about-brand-visual").forEach((el,i)=>el.classList.add("reveal",i%2?"reveal-right":"reveal-left"));
  const items=document.querySelectorAll(".reveal,.reveal-group");
  if(reduceMotion.matches||!("IntersectionObserver" in window)){items.forEach(el=>el.classList.add("is-visible"))}else{
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.08,rootMargin:"0px 0px -5% 0px"});items.forEach(el=>observer.observe(el));
  }
  const grid=document.querySelector("#product-grid");
  if(grid&&"MutationObserver" in window&&!reduceMotion.matches)new MutationObserver(()=>{grid.classList.add("grid-refresh");requestAnimationFrame(()=>requestAnimationFrame(()=>grid.classList.remove("grid-refresh")))}).observe(grid,{childList:true});
  const fab=document.querySelector(".contact-fab");
  if(fab&&!reduceMotion.matches&&!sessionStorage.getItem("jopeem-fab-cued"))setTimeout(()=>{fab.classList.add("attention");sessionStorage.setItem("jopeem-fab-cued","1");fab.addEventListener("animationend",()=>fab.classList.remove("attention"),{once:true})},1800);
})();


/* Opt-in nearest branch finder. Coordinates are compared locally and never stored. */
(function initNearestBranchFinder(){
  const picker=document.querySelector("#branch-dialog"),dialog=document.querySelector("#nearest-branch-dialog");
  const startButton=document.querySelector("[data-find-nearest]");
  if(!picker||!dialog||!startButton)return;
  const points=Object.fromEntries(Object.entries(BRANCHES).map(([name,branch])=>[name,{lat:branch.lat,lng:branch.lng,label:name}]));
  let suggestedBranch="";
  const title=document.querySelector("[data-location-title]",dialog),status=document.querySelector("[data-location-status]",dialog),eyebrow=document.querySelector("[data-location-eyebrow]",dialog),result=document.querySelector("[data-nearest-result]",dialog),retry=document.querySelector("[data-location-retry]",dialog),scan=document.querySelector(".location-scan",dialog);
  const distanceKm=(lat1,lng1,lat2,lng2)=>{const rad=value=>value*Math.PI/180,dLat=rad(lat2-lat1),dLng=rad(lng2-lng1),a=Math.sin(dLat/2)**2+Math.cos(rad(lat1))*Math.cos(rad(lat2))*Math.sin(dLng/2)**2;return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))};
  const reset=()=>{suggestedBranch="";dialog.classList.add("is-scanning");scan.classList.remove("is-error","is-found");eyebrow.textContent="Finding your nearest Jopeem";title.textContent="Checking your location…";status.textContent="Please allow location access when your browser asks.";status.hidden=false;result.hidden=true;retry.hidden=true};
  const fail=error=>{dialog.classList.remove("is-scanning");scan.classList.add("is-error");eyebrow.textContent="Location unavailable";title.textContent="We could not determine your location";status.hidden=false;status.textContent=error&&error.code===1?"Location access was not allowed. You can enable it in your browser settings or choose a branch manually.":"Please check that location services are enabled and try again.";retry.hidden=false};
  const locate=()=>{reset();if(!navigator.geolocation){fail();return}navigator.geolocation.getCurrentPosition(position=>{const distances=Object.entries(points).map(([name,point])=>({name,point,km:distanceKm(position.coords.latitude,position.coords.longitude,point.lat,point.lng)})).sort((a,b)=>a.km-b.km),nearest=distances[0],other=distances[1];suggestedBranch=nearest.name;dialog.classList.remove("is-scanning");scan.classList.add("is-found");eyebrow.textContent="Nearest branch found";title.textContent="This looks like your closest Jopeem";status.hidden=true;document.querySelector("[data-nearest-name]",dialog).textContent=nearest.point.label;document.querySelector("[data-nearest-detail]",dialog).textContent="Approximately "+(nearest.km<1?Math.round(nearest.km*1000)+" m":nearest.km.toFixed(1)+" km")+" away · "+other.point.label+" is about "+other.km.toFixed(1)+" km away";const directions=dialog.querySelector("[data-nearest-directions]");if(directions)directions.href=branchDirectionsUrl(BRANCHES[nearest.name]);focusBranchOnMap(nearest.name,{lat:position.coords.latitude,lng:position.coords.longitude});result.hidden=false},fail,{enableHighAccuracy:false,timeout:12000,maximumAge:300000})};
  startButton.addEventListener("click",()=>{picker.close();dialog.showModal();locate()});
  retry.addEventListener("click",locate);
  document.querySelector("[data-close-nearest]",dialog).addEventListener("click",()=>dialog.close());
  document.querySelector("[data-confirm-nearest]",dialog).addEventListener("click",()=>{if(suggestedBranch)applyBranch(suggestedBranch,true);dialog.close()});
  document.querySelector("[data-choose-manually]",dialog).addEventListener("click",()=>{dialog.close();picker.showModal()});
})();
