const Sequelize = require("sequelize");

var db = {};

const sequelize = new Sequelize("movie", "postgres", "0915", {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  define: {
    freezeTableName: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
  operatorAliases: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

const models = [
  require("../models/sequelize/category"),
  require("../models/sequelize/Genre"),
  require("../models/sequelize/movie"),
  require("../models/sequelize/customer"),
  require("../models/sequelize/movieActor"),
  require("../models/sequelize/movieAuthor"),
  require("../models/sequelize/movieDirector"),
  require("../models/sequelize/staff"),
];

models.forEach((model) => {
  const seqModel = model(sequelize, Sequelize);
  db[seqModel] = seqModel;
});

db.sequelize = sequelize;

module.exports = db;
