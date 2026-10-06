/* تمكّني — الثيم + الخط + الفلترة + اختبار المهارات */
document.addEventListener("DOMContentLoaded", () => {
  const root = document.documentElement;

  /* ---------- الثيم ليلي / نهاري ---------- */
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.getElementById("themeIcon");
  const themeText = document.getElementById("themeText");
  const savedTheme = localStorage.getItem("tm-theme") || "light";
  const applyTheme = (t) => {
    root.setAttribute("data-theme", t);
    localStorage.setItem("tm-theme", t);
    const dark = t === "dark";
    themeIcon.textContent = dark ? "☀️" : "🌙";
    themeText.textContent = dark ? "نهاري" : "ليلي";
  };
  applyTheme(savedTheme);
  themeToggle.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  /* ---------- تكبير / تصغير الخط ---------- */
  let fontScale = parseInt(localStorage.getItem("tm-font") || "100", 10);
  const label = document.getElementById("fontSizeLabel");
  const applyFont = () => {
    fontScale = Math.min(140, Math.max(80, fontScale));
    root.style.fontSize = (16 * fontScale / 100) + "px";
    label.textContent = fontScale + "%";
    localStorage.setItem("tm-font", String(fontScale));
  };
  applyFont();
  document.getElementById("fontIncrease").addEventListener("click", () => { fontScale += 10; applyFont(); });
  document.getElementById("fontDecrease").addEventListener("click", () => { fontScale -= 10; applyFont(); });
  document.getElementById("fontReset").addEventListener("click", () => { fontScale = 100; applyFont(); });

  /* ---------- القائمة + العودة للأعلى + الظهور ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("open");
    navLinks.classList.toggle("open");
  });
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    menuToggle.classList.remove("open"); navLinks.classList.remove("open");
  }));
  const backToTop = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- فلترة الدورات ---------- */
  document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const f = btn.dataset.filter;
      document.querySelectorAll("#coursesGrid .course-card").forEach(card => {
        card.classList.toggle("hide", f !== "all" && card.dataset.cat !== f);
      });
    });
  });

  /* ---------- التسجيل (تجريبي) ---------- */
  const note = document.getElementById("enrollNote");
  let myCourses = JSON.parse(localStorage.getItem("tm-courses") || "[]");
  document.querySelectorAll(".enroll-btn").forEach(btn => {
    const name = btn.dataset.course;
    if (myCourses.includes(name)) { btn.textContent = "✓ مسجّلة"; btn.disabled = true; }
    btn.addEventListener("click", () => {
      if (!myCourses.includes(name)) myCourses.push(name);
      localStorage.setItem("tm-courses", JSON.stringify(myCourses));
      btn.textContent = "✓ تم التسجيل";
      btn.disabled = true;
      note.textContent = `تم تسجيلك في دورة «${name}» بنجاح! ستصلك التفاصيل على بريدك. (${myCourses.length} دورات مسجلة)`;
    });
  });

  /* ================= اختبار المهارات ================= */
  const QUESTIONS = [
    { skill: "تقنية", q: "تريدين شرح درس نحو بطريقة تفاعلية سريعة. أفضل أداة ذكاء اصطناعي؟", opts: ["توليد أسئلة وتمارين متنوعة ثم مراجعتها تربوياً", "نسخ إجابات جاهزة وتوزيعها دون مراجعة", "منع الطالبات من استخدام أي تقنية", "الاكتفاء بالكتاب فقط"], a: 0, why: "الذكاء الاصطناعي مساعد للمعلمة، والمراجعة التربوية تضمن الدقة." },
    { skill: "تعلم نشط", q: "أي استراتيجية تنمّي التفكير العليا (تحليل/تقويم/إبداع)؟", opts: ["تلقين وحفظ فقط", "مشروع صفي يحل مشكلة واقعية + نقاش", "نسخ الملخص من السبورة", "اختبار حفظ أسبوعي"], a: 1, why: "التعلم القائم على المشاريع يفعّل مستويات بلوم العليا." },
    { skill: "إدارة صف", q: "طالبة تقاطع زميلاتها باستمرار. التصرف الأفضل أولاً؟", opts: ["الصراخ أمام الصف", "تعزيز السلوك الإيجابي + اتفاق صفّي + مهمة قيادية لها", "طردها فوراً", "تجاهل الأمر تماماً"], a: 1, why: "التعزيز الإيجابي والاتفاقات الصفية أكثر فاعلية من العقاب." },
    { skill: "تقويم", q: "ما الفرق الجوهري بين التقويم التكويني والختامي؟", opts: ["لا فرق بينهما", "التكويني أثناء التعلم لتحسينه، والختامي في النهاية للحكم", "التكويني أصعب دائماً", "الختامي بدون درجات"], a: 1, why: "التكويني للتغذية الراجعة والتحسين، والختامي للقرار النهائي." },
    { skill: "تقنية", q: "قبل مشاركة صور طالباتك في منصة تعليمية، يجب؟", opts: ["النشر مباشرة فلا مشكلة", "الحصول على موافقة الإدارة/الأهل وطمس البيانات الحساسة", "مشاركتها في مجموعات عامة", "استخدام أسمائهن الكاملة للدقة"], a: 1, why: "حماية خصوصية الطالبات أساس المواطنة الرقمية." },
    { skill: "دامج", q: "لديك فروق فردية كبيرة في الصف. الحل الأنسب؟", opts: ["شرح واحد للجميع فقط", "تفريق التعليم: مهام متدرجة + مجموعات مرنة + دعم بصري", "إهمال المتأخرات", "خفض سقف التوقعات للجميع"], a: 1, why: "تفريق التعليم يلبي احتياجات كل طالبة دون استثناء." },
    { skill: "تقويم", q: "أي أداة أنسب لتقويم مهارة الإلقاء والعرض؟", opts: ["اختبار اختيار من متعدد فقط", "روبرك (سلم تقدير) بمعايير واضحة: اللغة، الإلقاء، المحتوى", "سؤال صح/خطأ", "بدون تقويم"], a: 1, why: "الروبرك يضمن العدالة والشفافية في تقويم الأداء." },
    { skill: "تعلم نشط", q: "الصف المقلوب يعني؟", opts: ["المعلمة تشرح والطالبات نائمات", "الطالبة تتعلم المحتوى في البيت (فيديو) والصف للتطبيق والنقاش", "إلغاء الواجبات", "قلب الطاولات فقط"], a: 1, why: "يُستثمر وقت الحصة في التطبيق بدل التلقين." },
    { skill: "قيادة", q: "أفضل طريقة لبناء ملف إنجاز مهني للرخصة؟", opts: ["جمع شهادات فقط", "أدلة موثقة: خطط، صور أنشطة، نتائج طالبات، تأمل مهني", "نسخ ملف زميلة", "ملف فارغ"], a: 1, why: "الأدلة والتأمل المهني يعكسان النمو الحقيقي." },
    { skill: "إدارة صف", q: "لزيادة دافعية الطالبات، الأقوى أثراً بحسب الأبحاث؟", opts: ["التهديد بالدرجات", "أهداف واضحة + خيارات + تغذية راجعة فورية محددة", "المقارنة بين الطالبات علناً", "واجبات عقابية كثيرة"], a: 1, why: "الاستقلالية والكفاءة والتغذية الراجعة وقود الدافعية." },
  ];

  const startScr = document.getElementById("quizStart");
  const playScr = document.getElementById("quizPlay");
  const resScr = document.getElementById("quizResult");
  const qText = document.getElementById("quizQuestion");
  const qOpts = document.getElementById("quizOptions");
  const qCount = document.getElementById("quizCounter");
  const qTag = document.getElementById("quizSkillTag");
  const qFill = document.getElementById("quizProgressFill");
  const qFeed = document.getElementById("quizFeedback");
  const nextBtn = document.getElementById("nextBtn");
  const bestEl = document.getElementById("bestScore");

  let idx = 0, score = 0, locked = false;
  const showBest = () => {
    const b = localStorage.getItem("tm-best");
    bestEl.textContent = b === null ? "—" : b + "/10";
  };
  showBest();

  const show = (el) => [startScr, playScr, resScr].forEach(s => s.classList.toggle("active", s === el));

  document.getElementById("startQuizBtn").addEventListener("click", () => {
    idx = 0; score = 0; show(playScr); renderQ();
  });
  document.getElementById("retryBtn").addEventListener("click", () => {
    idx = 0; score = 0; show(playScr); renderQ();
  });

  function renderQ() {
    locked = false;
    nextBtn.disabled = true;
    qFeed.textContent = ""; qFeed.className = "quiz-feedback";
    const item = QUESTIONS[idx];
    qCount.textContent = `السؤال ${idx + 1} من ${QUESTIONS.length}`;
    qTag.textContent = item.skill;
    qFill.style.width = (idx / QUESTIONS.length * 100) + "%";
    qText.textContent = item.q;
    qOpts.innerHTML = "";
    item.opts.forEach((t, i) => {
      const b = document.createElement("button");
      b.className = "quiz-opt"; b.textContent = t;
      b.addEventListener("click", () => answer(i, b));
      qOpts.appendChild(b);
    });
  }

  function answer(i, btn) {
    if (locked) return;
    locked = true;
    const item = QUESTIONS[idx];
    const btns = [...qOpts.children];
    btns.forEach(b => b.disabled = true);
    if (i === item.a) {
      score++;
      btn.classList.add("correct");
      qFeed.textContent = "✓ إجابة صحيحة! " + item.why;
      qFeed.classList.add("good");
    } else {
      btn.classList.add("wrong");
      btns[item.a].classList.add("correct");
      qFeed.textContent = "✗ الإجابة الصحيحة مظللة بالأخضر. " + item.why;
      qFeed.classList.add("bad");
    }
    qFill.style.width = ((idx + 1) / QUESTIONS.length * 100) + "%";
    nextBtn.disabled = false;
    nextBtn.textContent = idx === QUESTIONS.length - 1 ? "عرض النتيجة ★" : "التالي ←";
  }

  nextBtn.addEventListener("click", () => {
    if (idx < QUESTIONS.length - 1) { idx++; renderQ(); }
    else showResult();
  });

  function showResult() {
    show(resScr);
    const pct = Math.round(score / QUESTIONS.length * 100);
    const circle = document.querySelector(".result-circle");
    circle.style.setProperty("--p", pct + "%");
    document.getElementById("resultPct").textContent = pct + "%";
    let level, desc, rec;
    if (pct >= 90) { level = "خبيرة متمكنة 🌟"; desc = `ممتاز! أجبتِ صحيحة عن ${score} من 10. جاهزة لدورات القيادة والـ STEM.`; rec = "نرشح لك: القيادة الصفية + دمج STEM"; }
    else if (pct >= 70) { level = "متقدمة 💪"; desc = `أحسنتِ! ${score} من 10. لديك أساس قوي، طوّري التقويم والتقنية.`; rec = "نرشح لك: التقويم البديل + الذكاء الاصطناعي"; }
    else if (pct >= 50) { level = "متطورة 🌱"; desc = `جيد! ${score} من 10. ركّزي على التعلم النشط وإدارة الصف.`; rec = "نرشح لك: التعلم النشط + إدارة الصف الرقمي"; }
    else { level = "في بداية الطريق 🌸"; desc = `حصلتِ على ${score} من 10 — وهذه بداية جميلة! ابدئي بالأساسيات.`; rec = "نرشح لك: إدارة الصف الرقمي + التعليم الدامج"; }
    document.getElementById("resultLevel").textContent = "مستواك: " + level;
    document.getElementById("resultDesc").textContent = desc;
    document.getElementById("resultRec").textContent = "🎯 " + rec;
    const prev = parseInt(localStorage.getItem("tm-best") || "-1", 10);
    if (score > prev) localStorage.setItem("tm-best", String(score));
    showBest();
  }
});
