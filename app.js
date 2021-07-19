// require packages used in the project
const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const restaurantList = require('./restaurant.json')
const Restaurant = require('./models/restaurant')



mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


// setting template engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

app.use(bodyParser.urlencoded({ extended: true }))


// setting static files
app.use(express.static('public'))

// routes setting

app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.error(error))

})


app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})





app.post('/restaurants', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})



app.get('/restaurants/searches', (req, res) => {
  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.category.toLowerCase().includes(keyword.toLowerCase())
  })
  // res.render('index', {restaurants: restaurants, keyword: keyword})
  
  if (restaurants.length > 0) {
    res.render('index', {
      restaurants: restaurants,
      keyword: keyword
    })
  } else {
    res.render('index', {
      keyword: keyword,
      no_result: `<h3> 沒有"${req.query.keyword}"的搜尋結果</h3>`,
    })
  }

})


app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  console.log(id)

  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('show', { restaurant }))
    .catch(error => console.log(error))
})


// app.get('/restaurants/:restaurant_id', (req, res) => {

//   const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)

//   console.log(restaurant)

//   if (restaurant === undefined) {
//   return res.render('index', {
//     errMsg: `<h3> 沒有這間餐廳囉~ </h3>`
//     })
//   }  

//   res.render('show', {restaurant: restaurant}, )
// })





// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})



