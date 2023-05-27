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
    
    client.send(new rqs.SearchItems("undefined", value, 5, {
      'cascadeCreate': false,
      'returnProperties': true,
    }), (err, response) =>{
      
  
        console.log(response)
        res.send(response)

      } )

      
     
     
});







app.get('/BackEnd/Products/:value', (req ,res) => {


    const value = decodeURIComponent(req.params.value);


    client.send(new rqs.SearchItems("undefined", value, 1, {
      'cascadeCreate': false,
      'returnProperties': true,
    }), (err, response) =>{

        res.send(response);
        console.log(response)
        const result = findObjectByPropertyValue(response, 'ProductName', value);
        
       
     }
    
    
    )

  
    });
    


//登入

/**
 * -----------------------------------------------------------------------------
 * Setup
 * -----------------------------------------------------------------------------
 */


// 将用户 ID 序列化到 session 中





// recombeee


app.post('/BackEnd/Detail',( req, res) => {


  let UserItem = null;
  const userData = req.body.data.UserData;
  const userViewData = req.body.data.UserViewData

  console.log(userViewData)
  console.log(userData)


  client.send(new rqs.AddDetailView(userData, userViewData, {'cascadeCreate': true}),
    (err, response) => {
      console.log(response)
    }
  );

  client.send(new rqs.RecommendItemsToUser(userData, 8, {
    // optional parameters:
    'cascadeCreate':false,
    'returnProperties': true,
    'rotationRate': 0.3
  }) , (err, response)  =>{

    res.send(response);

  }  )



  



})

app.post('/BackEnd/DetailHome',( req, res) => {


  let UserItem = null;
  const userData = req.body.data.UserData;

  console.log(userData)
 
   client.send(new rqs.RecommendItemsToUser(userData, 8, {
    // optional parameters:
    'cascadeCreate':true,
    'returnProperties': true,
  }),(err, response) =>{

    
    res.send(response);
  });
  



})



app.post('/BackEnd/Profile',( req, res) => {


  const userData = req.body.data.UserData;
  let UserItem =null;

  client.send(new rqs.ListUserDetailViews(userData),
    (err, response) => {
      
      console.log(response);
      const sortedArray = response.sort((a, b) => b.timestamp - a.timestamp)
      console.log("sortedArray"+JSON.stringify(sortedArray));
      UserItem = sortedArray.slice(0,5);
      console.log("limitedProducts : " +JSON.stringify(UserItem));
      
     
       
    }
  );


  for(let i = 0 ; i< 5 ;i++){
  
    client.send(new rqs.SearchItems("undefined", UserItem[i].itemId, 1, {
      'cascadeCreate': false,
      'returnProperties': true,
    }), (err, response) =>{
  
         console.log(response)
         res.send(response);
    
    
    });
  }

 

 


 })

 
 app.post('/BackEnd/Add',( req, res) => {


  const userData = req.body.data.UserData;

  console.log(JSON.stringify(userData))

  client.send(new rqs.AddDetailView(userData, "001", {
    'cascadeCreate':true,
  }),(error ,response ) => {

    res.send("seucces");
  
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
