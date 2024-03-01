const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/comp") // database
  .then(() => {
    //success then() will execcute
    console.log("connected to mongodb");
  })
  .catch((err) => {
    //if error catch() funct on will execute
    console.log(err);
  });

  const empSchema = new mongoose.Schema({
  //structure
  //structure
  name: String,
  id: String,
  department : String,
});

const empModel = mongoose.model("emp", empSchema);
app.use(express.json()); // Middleware para permitir
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

let employees = [
    { id: 1, name: 'John Doe', age: 30, department: 'IT' },
    { id: 2, name: 'Jane Smith', age: 35, department: 'HR' },
    { id: 3, name: 'Alice Johnson', age: 28, department: 'Marketing' }
];

// Home route
app.get('/', (req, res) => {
    res.render('index', { employees });
});

// Add Employee route - GET
app.get('/add', (req, res) => {
    res.render('addEmployee');
});

// Add Employee route - POST
app.post('/add', (req, res) => {
    const { name, age, department } = req.body;
    const id = employees.length + 1;
    employees.push({ id, name, age, department });
    res.redirect('/');
});

// Edit Employee route - GET
app.get('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const employee = employees.find(emp => emp.id === id);
    res.render('editEmployee', { employee });
});

// Edit Employee route - POST
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { name, age, department } = req.body;
    const index = employees.findIndex(emp => emp.id === id);
    employees[index] = { id, name, age, department };
    res.redirect('/');
});

// Delete Employee route
app.get('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    employees = employees.filter(emp => emp.id !== id);
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
