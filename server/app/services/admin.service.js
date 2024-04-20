const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const config = require("../config");

class AdminService {
  constructor(client) {
    this.Admin = client.db().collection("admin");
  }
  extractAdminData(payload) {
    const admin = {
      name: payload.name,
      password: payload.password,
      position: payload.position,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      role: "admin",
    };

    // Loại bỏ các trường không được định nghĩa (undefined hoặc null)
    Object.keys(admin).forEach((key) => {
      if (admin[key] === undefined || admin[key] === null) {
        delete admin[key];
      }
    });

    return admin;
  }

  // handle create
  async create(payload) {
    const admin = this.extractAdminData(payload);
    admin.password = await bcrypt.hash(admin.password, 10);
    // Tạo bộ lọc để kiểm tra sự tồn tại của admin bằng cả tên và _id
    const filter = {
      $or: [{ name: admin.name }, { _id: new ObjectId(payload._id) }],
    };
    const update = {
      $set: admin,
    };
    const options = {
      returnDocument: "after",
      upsert: true,
    };

    const result = await this.Admin.findOneAndUpdate(filter, update, options);
    return result;
  }

  // handle find
  async find(filter) {
    const cursor = await this.Admin.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }
  async findAdmin(name) {
    try {
      const admin = await this.Admin.findOne({
        name: { $regex: new RegExp(name), $options: "i" },
      });
      return admin;
    } catch (error) {
      throw new Error(`Error finding admin by name: ${error.message}`);
    }
  }

  async findById(id) {
    return await this.Admin.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // handle update
  async update(id, payload) {
    // Trích xuất dữ liệu quản trị viên từ payload
    const updateData = this.extractAdminData(payload);

    if (payload.password) {
      updateData.password = await bcrypt.hash(payload.password, 10);
    }

    // Tạo bộ lọc để tìm quản trị viên cần cập nhật
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    // Tạo câu lệnh cập nhật
    const updateCommand = {
      $set: updateData,
    };

    // Thực hiện cập nhật trong cơ sở dữ liệu
    const result = await this.Admin.findOneAndUpdate(filter, updateCommand, {
      returnDocument: "after",
    });

    // Trả về giá trị sau khi cập nhật
    return result.value;
  }

  // handle delete
  async delete(id) {
    const result = await this.Admin.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Admin.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = AdminService;
