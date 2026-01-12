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

// ------------------------------
// MN8 Diagnostic flow (EN/FR)
// ------------------------------
window.MN8_DIAG = window.MN8_DIAG || {};

const diagCopy = {
  en: {
    kicker: "powered by MN8",
    title: "The Diagnostic",
    sub: "Enter your details, then answer the questions with honesty.",
    first: "First name",
    last: "Last name",
    email: "Email",
    submit: "View my diagnostic",
    back: "Back",
    hint: "Your answers are used only to generate your diagnostic.",
    required: "Please answer every question (or choose Other and write your answer).",
  },
  fr: {
    kicker: "propulsé par MN8",
    title: "Le Diagnostic",
    sub: "Entre tes informations, puis réponds aux questions avec honnêteté.",
    first: "Prénom",
    last: "Nom",
    email: "Email",
    phone: "Téléphone (optionnel)",
    submit: "Voir mon diagnostic",
    back: "Retour",
    hint: "Tes réponses servent uniquement à générer ton diagnostic.",
    required: "Réponds à chaque question (ou choisis Autre et écris ta réponse).",
  },
};

const questions = {
  en: [
    {
      id: "q1",
      text: "What has changed most since the period when you were disciplined?",
      options: [
        "I’m no longer consistent, even when I know what to do",
        "I lost trust that I’ll actually hold it",
        "Moving forward costs me more mentally than before",
        "I recognize myself less in who I used to be",
        "Other",
      ],
    },
    {
      id: "q2",
      text: "When you think about restarting seriously, what’s the first internal reaction that appears?",
      options: [
        "Fatigue before I even begin",
        "A voice that says “not now”",
        "A pressure that shuts me down",
        "Fear of not holding it again",
        "Other",
      ],
    },
    {
      id: "q3",
      text: "When you force yourself anyway, what does it do to you internally?",
      options: [
        "I hold for a moment, then I crash",
        "I keep going but I feel drained",
        "I lose the taste for what I’m doing",
        "I build silent frustration",
        "Other",
      ],
    },
    {
      id: "q4",
      text: "Which statement fits you most right now?",
      options: [
        "I know I’m capable, but something blocks",
        "I don’t trust myself like I used to",
        "I feel like I’m fighting myself",
        "I sometimes wonder what’s wrong with me",
        "Other",
      ],
    },
    {
      id: "q5",
      text: "When your energy drops, what actually supports you today?",
      options: [
        "Nothing stable",
        "My willpower (when it shows up)",
        "Reminders / routines I can’t maintain",
        "I improvise based on how I feel",
        "Other",
      ],
    },
    {
      id: "q6",
      text: "When you stop something, what makes restarting hard?",
      options: [
        "I wait to feel ready",
        "I feel guilt and I delay",
        "I restart too hard and burn out",
        "I don’t know how to restart without self-sabotage",
        "Other",
      ],
    },
    {
      id: "q7",
      text: "Right now, what you’re missing most is:",
      options: [
        "A structure that holds even when momentum drops",
        "An anchor when fatigue shows up",
        "Clarity on what’s actually happening",
        "A frame that doesn’t require fighting myself",
        "Other",
      ],
    },
  ],
  fr: [
    {
      id: "q1",
      text: "Qu’est-ce qui a le plus changé depuis la période où tu étais discipliné(e) ?",
      options: [
        "Je ne suis plus constant(e), même quand je sais quoi faire",
        "J’ai perdu la confiance que “je vais tenir”",
        "Avancer me coûte plus mentalement qu’avant",
        "Je me reconnais moins dans la personne que j’étais",
        "Autre",
      ],
    },
    {
      id: "q2",
      text: "Quand tu envisages de reprendre sérieusement, quelle est la première réaction intérieure qui apparaît ?",
      options: [
        "Fatigue avant même de commencer",
        "Une voix qui dit “pas maintenant”",
        "Une pression interne qui me ferme",
        "Peur de ne pas tenir encore une fois",
        "Autre",
      ],
    },
    {
      id: "q3",
      text: "Quand tu te forces quand même, qu’est-ce que ça te fait intérieurement ?",
      options: [
        "Je tiens un moment, puis je retombe",
        "Je continue, mais je me sens vidé(e)",
        "Je perds le goût de ce que je fais",
        "J’accumule de la frustration silencieuse",
        "Autre",
      ],
    },
    {
      id: "q4",
      text: "Laquelle de ces phrases te ressemble le plus en ce moment ?",
      options: [
        "Je sais que je suis capable, mais quelque chose bloque",
        "Je ne me fais plus autant confiance qu’avant",
        "J’ai l’impression de me battre contre moi-même",
        "Je me demande parfois ce qui cloche chez moi",
        "Autre",
      ],
    },
    {
      id: "q5",
      text: "Quand ton énergie baisse, qu’est-ce qui te soutient concrètement aujourd’hui ?",
      options: [
        "Rien de stable",
        "Ma volonté (quand elle est là)",
        "Des rappels / routines que je n’arrive pas à maintenir",
        "J’improvise selon comment je me sens",
        "Autre",
      ],
    },
    {
      id: "q6",
      text: "Quand tu arrêtes quelque chose, qu’est-ce qui rend le redémarrage difficile ?",
      options: [
        "J’attends de me sentir prêt(e)",
        "Je culpabilise et je repousse",
        "Je repars trop fort et je m’épuise",
        "Je ne sais pas comment reprendre sans auto-sabotage",
        "Autre",
      ],
    },
    {
      id: "q7",
      text: "En ce moment, ce qui te manque le plus, c’est :",
      options: [
        "Une structure qui tient même quand l’élan baisse",
        "Un point d’ancrage quand la fatigue apparaît",
        "De la clarté sur ce qui se passe réellement",
        "Un cadre qui ne demande pas de me battre contre moi-même",
        "Autre",
      ],
    },
  ],
};

function getLang() {
  const saved = localStorage.getItem("mn8_diag_lang");
  return saved === "fr" ? "fr" : "en";
}

function renderQuestions(container, lang) {
  container.innerHTML = "";
  const list = questions[lang];

  list.forEach((q, idx) => {
    const qEl = document.createElement("div");
    qEl.className = "q";
    qEl.dataset.qid = q.id;

    const title = document.createElement("div");
    title.className = "q-title";
    title.textContent = `${idx + 1}. ${q.text}`;

    const optionsWrap = document.createElement("div");
    optionsWrap.className = "options";

    const otherWrap = document.createElement("div");
    otherWrap.className = "otherWrap";
    otherWrap.innerHTML = `
      <input class="input otherInput" type="text" placeholder="${
        lang === "fr" ? "Précise ici…" : "Type here…"
      }" />
    `;

    q.options.forEach((optText, optIdx) => {
      const opt = document.createElement("div");
      opt.className = "opt";
      const id = `${q.id}_${optIdx}`;

      opt.innerHTML = `
        <input class="radio" type="radio" name="${q.id}" id="${id}" value="${optText}" />
        <label for="${id}">${optText}</label>
      `;

      opt.querySelector("input").addEventListener("change", (e) => {
        const isOther =
          (lang === "en" && e.target.value === "Other") ||
          (lang === "fr" && e.target.value === "Autre");
        otherWrap.classList.toggle("show", isOther);
        if (!isOther) otherWrap.querySelector("input").value = "";
      });

      optionsWrap.appendChild(opt);
    });

    optionsWrap.appendChild(otherWrap);

    qEl.appendChild(title);
    qEl.appendChild(optionsWrap);
    container.appendChild(qEl);
  });
}

function collectAnswers(form, lang) {
  const payload = {
    lang,
    identity: {
      firstName: form.firstName.value.trim(),
      lastName: form.lastName.value.trim(),
      email: form.email.value.trim(),
    },
    answers: [],
    meta: { ts: Date.now() },
  };

  const list = questions[lang];

  for (const q of list) {
    const selected = form.querySelector(`input[name="${q.id}"]:checked`);
    if (!selected) return { ok: false };

    const qBox = form.querySelector(`.q[data-qid="${q.id}"]`);
    const otherInput = qBox.querySelector(".otherInput");
    const isOther =
      (lang === "en" && selected.value === "Other") ||
      (lang === "fr" && selected.value === "Autre");

    let value = selected.value;

    if (isOther) {
      const typed = (otherInput?.value || "").trim();
      if (!typed) return { ok: false };
      value = typed;
    }

    payload.answers.push({ id: q.id, value });
  }

  // basic required identity checks (email required by HTML)
  if (!payload.identity.firstName || !payload.identity.lastName) return { ok: false };

  return { ok: true, payload };
}

window.MN8_DIAG.initDiagnosticPage = function initDiagnosticPage() {
  const lang = getLang();
  const c = diagCopy[lang];

  // Set copy
  document.getElementById("dkicker").textContent = c.kicker;
  document.getElementById("dtitle").textContent = c.title;
  document.getElementById("dsub").textContent = c.sub;

  document.getElementById("lFirst").textContent = c.first;
  document.getElementById("lLast").textContent = c.last;
  document.getElementById("lEmail").textContent = c.email;
  document.getElementById("lPhone").textContent = c.phone;

  document.getElementById("submitBtn").textContent = c.submit;
  document.getElementById("backBtn").textContent = c.back;
  document.getElementById("hint").textContent = c.hint;

  // Render questions
  const qContainer = document.getElementById("questions");
  renderQuestions(qContainer, lang);

  // Back
  document.getElementById("backBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });

  // Submit
  const form = document.getElementById("diagForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const collected = collectAnswers(form, lang);
    if (!collected.ok) {
      alert(c.required);
      return;
    }

    localStorage.setItem("mn8_diag_payload", JSON.stringify(collected.payload));
    window.location.href = "result.html";
  });
};
window.MN8_DIAG.initResultPage = function initResultPage() {
  const lang = localStorage.getItem("mn8_diag_lang") === "fr" ? "fr" : "en";

  const ui = {
    en: {
      kicker: "powered by MN8",
      title: "The Diagnostic",
      compiling: "Compiling your diagnostic…",
      note: "This usually takes about 60–90 seconds.",
      summaryTitle: "Diagnostic Summary",
      indicates: "What your responses indicate",
      done: "Reading complete.",
      cta: "See MN8",
      restart: "Restart",
      emailed: "A copy has been sent to your email.",
      tryAgain: "Try again",
      loaderLines: [
        "Reviewing response patterns",
        "Identifying structural gaps",
        "Cross-referencing discipline signals",
        "Finalizing diagnostic summary",
      ],
    },
    fr: {
      kicker: "propulsé par MN8",
      title: "Le Diagnostic",
      compiling: "Compilation de ton diagnostic…",
      note: "Cela prend généralement 60 à 90 secondes.",
      summaryTitle: "Synthèse du diagnostic",
      indicates: "Ce que tes réponses indiquent",
      done: "Lecture terminée.",
      cta: "Découvrir MN8",
      restart: "Recommencer",
      emailed: "Une copie a été envoyée par email.",
      tryAgain: "Réessayer",
      loaderLines: [
        "Analyse des réponses",
        "Identification des écarts de structure",
        "Vérification des signaux de discipline",
        "Finalisation de la synthèse",
      ],
    },
  }[lang];

  // Wire base copy
  const rk = document.getElementById("rkicker");
  const rt = document.getElementById("rtitle");
  const loaderTitle = document.getElementById("loaderTitle");
  const rnote = document.getElementById("rnote");
  const outKicker = document.getElementById("outKicker");
  const outTitle = document.getElementById("outTitle");
  const outLabel = document.getElementById("outLabel");
  const outEnd = document.getElementById("outEnd");
  const ctaBtn = document.getElementById("ctaBtn");
  const restartBtn = document.getElementById("restartBtn");

  rk.textContent = ui.kicker;
  rt.textContent = ui.title;
  loaderTitle.textContent = ui.compiling;
  rnote.textContent = ui.note;

  outKicker.textContent = ui.kicker;
  outTitle.textContent = ui.summaryTitle;
  outLabel.textContent = ui.indicates;
  outEnd.textContent = ui.done;

  ctaBtn.textContent = ui.cta;
  restartBtn.textContent = ui.restart;

  // TODO: set your real MN8 URL later
  ctaBtn.href = "https://mn8.com"; // replace later

  restartBtn.addEventListener("click", () => {
    localStorage.removeItem("mn8_diag_payload");
    window.location.href = "diagnostic.html";
  });

  const payloadRaw = localStorage.getItem("mn8_diag_payload");
  if (!payloadRaw) {
    // no payload -> go back
    window.location.href = "diagnostic.html";
    return;
  }

  const payload = JSON.parse(payloadRaw);

  // 60–90s feel (we don't force waiting if API returns faster, but we keep it calm)
  const loaderLine = document.getElementById("loaderLine");
  const bar = document.getElementById("bar");
  let step = 0;

  const start = Date.now();
  const targetMs = 75000; // ~75s center; feels like 60–90
  const lineTimer = setInterval(() => {
    step = (step + 1) % ui.loaderLines.length;
    loaderLine.textContent = ui.loaderLines[step];
  }, 15000);

  const barTimer = setInterval(() => {
    const elapsed = Date.now() - start;
    const pct = Math.min(92, Math.floor((elapsed / targetMs) * 92));
    bar.style.width = pct + "%";
  }, 350);

  function showResult(out) {
    clearInterval(lineTimer);
    clearInterval(barTimer);
    bar.style.width = "100%";

    document.getElementById("loading").style.display = "none";
    document.getElementById("error").style.display = "none";
    document.getElementById("result").style.display = "block";

    document.getElementById("outSummary").textContent = out.summary || "";

    const list = document.getElementById("outList");
    list.innerHTML = "";
    (out.indicators || []).slice(0, 6).forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });

    document.getElementById("outCore").textContent = out.core || "";
    document.getElementById("outHint").textContent = out.emailed
      ? ui.emailed
      : "";
  }

  function showError() {
    clearInterval(lineTimer);
    clearInterval(barTimer);
    document.getElementById("loading").style.display = "none";
    document.getElementById("result").style.display = "none";
    document.getElementById("error").style.display = "block";
  }

  // Try again button
  const tryAgainBtn = document.getElementById("tryAgainBtn");
  tryAgainBtn.textContent = ui.tryAgain;
  tryAgainBtn.addEventListener("click", () => {
    window.location.reload();
  });

  // Call backend
  fetch("/api/diagnostic", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (r) => {
      const data = await r.json().catch(() => null);
      if (!r.ok || !data) throw new Error("bad_response");
      return data;
    })
    .then((out) => {
      showResult(out);
    })
    .catch(() => {
      showError();
    });
};

