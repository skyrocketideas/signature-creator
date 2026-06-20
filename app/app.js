const STORAGE_KEY = "email-sigs-fkp-template-v4";
const LOCKED_COMPANY_NAME = "FKP Scorpio Entertainment Ltd";
const LOCKED_WEBSITE = "fkpscorpioentertainment.com";
const LOCKED_LOGO_PATH = "assets/fkp-logo-black-email.png";

const campaignPresets = [
  {
    id: "vikings",
    label: "Vikings",
    color: "#5130b8",
    image: "assets/vikings-thumb.jpg",
    link: "https://vikings-immersive.co.uk",
  },
  {
    id: "cleopatra",
    label: "Cleopatra",
    color: "#2d6f67",
    image: "assets/cleopatra-thumb.jpg",
    link: "https://cleopatraexperience.co.uk",
  },
  {
    id: "tutankhamun",
    label: "Tutankhamun",
    color: "#b66b1f",
    image: "assets/tutankhamun-thumb.jpg",
    link: "https://tutankhamunexperience.com",
  },
  {
    id: "minecraft",
    label: "Minecraft Experience",
    color: "#4f8f36",
    image: "assets/minecraft-thumb.jpg",
    link: "https://www.minecraftexperience.com",
  },
];

const placeholderImages = campaignPresets.slice(0, 3).map((preset) => ({ ...preset, presetId: preset.id }));

const defaultState = {
  activePersonId: "james-cassidy",
  company: {},
  people: [
    {
      id: "james-cassidy",
      fullName: "James Cassidy",
      pronouns: "",
      jobTitle: "President / Director",
      email: "james.cassidy@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "barry-campbell",
      fullName: "Barry Campbell",
      pronouns: "",
      jobTitle: "Special Projects Director",
      email: "barry.campbell@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "neeshat-wadud",
      fullName: "Neeshat Wadud",
      pronouns: "",
      jobTitle: "Head of Marketing",
      email: "neeshat.wadud@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "nathan-birch",
      fullName: "Nathan Birch",
      pronouns: "",
      jobTitle: "International Head of Ticketing (UK & Europe)",
      email: "nathan.birch@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "amy-hedayati",
      fullName: "Amy Hedayati",
      pronouns: "",
      jobTitle: "Financial Controller",
      email: "amy.hedayati@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "himani-patel",
      fullName: "Himani Patel",
      pronouns: "",
      jobTitle: "Event Operations Manager",
      email: "himani.patel@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "suzy-bryant",
      fullName: "Suzy Bryant",
      pronouns: "",
      jobTitle: "Senior Marketing Manager",
      email: "suzy.bryant@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "daisy-parry",
      fullName: "Daisy Parry",
      pronouns: "",
      jobTitle: "Special Projects Coordinator",
      email: "daisy.parry@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "emma-siegfried",
      fullName: "Emma Siegfried",
      pronouns: "",
      jobTitle: "Marketing & Customer Service Assistant",
      email: "emma.siegfried@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
    {
      id: "jonnie-hughes",
      fullName: "Jonnie Hughes",
      pronouns: "",
      jobTitle: "Ticketing Assistant",
      email: "jonnie.hughes@fkpscorpio.co.uk",
      phone: "",
      footerImages: structuredClone(placeholderImages),
    },
  ],
};

const storedState = localStorage.getItem(STORAGE_KEY);
let state;

try {
  state = storedState ? JSON.parse(storedState) : structuredClone(defaultState);
} catch {
  state = structuredClone(defaultState);
}

const sharedFooterImages = state.company.footerImages || structuredClone(placeholderImages);
state.people = state.people.map((person) => ({
  ...person,
  phone: person.phone || "",
  footerImages: normalizeFooterImages(person.footerImages || sharedFooterImages),
}));
delete state.company.footerImages;

const elements = {
  peopleStrip: document.querySelector("#peopleStrip"),
  peopleCount: document.querySelector("#peopleCount"),
  fullName: document.querySelector("#fullName"),
  pronouns: document.querySelector("#pronouns"),
  jobTitle: document.querySelector("#jobTitle"),
  email: document.querySelector("#email"),
  phone: document.querySelector("#phone"),
  imageSlots: document.querySelector("#imageSlots"),
  signaturePreview: document.querySelector("#signaturePreview"),
  savedState: document.querySelector("#savedState"),
  toast: document.querySelector("#toast"),
  emailStage: document.querySelector("#emailStage"),
};

function activePerson() {
  return state.people.find((person) => person.id === state.activePersonId) || state.people[0];
}

function normalizeFooterImages(images) {
  return images.map((item, index) => ({
    ...(placeholderImages[index] || {
      label: `Image ${index + 1}`,
      color: "#26634f",
      image: "",
      link: "",
    }),
    ...item,
    label: item.label || `Image ${index + 1}`,
    color: item.color || placeholderImages[index]?.color || "#26634f",
    image: item.image || "",
    link: item.link || "",
    presetId: item.presetId || "",
  }));
}

function newFooterImageSlot() {
  const nextIndex = activePerson().footerImages.length + 1;
  return {
    label: `Image ${nextIndex}`,
    color: "#26634f",
    image: "",
    link: "",
    presetId: "",
  };
}

function campaignPresetOptions(selectedPresetId) {
  return [
    '<option value="">No event selected</option>',
    ...campaignPresets.map(
      (preset) =>
        `<option value="${escapeHtml(preset.id)}" ${preset.id === selectedPresetId ? "selected" : ""}>${escapeHtml(preset.label)}</option>`,
    ),
  ].join("");
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeUrl(value) {
  if (!value) return "";
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

function assetUrl(path) {
  return new URL(path, window.location.href).href;
}

function imageUrl(path) {
  if (!path) return "";
  return /^(data:|https?:)/i.test(path) ? path : assetUrl(path);
}

function saveState() {
  elements.savedState.innerHTML = '<span class="saved-dot"></span>Saving…';
  window.clearTimeout(saveState.timer);
  saveState.timer = window.setTimeout(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    elements.savedState.innerHTML = '<span class="saved-dot"></span>Saved';
  }, 280);
}

function placeholderCell(item, size = 78) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
      <tr>
        <td width="${size}" height="${size}" align="center" valign="middle" bgcolor="${item.color}" style="width:${size}px;height:${size}px;background:${item.color};color:#ffffff;font-family:Arial,sans-serif;font-size:9pt;line-height:11pt;font-weight:bold;text-align:center;mso-line-height-rule:exactly;">
          ${escapeHtml(item.label)}
        </td>
      </tr>
    </table>
  `;
}

function logoHtml() {
  return `<img src="${escapeHtml(assetUrl(LOCKED_LOGO_PATH))}" width="104" alt="FKP Scorpio Entertainment" style="display:block;width:104px;max-width:104px;border:0;outline:none;text-decoration:none;" />`;
}

function footerImagesHtml() {
  const footerImages = activePerson().footerImages;
  return footerImages
    .map((item, index) => {
      const media = item.image
        ? `<img src="${escapeHtml(imageUrl(item.image))}" width="78" height="78" alt="${escapeHtml(item.label)}" style="display:block;width:78px;height:78px;border:0;outline:none;text-decoration:none;" />`
        : placeholderCell(item);
      const linkedMedia = item.link
        ? `<a href="${escapeHtml(normalizeUrl(item.link))}" target="_blank" style="display:block;text-decoration:none;border:0;">${media}</a>`
        : media;
      const spacer = index === footerImages.length - 1 ? "" : '<td width="5" style="width:5px;font-size:0;line-height:0;">&nbsp;</td>';

      return `<td width="78" valign="top" style="width:78px;padding:0;">${linkedMedia}</td>${spacer}`;
    })
    .join("");
}

function taglineHtml() {
  return "BRINGING PEOPLE TOGETHER<br />THROUGH IMMERSIVE EVENTS";
}

function signatureHtml() {
  const person = activePerson();
  const pronouns = person.pronouns.trim();
  const phone = (person.phone || "").trim();
  const pronounsHtml = pronouns
    ? `<span style="font-size:10pt;line-height:12.5pt;font-style:italic;font-weight:normal;color:#555555;mso-line-height-rule:exactly;"> (${escapeHtml(pronouns)})</span>`
    : "";
  const phoneRow = phone
    ? `
            <tr>
              <td height="17" style="height:17px;padding:0;font-family:Arial,sans-serif;font-size:10pt;line-height:12.5pt;color:#000000;mso-line-height-rule:exactly;">
                <span style="font-weight:bold;">P:</span>
                <a href="tel:${escapeHtml(phone.replace(/\\s/g, ""))}" style="color:#004f9f;text-decoration:none;"> ${escapeHtml(phone)}</a>
              </td>
            </tr>`
    : "";
  return `
    <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;font-family:Arial,sans-serif;color:#000000;">
      <tr>
        <td style="padding:0 0 7px;font-family:Arial,sans-serif;color:#000000;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td height="17" style="height:17px;padding:0;font-family:Arial,sans-serif;font-size:10pt;line-height:12.5pt;font-weight:bold;color:#000000;mso-line-height-rule:exactly;">
                ${escapeHtml(person.fullName)}
                ${pronounsHtml}
              </td>
            </tr>
            <tr>
              <td height="17" style="height:17px;padding:0;font-family:Arial,sans-serif;font-size:10pt;line-height:12.5pt;color:#000000;mso-line-height-rule:exactly;">${escapeHtml(person.jobTitle)}</td>
            </tr>
            <tr>
              <td height="17" style="height:17px;padding:0;font-family:Arial,sans-serif;font-size:10pt;line-height:12.5pt;font-weight:bold;color:#000000;mso-line-height-rule:exactly;">${escapeHtml(LOCKED_COMPANY_NAME)}</td>
            </tr>
            <tr>
              <td height="17" style="height:17px;padding:0;font-family:Arial,sans-serif;font-size:10pt;line-height:12.5pt;color:#000000;mso-line-height-rule:exactly;">
                <span style="font-weight:bold;">E:</span>
                <a href="mailto:${escapeHtml(person.email)}" style="color:#004f9f;text-decoration:none;"> ${escapeHtml(person.email)}</a>
              </td>
            </tr>
            ${phoneRow}
            <tr>
              <td height="17" style="height:17px;padding:0;font-family:Arial,sans-serif;font-size:10pt;line-height:12.5pt;color:#000000;mso-line-height-rule:exactly;">
                <span style="font-weight:bold;">W:</span>
                <a href="${escapeHtml(normalizeUrl(LOCKED_WEBSITE))}" style="color:#004f9f;text-decoration:none;"> ${escapeHtml(LOCKED_WEBSITE)}</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0;">
          <table width="390" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:390px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr><td height="1" bgcolor="#cfcfcf" style="height:1px;background:#cfcfcf;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td width="122" valign="middle" style="width:122px;padding:0 12px 0 8px;">${logoHtml()}</td>
              <td width="260" valign="middle" style="width:260px;padding:0;font-family:Arial,sans-serif;font-size:8.5pt;line-height:10.5pt;font-weight:bold;font-style:italic;color:#000000;mso-line-height-rule:exactly;">
                ${taglineHtml()}
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0;">
          <table width="390" cellpadding="0" cellspacing="0" border="0" role="presentation" style="width:390px;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr><td height="1" bgcolor="#cfcfcf" style="height:1px;background:#cfcfcf;font-size:0;line-height:0;">&nbsp;</td></tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 0 0;">
          <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>${footerImagesHtml()}</tr>
          </table>
        </td>
      </tr>
    </table>
  `.trim();
}

function renderPeople() {
  elements.peopleCount.textContent = state.people.length;
  elements.peopleStrip.innerHTML = state.people
    .map(
      (person) => `
        <button class="person-card ${person.id === state.activePersonId ? "is-active" : ""}" type="button" data-person-id="${person.id}">
          <span>${escapeHtml(person.fullName)}</span>
        </button>
      `,
    )
    .join("");
}

function renderPersonForm() {
  const person = activePerson();
  elements.fullName.value = person.fullName;
  elements.pronouns.value = person.pronouns;
  elements.jobTitle.value = person.jobTitle;
  elements.email.value = person.email;
  elements.phone.value = person.phone || "";
}

function renderCompanyForm() {
  renderImageSlots();
}

function renderImageSlots() {
  const person = activePerson();
  elements.imageSlots.innerHTML = person.footerImages
    .map(
      (item, index) => `
        <div class="image-slot">
          <div class="image-slot-preview" style="--slot-color:${item.color}">
            ${item.image ? `<img src="${escapeHtml(imageUrl(item.image))}" alt="${escapeHtml(item.label)}" />` : `<span>${escapeHtml(item.label)}</span>`}
          </div>
          <div class="event-slot-main">
          <label class="field">
            <span>Event ${index + 1}</span>
            <select class="slot-preset" data-slot-index="${index}">
              ${campaignPresetOptions(item.presetId || "")}
            </select>
          </label>
          <div class="photo-actions">
            <button class="text-button slot-reset" type="button" data-slot-index="${index}">
              ${index < placeholderImages.length ? "Reset" : "Remove"}
            </button>
          </div>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderSignature() {
  elements.signaturePreview.innerHTML = signatureHtml();
}

function renderAll() {
  renderPeople();
  renderPersonForm();
  renderCompanyForm();
  renderSignature();
}

function updatePerson(field, value) {
  activePerson()[field] = value;
  renderPeople();
  renderPersonForm();
  renderImageSlots();
  renderSignature();
  saveState();
}

function readImage(file, callback) {
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    showToast("Image must be under 2 MB");
    return;
  }
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(file);
}

function showToast(message) {
  elements.toast.querySelector("span").textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

async function copySignature() {
  const person = activePerson();
  const pronouns = person.pronouns.trim();
  const phone = (person.phone || "").trim();
  const html = signatureHtml();
  const plainName = pronouns ? `${person.fullName} (${pronouns})` : person.fullName;
  const plainPhone = phone ? `\nP: ${phone}` : "";
  const plainText = `${plainName}\n${person.jobTitle}\n${LOCKED_COMPANY_NAME}\nE: ${person.email}${plainPhone}\nW: ${LOCKED_WEBSITE}`;

  try {
    if (window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plainText], { type: "text/plain" }),
        }),
      ]);
    } else {
      const range = document.createRange();
      range.selectNode(elements.signaturePreview);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      document.execCommand("copy");
      selection.removeAllRanges();
    }
    showToast("Signature copied");
  } catch {
    showToast("Select the preview and copy");
  }
}

elements.peopleStrip.addEventListener("click", (event) => {
  const card = event.target.closest("[data-person-id]");
  if (!card) return;
  state.activePersonId = card.dataset.personId;
  renderPeople();
  renderPersonForm();
  renderImageSlots();
  renderSignature();
  saveState();
});

["fullName", "pronouns", "jobTitle", "email", "phone"].forEach((field) => {
  elements[field].addEventListener("input", (event) => updatePerson(field, event.target.value));
});

elements.imageSlots.addEventListener("change", (event) => {
  if (!event.target.matches(".slot-preset")) return;
  const index = Number(event.target.dataset.slotIndex);
  const preset = campaignPresets.find((item) => item.id === event.target.value);

  if (preset) {
    activePerson().footerImages[index] = {
      ...activePerson().footerImages[index],
      label: preset.label,
      color: preset.color,
      image: preset.image,
      link: preset.link,
      presetId: preset.id,
    };
  } else {
    activePerson().footerImages[index].presetId = "";
  }

  renderImageSlots();
  renderSignature();
  saveState();
});

elements.imageSlots.addEventListener("click", (event) => {
  if (!event.target.matches(".slot-reset")) return;
  const index = Number(event.target.dataset.slotIndex);
  const person = activePerson();
  if (index < placeholderImages.length) {
    person.footerImages[index] = structuredClone(placeholderImages[index]);
  } else {
    person.footerImages.splice(index, 1);
  }
  renderImageSlots();
  renderSignature();
  saveState();
});

document.querySelector("#addImageSlot").addEventListener("click", () => {
  activePerson().footerImages.push(newFooterImageSlot());
  renderImageSlots();
  renderSignature();
  saveState();
});

document.querySelector("#addPerson").addEventListener("click", () => {
  const id = `person-${Date.now()}`;
  state.people.push({
    id,
    fullName: "New team member",
    pronouns: "",
    jobTitle: "Job title",
    email: "name@fkpscorpio.co.uk",
    phone: "",
    footerImages: structuredClone(placeholderImages),
  });
  state.activePersonId = id;
  renderPeople();
  renderPersonForm();
  renderSignature();
  saveState();
});

document.querySelectorAll("[data-preview-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-preview-theme]").forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    elements.emailStage.classList.toggle("is-dark", button.dataset.previewTheme === "dark");
  });
});

document.querySelector("#copySignature").addEventListener("click", copySignature);
document.querySelector("#copySignatureTop").addEventListener("click", copySignature);

document.querySelector("#downloadHtml").addEventListener("click", () => {
  const person = activePerson();
  const html = `<!doctype html><html><body>${signatureHtml()}</body></html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${person.fullName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-signature.html`;
  anchor.click();
  URL.revokeObjectURL(url);
  showToast("HTML file downloaded");
});

renderAll();
