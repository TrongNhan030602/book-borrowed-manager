const authMiddleware = (req, res, next) => {
  // Kiểm tra xem người dùng đã đăng nhập chưa bằng cách kiểm tra sự tồn tại của thông tin người dùng trong session
  if (req.session.admin && req.session.admin.role === "admin") {
    // Nếu là admin, cho phép đi tiếp
    return next();
  }

  // Nếu không phải admin hoặc chưa đăng nhập, trả về lỗi 401
  return res.status(401).json({ message: "Unauthorized" });
};

module.exports = authMiddleware;
