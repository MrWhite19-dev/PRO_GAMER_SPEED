/* PRO GAMER SPEED — configuration générale */
const PGS_CONFIG = {
  whatsappNumber: "2250768901166",
  // À compléter lorsque l'adresse de réception sera communiquée.
  adminEmail: "",
  // Le backend (Firebase, Supabase ou API sécurisée) sera branché ici.
};

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.classList.toggle("is-open", open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }));
  }

  const bookingForm = document.getElementById("booking-form");
  if (bookingForm) {
    const dateInput = bookingForm.elements.date;
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
    dateInput.min = localToday;

    bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;
      const data = new FormData(bookingForm);
      const message = [
        "Bonjour PRO GAMER SPEED ! Je souhaite effectuer une réservation.",
        "",
        `Nom : ${data.get("fullname")}`,
        `Téléphone : ${data.get("phone")}`,
        `Date : ${data.get("date")}`,
        `Heure : ${data.get("time")}`,
        `Expérience : ${data.get("game")}`,
        `Nombre de joueurs : ${data.get("players")}`,
        `Durée : ${data.get("duration")}`,
        `Message : ${data.get("message") || "Aucun"}`
      ].join("\n");
      document.getElementById("booking-feedback").textContent = "WhatsApp va s'ouvrir. Vérifie le message puis appuie sur Envoyer.";
      window.open(`https://wa.me/${PGS_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    });
  }

  const competitionForm = document.getElementById("competition-form");
  if (competitionForm) {
    competitionForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!competitionForm.reportValidity()) return;
      const data = new FormData(competitionForm);
      const ticketId = `PGS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
      const ticket = {
        id: ticketId,
        fullname: data.get("fullname"),
        nickname: data.get("nickname"),
        phone: data.get("phone"),
        email: data.get("email"),
        game: data.get("game"),
        age: data.get("age"),
        createdAt: new Date().toISOString()
      };

      // Démonstration locale uniquement : ne remplace pas une base de données.
      try {
        const saved = JSON.parse(localStorage.getItem("pgs_demo_tickets") || "[]");
        saved.push(ticket);
        localStorage.setItem("pgs_demo_tickets", JSON.stringify(saved));
      } catch (error) {
        console.warn("Stockage local indisponible", error);
      }

      document.getElementById("ticket-number").textContent = ticketId;
      document.getElementById("ticket-data").innerHTML = `
        <div><span>PARTICIPANT</span><strong>${escapeHTML(ticket.fullname)}</strong></div>
        <div><span>PSEUDO GAMER</span><strong>${escapeHTML(ticket.nickname)}</strong></div>
        <div><span>COMPÉTITION</span><strong>${escapeHTML(ticket.game)}</strong></div>
        <div><span>DATE DE CRÉATION</span><strong>${new Date(ticket.createdAt).toLocaleDateString("fr-FR")}</strong></div>`;
      const qr = document.getElementById("ticket-qr");
      qr.innerHTML = "";
      const qrText = `PRO GAMER SPEED | ${ticket.id} | ${ticket.fullname} | ${ticket.game}`;
      if (window.QRCode) {
        new QRCode(qr, { text: qrText, width: 150, height: 150, colorDark: "#07101f", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });
      } else {
        qr.textContent = "QR code indisponible hors connexion";
      }
      document.getElementById("ticket-result").hidden = false;
      document.getElementById("competition-feedback").textContent = "Ticket de démonstration généré sur cet appareil.";
      document.getElementById("ticket-result").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const printButton = document.getElementById("print-ticket");
  if (printButton) printButton.addEventListener("click", () => window.print());
});

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  }[char]));
}
