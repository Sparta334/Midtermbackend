const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 8000;
var recombee = require('recombee-api-client');
var logger = require('morgan');
var bodyParser = require('body-parser');
require('dotenv').config();
var rqs = recombee.requests;
const session = require('express-session');
const request = require('request');
const passport = require('passport');
var cookieParser = require('cookie-parser');
const GitHubStrategy = require('passport-github').Strategy;

var RedisStore = require('connect-redis');
var redis = require("redis").createClient();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

var client = new recombee.ApiClient(


  'exodia-the-forbidden-one-dev', 
  'bx6IIFrZ7tzVnBplVVGhaQCdUKLVHWcELOMsUWH1orFxefDJtPuOzIFGT8Ck7Gdn', 
  { region: 'ap-se' }
);

function findObjectByPropertyValue(jsonArray, propertyName, targetValue) {
    for (let i = 0; i < jsonArray.length; i++) {
      if (jsonArray[i][propertyName] === targetValue) {
        return jsonArray[i];
      }
    }
    return null;
  }

  app.use(session({
    secret: 'your-secret-key',
    resave: false, // or true
    saveUninitialized: false // or true
  }));



  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

app.get('/BackEnd/SearchContent/:value' , (req ,res) =>{

    const value = req.params.value;
    
     client.send(new rqs.ListItems({
        // optional parameters:
        'returnProperties': true
      }) , (err, response) =>{
        
        const filteredProducts = response.filter((product) => {
            return product.ProductName.toLowerCase().includes(value.toLowerCase());
        });

        const limitedProducts = filteredProducts.slice(0, 5).map((product) => {
            return { product };
          });

  
        console.log(limitedProducts)
        res.send(limitedProducts)

      } )

      
     
     
});







app.get('/BackEnd/Products/:value', (req ,res) => {


    const value = decodeURIComponent(req.params.value);


    client.send(new rqs.ListItems({
        'returnProperties': true
    }) , (err, response) =>{

        const result = findObjectByPropertyValue(response, 'ProductName', value);
        console.log(result)
        res.send(result);
     }
    
    
    )

  
    });
    



//登入

/**
 * -----------------------------------------------------------------------------
 * Setup
 * -----------------------------------------------------------------------------
 */
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(passport.initialize());

app.use(passport.session());
// 将用户 ID 序列化到 session 中
passport.serializeUser((user, done) => {
done(null, user.id);
});

// 从 session 中反序列化用户 ID
passport.deserializeUser((id, done) => {
done(null, { id });
});


app.get('/BackEnd/Auth/:Provider' ,  (req , res)  => {



    const Provider =  req.params.Provider;


} );


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/github/callback"
},
    function(accessToken, refreshToken, profile, cb) {
  // 在此处处理用户信息
  return cb(null, profile);
  }
));




app.get('/logout', (req, res) => {
  req.logout();
});


app.get('/auth/github',  passport.authenticate('github'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


app.get('/auth/github/callback',
  passport.authenticate('github', { successRedirect: '/profile',  failureRedirect: '/pages/login' }));


app.get('/profile'), ( (req, res) => {
  // 检查用户是否已登录

  res.send(req.user.id);

})


app.listen(port , () =>{

  console.log("A")

})

