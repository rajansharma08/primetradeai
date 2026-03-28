const express = require("express");
const { body, param } = require("express-validator");

const {
  getBooks,
  createBook,
  deleteBook,
  issueBook,
  returnBook
} = require("../controllers/bookController");
const { protect } = require("../middlewares/authMiddleware");
const { authorize } = require("../middlewares/roleMiddleware");
const validate = require("../middlewares/validateMiddleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/books:
 *   get:
 *     summary: Get all books
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of books
 */
router.get("/", protect, getBooks);

/**
 * @swagger
 * /api/v1/books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookInput'
 *     responses:
 *       201:
 *         description: Book created
 */
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("author").trim().notEmpty().withMessage("Author is required")
  ],
  validate,
  createBook
);

/**
 * @swagger
 * /api/v1/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted
 */
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  [param("id").isMongoId().withMessage("Valid book id is required")],
  validate,
  deleteBook
);

/**
 * @swagger
 * /api/v1/books/{id}/issue:
 *   post:
 *     summary: Issue a book to the logged-in user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book issued
 */
router.post(
  "/:id/issue",
  protect,
  [param("id").isMongoId().withMessage("Valid book id is required")],
  validate,
  issueBook
);

/**
 * @swagger
 * /api/v1/books/{id}/return:
 *   post:
 *     summary: Return a book issued by the logged-in user
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book returned
 */
router.post(
  "/:id/return",
  protect,
  [param("id").isMongoId().withMessage("Valid book id is required")],
  validate,
  returnBook
);

module.exports = router;
