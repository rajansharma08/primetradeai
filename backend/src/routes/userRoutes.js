const express = require("express");
const { body, param } = require("express-validator");

const {
  getUsers,
  getDashboardSummary,
  createAdmin,
  deleteUser
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

router.get("/summary", protect, authorize("admin"), getDashboardSummary);

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/", protect, authorize("admin"), getUsers);

router.post(
  "/admins",
  protect,
  authorize("admin"),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long")
  ],
  validate,
  createAdmin
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Valid user id is required")],
  validate,
  deleteUser
);

module.exports = router;
