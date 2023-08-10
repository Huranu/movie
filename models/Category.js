const mongoose = require("mongoose");
const { transliterate, slugify } = require("transliteration");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Neriig oruulna uu"],
      unique: true,
      trim: true,
      maxlength: [50, "Too long must be 50"],
    },
    slug: String,
    description: {
      type: String,
      required: [true, "Tailbar oruulna uu"],
      maxlength: [500, "Too long must be 500"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    averageRating: {
      type: Number,
      min: [1, "Min is 1"],
      max: [10, "Max is 10"],
    },
    averagePrice: Number,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CategorySchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "category",
  justOne: false,
});

CategorySchema.pre("remove", async function (next) {
  await this.model("Book").deleteMany([{ category: this._id }]);
  next();
});

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  this.averageRating = Math.floor(Math.random() * 10) + 1;
  // this.averagePrice = Math.floor(Math.random() * 100000) + 3000;
  next();
});

module.exports = mongoose.model("Category", CategorySchema);
