class SearchForm extends HTMLElement {
  constructor() {
    super();
    // Placeholder logic for SearchForm that can be reused in MainSearch
  }
}
class MainSearch extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input[type="search"]'); // Target the search input
    this.resetButton = this.querySelector('button[type="reset"]'); // Target the reset button

    // If the input exists, add event listeners
    if (this.input) {
      this.input.form.addEventListener('reset', this.onFormReset.bind(this)); // Handle form reset
      this.input.addEventListener('input', debounce((event) => {
        this.onChange(event); // Handle input changes
      }, 300).bind(this)); // Debounced input event
    }
  }

  // Method to toggle reset button visibility
  toggleResetButton() {
    const resetIsHidden = this.resetButton.classList.contains('hidden');
    if (this.input.value.length > 0 && resetIsHidden) {
      this.resetButton.classList.remove('hidden'); // Show reset button
    } else if (this.input.value.length === 0 && !resetIsHidden) {
      this.resetButton.classList.add('hidden'); // Hide reset button
    }
  }

  // Call toggleResetButton whenever the input changes
  onChange() {
    this.toggleResetButton();
  }

  // Determines if the form should be reset (based on other conditions like dropdown selection)
  shouldResetForm() {
    return !document.querySelector('[aria-selected="true"] a');
  }

  // Method to handle form reset action
  onFormReset(event) {
    event.preventDefault();  // Prevent default form reset behavior
    if (this.shouldResetForm()) {
      this.input.value = '';   // Clear the input value
      this.input.focus();      // Focus the input after reset
      this.toggleResetButton(); // Update reset button visibility
    }
  }
}

// Register the custom element 'main-search'
customElements.define('main-search', MainSearch);

// Debounce function to limit input event firing
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
