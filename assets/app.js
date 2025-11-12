// Utility function to dispatch custom events
function dispatchCustomEvent(eventName, data = {}) {
  const event = new CustomEvent(eventName, { detail: data });
  document.dispatchEvent(event);
}

// Function to update the cart item quantity or remove item
function updateCartItem(key, quantity, inputElement, priceEle) {

  fetch('/cart/change.js', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
    body: JSON.stringify({ id: key, quantity: quantity })
  })
  .then(response => response.json())
  .then(data => {
    // Update cart item count
    document.getElementById('cart-item-count').textContent = data.item_count;
    document.querySelector('.thb-item-count').textContent = data.item_count;

    // Close the cart if empty
    if (data.item_count === 0) {
      const cartDrawer = document.getElementById('Cart-Drawer');
      cartDrawer.classList.remove('active');
      document.body.classList.remove('open-cc');
    }

    
  
    // Refresh the quantity value in the input element if quantity > 0
    if (quantity > 0 && inputElement) {
      inputElement.value = data.items.find(item => item.key === key)?.quantity || 1;
      if (priceEle) {
        priceEle.innerHTML = "$" + `${(data.items.find(item => item.key === key).final_line_price / 100).toFixed(2)}`;
      }
    }

    inputElement.value = +quantity

    // If the quantity is 0, remove the item visually from the cart drawer
    if (quantity === 0) {
      const itemElement = document.getElementById(`CartDrawerItem-${key}`);
      if (itemElement) itemElement.remove();
    }

    // Update the total price displayed
    document.querySelector('.cart-total .amount').textContent = `$${(data.total_price / 100).toFixed(2)}`;

    // Dispatch a custom event after updating the cart
    dispatchCustomEvent('cart:item-updated', { key, quantity });
  })
  .catch(error => console.error('Error updating cart:', error));
}

// Event delegation to handle quantity increment and decrement
document.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (button && (button.classList.contains('minus') || button.classList.contains('plus'))) {
    const inputElement = button.closest('.quantity').querySelector('.qty');
    const key = inputElement.id.split('_')[1];
    const change = button.classList.contains('minus') ? -1 : 1;
    const newQuantity = Math.max(1, parseInt(inputElement.value, 10) + change);

    // Get the price element related to this product
    const productContainer = button.closest('.product-information');
    const priceEle = productContainer?.querySelector('.amount');
    updateCartItem(key, newQuantity, inputElement, priceEle);
  }
});

// Event listener to handle quantity changes directly via input field
document.addEventListener('change', (event) => {
  if (event.target.classList.contains('qty')) {
    const key = event.target.id.split('_')[1];
    updateCartItem(key, parseInt(event.target.value, 10), event.target);
  }
});

// Event delegation to handle item removal
document.addEventListener('click', (event) => {
  const button = event.target.closest('.remove');
  if (button) {
    const key = button.closest('.product-cart-item').id.split('-')[1]; // Extract the key from the item's ID
    updateCartItem(key, 0); // Set quantity to 0 to remove the item
  }
});

// Cart Drawer Handling
document.addEventListener('DOMContentLoaded', () => {
  const cartDrawer = document.getElementById('Cart-Drawer');
  const toggleButton = document.getElementById('cart-drawer-toggle');
  const closeButton = document.querySelector('.side-panel-close');
  const orderNoteToggle = document.getElementById('order-note-toggle');
  const orderNoteContent = document.getElementById('mini-cart-note');
  const saveButton = orderNoteContent?.querySelector('.button.full');
  const noteTextarea = document.getElementById('mini-cart__notes');

  if (orderNoteToggle && orderNoteContent) {
    // Toggle the active class for the order note content
    orderNoteToggle.addEventListener('click', () => {
      orderNoteContent.classList.toggle('active');
    });
  }

  if (saveButton) {
    saveButton.addEventListener('click', () => {
      const note = noteTextarea.value;

      // Send the note to Shopify's cart API
      fetch('/cart/update.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({
          note: note
        })
      })
      .then(response => response.json())
      .then(data => {
        console.log('Order note saved:', data.note);
        // Optionally close the note input after saving
        orderNoteContent.classList.remove('active');
      })
      .catch(error => console.error('Error saving order note:', error));
    });
  }

  if (toggleButton && cartDrawer) {
    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.add('open-cc');
      cartDrawer.classList.add('active');
      cartDrawer.focus();
      dispatchCustomEvent('cart-drawer:open');
    });
  }

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      cartDrawer.classList.remove('active');
      document.body.classList.remove('open-cc');
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const elems = document.querySelectorAll(".products.carousel");

  // Check if elements exist
  if (elems.length > 0) {
    console.log("Carousel elements found:", elems.length);

    elems.forEach((ele) => {
      // Ensure the element is visible and ready
      if (ele) {
        console.log("Initializing Flickity for:", ele);

        const flkty = new Flickity(ele, {
          groupCells: 5,
          prevNextButtons: false,  // Use prevNextButtons instead of arrows
          pageDots: false,
          percentPosition: false,
        });

        // Check for the progress bar element
        const progressBar = ele.closest('.small-12').querySelector('.flickity-progress--bar');
        if (progressBar) {
          console.log("Progress bar found for:", ele);

          // Update the progress bar on scroll
          flkty.on('scroll', (progress) => {
            progress = Math.max(0, Math.min(1, progress));
            progressBar.style.width = `${progress * 100}%`;
            console.log(`Progress: ${progress * 100}%`);
          });
        } else {
          console.log("No progress bar found for:", ele);
        }
      } else {
        console.log("Element is not ready:", ele);
      }
    });
  } else {
    console.log("No carousel elements found.");
  }
});

