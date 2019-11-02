// Import dependencies
const express = require('express');
const router = express.Router();

/_ GET api listing. _/
router.get('/', (req, res) => {
        res.send('api worksss');
});

module.exports = router;