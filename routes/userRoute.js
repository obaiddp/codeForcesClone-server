const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware');

// register
/*
curl -X POST http://localhost:5000/api/users/signup \
-H "Content-Type: application/json" \
-d '{
  "name": "obaid",
  "email": "obaid@example.com",
  "password": "obaidpassword",
  "role": "admin"
}'
*/
router.post('/signup', userController.register)

// login
/*
curl -X POST http://localhost:5000/api/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "zohaib@example.com",
  "password": "zohaibpassword"
}'
*/
router.post('/login', userController.login)

// logout
router.post('/logout', userController.logout)

// profile
/*
curl -X GET http://localhost:5000/api/users/profile \
-H "Content-Type: application/json" \
-H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OWY0MWIyZGJiNjEwYTY5OTBkYTgzYyIsImlhdCI6MTc1NTI2NzUwNiwiZXhwIjoxNzU1ODcyMzA2fQ.hUM3fiTE-VWPQLuzsLkdIyZxXXHs2rUmmyQ_YR-yZ7Y"
*/
router.get('/profile', protect, userController.profile)

module.exports = router;