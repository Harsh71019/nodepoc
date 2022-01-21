const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    author: {
      type: String,
    },
    title: {
      type: String,
      required: [true, "Please enter your post title"],
    },
    description: {
      type: String,
      required: [true, "Please enter your post description"],
    },
    comments: [
      {
        post:{
          type: Schema.Types.ObjectId,
          ref: "post",
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        description: {
          type: String,
          required: true,
        },
        author: {
          type: String,
        },
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
