const copy = {
  en: {
    title: "The Diagnostic",
    kicker: "powered by MN8",
    sub: "A private diagnostic designed to identify why moving forward requires more effort than it used to.",
    start: "Start",
    fine: "Private. Structured. Direct.",
  },
  fr: {
    title: "Le Diagnostic",
    kicker: "propulsé par MN8",
    sub: "Un diagnostic privé conçu pour identifier pourquoi avancer demande plus d’effort qu’avant.",
    start: "Commencer",
    fine: "Privé. Structuré. Direct.",
  },
};

let lang = "en";

function setLang(next) {
  lang = next;

  document.querySelector(".title").textContent = copy[lang].title;
  document.querySelector(".kicker").textContent = copy[lang].kicker;
  document.querySelector(".sub").textContent = copy[lang].sub;
  document.querySelector("#startBtn").textContent = copy[lang].start;
  document.querySelector(".fine").textContent = copy[lang].fine;

  document.querySelector("#langEN").setAttribute("aria-pressed", lang === "en");
  document.querySelector("#langFR").setAttribute("aria-pressed", lang === "fr");

  localStorage.setItem("mn8_diag_lang", lang);
}

document.querySelector("#startBtn").addEventListener("click", () => {
  // carry language into the flow
  localStorage.setItem("mn8_diag_lang", lang);
  window.location.href = "diagnostic.html";
});

document.querySelector("#langEN").addEventListener("click", () => setLang("en"));
document.querySelector("#langFR").addEventListener("click", () => setLang("fr"));

const saved = localStorage.getItem("mn8_diag_lang");
if (saved === "en" || saved === "fr") setLang(saved);
else setLang("en");
