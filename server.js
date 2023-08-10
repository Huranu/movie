const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
var morgan = require("morgan");
var path = require("path");
var rfs = require("rotating-file-stream");
const connectDB = require("./config/db");
const colors = require("colors");
const errorHandler = require("./middleware/error");
const fileUpload = require("express-fileupload");
const cors = require("cors");
var cookieParser = require("cookie-parser");
const helmet = require("helmet");
var xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

const app = express();

dotenv.config({ path: "./config/config.env" });

const db = require("./config/db-mysql");

connectDB();

const categoriesRoutes = require("./routes/categories");
const booksRoutes = require("./routes/books");
const usersRoutes = require("./routes/users");
const commentsRoutes = require("./routes/comments");
const injectDb = require("./middleware/injectDb");

var whitelist = ["http://localhost:3000"];

var corsOptions = {
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("horigloj baina..."));
    }
  },
  allowedHeaders: "Authorization,Set-Cookie,Content-Type",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "15 minutand heterhii olon oroldlogo hiisen baina..",
});

// body parser
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(limiter);
app.use(cors(corsOptions));
app.use(fileUpload());
app.use(logger);
app.use(cookieParser());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(injectDb(db));
app.use(morgan("combined", { stream: accessLogStream }));

var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

app.use("/api/v1/categories", categoriesRoutes);
app.use("/api/v1/books", booksRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/comments", commentsRoutes);

app.use(errorHandler);

db.user.belongsToMany(db.book, {
  through: db.comment,
});
db.book.belongsToMany(db.user, {
  through: db.comment,
});

db.user.hasMany(db.comment);
db.comment.belongsTo(db.user);

db.book.hasMany(db.comment);
db.comment.belongsTo(db.book);
// db.category.belongsToMany(db.book);
// db.book.belongsTo(db.category);

db.sequelize
  .sync({ force: true })
  .then((result) => {
    console.log("fuck");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(
  process.env.PORT,
  console.log("Hellooo " + process.env.PORT)
);

process.on("unhandledRejection", (err, promise) => {
  console.log("error " + err.message);
  server.close(() => {
    process.exit(1);
  });
});
