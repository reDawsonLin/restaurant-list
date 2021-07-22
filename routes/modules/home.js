// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

router.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(restaurants => res.render('index', {
      restaurants
    }))
    .catch(error => console.error(error))
})

// router.get('/search', (req, res) => {
//   const keyword = new RegExp(req.query.keyword.trim(), 'i')

//   Restaurant.find({
//     $or: [{
//     name: keyword
//     }, {
//         category: keyword
//       }]
//     })
//     .lean()
//     .sort(sortList[req.query.sortBy].mongoose)
//     .then(function (restaurants) {
//       if (restaurants.length > 0) {
//         res.render('index', {
//           restaurants,
//           sortList,
//           query: req.query
//         })
//       } else {
//         res.render('index', {
//           no_result: '<h3>搜尋沒有結果</h3>',
//           query: req.query
//         })
//       }
//     })
//     .catch(error => console.log(error))
// })

module.exports = router
