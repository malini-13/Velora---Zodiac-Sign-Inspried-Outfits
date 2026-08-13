(function () {
  const STORAGE_KEY = "velora-cart-v1";

  function readCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function writeCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function addItem(productId, quantity = 1) {
    const cart = readCart();
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    writeCart(cart);
    return cart;
  }

  function setQuantity(productId, quantity) {
    let cart = readCart();
    cart = cart
      .map((item) => item.id === productId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0);
    writeCart(cart);
    return cart;
  }

  function removeItem(productId) {
    const cart = readCart().filter((item) => item.id !== productId);
    writeCart(cart);
    return cart;
  }

  function clearCart() {
    writeCart([]);
  }

  function getCount() {
    return readCart().reduce((total, item) => total + item.quantity, 0);
  }

  function getEnrichedItems() {
    return readCart()
      .map((item) => {
        const product = window.VeloraProductMap[item.id];
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean);
  }

  function getSubtotal() {
    return getEnrichedItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  window.VeloraCart = {
    readCart,
    addItem,
    setQuantity,
    removeItem,
    clearCart,
    getCount,
    getEnrichedItems,
    getSubtotal
  };
})();
