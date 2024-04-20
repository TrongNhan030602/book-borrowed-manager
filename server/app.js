const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const ApiError = require("./app/api-error");

// Authorization
const authMiddleware = require("./app/middleware/auth.middleware");
const readerMiddleware = require("./app/middleware/reader.middleware");

// Router
const authRouter = require("./app/routes/auth.routes");
const booksRouter = require("./app/routes/book.routes");
const publishersRouter = require("./app/routes/publisher.routes");
const borrowsRouter = require("./app/routes/borrow.routes");
const adminRouter = require("./app/routes/admin.routes");
const readersRouter = require("./app/routes/reader.routes");

// Use --> create static routes
app.use(cors());
app.use(express.json());

// Sử dụng session middleware
app.use(
  session({
    secret: "030602",
    resave: false,
    saveUninitialized: false,
  })
);

// Use routes

app.use("/auth", authRouter);
app.use("/books", readerMiddleware, booksRouter);
app.use("/publishers", authMiddleware, publishersRouter);
app.use("/borrows", readerMiddleware, borrowsRouter);
app.use("/admin", authMiddleware, adminRouter);
app.use("/readers", readerMiddleware, readersRouter);

// Home page
app.get("/", (req, res) => {
  res.send("Welcome to the bookShop");
});

// handle 404 response
app.use((req, res, next) => {
  return next(new ApiError(404, "Resource not found"));
});

// middleware  error handlers
app.use((error, req, res, next) => {
  return res.status(error.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
