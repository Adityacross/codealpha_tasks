const { protect } = require("../middleware/authMiddleware");

// Example: protect cart route
router.get("/cart", protect, getCart);
router.post("/orders", protect, placeOrder);
router.get("/profile", protect, getUserProfile);
