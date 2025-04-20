 
const { jsPDF } = window.jspdf;

// ⁂ STATE ===================================================================
let idCounters = {
  exp: 0,
  edu: 0,
  skill: 0,
  hobby: 0,
  course: 0,
  lang: 0,
  ref: 0,
};

// ⁂ HELPERS =================================================================
/**
 * Gjeneron HTML për një komponent formimi të përshtatshëm
 * @param {string} type lloji i komponentit
 * @param {number} id   id unike
 * @returns {string}
 */
function getBlockTemplate(type, id) {
  switch (type) {
    case "exp":
      return `
        <div class="border rounded p-3 mb-3" data-type="exp" data-id="${id}">
          <div class="row g-2 align-items-end mb-2">
            <div class="col-md-6">
              <label class="form-label">Titulli i punës</label>
              <input type="text" class="form-control" name="title" placeholder="Frontend Developer" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Periudha</label>
              <input type="text" class="form-control" name="period" placeholder="2023 – prezent" />
            </div>
            <div class="col-md-2 text-end">
              <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <textarea class="form-control" name="description" rows="2" placeholder="Përshkrim i detajuar…"></textarea>
        </div>`;
    case "edu":
      return `
        <div class="border rounded p-3 mb-3" data-type="edu" data-id="${id}">
          <div class="row g-2 align-items-end">
            <div class="col-md-5">
              <label class="form-label">Programi / Gradimi</label>
              <input type="text" class="form-control" name="course" placeholder="BSc Në Informatikë" />
            </div>
            <div class="col-md-5">
              <label class="form-label">Institucioni</label>
              <input type="text" class="form-control" name="institution" placeholder="Universiteti i Tiranës" />
            </div>
            <div class="col-md-2 text-end">
              <label class="form-label d-block"> </label>
              <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <input type="text" class="form-control mt-2" name="year" placeholder="2020" />
        </div>`;
    case "skill":
      return `
        <div class="border rounded p-2 mb-2 d-flex align-items-center" data-type="skill" data-id="${id}">
          <input type="text" class="form-control me-2" name="skill" placeholder="React" />
          <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    case "hobby":
      return `
        <div class="border rounded p-2 mb-2 d-flex align-items-center" data-type="hobby" data-id="${id}">
          <input type="text" class="form-control me-2" name="hobby" placeholder="Lexim" />
          <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    case "course":
      return `
        <div class="border rounded p-3 mb-3" data-type="course" data-id="${id}">
          <div class="row g-2 align-items-end">
            <div class="col-md-7">
              <label class="form-label">Titulli i kursit</label>
              <input type="text" class="form-control" name="course" placeholder="JavaScript Advanced" />
            </div>
            <div class="col-md-3">
              <label class="form-label">Viti</label>
              <input type="text" class="form-control" name="year" placeholder="2022" />
            </div>
            <div class="col-md-2 text-end">
              <label class="form-label d-block"> </label>
              <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
        </div>`;
    case "lang":
      return `
        <div class="border rounded p-2 mb-2 d-flex align-items-center" data-type="lang" data-id="${id}">
          <input type="text" class="form-control me-2" style="max-width:45%" name="language" placeholder="Anglisht" />
          <select class="form-select me-2" name="level" style="max-width:45%">
            <option value="">Niveli</option>
            <option>Amëtare</option>
            <option>Fluent</option>
            <option>Intermediar</option>
            <option>Fillestar</option>
          </select>
          <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    case "ref":
      return `
        <div class="border rounded p-3 mb-3" data-type="ref" data-id="${id}">
          <div class="row g-2 align-items-end mb-2">
            <div class="col-md-5">
              <label class="form-label">Emri &amp; Mbiemri</label>
              <input type="text" class="form-control" name="name" placeholder="Elira Krasniqi" />
            </div>
            <div class="col-md-5">
              <label class="form-label">Pozicioni</label>
              <input type="text" class="form-control" name="position" placeholder="Menaxhere HR" />
            </div>
            <div class="col-md-2 text-end">
              <button type="button" class="btn btn-outline-danger remove-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
          </div>
          <input type="text" class="form-control" name="contact" placeholder="email@kompania.com / +355…" />
        </div>`;
  }
}

/**
 * Kthen vlerat e input‑eve të një blloku si objekt
 * @param {HTMLElement} block
 * @returns {Object}
 */
function serializeBlock(block) {
  const inputs = block.querySelectorAll("input, textarea, select");
  const data = {};
  inputs.forEach((i) => (data[i.name] = i.value.trim()));
  return data;
}

// ⁂ DOM =====================================================================

const containers = {
  exp: document.getElementById("experience-list"),
  edu: document.getElementById("education-list"),
  skill: document.getElementById("skill-list"),
  hobby: document.getElementById("hobby-list"),
  course: document.getElementById("course-list"),
  lang: document.getElementById("language-list"),
  ref: document.getElementById("reference-list"),
};

// Butonat "Shto …"
const addButtons = [
  ["add-experience", "exp"],
  ["add-education", "edu"],
  ["add-skill", "skill"],
  ["add-hobby", "hobby"],
  ["add-course", "course"],
  ["add-language", "lang"],
  ["add-reference", "ref"],
];
addButtons.forEach(([btnId, type]) => {
  document.getElementById(btnId).addEventListener("click", () => {
    containers[type].insertAdjacentHTML("beforeend", getBlockTemplate(type, ++idCounters[type]));
    updatePreview();
  });
});

// Fshirja e blloqeve
document.addEventListener("click", (e) => {
  if (e.target.closest(".remove-btn")) {
    e.target.closest("[data-type]").remove();
    updatePreview();
  }
});

// Për çdo input ➜ rifresko parapamjen
document.getElementById("cv-form").addEventListener("input", updatePreview);

updatePreview(); // inicim paraprak

// ⁂ FUNKSIONI KRYESOR --------------------------------------------------------
function updatePreview() {
const name = document.getElementById("fullname").value.trim();
const email = document.getElementById("email").value.trim();
const phone = document.getElementById("phone").value.trim();
const linkedin = document.getElementById("linkedin").value.trim();
const summary = document.getElementById("summary").value.trim();

document.getElementById("pv-name").innerText = name || "Emri Mbiemri";
document.getElementById("pv-contact").innerText = email && phone ? `${email} • ${phone}` : email || phone;
document.getElementById("pv-contact").style.display = email || phone ? "block" : "none";

document.getElementById("pv-linkedin").innerText = linkedin;
document.getElementById("pv-linkedin").style.display = linkedin ? "block" : "none";

document.getElementById("pv-summary").innerText = summary;
document.getElementById("pv-summary").style.display = summary ? "block" : "none";

function refreshList(type, pvContainerSelector, formatter) {
const pvNode = document.querySelector(pvContainerSelector);
const list = pvNode.querySelector("ul") || pvNode;
list.innerHTML = "";
containers[type].querySelectorAll(`[data-type='${type}']`).forEach((block) => {
  const data = serializeBlock(block);
  if (Object.values(data).every(Boolean)) {
    const li = document.createElement("li");
    li.className = "item";
    li.innerHTML = formatter(data);
    list.appendChild(li);
  }
});
pvNode.style.display = list.childElementCount ? "block" : "none";
}

function refreshComplex(type, pvSelector, templateCallback) {
const pv = document.querySelector(pvSelector);
pv.querySelectorAll(".item").forEach((n) => n.remove());
containers[type].querySelectorAll(`[data-type='${type}']`).forEach((block) => {
  const data = serializeBlock(block);
  const html = templateCallback(data);
  if (html) {
    const div = document.createElement("div");
    div.className = "item mb-2";
    div.innerHTML = html;
    pv.appendChild(div);
  }
});
pv.style.display = pv.querySelectorAll(".item").length ? "block" : "none";
}

refreshComplex("exp", "#pv-experience", ({ title, period, description }) =>
title ? `<strong>${title}</strong> <em class=\"text-muted\">${period}</em><br /><span>${description}</span>` : ""
);

refreshComplex("edu", "#pv-education", ({ course, institution, year }) =>
course ? `<strong>${course}</strong>, ${institution} <em class=\"text-muted\">(${year})</em>` : ""
);

refreshList("skill", "#pv-skills ul", ({ skill }) => skill);
refreshList("hobby", "#pv-hobbies ul", ({ hobby }) => hobby);
refreshList("lang", "#pv-languages ul", ({ language, level }) => language && level ? `${language} – <span class=\"text-muted\">${level}</span>` : "");

refreshComplex("course", "#pv-courses", ({ course, year }) =>
course ? `<strong>${course}</strong> <em class=\"text-muted\">(${year})</em>` : ""
);

refreshComplex("ref", "#pv-references", ({ name, position, contact }) =>
name ? `<strong>${name}</strong>, ${position}<br /><span class=\"text-muted\">${contact}</span>` : ""
);

["#pv-skills", "#pv-hobbies", "#pv-languages"].forEach((selector) => {
const container = document.querySelector(selector);
const list = container.querySelector("ul");
container.style.display = list.childElementCount ? "block" : "none";
});
}

// ⁂ PDF EXPORT ==============================================================
// ---------------- PDF Generator styled like sample image ----------------
// Requires jsPDF v2.5.1 already loaded in the page
// This script completely replaces the previous listener so make sure it is
// the ONLY generate listener on the page.

(function () {
const LEFT_MARGIN = 40;               // page left margin (pt)
const TOP_MARGIN  = 60;               // top margin start for body (pt)
const LEFT_COL_W  = 150;              // width of left sidebar column (pt)
const GAP         = 22;               // gap between sidebar & content (pt)

// Util ‑ splits long text respecting jsPDF page width
function wrap(doc, text, maxW) {
return doc.splitTextToSize(text, maxW);
}

// Draw a small square bullet (6×6pt) that mimics timeline squares in sample
function drawSquareBullet(doc, x, y, size = 6, color = "#1976d2") {
doc.setFillColor(color);
doc.rect(x, y - size + 1, size, size, "F");
}

// Main listener (overwrites previous)
document.getElementById("generate").addEventListener("click", () => {
const form = document.getElementById("cv-form");
if (!form.checkValidity()) {
  form.classList.add("was-validated");
  form.reportValidity();
  return;
}

const doc        = new jsPDF({ unit: "pt", format: "a4" });
const pageWidth  = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const RIGHT_START = LEFT_MARGIN + LEFT_COL_W + GAP; // x‑coordinate where main content starts

let y = 0;

// ==================== HEADER ====================================================
const HEADER_H = 110;
doc.setFillColor("#f5f7fb"); // light gray/blue header background
doc.rect(0, 0, pageWidth, HEADER_H, "F");

// Name (big blue)
const name = document.getElementById("pv-name").innerText || "Emri Mbiemri";
doc.setFontSize(24);
doc.setTextColor("#1976d2");
doc.setFont("helvetica", "bold");
doc.text(name, LEFT_MARGIN, 40);

// Professional headline (summary first sentence)
const summaryRaw = document.getElementById("pv-summary").innerText.trim();
if (summaryRaw) {
  const headline = wrap(doc, summaryRaw, pageWidth - RIGHT_START - LEFT_MARGIN);
  doc.setFontSize(11);
  doc.setTextColor("#333");
  doc.setFont("helvetica", "normal");
  doc.text(headline, LEFT_MARGIN, 66, { baseline: "top" });
}

// Contact row (email & phone). For brevity we use existing concatenated string
const contact = document.getElementById("pv-contact").innerText.trim();
if (contact) {
  doc.setFontSize(9);
  doc.setTextColor("#555");
  doc.text(contact, LEFT_MARGIN, 92);
}

y = HEADER_H + 20; // body starts after header

// Draw vertical divider line
doc.setDrawColor("#cfd3d8");
doc.setLineWidth(0.8);
doc.line(LEFT_MARGIN + LEFT_COL_W, HEADER_H, LEFT_MARGIN + LEFT_COL_W, pageHeight - TOP_MARGIN);

// ==================== SECTION RENDER HELPERS ====================================

function renderSectionTitle(title) {
  doc.setFontSize(11);
  doc.setTextColor("#1976d2");
  doc.setFont("helvetica", "bold");
  doc.text(title, LEFT_MARGIN, y);
}

// For multi‑item sections on the right side
function renderRightBulletItem(lines) {
  const squareX = LEFT_MARGIN + LEFT_COL_W - 9; // bullet just left of vertical line
  drawSquareBullet(doc, squareX, y + 3);

  doc.setFontSize(10);
  doc.setTextColor("#333");
  doc.setFont("helvetica", "normal");

  lines.forEach((ln, idx) => {
    doc.text(ln, RIGHT_START, y + idx * 13);
  });
  y += lines.length * 13 + 10;

  // Page break check
  if (y > pageHeight - 60) {
    doc.addPage();
    y = TOP_MARGIN;
    doc.line(LEFT_MARGIN + LEFT_COL_W, y - 20, LEFT_MARGIN + LEFT_COL_W, pageHeight - TOP_MARGIN);
  }
}

// Education ------------------------------------------------------------------
const eduItems = Array.from(document.querySelectorAll("#pv-education .item"));
if (eduItems.length) {
  renderSectionTitle("Education");
  y += 18;
  eduItems.forEach(it => {
    const txt = it.innerText.trim();
    if (!txt) return;
    const ln  = wrap(doc, txt, pageWidth - RIGHT_START - LEFT_MARGIN);
    renderRightBulletItem(ln);
  });
  y += 10;
}

// Employment -----------------------------------------------------------------
const expItems = Array.from(document.querySelectorAll("#pv-experience .item"));
if (expItems.length) {
  renderSectionTitle("Employment");
  y += 18;
  expItems.forEach(it => {
    const txt = it.innerText.trim();
    if (!txt) return;
    const ln  = wrap(doc, txt, pageWidth - RIGHT_START - LEFT_MARGIN);
    renderRightBulletItem(ln);
  });
  y += 10;
}

// Skills ---------------------------------------------------------------------
const skillItems = Array.from(document.querySelectorAll("#pv-skills .item-list li"));
if (skillItems.length) {
  renderSectionTitle("Skills");
  y += 18;

  const BAR_W = 120;
  const BAR_H = 6;
  const COL_GAP = 200; // distance between two skill columns
  let colToggle = 0;
  let startY = y;

  skillItems.forEach((li, idx) => {
    const label = li.innerText.trim();
    if (!label) return;

    const currX = RIGHT_START + (colToggle ? COL_GAP : 0);
    const txtY  = y;

    // Label
    doc.setFontSize(10);
    doc.setTextColor("#333");
    doc.text(label, currX, txtY);

    // Progress bar background (light)
    const barX = currX;
    const barY = txtY + 4;
    doc.setFillColor("#e8ecef");
    doc.rect(barX, barY, BAR_W, BAR_H, "F");

    // Foreground bar (blue) – currently fixed 85%/75% alternating
    const percent = idx % 2 === 0 ? 0.9 : 0.75;
    doc.setFillColor("#379cf6");
    doc.rect(barX, barY, BAR_W * percent, BAR_H, "F");

    // update coordinates
    if (colToggle) {
      y += 22; // move to next row after completing two columns
    }
    colToggle = 1 - colToggle; // toggle 0/1

    // Handle page break
    if (y > pageHeight - 60) {
      doc.addPage();
      y = TOP_MARGIN;
      doc.line(LEFT_MARGIN + LEFT_COL_W, y - 20, LEFT_MARGIN + LEFT_COL_W, pageHeight - TOP_MARGIN);
      renderSectionTitle("Skills (cont.)");
      y += 18;
      startY = y;
    }
  });

  // Ensure y continues below the tallest of two columns
  if (colToggle) y += 22;
  y += 14;
}

// Languages ------------------------------------------------------------------
const langItems = Array.from(document.querySelectorAll("#pv-languages .item-list li"));
if (langItems.length) {
  renderSectionTitle("Languages");
  y += 18;
  langItems.forEach(li => {
    const txt = li.innerText.trim();
    if (!txt) return;
    const lines = wrap(doc, txt.replace(/–/g, "-"), pageWidth - RIGHT_START - LEFT_MARGIN);
    renderRightBulletItem(lines);
  });
  y += 10;
}

// Hobbies --------------------------------------------------------------------
const hobbyItems = Array.from(document.querySelectorAll("#pv-hobbies .item-list li"));
if (hobbyItems.length) {
  renderSectionTitle("Hobbies");
  y += 18;
  hobbyItems.forEach(li => {
    const txt = li.innerText.trim();
    if (!txt) return;
    const lines = wrap(doc, txt, pageWidth - RIGHT_START - LEFT_MARGIN);
    renderRightBulletItem(lines);
  });
}

// ----------------- SAVE PDF -----------------------------------------------
doc.save("CV.pdf");
});
})();
 