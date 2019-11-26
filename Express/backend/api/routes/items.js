//add next field for pagination

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
router.get('/:page', (req, res, next) => {

  const resPerPage = 9;
  const page = req.params.page || 1;

  filter = req.query

  fields = "name location damaged_status _id"
  if (typeof filter.fields != 'undefined'){
    fields = filter.fields;
    delete filter.fields;
  }

  var regexFilter = function(filter){
    return_filter = {}
    Object.keys(filter).map(function(key){ return_filter[key] =  new RegExp('.*'+filter[key]+'.*', "i")});
    if (typeof filter.damaged_status != 'undefined'){
      return_filter['damaged_status'] = filter.damaged_status;
    }
    return return_filter;
  }

  Item.find(regexFilter(filter))
    .skip((resPerPage * page) - resPerPage)
    .limit(resPerPage)
    .select(fields)
    .exec()
    .then(items => {
      Item.count(regexFilter(filter), function (err, count) {
        if (err) {
          res.status(500).json({
              error: err
            });
        } else {
          const response = {
            total_count: count,
            total_pages: Math.ceil(count / resPerPage),
            current_count: items.length,
            current_page: parseInt(page),
            items: items.map(item => {
              return {
                name: item.name,
                location: item.location,
                description: item.description,
                notes: item.notes,
                image: item.image,
                damaged_status: item.damaged_status,
                _id: item._id,
                request: {
                  type: 'GET',
                  description: 'get item details',
                  url: 'http://localhost:3000/items/item/' + item._id 
                }
              }
            })
          }
          res.status(200).json(response);
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

/_ GET one item. _/
router.get('/item/:id', (req, res, next) => {

    filter = req.query

    fields = "name location description damaged_status notes image _id"
    if (typeof filter.fields != 'undefined'){
      fields = filter.fields;
    }

    Item.findById(req.params.id)
      .select(fields)
      .exec()
      .then(item => {
        if (item) {
          res.status(200).json({
            item: item,
            request: {
              type: 'GET',
              description: 'get all items',
              url: 'http://localhost:3000/items/1'
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
    // only admins can create item
    if (!req.userData.admin) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }
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
                url: 'http://localhost:3000/items/item/' + result._id
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
router.patch('/item/:id', checkAuth, (req, res, next) => {
    // only admins can update item
    if (!req.userData.admin) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

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
            url: 'http://localhost:3000/items/item' + req.params.id
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
router.delete('/item/:id', checkAuth, (req, res, next) => {
    // only admins can delete item
    if (!req.userData.admin) {
      return res.status(401).json({
        message: 'Auth failed'
      });
    }

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