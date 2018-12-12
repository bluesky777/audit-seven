var express         = require('express');
var router          = express.Router();

router.route('/').get(getIndex);




function getIndex(req, res) {

    console.log('toy en el serverr');

}




module.exports = router;