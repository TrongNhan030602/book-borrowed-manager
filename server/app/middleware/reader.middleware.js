// readerMiddleware.js

const readerMiddleware = (req, res, next) => {
  // Kiểm tra xem người dùng có vai trò là admin không
  if (req.session.admin && req.session.admin.role === "admin") {
    // Nếu là admin, cho phép đi tiếp
    next();
  } else if (
    req.session.admin &&
    req.session.admin.role === "reader" &&
    (req.method === "POST" || req.method === "GET")
  ) {
    // Nếu là độc giả và phương thức là POST (mượn sách), cho phép đi tiếp
    next();
  } else {
    // Nếu không phải là admin hoặc độc giả muốn truy cập vào route không được phép,
    // trả về lỗi 401
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = readerMiddleware;
