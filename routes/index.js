const router = require("express").Router();
const userRoutes = require("./users");
const cardRouter = require("./cards");
const authRouter = require("./auth");
const auth = require("../middlewares/auth");



router.use("/", authRouter);
// router.use(auth);
router.use("/users", userRoutes);
router.use("/cards", cardRouter);
router.use("*", (req, res) => {
  res.status(404).send({
    message: "Данная страница не существует",
  });
});

module.exports = router;
