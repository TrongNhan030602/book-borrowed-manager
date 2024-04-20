const express = require("express");
const borrows = require("../controllers/borrow.controller");

const router = express.Router();

// Các route xử lý việc mượn sách
router
  .route("/")
  .get(borrows.findAll) // Lấy tất cả các phiếu mượn
  .post(borrows.create) // Tạo một phiếu mượn mới (mượn sách)
  .delete(borrows.deleteAll); // Xóa tất cả các phiếu mượn

// RUD
router
  .route("/:id")
  .get(borrows.findOne) // Lấy thông tin của một phiếu mượn cụ thể bằng ID
  .put(borrows.update) // Cập nhật thông tin của một phiếu mượn bằng ID
  .delete(borrows.delete); // Xóa một phiếu mượn bằng ID

// Route để trả lại một cuốn sách đã mượn
router.post("/:id/return", borrows.returnBook);

// Route liệt tất cả sách đã mượn reader
router.get("/reader/:readerId", borrows.getBorrowedBooksByReaderId);
// Route liệt tất phiếu mượn reader

router.get("/borrowings/:readerId", borrows.getAllBorrowingsByReaderId);

module.exports = router;
