var Todo = require('./models/todo');
var User = require('./models/user');
var jwt = require('jwt-simple');
var moment = require('moment');
var fs = require('fs');
var multer = require('multer');
var path = require('path');



module.exports = function(app) {

    app.get('/api/todos', ensureAuthenticated, function(request, response) {
        User.findById(request.user, function(err, user) {
            var userId = user._id;
            Todo.find({ 'author' : userId }, function (error, todos) {
                if (error) {
                    response.send(error);
                }
                response.json(todos);
            });
        });

    });

    app.get('/api/getId', ensureAuthenticated, function(request, response) {
        User.findById(request.user, function(err, user) {
            response.send(user._id);
        });
    });


    app.delete('/api/todos/:todo_id', ensureAuthenticated, function(request, response) {
        User.findById(request.user, function(err, user) {
            var userId = user._id;
            Todo.remove({

                _id: request.params.todo_id

            }, function (error, todo) {

                if (error) {
                    response.send(error);
                }

                Todo.find({ "author" : userId },function(error, todos) {
                    if (error) {
                        response.send(error);
                    }
                    response.json(todos);
                });
            });
        });
    });



    app.put('/api/me', ensureAuthenticated, function(req, res) {
        User.findById(req.user, function(err, user) {
            if (!user) {
                return res.status(400).send({ message: 'User not found' });
            }
            user.todos.push(req.body);
            user.displayName = req.body.displayName || user.displayName;
            user.email = req.body.email || user.email;
            res.send(user.todos);
            user.save(function(err) {
                res.status(200).end();
            });
        });
    });


    app.post('/auth/login', function(req, res) {
        User.findOne({ email: req.body.email }, '+password', function(err, user) {
            if (!user) {
                return res.status(401).send({ message: 'Invalid email and/or password' });
            }
            user.comparePassword(req.body.password, function(err, isMatch) {
                if (!isMatch) {
                    return res.status(401).send({ message: 'Invalid email and/or password' });
                }
                res.send({ token: createJWT(user) });
            });
        });
    });

    app.post('/auth/signup', function(req, res) {
        User.findOne({ email: req.body.email }, function(err, existingUser) {
            if (existingUser) {
                return res.status(409).send({ message: 'Email is already taken' });
            }
            var user = new User({
                displayName: req.body.displayName,
                email: req.body.email,
                password: req.body.password
            });

            user.save(function(err, result) {
                if (err) {
                    res.status(500).send({ message: err.message });
                }
                res.send({ token: createJWT(result)});
            });
        });
    });

    function ensureAuthenticated(req, res, next) {
        if(!req.header('Authorization')) {
            return res.status(401).send({ message: 'Please make sure your request has Authorization header'});

        }
        var token = req.header('Authorization').split(' ')[1];

        var payload = null;
        try{
            payload = jwt.decode(token, app.get('superSecret'));
        }
        catch (err) {
            return res.status(401).send({ message: err.message });
        }

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({ message: 'Token has expired'});
        }
        req.user = payload.sub;
        next();
    }

    function createJWT(user) {
        var payload = {
            sub: user._id,
            iat: moment().unix(),
            exp: moment().add(14, 'days').unix()
        };
        return jwt.encode(payload, app.get('superSecret'));
    }

    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, './uploads/')
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
        }
    });

    var upload = multer({ storage: storage });
    app.post('/upload', upload.single('file'), function (req, res) {
        var imgData = fs.readFileSync(req.file.path);
        var imgContentType = req.file.mimetype;
        var imgDataB64 = new Buffer(imgData).toString('base64');
        var imgContentTypeB64 = "data:"+imgContentType+";base64,";
        var imgB64 = imgContentTypeB64 + imgDataB64;
        Todo.create({
            title: req.body.title,
            body: req.body.body,
            date: req.body.date,
            author: req.body.userId,
            img: {data : imgData, contentType : imgContentType },
            uri: imgB64
        }, function (error, todo) {
            if (error) {
                res.send(error);
            }
            Todo.find({ "author" : req.body.userId },function(error, todos) {
                if (error) {
                    res.send(error);
                }
                res.json(todos);
            });
        });
    });


    app.get('*', function (request, response) {
        response.sendFile(__dirname + '/../public/index.html');
    });
};
