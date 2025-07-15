const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// POST /api/cart — Add to cart
router.post('/', async (req, res) => {
  const { userId, productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [{ productId, quantity }] });
  } else {
    const itemIndex = cart.items.findIndex(i => i.productId == productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
  }

  await cart.save();
  res.json(cart);
});

// GET /api/cart/:userId — Get cart by user
router.get('/:userId', async (req, res) => {
  const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
  res.json(cart);
});

// DELETE /api/cart/:userId/:productId — Remove a product
router.delete('/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const cart = await Cart.findOne({ userId });
  if (!cart) return res.status(404).send("Cart not found");

  cart.items = cart.items.filter(i => i.productId != productId);
  await cart.save();

  res.json(cart);
});

module.exports = router;
