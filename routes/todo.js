var express = require('express'),
router = express.Router(),
mongoose = require('mongoose'), //mongo connection
Todo = mongoose.model('Todo')

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {
        console.log(req.body.title);

        // create a todo, information comes from AJAX request from Nej
        Todo.create({
            title: req.body.title,
            completed: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            getTodos(res);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });
    // update a todo
    app.put('/api/todos/:todo_id', function (req, res) {
        var title = req.body.title;
        var completed = req.body.completed;
        var updated_at = req.body.updated_at;

        Todo.findById(req.params.todo_id, function (err, todo) {
            todo.title = req.body.title;
            todo.completed = req.body.completed;
            // todo.updated_at = req.body.updated_at;
            console.log(todo);
            todo.save(function (err, todoID) {
                if (err)
                    res.send(err);

                getTodos(res);
            })
        });

    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the front-end index view
    });
};