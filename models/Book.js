const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Nomiin neriig oruulna uu"],
      unique: true,
      trim: true,
      maxlength: [250, "Too long must be 250"],
    },
    imageLink: {
      type: String,
      default: "no-photo.jpg",
    },
    author_name: {
      type: String,
      required: [true, "Zohiolchiin neriig oruulna uu"],
      trim: true,
      maxlength: [50, "Too long must be 50"],
    },
    averageRating: {
      type: Number,
      min: [1, "Min is 1"],
      max: [10, "Max is 10"],
    },
    price: {
      type: Number,
      min: [500, "Min is 500"],
    },
    pages: {
      type: Number,
      min: [1, "Min is 1"],
    },
    year: Number,
    language: {
      type: String,
    },

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
    },
    createdUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    updatedUser: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

BookSchema.statics.computeAvgPrice = async function (catId) {
  const obj = await this.aggregate([
    { $match: { category: catId } },
    { $group: { _id: "$category", avgPrice: { $avg: "$price" } } },
  ]);

  console.log(obj);
  let avgPrice = null;
  if (obj.length > 0) avgPrice = obj[0].avgPrice;

  await this.model("Category").findByIdAndUpdate(catId, {
    averagePrice: avgPrice,
  });

  return obj;
};

BookSchema.post("save", function () {
  this.constructor.computeAvgPrice(this.category);
});

BookSchema.pre("remove", function () {
  this.constructor.computeAvgPrice(this.category);
});

BookSchema.virtual("zohiogch").get(function () {
  if (!this.author_name) return "";
  let tokens = this.author_name.split(" ");
  if (tokens.length === 1) tokens = this.author_name.split(".");
  if (tokens.length === 2) return tokens[1];
});

BookSchema.pre("save", function (next) {
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  this.price = Math.floor(Math.random() * 100000) + 1000;
  next();
});

module.exports = mongoose.model("Book", BookSchema);
