const search = document.getElementById('search');
const category = document.getElementById('category');
const filterButton = document.getElementById('filter');
const resultCount = document.getElementById('resultCount');
const productCards = document.querySelectorAll('.card[data-name]');

function filterProducts() {
  const term = search.value.trim().toLowerCase();
  const selectedCategory = category.value;
  let visibleCount = 0;

  productCards.forEach((card) => {
    const matchesName = card.dataset.name.toLowerCase().includes(term);
    const matchesCategory =
      !selectedCategory || card.dataset.category === selectedCategory;
    const shouldShow = matchesName && matchesCategory;

    card.hidden = !shouldShow;
    if (shouldShow) visibleCount++;
  });

  resultCount.textContent =
    `${visibleCount} material(is) encontrado(s).`;
}

filterButton.addEventListener('click', filterProducts);
search.addEventListener('input', filterProducts);
category.addEventListener('change', filterProducts);

document.querySelectorAll('.details').forEach((button) => {
  button.addEventListener('click', () => {
    alert(button.dataset.detail + '\\nPreço demonstrativo para a Paraíba (PB).');
  });
});

filterProducts();
