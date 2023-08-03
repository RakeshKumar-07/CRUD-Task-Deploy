const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const app = express();

const mongoUrl = "mongodb+srv://Rakesh:Rakesh07@cluster0.ovtwerk.mongodb.net/crud?retryWrites=true&w=majority";
mongoose.connect(mongoUrl).
  catch(error => console.log(error));

//MIDDLEWARE
app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
  });

//MODELS
const {Task} = require('./schema');


//"GET" ROUTES:- 

app.get("/", (req, res, next) => {
    Task.find().then((err,tasks) => {
        if(err) res.send(err);
        else res.send(tasks);
    });
});


//"POST" ROUTES:-

app.post("/new-task", async (req, res, next) => {
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    })

    const doc = await task.save();

    if(doc == task){
        res.send(doc);
    }

})

app.put("/:_id", async (req, res, next) => {

    const _id = req.params._id;

    const task = new Task({
        _id: _id,
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
    })

    await Task.updateOne({_id}, task).then((err, task) => {
        if(err) res.send(err);
        else res.send(task);
    });

})

app.delete("/:_id", async (req, res, next) => {
    
    const _id = req.params._id;

    await Task.deleteOne({_id});

    res.send("Deleted!!")

})

//PORT
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Starting Server on port ${port}`);
});