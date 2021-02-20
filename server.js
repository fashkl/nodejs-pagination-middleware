//https://medium.com/learnfactory-nigeria/create-a-pagination-middleware-with-node-js-fe4ec5dca80f

const express = require('express')
const app = express()
const mongoose = require('mongoose')

require('dotenv').config()



//models import
const User = require('./models/users')
const Post = require('./models/posts')

//connect to DB
mongoose.connect(process.env.DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("database is connected to mongodb://localhost/pagination")
).catch(() => console.log("error connecting to database"));


const db = mongoose.connection

db.once("open", async () => {
    if ((await Post.countDocuments().exec()) > 0) {
        return console.log("user already inserted to database");
    }

    Promise.all([
        Post.create({ "name": "Post 1" }),
        Post.create({ "name": "Post 2" }),
        Post.create({ "name": "Post 3" }),
        Post.create({ "name": "Post 4" }),
        Post.create({ "name": "Post 5" }),
        Post.create({ "name": "Post 6" }),
        Post.create({ "name": "Post 7" }),
        Post.create({ "name": "Post 8" }),
        Post.create({ "name": "Post 9" }),
        Post.create({ "name": "Post 10" }),
    ])
        .then(() => { console.log('Added user to Database') })
        .catch(() => console.log("error occurred while inserting data to database"))
})



/*app.get('/users', (req, res) => {
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    // console.log(startIndex, ' ---- ',endIndex);
    // const result = users.slice(startIndex, endIndex)
    const result = {}
    if (endIndex < users.length) {
        result.next = {
            page: page + 1,
            limit: limit,
        }
    }
    if (startIndex > 0) {
        result.previous = {
            page: page - 1,
            limit: limit,
        }
    }
    result.results = users.slice(startIndex, endIndex)
    res.json(result)
})*/

app.get('/users', paginateMiddleware(User), (req, res) => {
    res.json(res.paginatedResult)
})

app.get('/posts', paginateMiddleware(Post), (req, res) => {
    res.json(res.paginatedResult)
})


function paginateMiddleware(model) {
    return async (req, res, next) => {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit
        const endIndex = page * limit

        const result = {}

        if (endIndex < (await model.countDocuments().exec())) {
            result.next = {
                page: page + 1,
                limit: limit,
            }
        }

        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit,
            }
        }

        try {
            // result.results = model.slice(startIndex, endIndex)
            result.results = await model.find().limit(limit).skip(startIndex);
            res.paginatedResult = result

            next()
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
}



app.listen(3001, () => { console.log('Server up & Running..'); })