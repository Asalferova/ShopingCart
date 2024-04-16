'use strict';

// Получение ссылок на элементы DOM
const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("product-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

const products = [
  {
    id: 1,
    name: "Ошейник для котика",
    price: 1200.99,
    category: "Ошейники",
    img: "./img/product1.png",
  },
  {
    id: 2,
    name: "Подушка для котика",
    price: 300,
    category: "Подушки",
    img: "./img/product2.png",
  },
  {
    id: 3,
    name: "Корм для котика",
    price: 300.99,
    category: "Кормы",
    img: "./img/product4.png",
  },
  {
    id: 4,
    name: "Очки для котика",
    price: 500,
    category: "Очки",
    img: "./img/product5.png",
  },
  {
    id: 5,
    name: "Миска для котика",
    price: 999,
    category: "Посуда",
    img: "./img/product3.png",
  },
  {
    id: 6,
    name: "Тапочки для котика",
    price: 995,
    category: "Тапочки",
    img: "./img/product6.png",
  },
];

products.forEach(
  ({ name, id, price, category, img }) => {
    dessertCards.innerHTML += `
      <div class="product-card">
      <img src="${img}" alt="image product">
        <h2>${name}</h2>
        <p class="product-price">${price} рублей</p>
        <p class="product-category">Категория: ${category}</p>
        <button 
          id="${id}" 
          class="btn add-to-cart-btn">Добавить в корзину
        </button>
      </div>
    `;
  }
);

// Определение класса ShoppingCart
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 8.25;
  }

  // Метод для добавления товара в корзину
  addItem(id, products) {
    const product = products.find((item) => item.id === id);
    const { name, price } = product;
    this.items.push(product);

    const totalCountPerProduct = {};
    this.items.forEach((item) => {
      totalCountPerProduct[item.id] = (totalCountPerProduct[item.id] || 0) + 1;
    })

    const currentProductCount = totalCountPerProduct[product.id];
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);

    currentProductCount > 1
      ? currentProductCountSpan.textContent = `${currentProductCount}x`
      : productsContainer.innerHTML += `
      <div id=product${id} class="product">
        <p>
          <span class="product-count" id=product-count-for-id${id}></span>${name}
        </p>
        <p>${price} рублей</p>
      </div>
      `;
  }

  // Метод для получения общего количества товаров
  getCounts() {
    return this.items.length;
  }

  // Метод для очистки корзины
  clearCart() {
    if (!this.items.length) {
      alert("Ваша корзина уже пуста");
      return;
    }

    const isCartCleared = confirm(
      "Вы точно хотите очистить свою корзину?"
    );

    if (isCartCleared) {
      this.items = [];
      this.total = 0;
      productsContainer.innerHTML = "";
      totalNumberOfItems.textContent = 0;
      cartSubTotal.textContent = 0;
      cartTaxes.textContent = 0;
      cartTotal.textContent = 0;
    }
  }

  // Метод для расчета налогов
  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  // Метод для расчета общей суммы
  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;
    cartSubTotal.textContent = `${subTotal.toFixed(2)} рублей`;
    cartTaxes.textContent = `${tax.toFixed(2)} рублей`;
    cartTotal.textContent = `${this.total.toFixed(2)} рублей`;
    return this.total;
  }
};

// Создание нового объекта ShoppingCart
const cart = new ShoppingCart();
// Получение ссылок на кнопки "Добавить в корзину"
const addToCartBtns = document.getElementsByClassName("add-to-cart-btn");

// Добавление обработчиков событий для кнопок "Добавить в корзину"
[...addToCartBtns].forEach(
  (btn) => {
    btn.addEventListener("click", (event) => {
      cart.addItem(Number(event.target.id), products);
      totalNumberOfItems.textContent = cart.getCounts();
      cart.calculateTotal();
    })
  }
);

// Добавление обработчика события для кнопки "Корзина"
cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Скрыть" : "Показать";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

// Добавление обработчика события для кнопки "Очистить корзину"
clearCartBtn.addEventListener('click', cart.clearCart.bind(cart));
