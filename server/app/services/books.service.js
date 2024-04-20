const { ObjectId } = require("mongodb");
const PublisherService = require("../services/publisher.service");

class BookService {
  constructor(client) {
    this.Book = client.db().collection("books");
    this.publisherService = new PublisherService(client); // Khởi tạo dịch vụ PublisherService
  }

  extractBookData(payload) {
    const book = {
      name: payload.name,
      price: payload.price,
      quantity: payload.quantity,
      publicationYear: payload.publicationYear,
      originOrAuthor: payload.originOrAuthor,
      imageUrl: payload.imageUrl,
      publisherName: payload.publisherName, // Không cần gán publisherId ở đây nữa
    };

    // Loại bỏ các trường không được định nghĩa (undefined hoặc null)
    Object.keys(book).forEach((key) => {
      if (book[key] === undefined || book[key] === null) {
        delete book[key];
      }
    });

    return book;
  }

  // handle create
  async create(payload) {
    const book = this.extractBookData(payload);

    // Tìm ID của nhà xuất bản dựa trên tên
    const publisher = await this.publisherService.findPublisher(
      payload.publisherName
    );
    if (!publisher) {
      throw new Error("Publisher not found");
    }

    // Gán ID của nhà xuất bản cho sách
    book.publisherId = publisher._id;

    // Loại bỏ các trường không được định nghĩa (undefined hoặc null)
    Object.keys(book).forEach((key) => {
      if (book[key] === undefined || book[key] === null) {
        delete book[key];
      }
    });

    // Tạo bộ lọc để kiểm tra sự tồn tại của cuốn sách bằng cả tên và _id
    const filter = {
      $or: [{ name: book.name }, { _id: new ObjectId(payload._id) }],
    };
    const update = {
      $set: book,
    };
    const options = {
      returnDocument: "after",
      upsert: true,
    };

    const result = await this.Book.findOneAndUpdate(filter, update, options);
    return result;
  }

  // handle find
  async find(filter) {
    const cursor = await this.Book.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.Book.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  // handle update
  async update(id, payload) {
    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const update = this.extractBookData(payload);
    const result = await this.Book.findOneAndUpdate(
      filter,
      { $set: update },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // handle delete
  async delete(id) {
    const result = await this.Book.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.Book.deleteMany({});
    return result.deletedCount;
  }
}

module.exports = BookService;
