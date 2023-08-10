const Book = require("../models/Book");
const path = require("path");
const Category = require("../models/Category");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");
const asyncHandler = require("express-async-handler");

exports.getBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getUserBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, Book);

  req.query.createdUser = req.params.id;

  const books = await Book.find(req.query, select)
    .populate({
      path: "category",
      select: "name",
    })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getCategoryBooks = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const sort = req.query.sort;
  const select = req.query.select;

  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);

  // Pagination
  const pagination = await paginate(page, limit, Book);

  const books = await Book.find(
    { ...req.query, category: req.params.categoryId },
    select
  )
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
    pagination,
  });
});

exports.getBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError("Iim id-tai nom baihgui baina", 400);
  }

  // const avg = await Book.computeAvgPrice(book.category);

  res.status(200).json({
    success: true,
    data: book,
    // dundaj: avg,
  });
});

exports.createBook = asyncHandler(async (req, res, next) => {
  //   const category = await Category.findById(req.body.category);

  //   if (!category) {
  //     throw new MyError("Iim id-tai category baihgui", 400);
  //   }

  req.body.createdUser = req.userId;

  const book = await Book.create(req.body);

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.deleteBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError("Iim id-tai nom baihgui baina", 400);
  }

  if (book.createdUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Ta zuvhun uuriin nomiig zavsarlah erhtei..", 403);
  }

  book.remove();

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.updateBook = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError("Iim id-tai nom baihgui baina", 400);
  }

  if (book.createdUser.toString() !== req.userId && req.userRole !== "admin") {
    throw new MyError("Ta zuvhun uuriin nomiig zavsarlah erhtei..", 403);
  }

  req.body.updatedUser = req.userId;

  for (let attr in req.body) {
    book[attr] = req.body[attr];
  }

  book.save();

  // book = await Book.findByIdAndUpdate(req.params.id, req.body, {
  //   new: true,
  //   runValidators: true,
  // });

  res.status(200).json({
    success: true,
    data: book,
  });
});

exports.uploadBookPhoto = asyncHandler(async (req, res, next) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    throw new MyError("Iim id-tai nom baihgui baina", 400);
  }

  const file = req.files.file;

  if (!file.mimetype.startsWith("image")) {
    throw new MyError("Ta zurag hiine uu", 400);
  }

  if (file.size > process.env.MAX_UPLOAD_SIZE) {
    throw new MyError("Tanii zuragnii hemjee hetersen baina", 400);
  }

  file.name = "photo_" + req.params.id + path.parse(file.name).ext;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => {
    if (err) {
      throw new MyError("File huulah yvtsad aldaa garsan" + err.message, 400);
    }
  });

  book.imageLink = file.name;
  book.save();

  res.status(200).json({
    success: true,
    data: file.name,
  });

  // res.end();
  // console.log(file.name);

  // res.status(200).json({
  //   success: true,
  //   data: book,
  // });
});
