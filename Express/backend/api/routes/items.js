// Import dependencies
const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const path = require('path')
const router = express.Router();

const UPLOAD_PATH = path.resolve(__dirname, '../../images/item_images')

// const storage = multer.diskStorage({
//   destination: function(req, file, cb) {
//     cb(null, '../../images/item_images');
//   },
//   filename: function(req, file, cb) {
//     cb(null, new Date().toISOString() + file.originalname);
//   }
// });

// const fileFilter = (req, file, cb) => {
//   // reject file
//   if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
//      cb(null, true);
//   } else {
//      cb(null, false);
//   }
// };

const upload = multer({
  dest: UPLOAD_PATH,
  //storage: storage,
  limits: {fileSize: 1024 * 1024 * 5, files: 5},
  // fileFilter: fileFilter
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


    //   {}, (err, items) => {
    //     if (err) res.status(500).send(error);

        // const response = {
        //   count: items.length,
        //   items: items.map(item => {
        //     return {
        //       name: item.name,
        //       location: item.location,

        //     }
        //   })
        // };
    //     res.status(200).json(response);
    // });
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
        }
      })
      .catch(err => {
        res.status(500).send(err);
      });
});

/_ POST an item. _/
router.post('/', upload.single('image'), (req, res, next) => {
    // const images = req.files.map((file) => {
    //     return {
    //         filename: file.filename,
    //         originalname: file.originalname
    //     }
    // });
    console.log(req.file);
    //console.log(req.files)
    let item = new Item({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        location: req.body.location,
        description: req.body.description,
        damaged_status: req.body.damaged_status,
        notes: req.body.notes,
        image: 'http://localhost:3000/images/item_images/' + req.file.filename
        // .map((file) => {
        //     return {
        //         filepath: file.path,
        //         filename: file.filename,
        //         originalname: file.originalname
        //     }
        // })
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

/_ PATCH an item. _/
router.patch('/:id', (req, res, next) => {
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

    // , (err, items) => {
    //     if (err) res.status(500).send(error)

    //     res.status(200).json(items);
    // });
});

/_ DELETE an item. _/
router.delete('/:id', (req, res, next) => {
    Item.deleteOne({ _id: req.params.id })
      .exec()
      .then(result => {
        res.status(200).json({
          message: 'Item successfully deleted',
          updated_item: {
            name: result.name,
            location: result.location,
            _id: result._id
          }
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        })
      })
});

// // upload image
// router.post('/images', upload.array('images', 5), (req, res, next) => {
//   console.log(req.files)
//   const images = req.files.map((file) => {
//     return {
//       filename: file.filename,
//       originalname: file.originalname
//     }
//   });

//   console.log(images)

//   Image.insertMany(images, (err, result) => {
//     if (err) return res.sendStatus(404);
//     res.json(result);
//   });
// });

// // get image with id
// router.get('/images/:id', (req, res, next) => {
//   Image.findOne({_id: req.params.id}, (err, image) => {
//     if (err) return res.sendStatus(404);
//     fs.createReadStream(path.resolve(UPLOAD_PATH, image.filename)).pipe(res);
//   });
// });

module.exports = router;