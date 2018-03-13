var express = require('express');
var router = express.Router();
var app = express();
var cors = require('cors');
app.use(cors());
app.use(express.static('public'));
var path = require('path');

require("dotenv").config();

app.use(express.static(path.join(__dirname, "client", "build")))

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/person');

var Schema = mongoose.Schema;
var personSchema = new Schema({
    firstname: String,
    lastname: String
});

var Person = mongoose.model('person', personSchema);

var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.options('*', cors());

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api/allmembers', function(req, res) {
    let query = Person.find({});
    query.exec(function(err, persons) {
        res.json(persons);
    });
});

app.get('/api/members/:page?', function(req, res) {
    let page = req.params.page;
    const limit = 10;

    if (typeof(page) === 'undefined' || isNaN(page))
        page = 0;
    else
        page = (page * limit) - limit;

    let query = Person.find({}).sort({ 'lastname': 1 }).skip(page).limit(limit);
    let results = Promise.all([query, Person.find({}).count()])
        .then((results) => {
            let returnedData = {};
            returnedData.persons = results[0];
            returnedData.maxRecordsReturned = limit;
            returnedData.totalRecords = results[1];
            res.json(returnedData);
        });
});

app.get('/api/members/find/:lastName', jsonParser, function(req, res) {
    let page = req.params.page;
    const limit = 10;

    if (typeof(page) === 'undefined' || isNaN(page))
        page = 0;
    else
        page = (page * limit) - limit;

    let query = Person.find({ lastname: new RegExp(req.params.lastName, "i")}).sort({ 'lastname': 1 }).skip(page).limit(limit);
    let results = Promise.all([query, Person.find({lastname: new RegExp(req.params.lastName, "i")}).count()])
        .then((results) => {
            let returnedData = {};
            returnedData.persons = results[0];
            returnedData.maxRecordsReturned = limit;
            returnedData.totalRecords = results[1];
            res.json(returnedData);
        });
});

app.get('/api/member/:id', jsonParser, function(req, res) {
    Person.findById(req.params.id, function(err, person) {
        if (err) console.log(err)

        res.json(person);
    });
});

app.delete('/api/member/:id', jsonParser, function(req, res) {
    Person.findByIdAndRemove(req.params.id, function(err) {
        if (err) console.log(err)
    });

    res.send(true);
});

app.post('/api/member/createOrUpdatePerson', jsonParser, function(req, res) {
    if (req.body.firstname === null || req.body.lastname === null)
    {
        res.send('First Name or Last Name not entered');
        return;
    }

    if (req.body.id === null || typeof req.body.id === 'undefined' || req.body.id === 0)
    {
        var createOrUpdatePerson = Person({
            firstname: req.body.firstname,
            lastname: req.body.lastname
        });

        createOrUpdatePerson.save(function(err) {
            res.send(createOrUpdatePerson._id);
        });
    } else {
        Person.findByIdAndUpdate(req.body.id, {
            $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname
            }
            }, { upsert: false },
            function (err, person) {
                res.send(req.body.id);
            }
        );
    }
});

app.use('/', function(req, res, next) {
    res.send('Loading...');
});

var port = process.env.PORT || 3030;

app.get("*", (req, res) => {  
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port);
