const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      console.log('getAllSauces: Success');
      console.log(sauces);
      res.status(200).json(sauces);
    })
    .catch((error) => {
      console.log('getAllSauces: Fail');
      res.status(400).json({
        error: error + 'Huh',
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

console.log('TEST DB');

Sauce.deleteMany({});

exports.createSauce = (req, res, next) => {
  console.log('createSauce: start');

  const url = req.protocol + '://' + req.get('host');

  console.log(req.body.sauce);

  const {
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
  } = JSON.parse(req.body.sauce);

  console.log(req.body.sauce);

  const imageUrl = url + '/images/' + req.file.filename;

  const likes = 10;
  const dislikes = 10;
  const usersLiked = [];
  const usersDisliked = [];

  const sauce = new Sauce({
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    usersDisliked,
    usersLiked,
    dislikes,
    likes,
    heat,
    imageUrl,
  });

  console.log(sauce);
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Post saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {};

// If 'like' = 1
//   Add userId to usersLiked array
//   Increment likes by 1
// Else if 'like' = -1
//   Check if userId is in both usersLiked and usersDisliked arrays
//   Increment dislikes by 1

exports.deleteSauce = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Deleted!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeSauce = (req, res, next) => {};
