const express = require('express')
const mongoose = require('mongoose');
var cors = require('cors')
// const morgan = require('morgan')

const bookController = require('./controllers/bookController')
let db = mongoose.connection
mongoose.connect('mongodb://localhost:27017/Library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => {
      console.log( db.name )

    }).catch(e => console.log(e.message))

const app = express()
app.set('view engine', 'pug')

app.use(express.static('static'))
app.use(cors())
const bookRouter = require('./routes/books')
// app.use(morgan('dev'))
let logger = (req, _, next) => {
    console.log(req.method, req.path)
    next()
}
app.use(logger)
app.use(express.urlencoded(extended=true))


app.get('/books', async (_, res) => {
    let books = await bookController.getAllBooks()
    console.log(books)
    res.json(books)
    // res.send(' Welcome to Library')
})
app.delete(/books*/, async (req, res) => {
    console.log( /(^.*\/)(.*$)/.exec( decodeURIComponent( req.path))[2]  )
    await bookController.removeBook( /(^.*\/)(.*$)/.exec( decodeURIComponent( req.path))[2] )
    res.end()
})
app.get('/addbook', (_,res) => {
    res.render('Addbook' )
})
app.post('/',(req,res) => {
    console.log(req , res)
    res.end()
})

app.use('/books/', bookRouter)

app.all(/.*/, (_, res) => {
    res.send('You are lost')
})



const PORT = 3300
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`)
})