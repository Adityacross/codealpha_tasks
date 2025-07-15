// const express = require('express');
// const router = express.Router();
// const Product = require('../models/Product');

// // GET /api/products → Get all products
// router.get('/', async (req, res) => {
//   try {
//     const products = await Product.find({});
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // routes/productRoutes.js
// router.get('/:id', getProductById);

// // controller function
// const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: 'Product not found' });
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// module.exports = router;
