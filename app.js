const express = require('express')
const app = express()
const { PromisedDatabase } = require('promised-sqlite3')
const db = new PromisedDatabase()
app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', (req, res)=>{
    res.render('index')
})
app.post('/cat', async (req, res)=>{
    const {name,cat_image} = req.body
    await db.open('./db/cat.db')
    const query ='INSERT INTO cat (name, cat_image, cat_like) values (?,?,0)'
    await db.run(query , [name, cat_image])
    await db.close('./db/cat.db')
    res.redirect('cat')
})
app.get('./cat', (req, res)=>{
    res.render('cat')
})

app.listen(8000)