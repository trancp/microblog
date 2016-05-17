var mongoose = require('mongoose');

module.exports = mongoose.model('Blog', {
    title : String,
    img: {data: Buffer, contentType: String },
    body : String,
    date: String,
    author: mongoose.Schema.Types.ObjectId,
    uri: String,
    comments: [{text: String}]
});

