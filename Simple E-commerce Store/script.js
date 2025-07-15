
document.addEventListener("DOMContentLoaded", () => {
  fetch('http://localhost:5000/api/products')
    .then(res => res.json())
    .then(products => {
      const productList = document.getElementById('product-list');
      
      products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'col-4';
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <h4>${product.name}</h4>
          <div class="rating">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-regular fa-star"></i>
          </div>
          <p>₹${product.price}</p>
        `;
        productList.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Failed to load products", err);
    });
});



fetch('http://localhost:5000/api/cart', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    productId: '68624062e99df8634b449d6f',
    quantity: 1
  })
})
.then(res => res.json())
.then(data => console.log(data));
