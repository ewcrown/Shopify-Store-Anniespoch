// Upcart Cart Drawer
const FREE_VARIANT_ID = 48640031981814;
const BLOCKED_VARIANT_ID = 48640031949046;
const MATCHED_URLS = [
  '/api/2025-04/graphql.json',
  '/cart.json?app=mwsfees',
  '/cart/add.js?upcart=1&opens_cart=never'
];

let debounceTimer = null;

function getCart() {
  return fetch('/cart.js').then(res => res.json());
}

function removeBlockedVariant(cart) {
  const hasFree = cart.items.some(item => item.variant_id == FREE_VARIANT_ID);
  const blockedItem = cart.items.find(item => item.variant_id == BLOCKED_VARIANT_ID);

  if (hasFree && blockedItem) {
    console.log('blockedItem.key ==>', blockedItem);
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: blockedItem.key, quantity: 0 })
    }).then(() => {
      console.log('Blocked variant removed because Free variant is in the cart.');
      window.location.href = '/cart';
    });
  }
}

function shouldWatch(url) {
  return MATCHED_URLS.some(pattern => url.includes(pattern));
}

function setupCartWatcher() {
  const originalFetch = window.fetch;

  window.fetch = function (...args) {
    const url = typeof args[0] === 'string' ? args[0] : args[0].url;

    if (shouldWatch(url)) {
      // Clear previous debounce if any
      if (debounceTimer) clearTimeout(debounceTimer);

      // Set debounce
      debounceTimer = setTimeout(() => {
        getCart().then(removeBlockedVariant);
      }, 300);
    }

    return originalFetch.apply(this, args);
  };
}

// Init
setupCartWatcher();


const cartDrawer = document.querySelector("#Cart-Drawer");
if (cartDrawer) {
  cartDrawer.addEventListener("click", (e) => {
    const closeButton =
      e.target.classList.contains("side-panel-close") ||
      e.target.closest(".side-panel-close");
    if (closeButton) {
      cartDrawer.classList.remove("active");
    }
  });
}
const variant_form = document.querySelector('.product-form__input');
const product_form = document.querySelector('.product-form');
if (variant_form) {
  variant_form.addEventListener('click', (e) => {
  if (e.target.tagName === "INPUT") {
    const variant_value = e.target.value;
    const hidden_select = document.querySelector('#annies-variant-select');
    const hidden_input = product_form.querySelector('input[name="id"]');
    const selectedOption = Array.from(hidden_select.options).find(option => option.dataset.title === variant_value);

    if (selectedOption) {
      const dataPrice = selectedOption.dataset.price;
      const dataCompareAtPrice = selectedOption.dataset.compare_at_price;

      const priceContainer = document.querySelector(".product-price-container .price");
      const compareAtEl = priceContainer.querySelector(".compare-at-price.amount");
      const compareAtWrapper = compareAtEl?.closest("del");
      const priceEl = priceContainer.querySelector("ins .amount");

      const compareAtValid = dataCompareAtPrice && !dataCompareAtPrice.includes("$0") && !dataCompareAtPrice.includes("0.00");

      // Update prices
      if (priceEl) {
        priceEl.innerText = dataPrice;
      }

      if (compareAtValid) {
        if (compareAtEl) compareAtEl.innerText = dataCompareAtPrice;
        if (compareAtWrapper) compareAtWrapper.style.display = "inline";
      } else {
        if (compareAtWrapper) compareAtWrapper.style.display = "none";
      }
    }

    // Update hidden select and input
    for (let i = 0; i < hidden_select.options.length; i++) {
      const option = hidden_select.options[i];
      if (option.dataset.title && option.dataset.title.includes(variant_value)) {
        option.selected = true;
        hidden_input.value = option.value;
        break;
      }
    }
  }
});
}
const AddToCart = document.querySelector('#AddToCart');
AddToCart?.addEventListener('click', async () => {
  setTimeout(async () => {
    try {
      const resp = await fetch(`${window.Shopify.routes.root}cart.js`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await resp.json();
      const cart_count = document.querySelector(".thb-item-count")
      cart_count.innerText = data.item_count
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  }, 2000);
});


const product_info = document.querySelector('.product-information .quantity');
product_info?.addEventListener('click', (e) => {
  const qtyInput = product_info.querySelector('.qty');
  let qty = parseInt(qtyInput.value, 10) || 1;

  if ((e.target.classList.contains('minus') || e.target.closest('.minus')) && qty > 1) {
    qty -= 1;
  } else if (e.target.classList.contains('plus') || e.target.closest('.plus')) {
    qty += 1;
  }

  qtyInput.value = qty;
});


// Cart Page
function attachQuantityListeners() {
  const cartPage = document.querySelector('#main-cart-items');
  if (!cartPage) return;

  const cartItems = cartPage.querySelectorAll('.cart-item');

  cartItems.forEach((item, index) => {
    const quantityInput = item.querySelector('.quantity__input');
    const id = quantityInput.dataset.quantityVariantId;

    if (!quantityInput) return;

    quantityInput.addEventListener('change', async (e) => {
      const newQuantity = parseInt(e.target.value);

      try {
        await fetch('/cart/change.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            id: `${id}`,
            quantity: newQuantity
          })
        });

        // Re-fetch and update the cart section
        const response = await fetch(window.location.pathname);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const newCart = doc.querySelector('#main-cart-items');
        const newCartFooter = doc.querySelector('.cart__footer .js-contents');

        document.querySelector('#main-cart-items').innerHTML = newCart.innerHTML;
        document.querySelector('.cart__footer .js-contents').innerHTML = newCartFooter.innerHTML;

        // ✅ Reattach listeners after DOM update
        attachQuantityListeners();
      } catch (error) {
        console.error('Failed to update cart quantity:', error);
      }
    });
  });
}

// 🔁 Initial call
attachQuantityListeners();


const limited_product_ids = JSON.parse(document.body.dataset.limitedProduct);
const originalFetch = window.fetch;

function showPopup() {
  document.getElementById('limited-product-popup').style.display = 'block';
}

function hidePopup() {
  location.reload(); // This will reload the page when the popup is closed
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('close-popup').addEventListener('click', hidePopup);
});

window.fetch = async function (...args) {
  const [url, options] = args;

  if (url.includes('/cart/add') && options?.body instanceof FormData) {
    const formData = options.body;
    const productId = formData.get('id');

    const response = await originalFetch.apply(this, args);

    if (limited_product_ids.includes(productId)) {
      document.querySelector('#Cart-Drawer').style.display = 'none'
      showPopup();
      await originalFetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          quantity: 1,
        }),
      });
    }

    return response;
  }

  if (url.includes('cart/change.js')) {
    const productId = JSON.parse(options.body).id.includes(':') ? JSON.parse(options.body).id.split(':')[0] : JSON.parse(options.body).id;
    const productQty = JSON.parse(options.body).quantity
    const response = await originalFetch.apply(this, args);

    if (limited_product_ids.includes(productId) && productQty > 1) {
      showPopup();
      await originalFetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: productId,
          quantity: 1,
        }),
      });
    }
    return response;
  }

  return originalFetch.apply(this, args);
};
