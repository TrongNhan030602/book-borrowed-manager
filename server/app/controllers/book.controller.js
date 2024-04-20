const BookService = require("../services/books.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Create and Save new Book
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name can not empty"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.create(req.body);
    return res.send(document);
  } catch (err) {
    // return next(new ApiError(500, "An error occurred while creating book"));
    console.log(err);
  }
};

// Retrieve (truy suất) all Books of a user from database
exports.findAll = async (req, res, next) => {
  let documents = [];

  try {
    const bookService = new BookService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await bookService.findByName(name);
    } else {
      documents = await bookService.find({});
    }
  } catch (err) {
    return next(new ApiError(500, "An error occurred while retrieving Books"));
  }

  return res.send(documents);
};

// Find a single Book with an id
exports.findOne = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.findById(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Book not found!"));
    }
    return res.send(document);
  } catch (err) {
    return next(
      new ApiError(500, `An error retrieving Book with id=${req.params.id}`)
    );
  }
};

// Update a Book by the id in the request
exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.update(req.params.id, req.body);
    if (document === null) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was updated successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `An error updating book with id=${req.params.id}`)
    );
  }
};

// Delete a Book with the specified id in the request
exports.delete = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const document = await bookService.delete(req.params.id);
    if (document === null) {
      return next(new ApiError(404, "Book not found"));
    }
    return res.send({ message: "Book was deleted successfully" });
  } catch (err) {
    return next(
      new ApiError(500, `Could not delete Book with id=${req.params.id}`)
    );
  }
};
exports.deleteAll = async (req, res, next) => {
  try {
    const bookService = new BookService(MongoDB.client);
    const deleteCount = await bookService.deleteAll();
    return res.send({
      message: `${deleteCount} books were deleted successfully!`,
    });
  } catch (err) {
    return next(
      new ApiError(500, "An error occurred while removing all books")
    );
  }
};
