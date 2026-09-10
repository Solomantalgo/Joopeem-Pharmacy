const DASHBOARD_ENDPOINT="https://script.google.com/macros/s/AKfycbwt77YE3EHukWLKugkTHCh4Qty5oKSKxKv9o7F3OMEBpLqwmnYJPJd52BCxr4xqyXDl8g/exec";const SESSION_KEY="jopeem-dashboard-session";const TYPES=["Website experience","Product availability","Service experience","Staff/customer care","Other"];const BRANCHES=["Nyanama Trading Centre","Lebron Shopping Complex, Nalumunye"];const $=id=>document.getElementById(id);const CACHE_KEY="jopeem-dashboard-cache",CACHE_TIME_KEY="jopeem-dashboard-cache-time",CACHE_MAX_AGE=300000;let data=null,busy=false;function clearCache(){try{sessionStorage.removeItem(CACHE_KEY);sessionStorage.removeItem(CACHE_TIME_KEY)}catch{}}function readCache(){try{if(!token())return null;const raw=sessionStorage.getItem(CACHE_KEY),cachedAt=Number(sessionStorage.getItem(CACHE_TIME_KEY)||0);if(!raw||!cachedAt||Date.now()-cachedAt>=CACHE_MAX_AGE){clearCache();return null}const cached=JSON.parse(raw);if(!cached||typeof cached!=="object"||!cached.summary||!Array.isArray(cached.feedback)){clearCache();return null}return cached}catch{clearCache();return null}}function writeCache(payload){try{sessionStorage.setItem(CACHE_KEY,JSON.stringify(payload));sessionStorage.setItem(CACHE_TIME_KEY,String(Date.now()))}catch{}}const clientKey="dash-"+Date.now()+"-"+Math.random().toString(36).slice(2);function token(){try{return sessionStorage.getItem(SESSION_KEY)||""}catch{return""}}function clearToken(){try{sessionStorage.removeItem(SESSION_KEY)}catch{}clearCache();data=null}function status(id,text,type=""){const n=$(id);n.textContent=text;n.className="form-status"+(type?" "+type:"");n.hidden=!text}async function request(action,fields={}){const response=await fetch(DASHBOARD_ENDPOINT,{method:"POST",body:new URLSearchParams({action,...fields})});let result={};try{result=await response.json()}catch{throw Error("Request failed")}if(!response.ok)throw Error("Request failed");return result}function showLogin(){ $("login-panel").hidden=false;$("dashboard-view").hidden=true;$("dashboard-password").value="";$("dashboard-password").focus()}function showDashboard(){$("login-panel").hidden=true;$("dashboard-view").hidden=false}function summary(d){const s=d.summary||{},items=[["Total feedback",s.total||0,""],["Average rating",Number(s.averageRating||0).toFixed(1)," "],["5-star feedback",s.fiveStar||0,""],["Low ratings",s.lowRatings||0,"low"]],target=$("summary-grid");target.replaceChildren();items.forEach(([label,value,kind])=>{const card=document.createElement("article");card.className="summary-card "+kind;const a=document.createElement("small"),b=document.createElement("strong");a.textContent=label;b.textContent=value;card.append(a,b);target.append(card)})}function ratingChart(values){
 const target=$("ratings-breakdown");target.replaceChildren();
 const labels=[["1 star","1 star"],["2 stars","2 stars"],["3 stars","3 stars"],["4 stars","4 stars"],["5 stars","5 stars"]];
 const counts=labels.map(item=>Number(values?.[item[1]]||0)),max=Math.max(1,...counts);
 labels.forEach((item,index)=>{
  const column=document.createElement("div");column.className="chart-column";column.setAttribute("role","img");column.setAttribute("aria-label",item[0]+": "+counts[index]+" responses");
  const count=document.createElement("strong");count.className="chart-count";count.textContent=String(counts[index]);
  const track=document.createElement("span");track.className="chart-track";track.setAttribute("aria-hidden","true");
  const fill=document.createElement("span");fill.className="chart-fill";fill.style.height=Math.round(counts[index]/max*100)+"%";track.append(fill);
  const label=document.createElement("span");label.className="chart-label";label.textContent=item[0];
  column.append(count,track,label);target.append(column);
 });
}
function bars(id,values,total){const target=$(id);target.replaceChildren();const entries=Object.entries(values||{});if(!entries.length){const empty=document.createElement("p");empty.className="no-data";empty.textContent="No data yet.";target.append(empty);return}entries.forEach(([label,count])=>{const row=document.createElement("div");row.className="bar-row";const name=document.createElement("span");name.className="bar-label";name.textContent=label;const track=document.createElement("span");track.className="bar-track";const fill=document.createElement("span");fill.className="bar-fill";fill.style.width=(total?Math.round(Number(count)/total*100):0)+"%";track.append(fill);const number=document.createElement("span");number.className="bar-count";number.textContent=String(count||0);row.append(name,track,number);target.append(row)})}
function branches(values){const target=$("branches-breakdown");target.replaceChildren();BRANCHES.forEach(name=>{const x=values?.[name]||{count:0,averageRating:0},card=document.createElement("div");card.className="branch-report";const b=document.createElement("b"),s=document.createElement("small");b.textContent=name;s.textContent=(x.count||0)+" feedback · average "+Number(x.averageRating||0).toFixed(1)+" / 5";card.append(b,s);target.append(card)})}function filters(){BRANCHES.forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;$("filter-branch").append(o)});TYPES.forEach(name=>{const o=document.createElement("option");o.value=name;o.textContent=name;$("filter-type").append(o)})}function rows(){
 const body=$("feedback-rows"),cards=$("feedback-cards"),empty=$("feedback-empty"),branch=$("filter-branch").value,type=$("filter-type").value;
 body.replaceChildren();cards.replaceChildren();
 const all=data?.feedback||[],list=all.filter(x=>(!branch||x.branch===branch)&&(!type||x.feedbackType===type));
 if(!list.length){empty.textContent=all.length?"No feedback matches these filters.":"No customer feedback has been received yet.";empty.hidden=false;return}
 empty.hidden=true;
 list.forEach(item=>{
  const tr=document.createElement("tr");
  [item.timestamp,"★".repeat(Number(item.rating)||0),item.feedbackType,item.branch,item.comment||"—"].forEach((value,i)=>{const td=document.createElement("td");if(i===1)td.className="rating";if(i===4)td.className="comment";td.textContent=String(value);tr.append(td)});
  body.append(tr);
  const card=document.createElement("article");card.className="feedback-card";
  const top=document.createElement("div");top.className="feedback-card-top";
  const rating=document.createElement("strong");rating.className="rating";rating.textContent="★".repeat(Number(item.rating)||0);
  const typeLabel=document.createElement("b");typeLabel.textContent=String(item.feedbackType||"");
  top.append(rating,typeLabel);
  const date=document.createElement("time");date.textContent=String(item.timestamp||"");
  const branchLabel=document.createElement("small");branchLabel.textContent=String(item.branch||"");
  const comment=document.createElement("p");comment.textContent=item.comment||"—";
  card.append(top,date,branchLabel,comment);cards.append(card);
 });
}
function render(d){data=d;summary(d);ratingChart(d.ratings);bars("types-breakdown",d.types,d.summary?.total||0);branches(d.branches);rows()}async function load(forceRefresh=false){
 if(busy)return;
 const cached=!forceRefresh?readCache():null;
 if(cached){render(cached);status("dashboard-status","Showing saved data","success")}
 busy=true;$("refresh-dashboard").disabled=true;
 status("dashboard-status",cached?"Updating feedback…":"Loading feedback…","sending");
 try{
  const result=await request("feedbackData",{token:token()});
  if(result.unauthorized){clearToken();showLogin();status("login-status","Your session has expired. Please sign in again.","error");return}
  if(!result.success)throw Error("Unable to load feedback");
  writeCache(result);render(result);status("dashboard-status","Updated just now","success");
  setTimeout(()=>status("dashboard-status",""),2500)
 }catch(error){
  console.error("Dashboard request failed.",error);
  status("dashboard-status",cached?"Showing saved data · refresh failed":"Couldn't load feedback. Please try again.","error")
 }finally{busy=false;$("refresh-dashboard").disabled=false}
}
async function signIn(event){event.preventDefault();if(busy)return;const password=$("dashboard-password").value;if(!password){status("login-status","Enter the dashboard password.","error");return}busy=true;$("login-submit").disabled=true;$("login-submit").textContent="Signing in…";status("login-status","Checking access…","sending");try{const result=await request("login",{password,clientKey});if(!result.success||!result.token)throw Error(result.message||"Incorrect password.");sessionStorage.setItem(SESSION_KEY,result.token);showDashboard();busy=false;await load()}catch(error){console.error("Dashboard sign-in failed.",error);status("login-status",error.message==="Incorrect password."?error.message:"We couldn't sign you in. Please try again.","error")}finally{busy=false;$("login-submit").disabled=false;$("login-submit").textContent="Sign in"}}async function logout(){const t=token();clearToken();showLogin();if(t){try{await request("logout",{token:t})}catch(error){console.warn("Dashboard logout failed.",error)}}}$("login-form").addEventListener("submit",signIn);$("toggle-password").addEventListener("click",()=>{const i=$("dashboard-password"),visible=i.type==="text";i.type=visible?"password":"text";$("toggle-password").textContent=visible?"Show":"Hide"});$("refresh-dashboard").addEventListener("click",()=>load(true));$("logout-dashboard").addEventListener("click",logout);$("filter-branch").addEventListener("change",rows);$("filter-type").addEventListener("change",rows);filters();if(token()){showDashboard();load()}else showLogin();