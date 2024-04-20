const { ObjectId } = require("mongodb");
const BookService = require("../services/books.service");
const ReaderService = require("../services/reader.service");

class BorrowService {
  constructor(client) {
    this.borrowings = client.db().collection("borrowings");
    this.bookService = new BookService(client);
    this.readerService = new ReaderService(client);
  }

  extractBorrowData(payload) {
    const borrowing = {
      readerId: new ObjectId(payload.readerId),
      readerName: payload.readerName,
      bookName: payload.bookName,
      bookUrl: payload.bookUrl,
      bookId: new ObjectId(payload.bookId),
      borrowDate: payload.borrowDate
        ? new Date(payload.borrowDate)
        : new Date(),
      returnDate: payload.returnDate
        ? new Date(payload.returnDate) // Có thể Thêm 'T00:00:00.000Z' để giữ nguyên giờ, phút và giây
        : new Date(),
      status: payload.status || "borrowed",
    };

    Object.keys(borrowing).forEach((key) => {
      if (borrowing[key] === undefined || borrowing[key] === null) {
        delete borrowing[key];
      }
    });

    return borrowing;
  }

  async create(payload) {
    const borrowing = this.extractBorrowData(payload);
    const book = await this.bookService.findById(borrowing.bookId);
    const reader = await this.readerService.findById(borrowing.readerId);

    if (!book || !reader || book.quantity === 0) {
      throw new Error("The book is not available for borrowing.");
    }

    // Kiểm tra xem người đọc đã mượn quyển sách này chưa
    const existingBorrowing = await this.borrowings.findOne({
      readerId: borrowing.readerId,
      bookId: borrowing.bookId,
      status: "borrowed", // Chỉ kiểm tra nếu sách vẫn đang được mượn
    });

    if (existingBorrowing) {
      throw new Error("The reader has already borrowed this book.");
    }

    // Kiểm tra ngày trả phải sau ngày mượn
    const borrowDate = new Date(borrowing.borrowDate);
    let returnDate = new Date(borrowDate);
    if (payload.returnDate) {
      // Nếu ngày trả được cung cấp, sử dụng ngày trả đó
      returnDate = new Date(payload.returnDate);
    } else {
      // Nếu không, tự động tính toán ngày trả sau 7 ngày mượn
      returnDate.setDate(returnDate.getDate() + 7);
    }
    borrowing.returnDate = returnDate;

    await this.bookService.update(borrowing.bookId, {
      quantity: book.quantity - 1,
    });

    const filter = {
      $or: [
        { readerId: borrowing.readerId, bookId: borrowing.bookId },
        { _id: new ObjectId(payload._id) },
      ],
    };
    const update = {
      $set: borrowing,
    };
    const options = {
      returnDocument: "after",
      upsert: true,
    };

    const result = await this.borrowings.findOneAndUpdate(
      filter,
      update,
      options
    );
    return result.value;
  }

  async find(filter) {
    const cursor = await this.borrowings.find(filter);
    return await cursor.toArray();
  }

  async findByName(name) {
    return await this.find({
      name: { $regex: new RegExp(name), $options: "i" },
    });
  }

  async findById(id) {
    return await this.borrowings.findOne({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
  }

  async update(id, payload) {
    const borrowing = await this.findById(id);
    if (!borrowing) {
      throw new Error("Borrowing not found.");
    }

    const updateData = this.extractBorrowData(payload);

    // Kiểm tra ngày trả phải sau ngày mượn
    const borrowDate = new Date(borrowing.borrowDate);
    let returnDate = new Date(borrowDate);
    if (updateData.returnDate) {
      // Nếu ngày trả được cung cấp, sử dụng ngày trả đó
      returnDate = new Date(updateData.returnDate);
    } else {
      // Nếu không, sử dụng ngày trả hiện tại của phiếu mượn
      returnDate = new Date(borrowing.returnDate);
    }
    if (returnDate < borrowDate) {
      console.error("Ngày trả phải sau ngày mượn!");
    }

    updateData.returnDate = returnDate;

    if (updateData.returnDate < new Date()) {
      updateData.status = "returned";
    }

    const filter = {
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    };
    const options = {
      returnDocument: "after", // Trả về tài liệu sau khi cập nhật
      returnOriginal: false, // Đảm bảo rằng tài liệu đã cập nhật được trả về
    };
    const result = await this.borrowings.findOneAndUpdate(
      filter,
      { $set: updateData },
      options
    );
    return result.value;
  }

  async delete(id) {
    const result = await this.borrowings.findOneAndDelete({
      _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result.value;
  }

  async deleteAll() {
    const result = await this.borrowings.deleteMany({});
    return result.deletedCount;
  }

  async returnBook(id) {
    const borrowing = await this.findById(id);

    if (!borrowing) {
      throw new Error("The borrowing does not exist");
    }

    borrowing.returnDate = new Date();
    borrowing.status = "returned";

    const book = await this.bookService.findById(borrowing.bookId);
    if (book) {
      await this.bookService.update(borrowing.bookId, {
        quantity: book.quantity + 1,
      });
    } else {
      throw new Error("The borrowed book does not exist.");
    }

    // Không cập nhật readerId ở đây

    await this.update(id, {
      status: "returned",
      returnDate: borrowing.returnDate, // Cập nhật ngày trả là ngày hôm nay
    });

    return borrowing;
  }

  async getBorrowedBooksByReaderId(readerId) {
    try {
      const filter = { readerId: new ObjectId(readerId), status: "borrowed" };
      const borrowings = await this.borrowings.find(filter).toArray();

      const borrowedBooks = [];
      for (const borrowing of borrowings) {
        const book = await this.bookService.findById(borrowing.bookId);
        if (book) {
          borrowedBooks.push(book);
        }
      }

      return borrowedBooks;
    } catch (error) {
      throw new Error(
        `Error getting borrowed books for reader ${readerId}: ${error.message}`
      );
    }
  }
  // Lấy tất cả phiếu mượn của reader có id
  async getAllBorrowingsByReaderId(readerId) {
    try {
      const filter = { readerId: new ObjectId(readerId) };
      const borrowings = await this.borrowings.find(filter).toArray();
      return borrowings;
    } catch (error) {
      throw new Error(
        `Error getting borrowings for reader ${readerId}: ${error.message}`
      );
    }
  }
}

module.exports = BorrowService;
