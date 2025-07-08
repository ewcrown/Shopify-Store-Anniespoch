const ON_CHANGE_DEBOUNCE_TIMER = 300;

const PUB_SUB_EVENTS = {
  cartUpdate: 'cart-update',
  quantityUpdate: 'quantity-update',
  optionValueSelectionChange: 'option-value-selection-change',
  variantChange: 'variant-change',
  cartError: 'cart-error',
};

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: `application/${type}` },
  };
}