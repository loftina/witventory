// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UPLOAD_PATH = path.resolve(__dirname, '../../images/item_images')

const upload = multer({
  dest: UPLOAD_PATH,
  limits: {fileSize: 1024 * 1024 * 5, files: 5},
})


const Item = require('../models/item');

/_ GET all items. _/
router.get('/', (req, res, next) => {
    Item.find()
      .select("name location damaged_status _id")
      .exec()
      .then(items => {
        const response = {
          count: items.length,
          items: items.map(item => {
            return {
              name: item.name,
              location: item.location,
              damaged_status: item.damaged_status,
              _id: item._id,
              request: {
                type: 'GET',
                description: 'get item details',
                url: 'http://localhost:3000/items/' + item._id 
              }
            }
          })
        };
        res.status(200).json(response);
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
});

/_ GET one item. _/
router.get('/:id', (req, res, next) => {
    Item.findById(req.params.id)
      .select('name location description damaged_status notes image _id')
      .exec()
      .then(item => {
        if (item) {
          res.status(200).json({
            item: item,
            request: {
              type: 'GET',
              description: 'get all items',
              url: 'http://localhost:3000/items'
            }
          })
        } else {
          res.status(404).json({
            message: "item not found"
          });
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
});

/_ POST an item. _/
router.post('/', checkAuth, upload.single('image'), (req, res, next) => {
    let item = new Item({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        damaged_status: req.body.damaged_status,
        notes: req.body.notes,
        image: 'http://localhost:3000/images/item_images/' + req.file.filename
    });

    item.save()
      .then(result => {
        res.status(201).json({
            message: 'Item successfully created',
            created_item: {
              name: result.name,
              location: result.location,
              _id: result._id,
              request: {
                type: 'GET',
                url: 'http://localhost:3000/items/' + result._id
              }
            }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
});

// should restrict fields you can update
/_ PATCH an item. _/
router.patch('/:id', checkAuth, (req, res, next) => {
    const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value;
    }
    Item.updateOne({ _id: req.params.id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Item successfully updated',
          request: {
            type: 'GET',
            url: 'http://localhost:3000/items/' + req.params.id
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      });
});

/_ DELETE an item. _/
router.delete('/:id', checkAuth, (req, res, next) => {
    Item.deleteOne({ _id: req.params.id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Item successfully deleted'
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
});

module.exports = router;