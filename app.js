const express = require('express')
const app = express()
const multer  = require('multer')
const path = require('path')
const { PromisedDatabase } = require("promised-sqlite3")

const db = new PromisedDatabase()


const storage = multer.diskStorage({
    destination: (req, file ,cb)=>{
        cb(null, './public/images')
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() +file.originalname)
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
    const image = Date.now() +req.file.originalname
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
app.get('/image/:id',async(req, res)=>{
    const id = req.params.id
    await db.open('./db/cat.db')
    const query = await db.get(`SELECT * FROM cat WHERE cat_id = ${id}`)
    await db.close('./db/cat.db')
    res.send(query.cat_image)

})

app.listen(8000)