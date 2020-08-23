const notifyRouter = require('express').Router();
const { Park, UserParkWishList, UserParkHistory, User } = require('../db/index');
require('dotenv').config();
const { routeUsersPhone, findRouteWeather, userRouteInvite } = require('../db/database')
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const { sendNotification } = require('../sms/twilio')
const client = require('twilio')(accountSid, authToken);
const { getWeatherData } = require('../weather/weather');

notifyRouter.get('/routechange', (req, res) => {
  routeUsersPhone(null).then((data) => {
    //update with a for each
    data.forEach(number => {
      sendNotification(`your route has been updated`, '+12163859616');
        console.log('sent');

    })
      res.status(200);
      res.send(data);
  })
})

notifyRouter.post('/dailyweather', (req, res) => {
  let date = new Date()
  let dateString;
   dateString = date.toString();
   dateString = dateString.slice(4, 15);
   /// Aug 22 2020
  
  console.log(dateString);
  findRouteWeather(req.user.dataValues.id_route, '2020-08-22').then(data => {
    //console.log(data);
  })
  res.send('you hit weather')
})

notifyRouter.post('/invite', (req, res) => {
  console.log(req.body);
  //userRouteInvite()
})

module.exports = {
  notifyRouter,
}