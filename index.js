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
const request = require('request');
const passport = require('passport');
const session =require('express-session') 


var cookieParser = require('cookie-parser');
const GitHubStrategy = require('passport-github').Strategy;

var RedisStore = require('connect-redis');
const { send } = require('process');
var redis = require("redis").createClient();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    


app.use(session({

  secret : 'cats'

}))


//登入

/**
 * -----------------------------------------------------------------------------
 * Setup
 * -----------------------------------------------------------------------------
 */


// 将用户 ID 序列化到 session 中





// recombeee


app.post('/BackEnd/Detail',( req, res, next) => {


  let UserItem = null;
  const userData = req.data.UserData;
  const userViewData = req.data.UserViewData

  console.log(req.userData)

  client.send(new rqs.AddDetailView(userData, userViewData, {timestamp: '2014-07-20T02:49:45+02:00', cascadeCreate: true}),
    (err, response) => {
    //...
    }
  );

  client.send(new rqs.RecommendItemsToUser(userData, 8, {
    // optional parameters:
    'cascadeCreate':true,
    'returnProperties': true,
  }),(err, response) =>{

    console.log(response);
    res.send(response);

  });
  



})


app.listen(8000 , () =>{

  console.log("A")

})




// client.send(new recombee.AddDetailView('2c169e575644d840838e', 'xyz'),
//     (err, response) => {
//     //...
//     }
// );