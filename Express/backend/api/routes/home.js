// Import dependencies
const express = require('express');
const router = express.Router();

/_ GET homepage/
router.get('/home',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});
module.exports = router;

