const { ObjectId } = require("mongodb");
class PublisherService {
  constructor(client) {
    this.Publisher = client.db().collection("publishers");
  }
  extractPublisherData(payload) {
    const publisher = {
      name: payload.name,
      address: payload.address,
    };

    // Loại bỏ các trường không được định nghĩa (undefined hoặc null)
    Object.keys(publisher).forEach((key) => {
      if (publisher[key] === undefined || publisher[key] === null) {
        delete publisher[key];
      }
    });

    return publisher;
  }

  // handle create
  async create(payload) {
    const publisher = this.extractPublisherData(payload);
    // Tạo bộ lọc để kiểm tra sự tồn tại của NXB bằng cả tên và _id
    const filter = {
      $or: [{ name: publisher.name }, { _id: new ObjectId(payload._id) }],
    };
    const update = {
      $set: publisher,
    };
    const options = {
      returnDocument: "after",
      upsert: true,
    };

    const result = await this.Publisher.findOneAndUpdate(
      filter,
      update,
      options
    );
    return result;
  }

  // handle find
  async find(filter) {
    const cursor = await this.Publisher.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }
  async findPublisher(name) {
    try {
      const publisher = await this.Publisher.findOne({
        name: { $regex: new RegExp(name), $options: "i" },
      });
      return publisher;
    } catch (error) {
      throw new Error(`Error finding publisher by name: ${error.message}`);
    }
  }
  async findById(id) {
    return await this.Publisher.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // handle update
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractPublisherData(payload);
    const result = await this.Publisher.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // handle delete
  async delete(id) {
    const result = await this.Publisher.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Publisher.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = PublisherService;
