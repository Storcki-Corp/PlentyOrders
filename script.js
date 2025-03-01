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

// Detect current page from a data attribute on <body>
// (For example: <body data-page="Home">, <body data-page="About_Us">, <body data-page="Download">)
const currentPage = document.body.getAttribute("data-page") || "Home";

// Define common content elements selectors
const languageSelect = document.getElementById("langue");
const contentElements = {
  menu: document.getElementById("Menu"),
  about: document.getElementById("About"),
  download: document.getElementById("Download"),
  contact: document.getElementById("Contact"),
  // Here we update the label for the checkbox
  colorBlindLabel: document.querySelector('label[for="check-box"]'),
  // Main content container – assumed to have id "main-content" in each HTML file
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
      console.log(content);

      // Update common header elements if they exist
      if (contentElements.menu && content.menu) {
        contentElements.menu.textContent = content.menu;
      }
      if (contentElements.about && content.about) {
        contentElements.about.textContent = content.about;
      }
      if (contentElements.download && content.download) {
        contentElements.download.textContent = content.download;
      }
      if (contentElements.contact && content.contact) {
        contentElements.contact.textContent = content.contact;
      }
      if (contentElements.colorBlindLabel && content.colorBlind) {
        contentElements.colorBlindLabel.textContent = content.colorBlind;
      }

      // Update main content area (dynamic per page)
      // Update main content area using paragraphs with class "translatable"
      if (contentElements.mainContent) {
        const paragraphs =
          contentElements.mainContent.querySelectorAll("p.translatable");
        // Supposons que le JSON contient un tableau ou un objet ordonné de paragraphes
        // Ici, on considère qu'il s'agit d'un objet avec des clés ordonnées (ex: "paragraph1", "paragraph2", ...)
        const keys = Object.keys(content.mainContent);

        paragraphs.forEach((p, index) => {
          if (index < keys.length) {
            p.innerHTML = content.mainContent[keys[index]];
          }
        });
      }

      // Update footer elements
      if (
        contentElements.footer.terms &&
        content.footer &&
        content.footer.terms
      ) {
        contentElements.footer.terms.textContent = content.footer.terms;
      }
      if (
        contentElements.footer.privacy &&
        content.footer &&
        content.footer.privacy
      ) {
        contentElements.footer.privacy.textContent = content.footer.privacy;
      }
      if (
        contentElements.footer.copyright &&
        content.footer &&
        content.footer.copyright
      ) {
        contentElements.footer.copyright.innerHTML = content.footer.copyright;
      }

      // Update language select dropdown options
      const options = languageSelect.options;
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

      console.log(lang === "fr" ? "en" : "fr");
    })
    .catch((error) =>
      console.error("Erreur lors du chargement du JSON :", error)
    );
}

// Event listener for language change
languageSelect.addEventListener("change", function () {
  const selectedLang = this.value;
  setCookie("language", selectedLang, 30);
  updateContent(selectedLang);
});

// Check for saved language preference (default to French)
const savedLanguage = getCookie("language");
const defaultLanguage = savedLanguage || "fr";
updateContent(defaultLanguage);

// --- Colorblind Mode Code (remains unchanged) ---
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
