const BorrowService = require("../services/borrow.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save new Borrowing
exports.create = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.create(req.body);
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while creating borrowing")
    );
  }
};

// Return a borrowed book
exports.returnBook = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.returnBook(req.params.id);
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while returning the book")
    );
  }
};

// Retrieve all Borrowings from database
exports.findAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const { readerId, bookId } = req.query;
    let documents;

    if (readerId && bookId) {
      // Find all borrowings by readerId and bookId
      documents = await borrowService.find({ readerId, bookId });
    } else if (readerId) {
      // Find all borrowings by readerId
      documents = await borrowService.find({ readerId });
    } else if (bookId) {
      // Find all borrowings by bookId
      documents = await borrowService.find({ bookId });
    } else {
      // Find all borrowings
      documents = await borrowService.find({});
    }

    return res.send(documents);
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while retrieving borrowings")
    );
  }
};

// Find a single Borrowing with an id
exports.findOne = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Borrowing not found!"));
    }
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(
        500,
        `An error retrieving borrowing with id=${req.params.id}`
      )
    );
  }
};

// Update a Borrowing by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.update(req.params.id, req.body);
    if (document === null) {
      return next(new ApiError(404, "Borrowing not found"));
    }
    return res.send({ message: "Borrowing was updated successfully" });
  } catch (err) {
    // return next(
    //   new ApiError(500, `An error updating borrowing with id=${req.params.id}`)
    // );
    console.error(err);
  }
};

// Delete a Borrowing with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const document = await borrowService.delete(req.params.id);
    if (document === null) {
      return next(new ApiError(404, "Borrowing not found"));
    }
    return res.send({ message: "Borrowing was deleted successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `Could not delete Borrowing with id=${req.params.id}`)
    );
  }
};

// Delete all Borrowings from the database
exports.deleteAll = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const deleteCount = await borrowService.deleteAll();
    return res.send({
      message: `${deleteCount} borrowings were deleted successfully!`,
    });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all borrowings")
    );
  }
};
// Lấy sách đã mượn Raeder
exports.getBorrowedBooksByReaderId = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const readerId = req.params.readerId; // Lấy id của người đọc từ request params
    const borrowedBooks = await borrowService.getBorrowedBooksByReaderId(
      readerId
    );
    return res.send(borrowedBooks);
  } catch (err) {
    return next(
      new ApiError(
        500,
        "An error occurred while retrieving borrowed books by reader"
      )
    );
  }
};

// Lấy tất cả phiếu mượn của một reader
exports.getAllBorrowingsByReaderId = async (req, res, next) => {
  try {
    const borrowService = new BorrowService(MongoDB.client);
    const readerId = req.params.readerId; // Get the reader id from request params
    const borrowings = await borrowService.getAllBorrowingsByReaderId(readerId);
    return res.send(borrowings);
  } catch (err) {
    return next(
      new ApiError(
        500,
        "An error occurred while retrieving all borrowings of the reader"
      )
    );
  }
};
