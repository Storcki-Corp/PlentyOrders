// Assurez-vous que le DOM est entièrement chargé avant d'exécuter le script
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM entièrement chargé et analysé");
});

// Exemple de fonction pour un bouton pour revenir à la page d'accueil
function BackToHome() {
  window.location.href = "/plenty-orders/home/";
}

function ToDownload() {
  window.location.href = "/plenty-orders/download/";
  console.log("Téléchargement");
}