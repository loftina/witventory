// Import dependencies
const express = require('express');
const router = express.Router();

/_ GET api listing. _/
router.get('/', (req, res) => {
        res.redirect(process.env.FRONTEND_URL);
});

module.exports = router;