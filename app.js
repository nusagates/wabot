const express = require('express')
const app = express()
const port = 3000
const hbs = require('hbs');
const path = require('path');
const session = require('express-session')
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const wa = require('waweb-phi')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'waservice'
});
const client = new wa({
    puppeteer: {headless: true}, //change it to true if u want hidding the chrome/
    authTimeout: 30000

});

conn.connect((err) => {
    if (err) throw err;
    console.log('Mysql Connected...');
});

conn.on('error', function (err) {
    console.log("[mysql error]", err);
});
//set views file
app.set('views', path.join(__dirname, 'views'));
//set view engine
app.set('view engine', 'hbs');
// Session Setup
app.use(session({

    // It holds the secret key for session
    secret: 'TheBestIndonesianApp',

    // Forces the session to be saved
    // back to the session store
    resave: true,

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))

app.get('/', (req, res) => {
    res.render('index', {
        layout: 'layouts/basic', data: 9
    });
});
app.get("/session", function (req, res) {

    bcrypt.hash('BaikBaikSaja', 10, function (err, hash) {
        res.send(hash)
    });
})
app.get("/login", function (req, ress) {
    let mobile = req.query.mobile
    let pass = req.query.password
    let to = req.query.to
    let msg = req.query.msg
    conn.query('SELECT * FROM users WHERE mobile = ?', [mobile], function (error, results, fields) {
        if (results.length > 0) {
            let user = results[0];
            var hash = user.password
            bcrypt.compare(pass, hash, function (err, res) {
                if (res) {
                    client.session = user.whatsapp_token
                    client.initialize();
                  //ress.end(client.session)
                    client.on('ready', () => {
                        console.log('READY');
                    });
                } else {
                    ress.end("salah")
                }
            });
        } else {
            ress.end("Errorr")
        }
    });

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))