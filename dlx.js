// تنزيل عام لأي صفحة: يضع زرّي «PDF» و«صفحة ويب» داخل أي عنصر [data-dl]
// data-dl="اسم الملف"  ·  data-dl-src="محدد العنصر المراد تنزيله" (الافتراضي main)
// data-dl-build="اسم دالة عامة" تُرجع عنصرًا جاهزًا للتنزيل (مثل بنك الأسئلة)
(function(){
"use strict";
var LIBS={h2c:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",pdf:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"};
var busy=false;
function load(src){return new Promise(function(res,rej){if(document.querySelector('script[src="'+src+'"]'))return res();var s=document.createElement("script");s.src=src;s.crossOrigin="anonymous";s.onload=res;s.onerror=function(){rej(new Error("lib"))};document.head.appendChild(s)})}
function save(name,data,mime){
 var viaClaude=window.claude&&claude.use?claude.use("downloads").catch(function(){return null}):Promise.resolve(null);
 return viaClaude.then(function(d){
  if(d)return d.save({filename:name,data:data}).then(function(){return "saved"}).catch(function(e){var c=e&&e.code;if(c==="declined")return "declined";if(c==="rate_limited")throw "توجد نافذة تنزيل مفتوحة؛ أغلقها ثم حاول مرة أخرى.";throw "التنزيل غير متاح في هذا العرض؛ افتح الموقع من رابطه في claude.ai."});
  if(window.claude)throw "التنزيل غير متاح في هذا العرض؛ افتح الموقع من رابطه في claude.ai.";
  var blob=data instanceof Blob?data:new Blob([data],{type:mime});var u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},2000);return "saved"})}

var VARS="--bg:#f7f6f2;--paper:#fff;--ink:#23283a;--muted:#636979;--line:#e6e2d9;--accent:#8f5a1e;--hue:#8f5a1e;--accent-soft:#f6efe6;--accent-ink:#fff;--gold:#8f5a1e;--gold-soft:#f8f1e6;--good:#1f7a3f;--good-soft:#e2f4e7;--bad:#b3303d;--bad-soft:#fbe6e8;--shadow:none;color-scheme:light";
function sheet(host){
 var title=host.getAttribute("data-dl")||document.title;
 var box=document.createElement("div");box.className="dl-sheet";box.setAttribute("dir","rtl");
 box.style.cssText="position:fixed;left:-10000px;top:0;width:794px;padding:34px 38px;background:#fff;color:#23283a;font-family:var(--body);font-size:15px;line-height:1.85;"+VARS;
 var subj=/^isl-/.test(decodeURIComponent(location.pathname.split("/").pop()||""))?"العلوم الإسلامية (1)":"اللغة العربية (1)";var col=subj.indexOf("الإسلامية")>0?"#4d6b45":"#8f5a1e";
 var head=document.createElement("div");head.style.cssText="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid "+col+";padding-bottom:10px;margin-bottom:18px";
 head.innerHTML='<div><div style="font-family:var(--display);font-size:24px;color:'+col+'">طريق المئة</div><div style="color:#636979;font-size:13px">'+subj+' · الصف الثاني عشر · <b></b></div></div><div style="font-size:12px;color:#636979;text-align:left">من الكتاب المدرسي<br>واختبارات الوزارة</div>';
 head.querySelector("b").textContent=title;box.appendChild(head);
 var content,b=host.getAttribute("data-dl-build");
 if(b&&typeof window[b]==="function")content=window[b]();
 else{var src=document.querySelector(host.getAttribute("data-dl-src")||"main");content=src?src.cloneNode(true):document.createElement("div")}
 content.querySelectorAll("[hidden],.jump,nav,button,script,input,select,textarea,.motto,[data-motto],[data-dl],.tm-done,.no-dl,.tm-fab").forEach(function(x){x.remove()});
 content.querySelectorAll("details").forEach(function(d){d.open=true});
 content.querySelectorAll("*").forEach(function(x){x.style.boxShadow="none";x.style.animation="none"});
 box.appendChild(content);
 var foot=document.createElement("p");foot.style.cssText="margin-top:10px;color:#636979;font-size:12px;text-align:center";foot.textContent="بالتوفيق 🤍 · طريق المئة";box.appendChild(foot);
 document.body.appendChild(box);return {box:box,title:title}}
function cutAt(ctx,w,ideal,minY){for(var y=ideal;y>Math.max(minY,ideal-260);y-=2){var d=ctx.getImageData(0,y,w,1).data,clean=true;for(var x=0;x<d.length;x+=16){if(d[x]<245||d[x+1]<245||d[x+2]<245){clean=false;break}}if(clean)return y}return ideal}
function makePdf(host,ui){
 return load(LIBS.h2c).then(function(){ui.p(.15,"نحمّل أدوات الملف…");return load(LIBS.pdf)}).then(function(){
  var s=sheet(host),box=s.box;ui.p(.3,"نرسم الصفحات…");
  return (document.fonts&&document.fonts.ready||Promise.resolve()).then(function(){return html2canvas(box,{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false,windowWidth:794})}).then(function(cv){box.remove();ui.p(.7,"نرتّب الصفحات…");
   var J=window.jspdf&&window.jspdf.jsPDF;if(!J)throw new Error("lib");var pdf=new J({unit:"pt",format:"a4",compress:true});
   var PW=pdf.internal.pageSize.getWidth(),PH=pdf.internal.pageSize.getHeight(),pageH=Math.floor(cv.width*PH/PW),ctx=cv.getContext("2d"),y=0,n=0;
   while(y<cv.height-4){var end=Math.min(cv.height,y+pageH);if(end<cv.height)end=cutAt(ctx,cv.width,end,y+pageH*.55);var part=document.createElement("canvas");part.width=cv.width;part.height=end-y;var pc=part.getContext("2d");pc.fillStyle="#fff";pc.fillRect(0,0,part.width,part.height);pc.drawImage(cv,0,y,cv.width,end-y,0,0,cv.width,end-y);
    if(n)pdf.addPage();pdf.addImage(part.toDataURL("image/jpeg",.9),"JPEG",0,0,PW,(end-y)*PW/cv.width);n++;
    pdf.setFontSize(9);pdf.setTextColor(140);pdf.text(String(n),PW/2,PH-14,{align:"center"});y=end}
   return {blob:pdf.output("blob"),title:s.title}})})}
function makeHtml(host){
 return fetch("site.css").then(function(r){return r.ok?r.text():""}).catch(function(){return ""}).then(function(css){
  var s=sheet(host),body=s.box.innerHTML;s.box.remove();
  var extra=Array.prototype.map.call(document.querySelectorAll("head style"),function(x){return x.textContent}).join("\n");
  return {text:'<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+s.title.replace(/[<>&]/g,"")+' · طريق المئة</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Reem+Kufi:wght@500;700&family=Amiri&display=swap"><style>'+css+"\n"+extra+'\nbody{background:#f7f6f2;margin:0}.dl-sheet{max-width:860px;margin:0 auto;padding:24px 18px;background:#fff;'+VARS+'}</style></head><body><div class="dl-sheet">'+body+'</div></body></html>',title:s.title}})}
function fname(t,ext){return "طريق-المئة-"+String(t).replace(/[\\\/:*?"<>|]/g,"").replace(/\s+/g,"-")+"."+ext}

function mount(host){
 if(host.classList.contains("dlx"))return;host.classList.add("dlx");
 host.innerHTML='<div class="dlx-row"><span class="dlx-t">📥 نزّل هذه الصفحة للمراجعة بلا إنترنت:</span><button type="button" class="btn dlx-pdf">PDF</button><button type="button" class="btn ghost dlx-html">صفحة ويب</button></div><div class="dlx-prog" hidden><i></i><span></span></div><p class="dlx-msg" hidden></p>';
 var pg=host.querySelector(".dlx-prog"),bar=pg.querySelector("i"),tx=pg.querySelector("span"),msg=host.querySelector(".dlx-msg");
 var ui={p:function(v,t){pg.hidden=false;bar.style.width=Math.round(v*100)+"%";if(t)tx.textContent=t}};
 function say(t,bad){msg.textContent=t;msg.className="dlx-msg"+(bad?" bad":"");msg.hidden=false}
 function run(kind){if(busy)return;busy=true;msg.hidden=true;ui.p(.05,"نجهّز الملف…");
  var job=kind==="pdf"?makePdf(host,ui).then(function(r){return save(fname(r.title,"pdf"),r.blob,"application/pdf")}):makeHtml(host).then(function(r){ui.p(.8);return save(fname(r.title,"html"),r.text,"text/html")});
  job.then(function(r){ui.p(1,"جاهز ✅");if(r==="declined"){say("أُلغي التنزيل. يمكنك المحاولة مرة أخرى متى شئت.");return}say(kind==="pdf"?"تم تنزيل ملف PDF ✅":"تم تنزيل صفحة الويب ✅");if(window.TM){TM.sound&&TM.sound.win&&TM.sound.win();TM.badge&&TM.badge("download")}})
  .catch(function(e){say(typeof e==="string"?e:"تعذّر تجهيز الملف. تأكد من الاتصال بالإنترنت وحاول مرة أخرى، أو جرّب «صفحة ويب».",true)})
  .then(function(){busy=false;setTimeout(function(){pg.hidden=true},1400)})}
 host.querySelector(".dlx-pdf").onclick=function(){run("pdf")};
 host.querySelector(".dlx-html").onclick=function(){run("html")};
}
var st=document.createElement("style");st.textContent=".dlx{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:8px}.dlx-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.dlx-t{font-weight:600;flex:1 1 220px}.dlx .btn{padding:6px 16px;font-size:.9rem}.dlx-prog{position:relative;height:24px;border-radius:999px;background:var(--bg);overflow:hidden}.dlx-prog i{position:absolute;inset:0 auto 0 0;width:0;background:var(--accent-soft);transition:width .3s}.dlx-prog span{position:relative;display:block;text-align:center;font-size:.8rem;line-height:24px}.dlx-msg{font-size:.9rem;color:var(--good)}.dlx-msg.bad{color:var(--bad)}";document.head.appendChild(st);
document.querySelectorAll("[data-dl]").forEach(mount);
window.TMDLX={mount:function(el){if(el&&!el.classList.contains("dlx"))mount(el)}};
})();
