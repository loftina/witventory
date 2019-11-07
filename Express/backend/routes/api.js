// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// MongoDB URL from the docker-compose file
const dbHost = 'mongodb://mongo:27017/WITventory';

// Connect to mongodb
mongoose.connect(dbHost);

// create mongoose schema
const itemSchema = new mongoose.Schema({
  name: String,
  tag_number: Number
});

// create mongoose model
const Item = mongoose.model('Item', itemSchema);


/_ GET api listing. _/
router.get('/', (req, res) => {
        res.send('api works');
});

/_ GET all items. _/
router.get('/items', (req, res) => {
    Item.find({}, (err, items) => {
        if (err) res.status(500).send(error)

        res.status(200).json(items);
    });
});

/_ GET one item. _/
router.get('/items/:id', (req, res) => {
    Item.findById(req.param.id, (err, items) => {
        if (err) res.status(500).send(error)

        res.status(200).json(items);
    });
});

/_ Create an item. _/
router.post('/items', (req, res) => {
    let item = new Item({
        name: req.body.name,
        tag_number: req.body.tag_number
    });

    item.save(error => {
        if (error) res.status(500).send(error);

        res.status(201).json({
            message: 'Item created successfully'
        });
    });
});

module.exports = router;