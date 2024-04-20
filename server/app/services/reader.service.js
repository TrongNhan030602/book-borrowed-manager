const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
class ReaderService {
  constructor(client) {
    this.Reader = client.db().collection("readers");
  }

  async extractReaderData(payload) {
    const reader = {
      name: payload.name,
      birthDate: payload.birthDate
        ? new Date(payload.birthDate + "T00:00:00.000Z")
        : new Date(),
      gender: payload.gender,
      address: payload.address,
      phoneNumber: payload.phoneNumber,
      password: payload.password,
      role: "reader",
    };
    // Băm mật khẩu nếu có trong payload
    if (payload.password) {
      reader.password = await bcrypt.hash(payload.password, 10);
    }

    // Loại bỏ các trường không được định nghĩa (undefined hoặc null)
    Object.keys(reader).forEach((key) => {
      if (reader[key] === undefined || reader[key] === null) {
        delete reader[key];
      }
    });

    return reader;
  }

  // handle create
  async create(payload) {
    const reader = this.extractReaderData(payload);
    reader.password = await bcrypt.hash(reader.password, 10);
    // Tạo bộ lọc để kiểm tra sự tồn tại của reader bằng cả tên và _id
    const filter = {
      $or: [
        { name: reader.name },
        {
          _id: ObjectId.isValid(payload._id) ? new ObjectId(payload._id) : null,
        },
      ],
    };

    const update = {
      $set: reader,
    };
    const options = {
      returnDocument: "after",
      upsert: true,
    };

    const result = await this.Reader.findOneAndUpdate(filter, update, options);
    return result;
  }

  // handle find
  async find(filter) {
    const cursor = await this.Reader.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }
  async findReader(name) {
    try {
      const reader = await this.Reader.findOne({
        name: { $regex: new RegExp(name), $options: "i" },
      });
      return reader;
    } catch (error) {
      throw new Error(`Error finding reader by name: ${error.message}`);
    }
  }
  async findById(id) {
    return await this.Reader.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // handle update
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };

    // Kiểm tra nếu có ngày sinh trong payload và ngày sinh đó hợp lệ
    if (payload.birthDate) {
      const birthDate = new Date(payload.birthDate + "T00:00:00.000Z");
      if (isNaN(birthDate.getTime())) {
        throw new Error("Ngày sinh không hợp lệ.");
      }
    }

    const update = await this.extractReaderData(payload);
    // Thực hiện cập nhật trong cơ sở dữ liệu
    const result = await this.Reader.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // handle delete
  async delete(id) {
    const result = await this.Reader.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Reader.deleteMany({});
    return result.deletedCount;
  }

  //Get ID by name
  async getIdByName(name) {
    try {
      // Tìm kiếm độc giả dựa trên tên
      const reader = await this.Reader.findOne({
        name: { $regex: new RegExp(name), $options: "i" },
      });

      if (!reader) {
        throw new Error(`Không tìm thấy độc giả với tên: ${name}`);
      }

      // Trả về ID của độc giả
      return reader._id.toString();
    } catch (error) {
      console.error(`Lỗi khi lấy ID của độc giả từ tên: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ReaderService;
