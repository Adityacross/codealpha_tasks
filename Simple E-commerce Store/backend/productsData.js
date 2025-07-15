const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);


 const products = [
  {
    name: "Red Printed T-shirts",
    brand: "Beyond",
    description: "Comfortable red cotton T-shirt with unique print.",
    price: 25.00,
    image: "img/ChatGPT Image Jun 21, 2025, 10_23_20 PM.png",
    inStock: true
  },
  {
    name: "Black Printed T-shirts",
    brand: "Urban",
    description: "Stylish black printed T-shirt for daily wear.",
    price: 25.00,
    image: "img/ChatGPT Image Jun 21, 2025, 10_21_14 PM.png",
    inStock: true
  },
  {
    name: "Black Urban Hoodie",
    brand: "Urban",
    description: "Trendy black hoodie made from premium materials.",
    price: 40.00,
    image: "img/mohamed-youssry-KMwpYURfx6E-unsplash.jpg",
    inStock: true
  },
  {
    name: "Oversized Hoodie",
    brand: "StyleSnap",
    description: "Cozy oversized hoodie for ultimate comfort.",
    price: 35.00,
    image: "img/waldo-kleyn-vtnhu9LgScs-unsplash.jpg",
    inStock: true
  },
  {
    name: "Brown Joggers",
    brand: "SnapTech",
    description: "Comfortable and stylish brown joggers.",
    price: 50.00,
    image: "img/Tech Joggers.webp",
    inStock: true
  },
  {
    name: "Black Pants",
    brand: "SnapFit",
    description: "Classic black pants with modern fit.",
    price: 35.00,
    image: "img/kyle-loftus-d5GlpSOAzzg-unsplash.jpg",
    inStock: true
  },
  {
    name: "Shoes",
    brand: "FootFlex",
    description: "Durable and stylish shoes for all occasions.",
    price: 50.00,
    image: "img/joshua-diaz-48EIci5oOhk-unsplash.jpg",
    inStock: true
  },
  {
    name: "Sunglasses",
    brand: "SunRay",
    description: "Stylish sunglasses with full UV protection.",
    price: 45.00,
    image: "img/laura-chouette-NoqrVeKJCwE-unsplash.jpg",
    inStock: true
  }
];

module.exports = products;

async function seedProducts() {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log("✅ Sample products inserted!");
  process.exit();
}

seedProducts();
