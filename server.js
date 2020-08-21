const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const basicAuth = require('express-basic-auth')
const wa = require('waweb-phi')
var r;
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const client = new wa({
    puppeteer: {headless: true}, //change it to true if u want hidding the chrome/
    authTimeout: 30000,
    session: {
        WABrowserId: '"oLfhus3kDP6aaWW6z4iwzQ=="',
        WASecretBundle: '{"key":"pLylpbr89G+uNUin25AuoUEtX7UFXOGYi8YyWZBgkYM=","encKey":"leBS1a2wbu9Or6xEZFDjftKdGxnL+VKfkxK/bS/OMYs=","macKey":"pLylpbr89G+uNUin25AuoUEtX7UFXOGYi8YyWZBgkYM="}',
        WAToken1: '"jnR2UArYhB0XCugjhw4AUOpWDrR7wNnoFF0UvIQZjYw="',
        WAToken2: '"1@+UWHhEK/9EkcPdVDKpw+u1Ac6iXY5lvgrM645IaX1+ZdUUqAyZmLiFtLbd3nQo1aUPGd1cyTDm82Eg=="'
    }


});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);

});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);


})
app.use(basicAuth({
    users: {'user': 'orangbaik'},
    challenge: true
}))

app.get('/', function (req, res) {
    var data = {
        'status': 200,
        'data': req.body
    };
    res.send(data);
})

client.on('ready', () => {
    console.log('READY');
    app.post('/send', function (req, res) {
        var data = {
            'status': 200,
            'data': req.body
        };
        res.send(data)
        client.sendMessage(req.body.to + "@c.us", req.body.message).then((r) => {
            console.log("sendMessage", r)
        })

    })
});

client.initialize();
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))