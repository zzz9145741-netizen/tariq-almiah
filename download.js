// تنزيل الملخصات: PDF (صور عالية الدقة مع فواصل صفحات ذكية) أو صفحة ويب مستقلة
(function(){
"use strict";
var $=function(id){return document.getElementById(id)};
var NAMES={all:"كل الملخصات",quran:"القرآن الكريم",hadith:"الحديث الشريف",sadr:"شعر صدر الإسلام",itidhar:"الأغراض الجاهلية والاعتذار",madhahib:"المذاهب الأدبية",manahij:"المناهج النقدية"};
var ORDER=["quran","hadith","sadr","itidhar","madhahib","manahij"];
var LIBS={h2c:"https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",pdf:"https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"};
var busy=false;

function prog(p,t){$("dlProg").hidden=false;$("dlBar").style.width=Math.round(p*100)+"%";if(t)$("dlTxt").textContent=t}
function msg(t,bad){var m=$("dlMsg");m.textContent=t;m.className="msg-dl"+(bad?" bad":"");m.hidden=false}
function lock(on){busy=on;["dlPdf","dlHtml"].forEach(function(i){$(i).disabled=on});document.querySelectorAll(".ldl").forEach(function(b){b.disabled=on})}
function ids(which){return which==="all"?ORDER:[which]}
function fname(which,ext){return "طريق-المئة-ملخص-"+NAMES[which].replace(/\s+/g,"-")+"."+ext}
function load(src){return new Promise(function(res,rej){if(document.querySelector('script[src="'+src+'"]'))return res();var s=document.createElement("script");s.src=src;s.crossOrigin="anonymous";s.onload=res;s.onerror=function(){rej(new Error("lib"))};document.head.appendChild(s)})}

// الحفظ: عبر خاصية التنزيلات في claude.ai، وإلا رابط تنزيل عادي (خارج claude.ai)
function save(name,data,mime){
 var viaClaude=window.claude&&claude.use?claude.use("downloads").catch(function(){return null}):Promise.resolve(null);
 return viaClaude.then(function(d){
  if(d)return d.save({filename:name,data:data}).then(function(){return "saved"}).catch(function(e){var c=e&&e.code;if(c==="declined")return "declined";if(c==="rate_limited")throw "في نافذة تنزيل مفتوحة. سكّرها وجرّب مرة ثانية.";throw "التنزيل مب متاح في هذا العرض. افتح الموقع من claude.ai."});
  if(window.claude)throw "التنزيل مب متاح في هذا العرض. افتح الموقع من claude.ai.";
  var blob=data instanceof Blob?data:new Blob([data],{type:mime});var u=URL.createObjectURL(blob),a=document.createElement("a");a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(u);a.remove()},2000);return "saved"});}

// نسخة نظيفة من الدرس (بدون أزرار، بألوان الطباعة)
function sheet(which,forPdf){
 var box=document.createElement("div");box.className="dl-sheet";box.setAttribute("dir","rtl");
 box.style.cssText="position:fixed;left:-10000px;top:0;width:794px;padding:34px 38px;background:#fff;color:#1d2033;font-family:var(--body);font-size:15px;line-height:1.85;--bg:#f6f2ea;--paper:#fff;--ink:#1d2033;--muted:#5b6180;--line:#e2e3ee;--accent:#a85a0a;--accent-soft:#f8ecd9;--accent-ink:#fff;--gold:#a3610a;--gold-soft:#fdf1dc;--good:#1f7a3f;--good-soft:#e2f4e7;--bad:#b3303d;--bad-soft:#fbe6e8;--shadow:none;color-scheme:light";
 var st=document.createElement("style");st.textContent=".dl-sheet .cmp{overflow:visible}.dl-sheet .cmp table{min-width:0;font-size:12.5px;table-layout:fixed}.dl-sheet .cmp th,.dl-sheet .cmp td{padding:6px 7px}.dl-sheet .cmp tbody th{white-space:normal;width:84px}.dl-sheet .lesson{box-shadow:none!important}.dl-sheet .dl-ic{animation:none}";box.appendChild(st);
 var head=document.createElement("div");head.style.cssText="display:flex;justify-content:space-between;align-items:center;border-bottom:3px solid #a85a0a;padding-bottom:10px;margin-bottom:18px";
 head.innerHTML='<div><div style="font-family:var(--display);font-size:24px;color:#a85a0a">طريق المئة</div><div style="color:#5b6180;font-size:13px">اللغة العربية (1) · الصف الثاني عشر · ملخص: <b></b></div></div><div style="font-size:12px;color:#5b6180;text-align:left">من الكتاب المدرسي<br>واختبارات الوزارة</div>';
 head.querySelector("b").textContent=NAMES[which];box.appendChild(head);
 ids(which).forEach(function(id,i){var src=$(id);if(!src)return;var c=src.cloneNode(true);c.removeAttribute("id");c.querySelectorAll(".ldl,.links,.btn").forEach(function(x){x.remove()});c.style.cssText="box-shadow:none;margin-bottom:22px;break-inside:avoid";c.setAttribute("data-sec",i);box.appendChild(c)});
 var foot=document.createElement("p");foot.style.cssText="margin-top:10px;color:#5b6180;font-size:12px;text-align:center";foot.textContent="بالتوفيق يا بطل 🤍 · طريق المئة";box.appendChild(foot);
 document.body.appendChild(box);return box}

// يبحث عن سطر أبيض قريب من حد الصفحة حتى لا يقطع الكلام
function cutAt(ctx,w,ideal,minY){for(var y=ideal;y>Math.max(minY,ideal-260);y-=2){var d=ctx.getImageData(0,y,w,1).data,clean=true;for(var x=0;x<d.length;x+=16){if(d[x]<245||d[x+1]<245||d[x+2]<245){clean=false;break}}if(clean)return y}return ideal}

function makePdf(which){
 return load(LIBS.h2c).then(function(){prog(.15,"نحمّل أدوات الـ PDF…");return load(LIBS.pdf)}).then(function(){
  var box=sheet(which,true);prog(.3,"نرسم الصفحات… 🎨");
  return (document.fonts&&document.fonts.ready||Promise.resolve()).then(function(){return html2canvas(box,{scale:2,backgroundColor:"#ffffff",useCORS:true,logging:false,windowWidth:794})}).then(function(cv){box.remove();prog(.7,"نرتّب الصفحات… 📄");
   var J=window.jspdf&&window.jspdf.jsPDF;if(!J)throw new Error("lib");var pdf=new J({unit:"pt",format:"a4",compress:true});
   var PW=pdf.internal.pageSize.getWidth(),PH=pdf.internal.pageSize.getHeight(),pageH=Math.floor(cv.width*PH/PW),ctx=cv.getContext("2d"),y=0,n=0;
   while(y<cv.height-4){var end=Math.min(cv.height,y+pageH);if(end<cv.height)end=cutAt(ctx,cv.width,end,y+pageH*.55);var part=document.createElement("canvas");part.width=cv.width;part.height=end-y;var pc=part.getContext("2d");pc.fillStyle="#fff";pc.fillRect(0,0,part.width,part.height);pc.drawImage(cv,0,y,cv.width,end-y,0,0,cv.width,end-y);
    if(n)pdf.addPage();pdf.addImage(part.toDataURL("image/jpeg",.9),"JPEG",0,0,PW,(end-y)*PW/cv.width);n++;
    pdf.setFontSize(9);pdf.setTextColor(140);pdf.text(String(n),PW/2,PH-14,{align:"center"});y=end}
   prog(.92,"آخر لمسات… ✨");return pdf.output("blob")})})}

function makeHtml(which){
 return fetch("site.css").then(function(r){return r.ok?r.text():""}).catch(function(){return ""}).then(function(css){
  var box=sheet(which,false),body=box.innerHTML;box.remove();
  var extra=Array.prototype.map.call(document.querySelectorAll("head style"),function(s){return s.textContent}).join("\n");
  return '<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+NAMES[which].replace(/[<>&]/g,"")+' · طريق المئة</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600;700&family=Reem+Kufi:wght@500;700&family=Amiri&display=swap"><style>'+css+"\n"+extra+'\nbody{background:#f4f5fb;margin:0}.dl-sheet{max-width:860px;margin:0 auto;padding:24px 18px;background:#fff;color:#1d2033;--bg:#f6f2ea;--paper:#fff;--ink:#1d2033;--muted:#5b6180;--line:#e2e3ee;--accent:#a85a0a;--accent-soft:#f8ecd9;--accent-ink:#fff}@media print{body{background:#fff}.lesson{break-inside:avoid}}</style></head><body><div class="dl-sheet">'+body+'</div></body></html>'})}

function run(kind,which){if(busy)return;lock(true);$("dlMsg").hidden=true;prog(.05,"نجهّز الملف…");
 var job=kind==="pdf"?makePdf(which).then(function(b){return save(fname(which,"pdf"),b,"application/pdf")}):makeHtml(which).then(function(s){prog(.8);return save(fname(which,"html"),s,"text/html")});
 job.then(function(r){prog(1,"جاهز ✅");if(r==="declined"){msg("تم إلغاء التنزيل. تقدر تجرّب مرة ثانية متى ما بغيت.");return}msg((kind==="pdf"?"تم تنزيل ملف PDF ✅ ":"تم تنزيل صفحة الويب ✅ ")+"راجعها وأنت بعيد عن الشاشة 📚");if(window.TM){TM.sound.win();TM.confetti(80);TM.badge("download")}})
 .catch(function(e){msg(typeof e==="string"?e:"ما قدرنا نجهّز الملف. تأكد من النت وجرّب مرة ثانية، أو جرّب «صفحة ويب».",true);window.TM&&TM.sound.wrong()})
 .then(function(){lock(false);setTimeout(function(){$("dlProg").hidden=true},1400)})}

$("dlPdf").onclick=function(){run("pdf",$("dlWhich").value)};
$("dlHtml").onclick=function(){run("html",$("dlWhich").value)};
// زر تنزيل صغير في رأس كل درس
ORDER.forEach(function(id){var a=$(id);if(!a)return;var h=a.querySelector("header");if(!h)return;var b=document.createElement("button");b.type="button";b.className="ldl";b.textContent="📥 نزّل هذا الملخص PDF";b.onclick=function(){$("dlWhich").value=id;run("pdf",id)};h.appendChild(b)});
})();
