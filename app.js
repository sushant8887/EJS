
const express = require("express");
const mongoose = require("mongoose");

const app = express(); //server

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/comp")
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch((err) => {
    console.log(err);
  });

const empSchema = new mongoose.Schema({
  name: String,
  id: String,
  salary: Number,
});

const empModel = mongoose.model("emp", empSchema); //collection

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs"); // Set EJS as the view engine

// Routes
app.get("/", async (req, res) => {
  try {
    const employees = await empModel.find(); // Fetch all employees from MongoDB
    res.render("index", { employee: employees }); // Pass employees to the template
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/addEmp", (req, res) => {
  res.render("add");
});

app.get("/editEmp/:id", async (req, res) => {
  const id = req.params.id;
  const employee = await empModel.findOne({ id: id });
  res.render("edit", { employee });
});

// CRUD operations

// Add new employee
app.post("/addEmp", async (req, res) => {
  const empData = req.body;
  const data = new empModel(empData);
  await data.save();
  res.redirect("/"); // Redirect to home page after adding
});

// Update employee
app.get("/editEmp/:id", async (req, res) => {
  const id = req.params.id;
  const { name, salary } = req.body;
  await empModel.updateOne({ id: id }, { $set: { name: name, salary: salary } });
  res.redirect("/");
});

// Delete employee
app.delete("/delEmp/:id", async (req, res) => {
  const id = req.params.id;
  await empModel.deleteOne({ id: id });
  res.redirect("/");
});

// Display all employees
app.get("/showEmps", async (req, res) => {
  const showData = await empModel.find();
  res.render("index", { employee: showData });
});

// Display specific employee
app.get("/findEmp/:id", async (req, res) => {
  const id = req.params.id;
  const data = await empModel.findOne({ id: id });
  res.render("show", { employee: data });
});

app.listen(3000, () => {
  console.log("listening on port 3000.....");
});