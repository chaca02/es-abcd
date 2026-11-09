/**
 * Es ABCD - Official Interactive JavaScript
 * Link Instagram: https://www.instagram.com/es.abcd.sahabat?exln=ZjVsYnEyemp5Nzg=
 */

const INSTAGRAM_URL = "https://www.instagram.com/es.abcd.sahabat?exln=ZjVsYnEyemp5Nzg=";

// State
const menuData = {
  original: {
    id: "original",
    name: "Es ABCD Original",
    price: 15000,
    desc: "Es serut halus berpadu pacar cina, selasih, cincau/cendol, kuah santan gurih & sirup legendaris."
  },
  fruity: {
    id: "fruity",
    name: "Es ABCD Fruity Bowl",
    price: 20000,
    desc: "Es serut bertabur potongan strawberry segar, mangga manis ranum, dan 1 scoop ice cream vanilla creamy."
  },
  signature: {
    id: "signature",
    name: "Es ABCD Signature",
    price: 25000,
    desc: "Mangkuk jumbo aneka jelly warna-warni, cincau, nata de coco, nangka, kacang sangrai & ice cream strawberry spesial."
  }
};

let currentOrder = {
  menuKey: "signature",
  qty: 1,
  toppings: []
};

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initMenuFilters();
  initFaqAccordion();
  initOrderModal();
  initScrollTop();
});

// 1. Navbar Handling
function initNavbar() {
  const toggleBtn = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  const navItems = document.querySelectorAll(".nav-link");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("mobile-open");
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        if (navLinks.classList.contains("mobile-open")) {
          icon.className = "fa-solid fa-xmark";
        } else {
          icon.className = "fa-solid fa-bars";
        }
      }
    });

    // Close on link click
    navItems.forEach(item => {
      item.addEventListener("click", () => {
        navLinks.classList.remove("mobile-open");
        const icon = toggleBtn.querySelector("i");
        if (icon) icon.className = "fa-solid fa-bars";
      });
    });
  }

  // Active Link on Scroll
  window.addEventListener("scroll", () => {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      const link = document.querySelector(`.nav-links a[href*="${sectionId}"]`);

      if (link) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      }
    });
  });
}

// 2. Menu Filter Tabs
function initMenuFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const menuCards = document.querySelectorAll(".menu-card");

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      menuCards.forEach(card => {
        if (filterValue === "all" || card.getAttribute("data-category") === filterValue) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(20px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });
}

// 3. FAQ Accordion
function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    questionBtn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
}

// 4. Order Modal & Calculation
function initOrderModal() {
  const modalBackdrop = document.getElementById("orderModal");
  const closeBtn = document.getElementById("closeModalBtn");
  const openOrderBtns = document.querySelectorAll(".btn-open-order");
  const menuRadios = document.querySelectorAll("input[name='selectedMenu']");
  const qtyMinus = document.getElementById("qtyMinus");
  const qtyPlus = document.getElementById("qtyPlus");
  const qtyDisplay = document.getElementById("qtyDisplay");
  const toppingCheckboxes = document.querySelectorAll(".topping-checkbox");
  const checkoutBtn = document.getElementById("proceedOrderBtn");

  // Open modal
  openOrderBtns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const menuType = btn.getAttribute("data-menu") || "signature";
      openModalWithMenu(menuType);
    });
  });

  // Close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener("click", (e) => {
      if (e.target === modalBackdrop) {
        closeModal();
      }
    });
  }

  // Escape key closes modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalBackdrop && modalBackdrop.classList.contains("active")) {
      closeModal();
    }
  });

  // Radio change
  menuRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      currentOrder.menuKey = radio.value;
      updateModalSelectionUI();
      calculateOrderTotal();
    });
  });

  // Quantity controls
  if (qtyMinus && qtyPlus && qtyDisplay) {
    qtyMinus.addEventListener("click", () => {
      if (currentOrder.qty > 1) {
        currentOrder.qty--;
        qtyDisplay.textContent = currentOrder.qty;
        calculateOrderTotal();
      }
    });

    qtyPlus.addEventListener("click", () => {
      if (currentOrder.qty < 50) {
        currentOrder.qty++;
        qtyDisplay.textContent = currentOrder.qty;
        calculateOrderTotal();
      }
    });
  }

  // Topping checkbox change
  toppingCheckboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      currentOrder.toppings = [];
      toppingCheckboxes.forEach(box => {
        if (box.checked) {
          currentOrder.toppings.push({
            name: box.getAttribute("data-name"),
            price: parseInt(box.getAttribute("data-price"), 10)
          });
        }
      });
      calculateOrderTotal();
    });
  });

  // Proceed checkout to Instagram DM
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      executeInstagramCheckout();
    });
  }
}

function openModalWithMenu(menuKey) {
  currentOrder.menuKey = menuKey;
  currentOrder.qty = 1;
  currentOrder.toppings = [];

  const modalBackdrop = document.getElementById("orderModal");
  const qtyDisplay = document.getElementById("qtyDisplay");
  const radio = document.querySelector(`input[name='selectedMenu'][value='${menuKey}']`);
  const toppingCheckboxes = document.querySelectorAll(".topping-checkbox");

  if (radio) radio.checked = true;
  if (qtyDisplay) qtyDisplay.textContent = "1";
  toppingCheckboxes.forEach(cb => cb.checked = false);

  updateModalSelectionUI();
  calculateOrderTotal();

  if (modalBackdrop) {
    modalBackdrop.classList.add("active");
    document.body.style.overflow = "hidden";
  }
}

function closeModal() {
  const modalBackdrop = document.getElementById("orderModal");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("active");
    document.body.style.overflow = "";
  }
}

function updateModalSelectionUI() {
  document.querySelectorAll(".menu-radio-card").forEach(card => {
    card.classList.remove("selected");
  });
  const activeRadio = document.querySelector(`input[name='selectedMenu'][value='${currentOrder.menuKey}']`);
  if (activeRadio) {
    const parentCard = activeRadio.closest(".menu-radio-card");
    if (parentCard) parentCard.classList.add("selected");
  }
}

function calculateOrderTotal() {
  const selectedItem = menuData[currentOrder.menuKey] || menuData.signature;
  const basePrice = selectedItem.price * currentOrder.qty;

  let toppingTotal = 0;
  currentOrder.toppings.forEach(top => {
    toppingTotal += top.price * currentOrder.qty;
  });

  const grandTotal = basePrice + toppingTotal;

  // Update summary UI
  const summaryMenuName = document.getElementById("summaryMenuName");
  const summaryMenuPrice = document.getElementById("summaryMenuPrice");
  const summaryToppingsRow = document.getElementById("summaryToppingsRow");
  const summaryToppingsPrice = document.getElementById("summaryToppingsPrice");
  const summaryGrandTotal = document.getElementById("summaryGrandTotal");

  if (summaryMenuName) {
    summaryMenuName.textContent = `${selectedItem.name} (${currentOrder.qty}x)`;
  }
  if (summaryMenuPrice) {
    summaryMenuPrice.textContent = `Rp ${basePrice.toLocaleString("id-ID")}`;
  }

  if (summaryToppingsRow && summaryToppingsPrice) {
    if (toppingTotal > 0) {
      summaryToppingsRow.style.display = "flex";
      summaryToppingsPrice.textContent = `+Rp ${toppingTotal.toLocaleString("id-ID")}`;
    } else {
      summaryToppingsRow.style.display = "none";
    }
  }

  if (summaryGrandTotal) {
    summaryGrandTotal.textContent = `Rp ${grandTotal.toLocaleString("id-ID")}`;
  }

  return { selectedItem, basePrice, toppingTotal, grandTotal };
}

function executeInstagramCheckout() {
  const { selectedItem, grandTotal } = calculateOrderTotal();

  // Format the text message to copy
  let toppingsStr = "Tidak ada extra topping";
  if (currentOrder.toppings.length > 0) {
    toppingsStr = currentOrder.toppings.map(t => t.name).join(", ");
  }

  const notesInput = document.getElementById("orderNotes");
  const notesStr = notesInput && notesInput.value.trim() ? notesInput.value.trim() : "-";

  const messageText = 
`🍧 *PESANAN ES ABCD (@es.abcd.sahabat)* 🍧
Halo Kak Admin! Saya mau order:

📌 *Menu Utama*: ${selectedItem.name} (${currentOrder.qty} porsi)
🍓 *Extra Topping*: ${toppingsStr}
📝 *Catatan Khusus*: ${notesStr}
💰 *Total Pesanan*: Rp ${grandTotal.toLocaleString("id-ID")}

Mohon info ongkir dan nomor rekening/QRIS untuk pembayaran ya kak. Terima kasih! ✨`;

  // Copy to clipboard
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(messageText).then(() => {
      showToast("✅ Format pesanan disalin! Mengarahkan ke Instagram DM...");
    }).catch(() => {
      showToast("🚀 Mengarahkan ke Instagram @es.abcd.sahabat...");
    });
  } else {
    showToast("🚀 Mengarahkan ke Instagram @es.abcd.sahabat...");
  }

  // Trigger Confetti effect if library loaded
  if (typeof confetti === "function") {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  // Open Instagram Link after slight delay so user sees toast
  setTimeout(() => {
    window.open(INSTAGRAM_URL, "_blank");
    closeModal();
  }, 900);
}

// 5. Scroll to top
function initScrollTop() {
  const backToTopBtn = document.getElementById("backToTopBtn");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

// 6. Toast Notification Helper
function showToast(message) {
  let toast = document.getElementById("appToast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "appToast";
    toast.className = "toast-notice";
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3200);
}
