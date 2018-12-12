var express = require('express');
var router = express.Router();



router.use('/upload', require('./UploadController'));


module.exports = router;