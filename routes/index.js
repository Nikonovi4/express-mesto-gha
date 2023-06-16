const router = require("express").Router();
const userRoutes = require("./users");
const cardRouter = require("./cards");

router.get("/", (req, res) => {
  res.send("Hello word3");
});

router.use("/users", userRoutes);
router.use("/cards", cardRouter);

module.exports = router;
