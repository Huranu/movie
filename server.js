const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const { DataTypes } = require("sequelize");

const logger = require("./middleware/logger");
const errorHandler = require("./middleware/error");
const injectDb = require("./middleware/injectDB");

const app = express();

dotenv.config({ path: "./config/config.env" });

const db = require("./config/databasepg");

const MoviesRoutes = require("./routes/movies");
const CategoriesRoutes = require("./routes/categories");
const GenresRoutes = require("./routes/genres");
const CustomersRoutes = require("./routes/customers");
const LoginRoutes = require("./routes/login");
const RegisterRoutes = require("./routes/register");
const StaffRoutes = require("./routes/staffs");
const MovieStaffRoutes = require("./routes/movieStaff");

// body parser
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use(logger);
app.use(cookieParser());
app.use(injectDb(db.sequelize.models));
app.use(morgan("combined", { stream: accessLogStream }));

app.use("/api/v1/categories", CategoriesRoutes);
app.use("/api/v1/movies", MoviesRoutes);
app.use("/api/v1/genres", GenresRoutes);
app.use("/api/v1/customers", CustomersRoutes);
app.use("/api/v1/login", LoginRoutes);
app.use("/api/v1/register", RegisterRoutes);
app.use("/api/v1/staffs", StaffRoutes);
app.use("/api/v1/movieStaffs", MovieStaffRoutes);

var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: path.join(__dirname, "log"),
});

app.use(errorHandler);
console.log(db.sequelize.models.category);

db.sequelize.models.category.hasMany(db.sequelize.models.genre, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
db.sequelize.models.genre.belongsTo(db.sequelize.models.category);

db.sequelize.models.genre.hasMany(db.sequelize.models.movie, {
  foreignKey: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});
db.sequelize.models.movie.belongsTo(db.sequelize.models.genre);

db.sequelize.models.movie.hasMany(db.sequelize.models.movieDirector);
db.sequelize.models.movieDirector.belongsTo(db.sequelize.models.movie);

db.sequelize.models.staff.hasMany(db.sequelize.models.movieDirector);
db.sequelize.models.movieDirector.belongsTo(db.sequelize.models.staff);

db.sequelize.models.movie.hasMany(db.sequelize.models.movieActor);
db.sequelize.models.movieActor.belongsTo(db.sequelize.models.movie);

db.sequelize.models.staff.hasMany(db.sequelize.models.movieActor);
db.sequelize.models.movieActor.belongsTo(db.sequelize.models.staff);

db.sequelize.models.movie.hasMany(db.sequelize.models.movieAuthor);
db.sequelize.models.movieAuthor.belongsTo(db.sequelize.models.movie);

db.sequelize.models.staff.hasMany(db.sequelize.models.movieAuthor);
db.sequelize.models.movieAuthor.belongsTo(db.sequelize.models.staff);

db.sequelize
  .sync({})
  .then((result) => {
    console.log("fuck");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT);

process.on("unhandledRejection", (err, promise) => {
  console.log("error " + err.message);
  server.close(() => {
    process.exit(1);
  });
});
