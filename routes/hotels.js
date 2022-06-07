const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../ultis/catchAsync')
const { isLoggedIn, isAuthor, validateHotel } = require('../middleware')
const hotel = require('../functions/hotels')
const { route } = require('./user')
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });

router.get('/', catchAsync(hotel.index));

router.get('/new', isLoggedIn, hotel.renderNew)

router.get('/:id', catchAsync(hotel.show));

router.post('/', upload.array('hotel[image]'), validateHotel, catchAsync(hotel.createNew));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(hotel.renderEdit))

router.put('/:id', isLoggedIn, isAuthor, upload.array('hotel[image]'), validateHotel, catchAsync(hotel.edit))
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(hotel.delete))

module.exports = router;