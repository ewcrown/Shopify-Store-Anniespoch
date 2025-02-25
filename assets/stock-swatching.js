// const availabilitySwitch = document.getElementById("availabilitySwitch");
// const availabilityLabel = document.getElementById("availabilityLabel");
// const inStockCheckbox = document.getElementById(
//   "Filter-filter.v.availability-1"
// );

// function updateSwitch() {
//   if (inStockCheckbox.checked) {
//     availabilitySwitch.checked = false;
//     availabilityLabel.textContent = "In stock";
//   } else {
//     availabilitySwitch.checked = true;
//     availabilityLabel.textContent = "Out of stock";
//   }
// }

// updateSwitch();

// availabilitySwitch.addEventListener("change", () => {
//   inStockCheckbox.checked = !availabilitySwitch.checked;
//   updateSwitch();
// });

// inStockCheckbox.addEventListener("change", updateSwitch);

const availabilitySwitch = document.getElementById("availabilitySwitch");
const availabilityLabel = document.getElementById("availabilityLabel");
const inStockCheckbox = document.getElementById(
  "Filter-filter.v.availability-1"
);

function updateSwitch() {
  if (availabilitySwitch.checked) {
    availabilityLabel.textContent = "Out of stock";
  } else {
    availabilityLabel.textContent = "In stock";
  }
}
updateSwitch();

availabilitySwitch.addEventListener("change", () => {
  inStockCheckbox.checked = !availabilitySwitch.checked;
  updateSwitch();
});

inStockCheckbox.addEventListener("change", updateSwitch);
