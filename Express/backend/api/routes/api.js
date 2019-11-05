// Import dependencies
const express = require('express');
const router = express.Router();

/_ GET api listing. _/
router.get('/', (req, res) => {
        res.redirect('http://localhost:4200');
});

module.exports = router;