function ToDownload() {
  window.open("/PlentyOrders/Download/example.txt", "_blank");
  console.log("Téléchargement");
}

// Helper functions for cookies
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(cookieName) === 0) {
      return cookie.substring(cookieName.length, cookie.length);
    }
  }
  return "";
}

console.log(document.body);
// Detect current page from a data attribute on <body>
const currentPage = document.body.getAttribute("data-page") || "Home";

// Define common content elements selectors
const languageSelect = document.getElementById("langue");
const contentElements = {
  menu: document.getElementById("Accueil"),
  about: document.getElementById("About"),
  download: document.getElementById("Download"),
  contact: document.getElementById("Contact"),
  colorBlindLabel: document.querySelector('label[for="check-box"]'),
  mainContent: document.getElementById("main-content"),
  footer: {
    terms: document.querySelector('a[href*="Terms-of-Service"]'),
    privacy: document.querySelector('a[href*="Privacy-Notice"]'),
    copyright: document.querySelector("footer p"),
  },
};

// Function to update content based on language and current page
function updateContent(lang) {
  fetch("/PlentyOrders/content.json")
    .then((response) => response.json())
    .then((data) => {
      if (!data[lang] || !data[lang][currentPage]) {
        console.error("Page or language not found in JSON:", lang, currentPage);
        return;
      }

      console.log("Updating content for", lang, currentPage);
      const content = data[lang][currentPage];

      if (contentElements.menu && content.menu)
        contentElements.menu.textContent = content.menu;
      if (contentElements.about && content.about)
        contentElements.about.textContent = content.about;
      if (contentElements.download && content.download)
        contentElements.download.textContent = content.download;
      if (contentElements.contact && content.contact)
        contentElements.contact.textContent = content.contact;
      if (contentElements.colorBlindLabel && content.colorBlind)
        contentElements.colorBlindLabel.textContent = content.colorBlind;

      if (contentElements.mainContent) {
        const translatables =
          contentElements.mainContent.querySelectorAll(".translatable");
        const keys = Object.keys(content.mainContent);
        translatables.forEach((el, index) => {
          if (index < keys.length)
            el.innerHTML = content.mainContent[keys[index]];
        });
      }

      if (contentElements.footer.terms && content.footer?.terms)
        contentElements.footer.terms.textContent = content.footer.terms;
      if (contentElements.footer.privacy && content.footer?.privacy)
        contentElements.footer.privacy.textContent = content.footer.privacy;
      if (contentElements.footer.copyright && content.footer?.copyright)
        contentElements.footer.copyright.innerHTML = content.footer.copyright;

      if (languageSelect) {
        if (lang === "fr") {
          languageSelect.options[0].text = "⏷ Français";
          languageSelect.options[0].value = "fr";
          languageSelect.options[1].text = "Anglais";
          languageSelect.options[1].value = "en";
        } else {
          languageSelect.options[0].text = "⏷ English";
          languageSelect.options[0].value = "en";
          languageSelect.options[1].text = "Français";
          languageSelect.options[1].value = "fr";
        }
        languageSelect.value = lang;
      }
    })
    .catch((error) =>
      console.error("Erreur lors du chargement du JSON :", error)
    );
}

// Détermination de la langue par défaut si aucun select n'est présent
const savedLanguage = getCookie("language");
var defaultLanguage = savedLanguage || "fr";
if (defaultLanguage !== "fr" && defaultLanguage !== "en") {
  console.error("Langue par défaut non valide, utilisation de 'fr'");
  defaultLanguage = "fr";
}
updateContent(defaultLanguage);

if (languageSelect) {
  languageSelect.addEventListener("change", function () {
    const selectedLang = this.value;
    setCookie("language", selectedLang, 30);
    updateContent(selectedLang);
  });
}

// Gestion du mode daltonien
if (document.getElementById("check-box") !== null) {
  const colorBlindCheckbox = document.getElementById("check-box");
  const pageElement = document.documentElement;

  function toggleColorBlindMode() {
    if (colorBlindCheckbox.checked) {
      console.log("Colorblind mode changed to: enabled");
      pageElement.style.filter = "grayscale(100%)";
      setCookie("colorBlindMode", "true", 30);
    } else {
      console.log("Colorblind mode changed to: disabled");
      pageElement.style.filter = "grayscale(0%)";
      setCookie("colorBlindMode", "false", 30);
    }
  }

  colorBlindCheckbox.addEventListener("change", toggleColorBlindMode);
  const savedColorBlindMode = getCookie("colorBlindMode") === "true";
  colorBlindCheckbox.checked = savedColorBlindMode;
  toggleColorBlindMode();
}
