const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:2717/fruitsDB", {useNewUrlParser: true}, { useUnifiedTopology: true })

const fruitSchema = new mongoose.Schema ({
	name: String,
	rating: Number,
	review: String
})

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit ({
	name: "Apple",
	rating: 7,
	review: "solid"
})

fruit.save()



app.set("view engine", "ejs")

app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("pages/home")
})

app.get("/posts", (req, res) => {
	res.render("pages/posts")
})

app.listen(3001, () => {
	console.log("Server started on port 3001")
})