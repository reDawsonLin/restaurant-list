const Restaurant = require('../restaurant')
const restaurantList = require('../../restaurant.json').results
const db = require('../../config/mongoose')

// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
  restaurantList.forEach((restaurant) => {
    Restaurant.create({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })
  console.log('restaurantSeeder done')
})
