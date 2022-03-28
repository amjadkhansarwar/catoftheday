const express = require('express')
const { links } = require('express/lib/response')
const app = express()
const multer  = require('multer')
const path = require('path')
const { PromisedDatabase } = require("promised-sqlite3")

const db = new PromisedDatabase()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const storage = multer.diskStorage({
    destination: (req, file ,cb)=>{
        cb(null, './public/images')
    },
    filename: (req, file, cb)=>{
        cb(null, file.originalname)
    }
})
const upload = multer({ storage: storage})
app.set('view engine', 'ejs')
app.use(express.static('public'))


app.get('/', (req, res)=>{
    res.render('index')
})
app.post('/cats',  upload.single('image'), async(req, res)=>{
 const name= req.body.name
    const image = req.file.originalname
     console.log(name,image)
    await db.open('./db/cat.db')
    const query ='INSERT INTO cat (name, cat_image, cat_like) values (?,?,0)'
    await db.run(query , [name, image])
    await db.close('./db/cat.db')
    res.redirect('cats')
})
app.get('/cats', async(req, res)=>{
    await db.open('./db/cat.db')
    const query ='SELECT * FROM cat'
     const cats =await db.all(query)
    await db.close('./db/cat.db')
    res.render('cats', {cats: cats})
})
app.post('/like', async(req, res)=>{
    var {id}= req.body
    await db.open('./db/cat.db')
    const query = await db.get(`SELECT cat_like FROM cat WHERE cat_id = ${id}`)
    var like = query.cat_like
    like = parseInt(like) + 1
    const query2 = await db.run(`UPDATE cat SET cat_like = ${like} WHERE cat_id = ${id}`)
    await db.close('./db/cat.db')
    res.render('like')
})
app.get('/like', async(req, res)=>{
    await db.open('./db/cat.db')
    const query ='SELECT *, MAX(cat_like) AS cat_like FROM cat'
     const cat =await db.get(query)
    await db.close('./db/cat.db')
    res.render('like', {cat: cat})
})

app.listen(8000)