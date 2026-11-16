// طريق المئة — طبقة الحسابات والحماية والتقدم والمرح (تُحمّل في آخر كل صفحة)
(function(){
"use strict";
if(window.TM)return;

/* ---------- أدوات أمان عامة ---------- */
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
// يزيل محارف التحكم واتجاه النص المخفية (تُستعمل للتلاعب بعرض النص) ويقص الطول
function clean(s,max){return String(s==null?"":s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F​-‏‪-‮⁦-⁩﻿]/g,"").trim().slice(0,max||500)}
var SCRIPT_BASE=(function(){var s=document.currentScript&&document.currentScript.src;return s?s.replace(/[^\/]*$/,""):""})();

/* ---------- الأدوات ---------- */
/* المواد وأقسامها: نفس الأقسام الأربعة في كل مادة */
var SUBJECTS={
 ar1:{t:"اللغة العربية (1)",home:"index.html#ar1",groups:[
  {k:"learn",t:"أفهم الدروس"},{k:"skill",t:"أتقن طريقة الإجابة"},{k:"memo",t:"أحفظ وأثبّت"},{k:"test",t:"أستعد للاختبار"},{k:"me",t:"حسابي"}],
  tools:[
  {f:"texts.html",k:"texts",t:"شرح النصوص الثمانية",e:"📜",g:"learn"},
  {f:"summaries.html",k:"summaries",t:"الملخصات",e:"🗺️",g:"learn"},
  {f:"schools.html",k:"schools",t:"المذاهب والمناهج",e:"🎭",g:"learn"},
  {f:"glossary.html",k:"glossary",t:"قاموس المصطلحات",e:"📚",g:"learn"},
  {f:"decoder.html",k:"decoder",t:"مفكك الأسئلة",e:"🔍",g:"skill"},
  {f:"relations.html",k:"relations",t:"العلاقات بين الجمل",e:"🔗",g:"skill"},
  {f:"reading.html",k:"reading",t:"النص الخارجي والقراءة",e:"📖",g:"skill"},
  {f:"memorize.html",k:"memorize",t:"الحفظ",e:"🧠",g:"memo"},
  {f:"cards.html",k:"cards",t:"بطاقات المراجعة",e:"🃏",g:"memo"},
  {f:"bank.html",k:"bank",t:"بنك الأسئلة",e:"🏦",g:"test"},
  {f:"exams.html",k:"exams",t:"اختبارات تجريبية",e:"⏱️",g:"test"}]},
 isl1:{t:"العلوم الإسلامية (1)",home:"index.html#isl1",groups:[
  {k:"learn",t:"أفهم الدروس"},{k:"skill",t:"أتقن طريقة الإجابة"},{k:"memo",t:"أحفظ وأثبّت"},{k:"test",t:"أستعد للاختبار"},{k:"me",t:"حسابي"}],
  tools:[
  {f:"isl-lessons.html",k:"isl-lessons",t:"بطاقات الدروس",e:"📗",g:"learn"},
  {f:"isl-keys.html",k:"isl-keys",t:"مفاتيح الأسئلة العليا",e:"🔍",g:"skill"},
  {f:"isl-situations.html",k:"isl-situations",t:"مدرّب المواقف",e:"🧭",g:"skill"},
  {f:"isl-memorize.html",k:"isl-memorize",t:"الحفظ: سورة النور والأحاديث",e:"🧠",g:"memo"},
  {f:"isl-bank.html",k:"isl-bank",t:"تجميعة أسئلة الوزارة",e:"🗂️",g:"test"},
  {f:"isl-exam.html",k:"isl-exam",t:"اختبار تجريبي",e:"⏱️",g:"test"}]}
};
var ME=[{f:"profile.html",k:"profile",t:"لوحتي وتقدّمي",e:"🏆",g:"me"},{f:"feedback.html",k:"feedback",t:"بلّغ عن خطأ",e:"🐞",g:"me"}];
function subjOf(f){return /^isl-/.test(f)?"isl1":"ar1"}
var SUBJ=subjOf(pageFile()),GROUPS=SUBJECTS[SUBJ].groups;
var TOOLS=[{f:"index.html",k:"index",t:"الرئيسية",e:"🏠",g:""}].concat(SUBJECTS.ar1.tools,SUBJECTS.isl1.tools,ME);
function subjTools(){return SUBJECTS[SUBJ].tools.concat(ME)}
function pageFile(){var p=decodeURIComponent(location.pathname.split("/").pop()||"");if(/\.html$/.test(p))return p;var cur=document.querySelector('.topbar nav a[aria-current="page"]');if(cur)return cur.getAttribute("href");return "index.html";}
var FILE=pageFile();
var KEY=(document.body.dataset.tool)||(/^text-/.test(FILE)?"texts":FILE.replace(".html",""));
document.body.dataset.tool=KEY;

/* ---------- تخزين آمن ---------- */
function mkLS(store){return {get:function(k,d){try{var v=store().getItem(k);if(v==null)return d;var o=JSON.parse(v);return o==null?d:o}catch(e){return d}},set:function(k,v){try{store().setItem(k,JSON.stringify(v))}catch(e){}},del:function(k){try{store().removeItem(k)}catch(e){}}}}
var LS=mkLS(function(){return localStorage}),SS=mkLS(function(){return sessionStorage});

/* ---------- العبارات ---------- */
var FALLBACK={good:["أحسنت! 👏","بارك الله فيك! 💪"],bad:["لا بأس، ستصيبها في المرة القادمة 😅"],level:["ارتقيت مستوى! 🚀"],hi:["أهلًا وسهلًا"]};
function PH(){return window.TM_PHRASES||FALLBACK}
var LINES={get good(){return PH().good||FALLBACK.good},get bad(){return PH().bad||FALLBACK.bad},get level(){return PH().level||FALLBACK.level},get hi(){return PH().hi||FALLBACK.hi}};
function pick(a){return a[Math.floor(Math.random()*a.length)]}
// اختيار بدون تكرار قريب
function pickFresh(cat,arr){var seen=SS.get("tm.seen."+cat,[]);var pool=arr.map(function(_,i){return i}).filter(function(i){return seen.indexOf(i)<0});if(!pool.length){seen=[];pool=arr.map(function(_,i){return i})}var i=pick(pool);seen.push(i);SS.set("tm.seen."+cat,seen.slice(-Math.floor(arr.length*.7)));return arr[i]}

/* ---------- الأصوات (بدون ملفات) ---------- */
var AC=null,muted=LS.get("tm.muted",false);
function ac(){if(muted)return null;try{if(!AC){var C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();}if(AC.state==="suspended")AC.resume();return AC}catch(e){return null}}
function tone(f,t0,d,type,vol,f2){var a=ac();if(!a)return;var o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=type||"sine";o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol||.18,t+.015);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+d+.05);}
var SND={
 correct:function(){tone(784,0,.16,"triangle");tone(1175,.09,.22,"triangle")},
 wrong:function(){tone(220,0,.18,"sawtooth",.07);tone(170,.12,.24,"sawtooth",.06)},
 level:function(){[523,659,784,1047].forEach(function(f,i){tone(f,i*.09,.25,"triangle",.16)})},
 win:function(){[523,659,784,1047,1319].forEach(function(f,i){tone(f,i*.08,.3,"square",.06)});tone(1568,.45,.5,"triangle",.14)},
 click:function(){tone(1500,0,.045,"sine",.05)},
 tap:function(){tone(900,0,.05,"triangle",.06,1200)},
 open:function(){tone(520,0,.11,"sine",.08,880)},
 close:function(){tone(820,0,.1,"sine",.07,480)},
 nav:function(){tone(660,0,.07,"triangle",.06);tone(990,.05,.08,"triangle",.05)},
 toggle:function(){tone(700,0,.05,"square",.04);tone(1050,.04,.05,"square",.035)},
 chime:function(){tone(1319,0,.35,"sine",.08);tone(1760,.08,.4,"sine",.06)},
 whoosh:function(){tone(300,0,.25,"sine",.05,1400)}
};

/* ---------- مؤثرات بصرية ---------- */
var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
function confetti(n){if(reduce)return;var c=document.createElement("canvas");c.className="tm-confetti";document.body.appendChild(c);var x=c.getContext("2d"),dp=window.devicePixelRatio||1,W=c.width=innerWidth*dp,H=c.height=innerHeight*dp;var cols=["#f4b860","#ec8f3c","#ffd98a","#fff3cf","#c46a12","#2f3b78","#8f9be0","#3f6e52"];var P=[];for(var i=0;i<(n||140);i++)P.push({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*16*dp,vy:(-Math.random()*14-4)*dp,s:(4+Math.random()*6)*dp,r:Math.random()*6,vr:(Math.random()-.5)*.3,c:pick(cols)});var t=0;(function f(){t++;x.clearRect(0,0,W,H);P.forEach(function(p){p.vy+=.45*dp;p.x+=p.vx;p.y+=p.vy;p.r+=p.vr;x.save();x.translate(p.x,p.y);x.rotate(p.r);x.fillStyle=p.c;x.fillRect(-p.s/2,-p.s/3,p.s,p.s*.66);x.restore();});if(t<110)requestAnimationFrame(f);else c.remove();})();}
var toastT=null;
function toast(msg,kind,ms){var old=document.querySelector(".tm-toast");if(old)old.remove();var d=document.createElement("div");d.className="tm-toast"+(kind?" "+kind:"");d.setAttribute("role","status");d.textContent=msg;document.body.appendChild(d);clearTimeout(toastT);toastT=setTimeout(function(){d.remove()},ms||2600);}
function fly(text,el){if(reduce)return;var r=el&&el.getBoundingClientRect?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0};var d=document.createElement("div");d.className="tm-xpfly";d.textContent=text;d.style.left=(r.left+r.width/2-20)+"px";d.style.top=(r.top-10)+"px";document.body.appendChild(d);setTimeout(function(){d.remove()},1000);}
function fx(el,cls){if(!el||reduce)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(function(){el.classList.remove(cls)},900);}

/* ---------- التشفير ---------- */
function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(b){return("0"+b.toString(16)).slice(-2)}).join("")}
function hasCrypto(){return !!(window.crypto&&crypto.subtle&&crypto.getRandomValues)}
function sha(s){return crypto.subtle.digest("SHA-256",new TextEncoder().encode(s)).then(hex)}
var ITER=210000;
function pbkdf2(pass,saltHex,it){var salt=new Uint8Array(saltHex.match(/../g).map(function(h){return parseInt(h,16)}));return crypto.subtle.importKey("raw",new TextEncoder().encode(pass),"PBKDF2",false,["deriveBits"]).then(function(k){return crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:salt,iterations:it||ITER},k,256)}).then(hex)}
function salt16(){var a=new Uint8Array(16);crypto.getRandomValues(a);return hex(a)}
// مقارنة لا تتأثر بالتوقيت
function same(a,b){a=String(a);b=String(b);if(a.length!==b.length)return false;var r=0;for(var i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0}
function verify(rec,pass){if(rec.it)return pbkdf2(pass,rec.salt,rec.it).then(function(h){return same(h,rec.hash)});return sha(rec.salt+":"+pass).then(function(h){return same(h,rec.hash)})}
function uid(name){return "u"+hex(new TextEncoder().encode(String(name).toLowerCase())).slice(0,120)}
var ADMIN={user:"mudeer",salt:"bbaea0691163819ea2af1465fdabe1b3",it:210000,hash:""};

/* ---------- قاعدة البيانات ---------- */
var cloud={db:null,user:null,vid:null,write:null,admin:false,ready:null,fb:false};
/* Firebase: يعمل تلقائيًا إذا وُجد ملف fb-config.js بإعدادات المشروع (خارج claude.ai) */
var FB=null;
function loadJS(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
function setFbUser(u){cloud.fbUser=u||null;cloud.vid=u?u.uid:null;cloud.write=!!u;var ae=FB&&FB.cfg.adminEmail;cloud.admin=!!(u&&ae&&u.email&&u.email.toLowerCase()===String(ae).toLowerCase())}
function fbEmail(name){var u=uid(name),d=(FB&&FB.cfg.userDomain)||"students.tariq-almiah.app";// الجزء قبل @ حده 64 حرفًا: الأسماء العربية الطويلة يُنقل باقيها إلى النطاق
 return u.slice(0,60)+"@"+(u.length>60?u.slice(60)+".":"")+d}
function fbStart(){return loadJS(SCRIPT_BASE+"fb-config.js").then(function(){var c=window.TM_FB;if(!c||!c.apiKey||/PASTE|ضع/.test(c.apiKey))return null;var b="https://www.gstatic.com/firebasejs/10.12.2/";
 return loadJS(b+"firebase-app-compat.js").then(function(){return Promise.all([loadJS(b+"firebase-auth-compat.js"),loadJS(b+"firebase-firestore-compat.js")])}).then(function(){var app=firebase.apps.length?firebase.app():firebase.initializeApp(c);FB={app:app,auth:firebase.auth(),db:firebase.firestore(),cfg:c};cloud.fb=true;cloud.db=FB.db;
  return new Promise(function(res){var un=FB.auth.onAuthStateChanged(function(u){un();setFbUser(u);res(cloud)})})})}).catch(function(){return null})}
function fbMsg(e){var c=e&&e.code||"";if(c==="auth/email-already-in-use")return "هذا الاسم محجوز لطالب ثاني. اختر اسمًا ثانيًا.";if(c==="auth/network-request-failed")return "تأكد من اتصالك بالإنترنت وحاول مرة ثانية.";if(c==="auth/too-many-requests")return "محاولات كثيرة 🔒 انتظر قليلًا وحاول مرة ثانية.";return "اسم المستخدم أو كلمة المرور غلط 🙈"}
cloud.ready=(function(){if(!window.claude||!claude.use)return fbStart().then(function(c){return c||cloud});return Promise.all([claude.use("db").catch(function(){return null}),claude.use("user").catch(function(){return null})]).then(function(r){cloud.db=r[0];cloud.user=r[1];if(!cloud.user)return cloud;var w=null,ad=false;try{w=cloud.user.can("data.write")}catch(e){}try{ad=cloud.user.canEdit()}catch(e){}return Promise.all([w,ad]).then(function(v){cloud.write=v[0];cloud.admin=!!v[1];return cloud.user.id?cloud.user.id():null}).then(function(id){cloud.vid=id&&/^[A-Za-z0-9_\-.~:@+]{1,200}$/.test(id)?id:null;return cloud}).catch(function(){return cloud})}).catch(function(){return cloud})})();
function canWrite(){return !!cloud.db&&cloud.write!==false&&!!cloud.vid}
function cGet(path){return cloud.ready.then(function(){if(!cloud.db)return null;return cloud.db.doc(path).get().then(function(s){return s.exists?JSON.parse(JSON.stringify(s.data())):null}).catch(function(){return null})})}
function cSet(path,data){return cloud.ready.then(function(){if(!canWrite())return false;return cloud.db.doc(path).set(data).then(function(){return true}).catch(function(e){if(e&&e.code==="invalid_argument")cloud.write=false;return false})})}
// خزنة المستخدم: مستند واحد خاص بكل حساب claude (لا يقرؤه غيره إلا المشرف)
var vaultQ=Promise.resolve();
function vaultUpdate(fn){vaultQ=vaultQ.then(function(){return cloud.ready}).then(function(){if(!canWrite())return false;var p="vault/"+cloud.vid;return cGet(p).then(function(v){v=v||{accounts:{},progress:{}};v.accounts=v.accounts||{};v.progress=v.progress||{};fn(v);v.updated=Date.now();return cSet(p,v)})}).catch(function(){return false});return vaultQ}
function vaultGet(){return cloud.ready.then(function(){if(!cloud.vid)return null;return cGet("vault/"+cloud.vid)})}

/* ---------- الحسابات ---------- */
var RESERVED=/^(mudeer|admin|administrator|root|system|null|undefined|guest|ضيف|مدير|المدير|مشرف|المشرف|__proto__|prototype|constructor)$/i;
var WEAK=["123456","1234567","12345678","123456789","1234567890","111111","000000","654321","abc123","abcdef","password","passw0rd","qwerty","qwerty123","123123","112233","121212","696969","iloveyou","oman123","oman2026","asdfgh"];
function validName(u){return /^[A-Za-z0-9_.ء-ي٠-٩]{3,20}$/.test(u)&&!RESERVED.test(u)&&!/^[._]|[._]$/.test(u)}
function passProblem(p,user){p=String(p||"");if(p.length<8)return "كلمة المرور 8 أحرف على الأقل.";if(p.length>64)return "كلمة المرور طويلة جدًا (64 حرفًا كحد أقصى).";if(WEAK.indexOf(p.toLowerCase())>=0||/^(.)\1+$/.test(p))return "كلمة المرور سهلة جدًا ويمكن تخمينها 😅 اختر غيرها.";if(user&&p.toLowerCase().indexOf(String(user).toLowerCase())>=0)return "لا تحط اسم المستخدم داخل كلمة المرور.";if(!/[0-9]/.test(p)||!/[^0-9]/.test(p))return "خلّ كلمة المرور فيها حروف وأرقام مع بعض.";return ""}
function strength(p){p=String(p||"");var s=0;if(p.length>=8)s++;if(p.length>=12)s++;if(/[0-9]/.test(p)&&/[^0-9]/.test(p))s++;if(/[A-Z]/.test(p)&&/[a-z]/.test(p)||/[ء-ي]/.test(p)&&/[A-Za-z]/.test(p))s++;if(/[^A-Za-z0-9ء-ي]/.test(p))s++;if(WEAK.indexOf(p.toLowerCase())>=0)s=0;return Math.min(4,s)}
function key(u){return "n:"+String(u).toLowerCase()}
function accounts(){var a=LS.get("tm.accounts2",null);if(a&&typeof a==="object")return a;// ترحيل الصيغة القديمة
 var old=LS.get("tm.accounts",{}),n={};Object.keys(old||{}).forEach(function(k){var r=old[k];if(r&&r.name&&validName(r.name))n[key(r.name)]={name:r.name,salt:r.salt,hash:r.hash,email:r.email||"",created:r.created||Date.now()}});LS.set("tm.accounts2",n);LS.del("tm.accounts");return n}
function getAcc(u){var a=accounts(),k=key(u);return Object.prototype.hasOwnProperty.call(a,k)?a[k]:null}
function putAcc(rec){var a=accounts();a[key(rec.name)]=rec;LS.set("tm.accounts2",a)}
// الجلسة
var SESSION_DAYS=30;
function loadSession(){var adm=SS.get("tm.admin",null);if(adm&&adm.exp>Date.now())return {user:ADMIN.user,admin:true,exp:adm.exp};var s=LS.get("tm.session",null);if(!s||!s.user||s.admin)return null;if(!s.exp)s.exp=Date.now()+SESSION_DAYS*864e5;if(s.exp<Date.now()){LS.del("tm.session");return null}if(!getAcc(s.user)){LS.del("tm.session");return null}return s}
var session=loadSession();
function who(){return session&&!session.admin?session.user:"guest"}
function isAdmin(){return !!(session&&session.admin)}
// قفل المحاولات الفاشلة
function lockState(){var l=LS.get("tm.lock",{n:0,until:0});return l}
function lockLeft(){var l=lockState();return Math.max(0,Math.ceil((l.until-Date.now())/1000))}
function failed(){var l=lockState();l.n=(l.n||0)+1;if(l.n>=5){var secs=Math.min(900,30*Math.pow(2,l.n-5));l.until=Date.now()+secs*1000}LS.set("tm.lock",l);return l}
function okLogin(){LS.del("tm.lock")}
function lockedMsg(){var s=lockLeft();return s>0?("محاولات كثيرة غلط 🔒 انتظر "+(s>=60?Math.ceil(s/60)+" دقيقة":s+" ثانية")+" وجرب مرة ثانية."):""}
function err(e){return typeof e==="string"?e:"صار خطأ غير متوقع. حاول مرة ثانية."}
var Auth={
 current:function(){return session},
 isAdmin:isAdmin,
 strength:strength,passProblem:passProblem,validName:validName,
 register:function(user,pass,email,remember){user=clean(user,20);email=clean(email,120);
  if(!hasCrypto())return Promise.reject("متصفحك قديم وما يدعم التشفير. حدّثه أو جرّب متصفح ثاني.");
  if(!validName(user))return Promise.reject("اسم المستخدم من 3 إلى 20 حرفًا: عربي أو إنجليزي أو أرقام أو _ . (بدون مسافات).");
  var pp=passProblem(pass,user);if(pp)return Promise.reject(pp);
  if(email&&!/^[^\s@<>"']{1,64}@[^\s@<>"']{1,100}\.[A-Za-zء-ي]{2,20}$/.test(email))return Promise.reject("الإيميل مكتوب بشكل غير صحيح، أو اتركه فاضي.");
  if(getAcc(user))return Promise.reject("هذا الاسم مستخدم على هذا الجهاز. جرّب اسمًا ثانيًا أو سجّل دخول.");
  var nameDoc="names/"+uid(user);
  return cloud.ready.then(function(){if(!FB)return;return FB.auth.createUserWithEmailAndPassword(fbEmail(user),pass).then(function(cr){setFbUser(cr.user)}).catch(function(e){if(e&&e.code==="auth/network-request-failed")return;throw fbMsg(e)})}).then(function(){return cGet(nameDoc)}).then(function(ex){if(ex&&ex.owner&&ex.owner!==cloud.vid)throw "هذا الاسم محجوز لطالب ثاني. اختر اسمًا ثانيًا.";var s=salt16();return pbkdf2(pass,s,ITER).then(function(h){
   var rec={name:user,salt:s,it:ITER,hash:h,email:email,created:Date.now()};putAcc(rec);
   if(canWrite()){cSet(nameDoc,{owner:cloud.vid,at:Date.now()});vaultUpdate(function(v){v.accounts[key(user)]=rec})}
   var guest=Prog.load("guest");setSession(user,remember);Prog.adopt(guest);badge("join");return session;})}).catch(function(e){throw err(e)})},
 login:function(user,pass,remember){user=clean(user,40);var lm=lockedMsg();if(lm)return Promise.reject(lm);
  if(!hasCrypto())return Promise.reject("متصفحك قديم وما يدعم التشفير. حدّثه أو جرّب متصفح ثاني.");
  if(user.toLowerCase()===ADMIN.user&&FB&&FB.cfg.adminEmail){return FB.auth.signInWithEmailAndPassword(FB.cfg.adminEmail,String(pass||"")).then(function(c){setFbUser(c.user);if(!cloud.admin)throw "x";okLogin();var exp=Date.now()+2*36e5;SS.set("tm.admin",{exp:exp});session={user:ADMIN.user,admin:true,exp:exp};return session}).catch(function(){failed();throw lockedMsg()||"اسم المستخدم أو كلمة المرور غلط 🙈"})}
  if(user.toLowerCase()===ADMIN.user){return pbkdf2(String(pass||""),ADMIN.salt,ADMIN.it).then(function(h){if(!same(h,ADMIN.hash)){failed();throw lockedMsg()||"اسم المستخدم أو كلمة المرور غلط 🙈"}okLogin();var exp=Date.now()+2*36e5;SS.set("tm.admin",{exp:exp});session={user:ADMIN.user,admin:true,exp:exp};return session})}
  var local=getAcc(user),fbOk=false;
  var pre=cloud.ready.then(function(){if(!FB)return;return FB.auth.signInWithEmailAndPassword(fbEmail(user),String(pass||"")).then(function(c){setFbUser(c.user);fbOk=true}).catch(function(e){if(!local&&e&&e.code!=="auth/network-request-failed"){failed();throw lockedMsg()||fbMsg(e)}})});
  var p=pre.then(function(){if(local)return local;return vaultGet().then(function(v){var r=v&&v.accounts&&Object.prototype.hasOwnProperty.call(v.accounts,key(user))&&v.accounts[key(user)];if(!r||!r.salt||!r.hash){failed();throw lockedMsg()||"اسم المستخدم أو كلمة المرور غلط 🙈"}return r})});
  return p.then(function(rec){return verify(rec,String(pass||"")).then(function(ok){if(!ok){failed();throw lockedMsg()||"اسم المستخدم أو كلمة المرور غلط 🙈"}okLogin();
   // ترقية التشفير القديم تلقائيًا
   var up=rec.it?Promise.resolve(rec):(function(){var s=salt16();return pbkdf2(pass,s,ITER).then(function(h){rec.salt=s;rec.it=ITER;rec.hash=h;return rec})})();
   // ترحيل: حساب قديم على هذا الجهاز بلا حساب في Firebase ← ننشئه بنفس كلمة المرور
   var mig=(FB&&!fbOk)?FB.auth.createUserWithEmailAndPassword(fbEmail(user),String(pass||"")).then(function(c){setFbUser(c.user)}).catch(function(){}):Promise.resolve();
   return mig.then(function(){return up}).then(function(r){putAcc(r);if(canWrite())vaultUpdate(function(v){v.accounts[key(r.name)]=r});setSession(r.name,remember);return Prog.pull().then(function(){return session})})})}).catch(function(e){throw err(e)})},
 logout:function(){if(FB)FB.auth.signOut().then(function(){setFbUser(null)}).catch(function(){});session=null;LS.del("tm.session");SS.del("tm.admin")},
 changePassword:function(oldp,newp){if(!session||session.admin)return Promise.reject("هذا الخيار للطلاب فقط.");var rec=getAcc(session.user);if(!rec)return Promise.reject("الحساب غير موجود على هذا الجهاز.");var pp=passProblem(newp,session.user);if(pp)return Promise.reject(pp);
  return verify(rec,oldp).then(function(ok){if(!ok)throw "كلمة المرور الحالية غلط.";var s=salt16();return pbkdf2(newp,s,ITER).then(function(h){rec.salt=s;rec.it=ITER;rec.hash=h;putAcc(rec);if(canWrite())vaultUpdate(function(v){v.accounts[key(rec.name)]=rec});if(cloud.fbUser)cloud.fbUser.updatePassword(newp).catch(function(){});return true})})},
 setEmail:function(email){if(!session||session.admin)return Promise.reject("هذا الخيار للطلاب فقط.");email=clean(email,120);if(email&&!/^[^\s@<>"']{1,64}@[^\s@<>"']{1,100}\.[A-Za-zء-ي]{2,20}$/.test(email))return Promise.reject("الإيميل مكتوب بشكل غير صحيح.");var rec=getAcc(session.user);if(!rec)return Promise.reject("الحساب غير موجود على هذا الجهاز.");rec.email=email;putAcc(rec);if(canWrite())vaultUpdate(function(v){v.accounts[key(rec.name)]=rec});return Promise.resolve(true)},
 email:function(){if(!session||session.admin)return"";var r=getAcc(session.user);return r?r.email||"":""},
 deleteLocal:function(){if(!session||session.admin)return;var a=accounts();delete a[key(session.user)];LS.set("tm.accounts2",a);LS.del(Prog.key());Auth.logout()},
 lockLeft:lockLeft
};
function setSession(user,remember){session={user:user,exp:Date.now()+(remember===false?1:SESSION_DAYS)*864e5};LS.set("tm.session",session)}

/* ---------- التقدم ---------- */
function ymd(d){return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
function today(){return ymd(new Date())}
function blank(){return {xp:0,days:{},streak:0,last:"",done:{},best:{},badges:{},visits:{},daily:60}}
function num(n,max){n=Number(n);return isFinite(n)&&n>=0?Math.min(n,max||1e7):0}
var Prog={
 key:function(u){return "tm.p."+String(u||who()).toLowerCase()},
 load:function(u){var p=LS.get(Prog.key(u),null);if(!p||typeof p!=="object")p=blank();var b=blank();for(var k in b)if(!(k in p)||typeof p[k]!==typeof b[k])p[k]=b[k];p.xp=num(p.xp);return p},
 save:function(p){LS.set(Prog.key(),p);Prog.push(p)},
 adopt:function(g){if(!g||!g.xp)return;var p=Prog.load();p.xp+=g.xp;for(var k in g.done)p.done[k]=g.done[k];for(var k2 in g.best)p.best[k2]=Math.max(p.best[k2]||0,g.best[k2]);for(var k3 in g.badges)p.badges[k3]=p.badges[k3]||g.badges[k3];for(var d in g.days)p.days[d]=(p.days[d]||0)+g.days[d];p.streak=Math.max(p.streak,g.streak);p.last=p.last>g.last?p.last:g.last;Prog.save(p);LS.del(Prog.key("guest"))},
 pushT:null,
 push:function(p){if(!session||session.admin)return;clearTimeout(Prog.pushT);var u=session.user;Prog.pushT=setTimeout(function(){vaultUpdate(function(v){v.progress[key(u)]={name:u,xp:p.xp,streak:p.streak,last:p.last,done:p.done,best:p.best,badges:p.badges,days:p.days,updated:Date.now()}})},2000)},
 pull:function(){if(!session||session.admin)return Promise.resolve();var u=session.user;return vaultGet().then(function(v){var r=v&&v.progress&&v.progress[key(u)];if(!r)return;var p=Prog.load();if(num(r.xp)>p.xp){p.xp=num(r.xp);p.streak=num(r.streak,999)||p.streak;p.last=typeof r.last==="string"?r.last:p.last;["done","best","badges","days"].forEach(function(f){if(r[f]&&typeof r[f]==="object")p[f]=Object.assign({},r[f],p[f])});LS.set(Prog.key(),p)}}).catch(function(){})}
};
var LEVELS=[[0,"مبتدئ متحمس 🐣"],[100,"طالب نشيط 📘"],[250,"شاطر الفصل ✏️"],[450,"فنان العربي 🎨"],[700,"نجم المادة ⭐"],[1000,"خبير النصوص 🧠"],[1400,"أسطورة المئة 🦅"],[2000,"المتنبي الصغير 👑"]];
function levelOf(xp){var i=0;for(var j=0;j<LEVELS.length;j++)if(xp>=LEVELS[j][0])i=j;var nx=LEVELS[i+1]?LEVELS[i+1][0]:null;return {n:i+1,name:LEVELS[i][1],from:LEVELS[i][0],to:nx}}
var BADGES={
 join:["🎟️","انضممت لطريق المئة"],first:["🌱","أول نقاط لك"],streak3:["🔥","3 أيام متتالية"],streak7:["🌋","أسبوع كامل بدون انقطاع"],
 text1:["📜","أنهيت أول نص"],text8:["🏛️","أنهيت النصوص الثمانية"],card25:["🃏","أتقنت 25 بطاقة"],cardall:["💎","أتقنت كل البطاقات"],
 memo:["🧠","مقطع حفظ بدون أخطاء"],memoall:["🗣️","كل مقاطع الحفظ بدون أخطاء"],schools:["🎭","12 من 12 في المذاهب والمناهج"],quiz:["🏦","10 من 10 في الاختبار السريع"],
 exam60:["📝","60 أو أكثر في اختبار تجريبي"],exam67:["🏆","67 أو أكثر في اختبار تجريبي"],xp500:["⚡","500 نقطة"],xp1000:["🚀","1000 نقطة"],
 report:["🐞","بلّغت عن خطأ وساعدت زملاءك"],download:["📥","نزّلت ملخصًا للمراجعة"]
};
function badge(id){var p=Prog.load();if(p.badges[id]||!BADGES[id])return false;p.badges[id]=today();Prog.save(p);setTimeout(function(){toast("وسام جديد "+BADGES[id][0]+" "+BADGES[id][1],"lvl");SND.level();confetti(90)},400);return true}
function addXP(n,el){var p=Prog.load(),before=levelOf(p.xp).n,d=today();
 if(p.last!==d){var yd=ymd(new Date(Date.now()-864e5));p.streak=(p.last===yd)?p.streak+1:1;p.last=d;}
 p.xp+=num(n,500);p.days[d]=(p.days[d]||0)+num(n,500);
 var ks=Object.keys(p.days).sort();while(ks.length>60){delete p.days[ks.shift()]}
 Prog.save(p);if(el)fly("+"+n+" ✨",el);chip();
 if(!p.badges.first)badge("first");if(p.streak>=3)badge("streak3");if(p.streak>=7)badge("streak7");if(p.xp>=500)badge("xp500");if(p.xp>=1000)badge("xp1000");
 var after=levelOf(p.xp);if(after.n>before){setTimeout(function(){toast(pick(LINES.level)+" · "+after.name,"lvl");SND.level();confetti(160)},300)}
 return p}
// حد للتكرار السريع (مثل إرسال البلاغات)
function rate(k,ms){var t=LS.get("tm.rate."+k,0);if(Date.now()-t<ms)return Math.ceil((ms-(Date.now()-t))/1000);LS.set("tm.rate."+k,Date.now());return 0}

/* ---------- واجهة برمجية للصفحات ---------- */
var TM={
 TOOLS:TOOLS,LS:LS,SS:SS,Auth:Auth,Prog:Prog,levelOf:levelOf,LEVELS:LEVELS,BADGES:BADGES,badge:badge,cloud:cloud,uid:uid,today:today,esc:esc,clean:clean,rate:rate,
 sound:SND,confetti:confetti,toast:toast,lines:LINES,pick:pick,phrase:function(cat){var a=PH()[cat];return a?pickFresh(cat,a):null},
 isMuted:function(){return muted},
 setMuted:function(v){muted=!!v;LS.set("tm.muted",muted);chip()},
 correct:function(key,xp,el){SND.correct();fx(el,"tm-glow");var p=Prog.load();if(key&&p.done[key]){toast(pickFresh("good",LINES.good),"good");return}if(key){p.done[key]=1;Prog.save(p)}addXP(xp||5,el);toast(pickFresh("good",LINES.good),"good")},
 wrong:function(el){SND.wrong();fx(el,"tm-shake");toast(pickFresh("bad",LINES.bad),"bad")},
 complete:function(key,xp,msg,el){var p=Prog.load();if(p.done[key]){toast(msg||pick(LINES.good),"good");SND.correct();return false}p.done[key]=1;Prog.save(p);addXP(xp||20,el);SND.win();confetti(120);toast(msg||pick(LINES.good),"good");return true},
 isDone:function(key){return !!Prog.load().done[key]},
 best:function(key,score){var p=Prog.load();if(num(score)>(p.best[key]||0)){p.best[key]=num(score);Prog.save(p);return true}return false},
 getBest:function(key){return Prog.load().best[key]||0},
 xp:function(n,el){return addXP(n,el)},
 click:function(){SND.click()},
 config:function(){return cGet("config/site").then(function(c){return c&&typeof c==="object"?c:{}})},
 setConfig:function(c){return cSet("config/site",c)},
 loadScript:function(src){return new Promise(function(res,rej){var s=document.createElement("script");s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s)})}
};
window.TM=TM;

/* ---------- الشريط العلوي والقائمة ---------- */
function chip(){var c=document.querySelector(".tm-chip");if(!c)return;var p=Prog.load(),l=levelOf(p.xp);var nm=session?session.user:"ضيف";c.innerHTML='<span class="av"></span><span class="nm"></span><span class="xp"></span>';c.querySelector(".av").textContent=session&&session.admin?"⚙":(nm.charAt(0)||"؟");c.querySelector(".nm").textContent=nm;c.querySelector(".xp").textContent=session&&session.admin?"المدير":(p.xp+" ✨ · م"+l.n);c.title=l.name;var s=document.querySelector(".tm-sound");if(s){s.textContent=muted?"🔇":"🔊";s.setAttribute("aria-label",muted?"تشغيل الأصوات":"كتم الأصوات")}}
function buildBar(){var bar=document.querySelector(".topbar .wrap");if(!bar)return;
 var brand=bar.querySelector(".brand");if(brand&&!brand.querySelector("i"))brand.innerHTML='<i>100</i>طريق المئة';
 var nav=bar.querySelector("nav");if(nav)nav.remove();
 var sp=document.createElement("span");sp.className="tm-spacer";bar.appendChild(sp);
 var mb=document.createElement("button");mb.type="button";mb.className="tm-menu-btn";mb.innerHTML='☰ <span class="tx">القائمة</span>';mb.setAttribute("aria-label","القائمة");mb.setAttribute("data-snd","none");mb.onclick=openDrawer;bar.appendChild(mb);
 var sd=document.createElement("button");sd.type="button";sd.className="tm-sound";sd.setAttribute("data-snd","none");sd.onclick=function(){TM.setMuted(!muted);if(!muted)SND.toggle()};bar.appendChild(sd);
 var a=document.createElement("a");a.className="tm-chip";a.href=session?(session.admin?"admin.html":"profile.html"):"login.html";bar.appendChild(a);chip();}
function openDrawer(){if(document.querySelector(".tm-drawer"))return;SND.open();var d=document.createElement("div");d.className="tm-drawer";d.setAttribute("role","dialog");d.setAttribute("aria-label","القائمة");
 var cur=function(t){return t.f===FILE||(t.k==="texts"&&/^text-/.test(FILE))?' aria-current="page"':''};
 var inHome=FILE==="index.html",hs=(location.hash||"").slice(1),curS=inHome?(/^isl1/.test(hs)?"isl1":/^ar1/.test(hs)?"ar1":""):SUBJ;
 var html='<div class="shade"></div><div class="panel"><button type="button" class="close" data-snd="none">إغلاق ✕</button><h2>القائمة</h2><a href="index.html#home" class="tm-home"><span class="e">🏠</span>الرئيسية</a><p class="tm-group">المواد</p><div class="tm-list">';
 [["ar1","✒️"],["isl1","📗"]].forEach(function(s){html+='<a href="'+SUBJECTS[s[0]].home+'"'+(s[0]===curS?' aria-current="page"':'')+'><span class="e">'+s[1]+'</span>'+esc(SUBJECTS[s[0]].t)+'</a>'});
 html+='</div><p class="tm-group">التواصل والملاحظات</p><div class="tm-list"><a href="feedback.html"'+(FILE==="feedback.html"?' aria-current="page"':'')+'><span class="e">✉️</span>أرسل ملاحظة أو بلّغ عن خطأ</a></div><p class="tm-group">حسابي</p>';
 html+=''+(session?'<p class="srcnote">مسجّل باسم <b class="who"></b> · <a href="'+(session.admin?"admin.html":"profile.html")+'">'+(session.admin?"لوحة المدير":"لوحتي")+'</a></p>':'<a class="btn" href="login.html">سجّل دخولك واحفظ تقدّمك 🎟️</a>')+'</div>';
 d.innerHTML=html;document.body.appendChild(d);var w=d.querySelector(".who");if(w)w.textContent=session.user;
 function close(){SND.close();d.remove();document.removeEventListener("keydown",onk)}function onk(e){if(e.key==="Escape")close()}
 d.querySelector(".shade").onclick=close;d.querySelector(".close").onclick=close;document.addEventListener("keydown",onk);d.querySelector(".close").focus();}
function fab(){if(KEY==="feedback"||KEY==="login")return;var a=document.createElement("a");a.className="tm-fab";a.href="feedback.html";a.innerHTML="🐞 <span>بلّغ عن خطأ</span>";a.onclick=function(){LS.set("tm.from",{file:FILE,at:Date.now()})};document.body.appendChild(a);}

/* ---------- العبارات في أماكنها ---------- */
function timeCat(){var h=new Date().getHours();return h>=4&&h<12?"morning":h>=12&&h<17?"noon":h>=17&&h<22?"evening":"night"}
function render(el,m,cls){if(!m)return;var pair=Array.isArray(m)?m:[m,""];el.innerHTML="<p></p>";var p=el.querySelector("p");p.textContent=pair[0];if(pair[1]){var s=document.createElement("small");s.textContent=pair[1];p.appendChild(s)}if(cls)el.classList.add(cls)}
function mottos(){var ph=PH();if(!ph.dhikr)return;var toolTips=(ph.tool||{})[KEY];
 // خانة نصيحة في منتصف الصفحة إن لم توجد
 var main=document.querySelector("main"),have=document.querySelectorAll("[data-motto]").length;
 if(main&&have<2&&toolTips&&KEY!=="login"&&KEY!=="admin"){var secs=main.querySelectorAll(":scope > section");var anchor=secs[Math.min(1,secs.length-1)];if(anchor&&anchor.nextSibling){var d=document.createElement("div");d.className="motto";d.setAttribute("data-motto","tooltip");main.insertBefore(d,anchor.nextSibling)}}
 var els=document.querySelectorAll("[data-motto]");if(!els.length)return;
 els.forEach(function(el,i){var want=el.getAttribute("data-motto");var cat,m;
  if(want==="tooltip"&&toolTips){cat="tooltip"}
  else if(want&&ph[want]){cat=want}
  else if(i===0){cat=KEY==="exams"?"dhikr":(Math.random()<.55?"dhikr":"motivation")}
  else if(i===els.length-1){cat=pick(["funny","motivation","proverb","challenge","funny"])}
  else{cat=toolTips&&Math.random()<.6?"tooltip":pick(["tips","exam","proverb"])}
  if(cat==="tooltip"){m=[pick(toolTips),"نصيحة لهذه الأداة"]}else{m=pickFresh(cat,ph[cat])}
  render(el,m,"m-"+cat)});}
function greet(){var d=today();if(LS.get("tm.greeted","")===d)return;LS.set("tm.greeted",d);var ph=PH();if(!ph.morning)return;setTimeout(function(){var nm=session&&!session.admin?" يا "+session.user:"";toast(pick(ph[timeCat()])+(nm?" ·"+nm:""),"",4200);SND.chime()},900)}
// تذكير بالاستراحة كل 25 دقيقة من المذاكرة الفعلية
function breaks(){var t=SS.get("tm.active",0),last=Date.now();setInterval(function(){if(document.hidden)return;t+=30;SS.set("tm.active",t);if(t>0&&t%(25*60)===0){var w=TM.phrase("wellbeing");if(w){toast(w[0],"",6000);SND.chime()}}},30000)}

/* ---------- أصوات الأزرار ---------- */
function clickSounds(){document.addEventListener("click",function(e){var el=e.target.closest&&e.target.closest('button,a,summary,[role="tab"],label,input[type="checkbox"],input[type="radio"]');if(!el||el.getAttribute("data-snd")==="none"||el.disabled)return;
 if(el.tagName==="SUMMARY"){var det=el.parentElement;setTimeout(function(){det&&det.open?SND.open():SND.close()},0);return}
 if(el.getAttribute("role")==="tab"||el.closest(".seg,.modes,.chips,.decks,.tabs,.roundpick,.pickx,.pick"))return SND.toggle();
 if(el.tagName==="A"){var h=el.getAttribute("href")||"";if(h.charAt(0)==="#")return SND.tap();return SND.nav()}
 if(el.tagName==="LABEL"||el.tagName==="INPUT")return SND.toggle();
 SND.click()},true);}

/* ---------- ربط تلقائي ---------- */
function autoHooks(){
 var h1=document.querySelector(".hero h1");var tool=TOOLS.filter(function(t){return t.k===KEY})[0];if(h1&&tool&&!h1.querySelector(".emo")){var em=document.createElement("span");em.className="emo";em.setAttribute("aria-hidden","true");em.textContent=tool.e;h1.insertBefore(em,h1.firstChild)}
 document.querySelectorAll("[data-done]").forEach(function(b){var k=b.getAttribute("data-done");b.setAttribute("data-snd","none");var mark=function(){b.textContent="✔ أنهيته، أحسنت";b.classList.add("ghost")};if(Prog.load().done[k])mark();b.addEventListener("click",function(){TM.complete(k,parseInt(b.getAttribute("data-xp"),10)||30,"نص كامل صار في جيبك! 📜🔥",b);mark();var p=Prog.load(),n=0;for(var x in p.done)if(x.indexOf("text:")===0)n++;if(n>=1)badge("text1");if(n>=8)badge("text8")})});
 document.querySelectorAll("details.try").forEach(function(d,i){d.addEventListener("toggle",function(){if(d.open){var k="try:"+FILE+":"+i;var p=Prog.load();if(!p.done[k]){p.done[k]=1;Prog.save(p);addXP(2,d.querySelector("summary"))}}})});
 // كل الروابط الخارجية تفتح بأمان
 document.querySelectorAll('a[target="_blank"]').forEach(function(a){a.setAttribute("rel","noopener noreferrer")});}

/* ---------- التشغيل ---------- */
function visit(){var p=Prog.load();p.visits[KEY]=(p.visits[KEY]||0)+1;LS.set(Prog.key(),p)}
function start(){buildBar();fab();autoHooks();visit();clickSounds();breaks();
 var go=function(){mottos();if(KEY!=="login")greet()};
 if(window.TM_PHRASES)go();else TM.loadScript(SCRIPT_BASE+"phrases.js").then(go).catch(go);
 var un=function(){ac();document.removeEventListener("pointerdown",un)};document.addEventListener("pointerdown",un);
 cloud.ready.then(function(){chip()});}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();
