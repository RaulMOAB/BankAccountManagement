'use stric';
const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql');
const { connect } = require('http2');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(function(req, res, next) {
    res.header ('Access-Control-Allow-Origin', '*');
    res.header ('Access-Control-Allow-Credentials', true);
    res.header ('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
    res.header ('Access-Control-Allow-Headers', 'Content-Type');
    res.header ('Allow', 'POST, GET, PUT, DELETE, OPTIONS');
    next();
});

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, 'public')));


//Create mysql connection
let connection = mysql.createConnection({
    host:'127.0.0.1',
    database:'BankDB',
    user:'root',
    password:'123456789'
});

app.get('/api/clients', (req, res)=>{
    console.log('llego a login');

    connection.connect(function (err){
        if(err){
            console.log('Error connectiong ' + err.stack);
            return;
        }
        console.log('Connected as id: ' + connection.threadId);
    });

    connection.query('SELECT * FROM Clients', (error, results, field)=>{
        if (error) {
            res.status(400).send({response: null})
        }else{//Connection OK
            res.status(200).send({response: results})
        }
    })
})

app.post('/api/updates', (req, res)=>{
    console.log('llego al post');
    let data = req.body;
    console.log(data.accounts);

    //? crear query que haga update todos juntos 
    data.accounts.forEach((account)=>{
        connection.query(`UPDATE Clients SET 
        NAME = '${account.NAME}',
        ACCOUNT_TYPE = '${account.ACCOUNT_TYPE}',
        AMOUNT= '${account.AMOUNT}',
        CLIENT_TYPE= '${account.CLIENT_TYPE}',
        ENTRY_DATE = '${account.ENTRY_DATE}' WHERE DNI = '${account.DNI}'`, (error, results, field)=>{
            if (error) {//!
                res.status(400).send({response: null})
            }else{//Connection OK
                //res.status(200).send({response: results})
            }
        })
    })
   //
})

app.listen(3000, ()=>{
    console.log('Aquesta és la nostra API-REST que corre en http://localhost:3000')
 })

