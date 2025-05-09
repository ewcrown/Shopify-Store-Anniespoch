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
        const priceContainer = document.querySelector(".product-price-container .amount");
        if (priceContainer) {
          priceContainer.innerText = dataPrice;
        }
      }
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
      console.log("cart_count==>", cart_count)
      cart_count.innerText = data.item_count
      console.log('Cart Data:', data);
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
    const line = index + 1;

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
            line,
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