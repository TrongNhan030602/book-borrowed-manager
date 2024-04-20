const bcrypt = require("bcrypt");
const AdminService = require("../services/admin.service");
const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util"); // Import MongoDB client

exports.login = async (req, res) => {
  const { name, password } = req.body;

  try {
    // Kiểm tra xem người dùng có tồn tại trong hệ thống hay không
    let admin;
    if (req.body.role === "admin") {
      const adminService = new AdminService(MongoDB.client);
      admin = await adminService.findAdmin(name);
    } else {
      const readerService = new ReaderService(MongoDB.client);
      admin = await readerService.findReader(name);
    }

    // Kiểm tra mật khẩu
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid adminname or password" });
    }

    // Lưu thông tin người dùng vào session, bao gồm cả vai trò

    req.session.admin = { id: admin._id, name: admin.name, role: admin.role };

    res.json({
      message: "Login successful",
      isLoggedIn: true,
      role: admin.role,
      userId: admin._id,
      name: admin.name,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logout = (req, res) => {
  // Xóa thông tin người dùng từ session để đăng xuất
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    } else {
      res.json({ message: "Logout successful", isLoggedIn: false });
    }
  });
};

exports.register = async (req, res) => {
  const { name, password, role } = req.body;

  try {
    // Kiểm tra xem tài khoản đã tồn tại hay chưa
    const adminService =
      role === "admin"
        ? new AdminService(MongoDB.client)
        : new ReaderService(MongoDB.client); // Chuyển MongoDB.client vào constructor
    const existingAdmin = await adminService.findByName(name);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Tạo mật khẩu băm
    const hashedPassword = await bcrypt.hash(password, 10);
    const document = await adminService.create(req.body);

    res.json(document);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred while registering admin" });
  }
};

// Trong phương thức checkAdmin
exports.checkAdmin = (req, res) => {
  try {
    // Kiểm tra xem người dùng đã đăng nhập hay chưa
    if (req.session.admin) {
      const { role } = req.session.admin;
      const isAdmin = role === "admin"; // Kiểm tra vai trò của người dùng
      // Trả về thông tin về người dùng, trạng thái đăng nhập và thông tin về vai trò
      res.json({
        isLoggedIn: true,
        user: req.session.admin,
        isAdmin: isAdmin,
      });
    } else {
      // Nếu người dùng chưa đăng nhập, trả về trạng thái đăng nhập là false và không có thông tin người dùng
      res.json({ isLoggedIn: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
