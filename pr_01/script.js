const categories = [
  { id: "all", label: "전체 메뉴" },
  { id: "burger", label: "버거" },
  { id: "set", label: "세트" },
  { id: "side", label: "사이드" },
  { id: "drink", label: "음료" }
];

const menuItems = [
  {
    id: 1,
    category: "burger",
    name: "클래식 버거",
    price: 6800,
    description: "담백한 패티와 신선한 채소가 들어간 기본 버거입니다.",
    popular: true,
    options: {
      sizes: ["단품", "세트"],
      extras: ["치즈 추가", "베이컨 추가"]
    }
  },
  {
    id: 2,
    category: "burger",
    name: "시그니처 버거",
    price: 7900,
    description: "고소한 소스와 풍성한 토핑이 들어간 대표 메뉴입니다.",
    popular: true,
    options: {
      sizes: ["단품", "세트"],
      extras: ["치즈 추가", "해시브라운 추가"]
    }
  },
  {
    id: 3,
    category: "set",
    name: "패밀리 세트",
    price: 14500,
    description: "버거와 사이드, 음료를 한 번에 즐길 수 있는 세트입니다.",
    popular: false,
    options: {
      sizes: ["기본", "라지"],
      extras: ["감자 업그레이드", "콜라 업그레이드"]
    }
  },
  {
    id: 4,
    category: "side",
    name: "크리스피 프라이",
    price: 3300,
    description: "바삭한 식감이 살아 있는 감자튀김입니다.",
    popular: false,
    options: {
      sizes: ["보통", "라지"],
      extras: ["치즈 시즈닝", "케첩 추가"]
    }
  },
  {
    id: 5,
    category: "drink",
    name: "레몬 에이드",
    price: 2900,
    description: "산뜻한 레몬 향이 느껴지는 시원한 에이드입니다.",
    popular: false,
    options: {
      sizes: ["보통", "라지"],
      extras: ["얼음 적게", "탄산 약하게"]
    }
  }
];

const state = {
  currentScreen: "start",
  selectedCategory: "all",
  cart: [],
  selectedMenu: null,
  selectedSize: "",
  selectedExtras: [],
  quantity: 1
};

const elements = {
  screens: document.querySelectorAll(".screen"),
  startOrderButton: document.getElementById("startOrderButton"),
  previewMenuButton: document.getElementById("previewMenuButton"),
  backToStartButton: document.getElementById("backToStartButton"),
  categoryList: document.getElementById("categoryList"),
  menuGrid: document.getElementById("menuGrid"),
  menuSectionTitle: document.getElementById("menuSectionTitle"),
  menuSectionNote: document.getElementById("menuSectionNote"),
  menuCountText: document.getElementById("menuCountText"),
  cartList: document.getElementById("cartList"),
  cartTotal: document.getElementById("cartTotal"),
  menuModal: document.getElementById("menuModal"),
  modalTitle: document.getElementById("modalTitle"),
  modalPrice: document.getElementById("modalPrice"),
  modalDescription: document.getElementById("modalDescription"),
  modalVisual: document.getElementById("modalVisual"),
  sizeChoices: document.getElementById("sizeChoices"),
  extraChoices: document.getElementById("extraChoices"),
  quantityValue: document.getElementById("quantityValue"),
  closeModalButton: document.getElementById("closeModalButton"),
  increaseQtyButton: document.getElementById("increaseQtyButton"),
  decreaseQtyButton: document.getElementById("decreaseQtyButton"),
  addToCartButton: document.getElementById("addToCartButton"),
  checkoutButton: document.getElementById("checkoutButton"),
  cartCheckoutButton: document.getElementById("cartCheckoutButton"),
  menuCardTemplate: document.getElementById("menuCardTemplate")
};

function formatPrice(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function setScreen(screenName) {
  state.currentScreen = screenName;
  elements.screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === screenName);
  });
}

function renderCategories() {
  elements.categoryList.innerHTML = "";

  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "category-button";
    button.textContent = category.label;
    if (state.selectedCategory === category.id) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      state.selectedCategory = category.id;
      renderCategories();
      renderMenus();
    });

    elements.categoryList.appendChild(button);
  });
}

function getFilteredMenus() {
  if (state.selectedCategory === "all") {
    return menuItems;
  }

  return menuItems.filter((menu) => menu.category === state.selectedCategory);
}

function renderMenus() {
  const filteredMenus = getFilteredMenus();
  const currentCategory = categories.find((category) => category.id === state.selectedCategory);

  elements.menuSectionTitle.textContent = currentCategory ? currentCategory.label : "전체 메뉴";
  elements.menuCountText.textContent = `총 ${filteredMenus.length}개 메뉴`;
  elements.menuSectionNote.textContent =
    state.selectedCategory === "all"
      ? "메뉴를 선택하면 옵션 창이 열립니다."
      : `${currentCategory.label} 카테고리 메뉴를 보고 있습니다.`;
  elements.menuGrid.innerHTML = "";

  if (filteredMenus.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "menu-empty";
    emptyState.innerHTML = `
      <strong>표시할 메뉴가 없습니다.</strong>
      <p>다른 카테고리를 선택하거나 메뉴 데이터를 추가해보세요.</p>
    `;
    elements.menuGrid.appendChild(emptyState);
    return;
  }

  filteredMenus.forEach((menu) => {
    const fragment = elements.menuCardTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".menu-card");
    const badge = fragment.querySelector(".badge");
    const title = fragment.querySelector("h4");
    const price = fragment.querySelector(".price");
    const description = fragment.querySelector(".description");
    const visual = fragment.querySelector(".menu-visual");
    const button = fragment.querySelector(".ghost-button");

    title.textContent = menu.name;
    price.textContent = formatPrice(menu.price);
    description.textContent = menu.description;
    visual.style.background = menu.popular
      ? "linear-gradient(135deg, rgba(217, 239, 226, 0.95), rgba(255,255,255,0.4)), linear-gradient(180deg, #f7f7f2, #ebebe5)"
      : "linear-gradient(135deg, rgba(236, 236, 231, 0.95), rgba(255,255,255,0.4)), linear-gradient(180deg, #f9f9f7, #ededea)";

    if (!menu.popular) {
      badge.textContent = "NEW";
    }

    button.addEventListener("click", () => openMenuModal(menu));
    card.addEventListener("click", (event) => {
      if (event.target.tagName !== "BUTTON") {
        openMenuModal(menu);
      }
    });

    elements.menuGrid.appendChild(fragment);
  });
}

function renderCart() {
  elements.cartList.innerHTML = "";

  if (state.cart.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <strong>아직 담긴 메뉴가 없습니다.</strong>
      <p>카테고리에서 메뉴를 선택하고 옵션을 고른 뒤 장바구니에 담아보세요.</p>
    `;
    elements.cartList.appendChild(emptyState);
  } else {
    state.cart.forEach((item) => {
      const cartItem = document.createElement("article");
      cartItem.className = "cart-item";
      cartItem.innerHTML = `
        <div class="cart-item-header">
          <span class="cart-item-title">${item.name}</span>
          <strong>${formatPrice(item.total)}</strong>
        </div>
        <p class="cart-item-options">사이즈: ${item.size} / 추가: ${item.extras.join(", ") || "없음"}</p>
        <div class="cart-item-footer">
          <span>수량 ${item.quantity}</span>
          <button class="ghost-button small" type="button">삭제</button>
        </div>
      `;

      const removeButton = cartItem.querySelector("button");
      removeButton.addEventListener("click", () => {
        state.cart = state.cart.filter((cartItemState) => cartItemState.cartId !== item.cartId);
        renderCart();
      });

      elements.cartList.appendChild(cartItem);
    });
  }

  const total = state.cart.reduce((sum, item) => sum + item.total, 0);
  elements.cartTotal.textContent = formatPrice(total);
}

function createChoiceButtons(container, choices, type) {
  container.innerHTML = "";

  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;

    if (type === "size" && state.selectedSize === choice) {
      button.classList.add("active");
    }

    if (type === "extra" && state.selectedExtras.includes(choice)) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      if (type === "size") {
        state.selectedSize = choice;
      } else {
        if (state.selectedExtras.includes(choice)) {
          state.selectedExtras = state.selectedExtras.filter((extra) => extra !== choice);
        } else {
          state.selectedExtras = [...state.selectedExtras, choice];
        }
      }

      createChoiceButtons(elements.sizeChoices, state.selectedMenu.options.sizes, "size");
      createChoiceButtons(elements.extraChoices, state.selectedMenu.options.extras, "extra");
    });

    container.appendChild(button);
  });
}

function openMenuModal(menu) {
  state.selectedMenu = menu;
  state.selectedSize = menu.options.sizes[0];
  state.selectedExtras = [];
  state.quantity = 1;

  elements.modalTitle.textContent = menu.name;
  elements.modalPrice.textContent = formatPrice(menu.price);
  elements.modalDescription.textContent = menu.description;
  elements.quantityValue.textContent = String(state.quantity);
  elements.modalVisual.style.background = menu.popular
    ? "linear-gradient(135deg, rgba(217, 239, 226, 0.95), rgba(255,255,255,0.2)), linear-gradient(180deg, #f8f8f5, #ecece7)"
    : "linear-gradient(135deg, rgba(236,236,231,0.95), rgba(255,255,255,0.2)), linear-gradient(180deg, #fafaf8, #efefe9)";

  createChoiceButtons(elements.sizeChoices, menu.options.sizes, "size");
  createChoiceButtons(elements.extraChoices, menu.options.extras, "extra");
  elements.menuModal.classList.remove("hidden");
}

function closeMenuModal() {
  elements.menuModal.classList.add("hidden");
}

function addSelectedMenuToCart() {
  if (!state.selectedMenu || !state.selectedSize) {
    return;
  }

  const total = state.selectedMenu.price * state.quantity;
  state.cart = [
    ...state.cart,
    {
      cartId: `${state.selectedMenu.id}-${Date.now()}`,
      name: state.selectedMenu.name,
      size: state.selectedSize,
      extras: state.selectedExtras,
      quantity: state.quantity,
      total
    }
  ];

  renderCart();
  closeMenuModal();
}

function bindEvents() {
  elements.startOrderButton.addEventListener("click", () => setScreen("kiosk"));
  elements.previewMenuButton.addEventListener("click", () => setScreen("kiosk"));
  elements.backToStartButton.addEventListener("click", () => setScreen("start"));
  elements.closeModalButton.addEventListener("click", closeMenuModal);

  elements.increaseQtyButton.addEventListener("click", () => {
    state.quantity += 1;
    elements.quantityValue.textContent = String(state.quantity);
  });

  elements.decreaseQtyButton.addEventListener("click", () => {
    state.quantity = Math.max(1, state.quantity - 1);
    elements.quantityValue.textContent = String(state.quantity);
  });

  elements.addToCartButton.addEventListener("click", addSelectedMenuToCart);

  elements.menuModal.addEventListener("click", (event) => {
    if (event.target === elements.menuModal) {
      closeMenuModal();
    }
  });

  const openCheckoutNotice = () => {
    window.alert("1단계 구현 범위에서는 주문 확인 전 단계까지만 화면 구조를 구성했습니다.");
  };

  elements.checkoutButton.addEventListener("click", openCheckoutNotice);
  elements.cartCheckoutButton.addEventListener("click", openCheckoutNotice);
}

function init() {
  renderCategories();
  renderMenus();
  renderCart();
  bindEvents();
  setScreen("start");
}

init();
