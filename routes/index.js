const express = require('express');

const router = express.Router();

const  { generateOTP, verifyOTP } = require('../services/index')


router.post('/request-otp', generateOTP);

router.post('/verify-otp', verifyOTP);

module.exports = router;
