const { PromisedDatabase } = require('promised-sqlite3')
const db = new PromisedDatabase()

async function setup(){
    try{
        await db.open('./db/cat.db')
        const data = await db.exec(
            `
            DROP TABLE IF EXISTS cat;
            CREATE TABLE cat (
            cat_id INTEGER NOT NULL UNIQUE,
            name TEXT NOT NULL,
            cat_image  TEXT NOT NULL,
            cat_like INTEGER,
            PRIMARY KEY(cat_id AUTOINCREMENT)
            );
            `
        )
        await db.close();
        console.log('Db is created')
    }
    catch(err){
        return err
    }


}
setup()