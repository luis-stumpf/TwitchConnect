const mongoose = require("mongoose")


const postSchema = {
	title: String,
	content: String,
	writer: String,
	writerImg: String
  }
  
  const Post = mongoose.model("Post", postSchema);

  module.exports = Post