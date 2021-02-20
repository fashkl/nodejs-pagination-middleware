
const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        defaults: Date.now
    }
})


module.exports = mongoose.model('posts', postSchema)