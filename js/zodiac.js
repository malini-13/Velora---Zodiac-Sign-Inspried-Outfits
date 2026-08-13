(function () {
  function initZodiacPage() {
    const selector = document.querySelector("[data-zodiac-selector]");
    const detail = document.querySelector("[data-zodiac-detail]");
    if (!selector || !detail) return;

    const products = window.VeloraProducts;

    selector.innerHTML = products.map((product, index) => `
      <button class="zodiac-btn${index === 0 ? " is-active" : ""}" type="button" data-zodiac="${product.id}">
        <strong>${product.zodiac}</strong>
        <span>${product.element} / ${product.dateRange}</span>
      </button>
    `).join("");

    function render(productId) {
      const product = window.VeloraProductMap[productId] || products[0];
      detail.innerHTML = `
        <div class="zodiac-visual">
          <img src="${product.image}" alt="${product.zodiac} zodiac inspired outfit by Velora" loading="lazy" width="640" height="800" onerror="this.onerror=null;this.src='assets/products/placeholder.svg';">
        </div>
        <div class="zodiac-copy">
          <div>
            <span class="chip">${product.zodiac}</span>
            <h3 style="margin-top:14px">${product.name}</h3>
          </div>
          <div class="zodiac-specs">
            <div class="spec"><strong>Date range</strong><span>${product.dateRange}</span></div>
            <div class="spec"><strong>Element</strong><span>${product.element}</span></div>
            <div class="spec"><strong>Personality</strong><span>${product.personality}</span></div>
            <div class="spec"><strong>Fashion energy</strong><span>${product.fashionEnergy}</span></div>
          </div>
          <div class="rich-copy">
            <p><strong>Velora outfit:</strong> ${product.description}</p>
            <p><strong>Styling concept:</strong> ${product.stylingConcept}</p>
          </div>
          <div class="product-actions">
            <a class="btn btn--primary" href="shop.html#product-${product.id}">Shop This Look</a>
            <button class="btn btn--ghost" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
          </div>
        </div>
      `;
    }

    render(products[0].id);

    selector.addEventListener("click", (event) => {
      const button = event.target.closest("[data-zodiac]");
      if (!button) return;

      selector.querySelectorAll(".zodiac-btn").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      render(button.dataset.zodiac);
    });
  }

  window.initZodiacPage = initZodiacPage;
})();
