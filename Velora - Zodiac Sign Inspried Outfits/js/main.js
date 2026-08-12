(function () {
  const moneyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  });

  function formatPrice(value) {
    return moneyFormatter.format(value);
  }

  function getPage() {
    return document.body.dataset.page || "home";
  }

  function setCurrentYear() {
    document.querySelectorAll("[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function setActiveNav() {
    const page = getPage();
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      const matches =
        (page === "home" && link.dataset.navLink === "home") ||
        (page === "shop" && link.dataset.navLink === "shop") ||
        (page === "find" && link.dataset.navLink === "find") ||
        (page === "about" && link.dataset.navLink === "about") ||
        (page === "contact" && link.dataset.navLink === "contact");

      if (matches) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  function initHeader() {
    const header = document.querySelector("[data-header]");
    const menuToggle = document.querySelector("[data-menu-toggle]");
    const mobileNav = document.querySelector("[data-mobile-nav]");

    const setHeaderState = () => {
      if (!header) return;
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });

    if (!menuToggle || !mobileNav) return;

    const closeMenu = () => {
      mobileNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    mobileNav.addEventListener("click", (event) => {
      if (event.target.matches("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  function initReveal() {
    const elements = document.querySelectorAll("[data-reveal], .reveal");
    if (!elements.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16 });

    elements.forEach((el) => {
      el.classList.add("reveal");
      observer.observe(el);
    });
  }

  function productCard(product, variant) {
    const link = variant === "home" ? `shop.html#product-${product.id}` : `#product-${product.id}`;
    return `
      <article class="product-card reveal" id="product-${product.id}">
        <div class="product-media">
          <img src="${product.image}" alt="${product.zodiac} zodiac inspired mythical fashion piece by Velora" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/products/placeholder.svg';">
          <span class="chip product-badge">${product.zodiac}</span>
        </div>
        <div class="product-body">
          <div class="product-title">
            <p>${product.element} / ${product.dateRange}</p>
            <h3>${product.name}</h3>
          </div>
          <div class="product-meta">
            <span>${formatPrice(product.price)}</span>
            <span>${product.fashionEnergy}</span>
          </div>
          <p class="product-description">${product.description}</p>
          <div class="product-actions">
            <a class="btn btn--ghost" href="${link}">View Piece</a>
            <button class="btn btn--primary" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProductGrids() {
    document.querySelectorAll("[data-product-grid]").forEach((grid) => {
      const variant = grid.dataset.productGrid || "shop";
      grid.innerHTML = window.VeloraProducts.map((product) => productCard(product, variant)).join("");
    });
  }

  function updateCartCount() {
    const count = window.VeloraCart.getCount();
    document.querySelectorAll("[data-cart-count]").forEach((node) => {
      node.textContent = String(count);
      node.classList.remove("is-pulse");
      void node.offsetWidth;
      node.classList.toggle("is-pulse", count > 0);
    });
  }

  function renderCartDrawer() {
    const items = window.VeloraCart.getEnrichedItems();
    const list = document.querySelector("[data-cart-items]");
    const subtotal = document.querySelector("[data-cart-subtotal]");
    const empty = document.querySelector("[data-cart-empty]");

    if (!list || !subtotal || !empty) return;

    if (!items.length) {
      list.innerHTML = "";
      empty.hidden = false;
      subtotal.textContent = formatPrice(0);
      return;
    }

    empty.hidden = true;
    list.innerHTML = items.map((item) => `
      <article class="cart-item">
        <img src="${item.image}" alt="${item.zodiac} luxury fashion outfit by Velora" loading="lazy" onerror="this.onerror=null;this.src='assets/products/placeholder.svg';">
        <div>
          <h4>${item.name}</h4>
          <p>${formatPrice(item.price)}</p>
          <div class="cart-item__meta">
            <div class="qty" aria-label="${item.name} quantity controls">
              <button type="button" aria-label="Decrease quantity" data-cart-dec="${item.id}">−</button>
              <strong aria-label="Quantity">${item.quantity}</strong>
              <button type="button" aria-label="Increase quantity" data-cart-inc="${item.id}">+</button>
            </div>
            <button class="btn btn--text" type="button" data-cart-remove="${item.id}"><span>Remove</span></button>
          </div>
        </div>
      </article>
    `).join("");

    subtotal.textContent = formatPrice(window.VeloraCart.getSubtotal());
  }

  function setCartOpen(open) {
    const drawer = document.querySelector("[data-cart-drawer]");
    const backdrop = document.querySelector("[data-drawer-backdrop]");
    if (!drawer || !backdrop) return;
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      drawer.querySelector("[data-cart-close]")?.focus();
    }
  }

  function initCart() {
    updateCartCount();
    renderCartDrawer();

    document.addEventListener("click", (event) => {
      const addButton = event.target.closest("[data-add-to-cart]");
      const openButton = event.target.closest("[data-cart-open]");
      const closeButton = event.target.closest("[data-cart-close]");
      const backdrop = event.target.closest("[data-drawer-backdrop]");
      const incButton = event.target.closest("[data-cart-inc]");
      const decButton = event.target.closest("[data-cart-dec]");
      const removeButton = event.target.closest("[data-cart-remove]");

      if (addButton) {
        window.VeloraCart.addItem(addButton.dataset.addToCart, 1);
        updateCartCount();
        renderCartDrawer();
        setCartOpen(true);
        return;
      }

      if (openButton) {
        setCartOpen(true);
        return;
      }

      if (closeButton || backdrop) {
        setCartOpen(false);
        return;
      }

      if (incButton) {
        const current = window.VeloraCart.readCart().find((item) => item.id === incButton.dataset.cartInc);
        window.VeloraCart.setQuantity(incButton.dataset.cartInc, (current?.quantity || 0) + 1);
        updateCartCount();
        renderCartDrawer();
        return;
      }

      if (decButton) {
        const current = window.VeloraCart.readCart().find((item) => item.id === decButton.dataset.cartDec);
        const next = Math.max(0, (current?.quantity || 0) - 1);
        window.VeloraCart.setQuantity(decButton.dataset.cartDec, next);
        updateCartCount();
        renderCartDrawer();
        return;
      }

      if (removeButton) {
        window.VeloraCart.removeItem(removeButton.dataset.cartRemove);
        updateCartCount();
        renderCartDrawer();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setCartOpen(false);
    });
  }

  function initContactForm() {
    const form = document.querySelector("[data-contact-form]");
    const message = document.querySelector("[data-form-message]");
    if (!form || !message) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = form.elements.namedItem("name");
      const email = form.elements.namedItem("email");
      const subject = form.elements.namedItem("subject");
      const body = form.elements.namedItem("message");

      if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !body.value.trim()) {
        message.textContent = "Please complete every field before sending your message.";
        message.classList.add("is-visible");
        return;
      }

      message.textContent = "Thank you. Your message has been received. Velora will respond shortly.";
      message.classList.add("is-visible");
      form.reset();
    });
  }

  function injectProductSchema() {
    const node = document.querySelector("[data-product-schema]");
    if (!node) return;

    const graph = window.VeloraProducts.map((product) => ({
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: [`https://www.velora.com/${product.image}`],
      sku: product.id,
      brand: {
        "@type": "Brand",
        name: "VELORA"
      },
      offers: {
        "@type": "Offer",
        url: `https://www.velora.com/shop.html#product-${product.id}`,
        priceCurrency: "INR",
        price: String(product.price),
        availability: "https://schema.org/InStock"
      }
    }));

    node.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  }

  function scrollHashTarget() {
    const id = window.location.hash.replace("#", "");
    if (!id) return;

    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => el.scrollIntoView({ block: "center", behavior: "smooth" }));
    }
  }

  function init() {
    setCurrentYear();
    setActiveNav();
    initHeader();
    initReveal();
    renderProductGrids();
    initCart();
    initContactForm();
    injectProductSchema();
    window.initZodiacPage?.();
    scrollHashTarget();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
