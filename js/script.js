/* ============================================================
   موقع مقررات د. عواطف – التفاعلات
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- قائمة الجوال ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("open");
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      menuToggle.setAttribute("aria-label", isOpen ? "إغلاق القائمة" : "فتح القائمة");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("open");
        navLinks.classList.remove("open");
      });
    });
  }

  /* ---------- شريط التنقل وزر العودة ---------- */
  const navbar = document.getElementById("navbar");
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
    if (backToTop) backToTop.classList.toggle("show", window.scrollY > 600);
  }, { passive: true });

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- تفعيل الرابط النشط حسب القسم الظاهر ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-link[href^='#']");

  if (sections.length && navAnchors.length) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navAnchors.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((sec) => spyObserver.observe(sec));
  }

  /* ---------- أكورديون الأسابيع ---------- */
  document.querySelectorAll(".week-head").forEach((head) => {
    head.addEventListener("click", () => {
      const item = head.parentElement;
      const isOpen = item.classList.contains("open");

      item.closest(".weeks-list").querySelectorAll(".week-item.open").forEach((other) => {
        if (other !== item) other.classList.remove("open");
      });

      item.classList.toggle("open", !isOpen);
    });
  });

  /* ---------- إظهار/إخفاء إجابات بنك الأسئلة ---------- */
  document.querySelectorAll(".q-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      if (!answer || !answer.classList.contains("q-answer")) return;
      const isOpen = answer.classList.toggle("open");
      btn.textContent = isOpen ? "إخفاء الإجابة" : "عرض الإجابة";
    });
  });

  /* ---------- حركات الظهور عند التمرير ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- نموذج التواصل (يفتح البريد) ---------- */
  const form = document.getElementById("contactForm");
  if (form) {
    const note = document.getElementById("formNote");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const subject = form.subject.value;
      const message = form.message.value.trim();

      if (!name || !email || !message) {
        note.textContent = "يرجى تعبئة جميع الحقول المطلوبة.";
        note.style.color = "#9b3d54";
        return;
      }

      const body = `الاسم: ${name}%0D%0Aالبريد: ${email}%0D%0A%0D%0A${encodeURIComponent(message)}`;
      const mailto = `mailto:a.alsaqri@university.edu?subject=${encodeURIComponent(subject)}&body=${body}`;
      window.location.href = mailto;

      note.textContent = "سيتم فتح بريدك الإلكتروني لإرسال الرسالة. شكراً لتواصلك!";
      note.style.color = "#145a50";
      form.reset();
    });
  }

  /* ---------- سنة حقوق النشر ---------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
