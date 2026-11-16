// عبارات تحفيز تتغير عند كل فتح للصفحة. يعمل بدون تخزين.
(function(){
  var list=[
    ["﴿وَقُل رَّبِّ زِدْنِي عِلْمًا﴾","سورة طه: 114"],
    ["المئة ليست حظًا، المئة خطة. وأنت تمشي عليها الآن.",""],
    ["لا تدع الجوال يسرق منك درجة كنت تستحقها.",""],
    ["تعب ساعة المذاكرة يزول، وفرحة الدرجة الكاملة تبقى.",""],
    ["ابدأ ولو بصفحة واحدة. المهم أن تبدأ اليوم.",""],
    ["من جدّ وجد، ومن زرع حصد.","مثل عربي"],
    ["اللهم لا سهل إلا ما جعلته سهلًا، وأنت تجعل الحزن إذا شئت سهلًا.","دعاء"],
    ["أنت أقرب إلى المئة مما تظن. خطوة اليوم تكفي.",""],
    ["درجة تحصّلها اليوم أهون من ندم بعد النتيجة.",""],
    ["صلِّ على النبي ﷺ، وابدأ مستعينًا بالله.",""],
    ["كل سؤال تحلّه الآن، سؤال لن يفاجئك في الاختبار.",""],
    ["أهلك ينتظرون فرحتك. اجعلها مئة.",""]
  ];
  var els=document.querySelectorAll('[data-motto]');
  if(!els.length) return;
  var start=Math.floor(Math.random()*list.length);
  els.forEach(function(el,i){var m=list[(start+i)%list.length];
    el.innerHTML='<p>'+m[0]+(m[1]?'<small>'+m[1]+'</small>':'')+'</p>';});
})();
// على الجوال: اجعل رابط الصفحة الحالية ظاهرًا في الشريط العلوي
(function(){
  var nav=document.querySelector('.topbar nav'),a=nav&&nav.querySelector('a[aria-current="page"]');
  if(!nav||!a||nav.scrollWidth<=nav.clientWidth) return;
  var nr=nav.getBoundingClientRect(),ar=a.getBoundingClientRect();
  nav.scrollLeft+= (ar.left+ar.width/2)-(nr.left+nr.width/2);
})();
