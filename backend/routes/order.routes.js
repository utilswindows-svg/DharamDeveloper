const router = require("express").Router();
const auth = require("../middleware/auth");
const { createOrder, getOrders } = require("../controllers/orderController");   

router.post("/orders", auth, createOrder);
router.get("/orders", auth, getOrders);
module.exports = router;