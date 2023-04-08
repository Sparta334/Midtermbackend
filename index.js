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


  app.use(cors());

  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://energetic-fox-pajamas.cyclic.app/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));


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
  
app.use(bodyParser.json());


app.get('/logout', (req, res) => {
  req.logout();
});


app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));




  app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/profile' }),
  function(req, res) {
    // Successful authentication, redirect home.

  });

app.get('/profile'), ( (req, res) => {
  // 检查用户是否已登录

  res.send(req.user.id);

})


app.listen(port , () =>{

  console.log("A")

})

