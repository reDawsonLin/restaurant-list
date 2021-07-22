const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/searches', (req, res) => {
  const keyword = req.query.keyword.trim().toLowerCase()
  if (keyword <= 0) {
    return res.redirect('/')
  }
  Restaurant.find()
    .lean()
    .then((restaurants) => {
      restaurants = restaurants.filter(
        (restaurant) =>
        restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
      )
      if (restaurants.length > 0) {
        return res.render('index', {
          restaurants: restaurants,
          keyword: keyword
        })
      } else {
        res.render('index', {
          keyword: req.query.keyword,
          no_result: `<h3> 沒有"${keyword}"的搜尋結果</h3>`
        })
      }
    })
    .catch((error) => console.error(error))
})

// sort
router.get('/sort', (req, res) => {
  const {
    select
  } = req.query

  Restaurant.find()
    .lean()
    .sort(select)
    .then((restaurants) => res.render('index', {
      restaurants,
      select
    }))
    .catch((error) => console.log(error))
})

router.get('/new', (req, res) => {
  return res.render('new')
})

router.post('/', (req, res) => {
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const image = req.body.image
  const location = req.body.location
  const phone = req.body.phone
  const google_map = req.body.google_map
  const rating = req.body.rating
  const description = req.body.description

  return Restaurant.create({
      name,
      name_en,
      category,
      image,
      location,
      phone,
      google_map,
      rating,
      description
    })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    // Restaurant.findOne({ id: id }) --findOne用法
    .lean()
    .then(restaurant => res.render('show', {
      restaurant
    }))
    .catch(error => console.log(error))
})

router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', {
      restaurant
    }))
    .catch(error => console.log(error))
})

router.put(':id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name
      restaurant.name_en = req.body.name_en
      restaurant.category = req.body.category
      restaurant.image = req.body.image
      restaurant.location = req.body.location
      restaurant.google_map = req.body.google_map
      restaurant.rating = req.body.rating
      restaurant.phone = req.body.phone
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then((restaurant) => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router