const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
  console.log('getAllSauces');
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

exports.createSauce = (req, res, next) => {
  console.log('createSauce: start');
  // console.log(req);
  // req.body.sauce = JSON.parse(req.body.sauce);
  // const parsedSauce = JSON.parse(req.body.sauce);
  const url = req.protocol + '://' + req.get('host');

  console.log(req.body.sauce);
  console.log(req.body);
  const {
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
    // usersDisliked,
    // usersLiked,
    // dislikes,
    // likes,
  } = JSON.parse(req.body.sauce);

  const imageUrl = url + '/images/' + req.file.filename;

  const likes = 10;
  const dislikes = 10;
  const usersLiked = 'Yup';
  const usersDisliked = 'Nope';

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
      console.log('createSauce: success');
      res.status(201).json({
        message: 'Post saved successfully!',
      });
    })
    .catch((error) => {
      console.log('createSauce: error');
      console.log(error);
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.body._id,
      userId: req.body.userId,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: url + '/images/' + req.file.filename,
      heat: req.body.heat,
      likes: req.body.likes,
      dislikes: req.body.dislikes,
      userLikes: req.body.userLikes,
      userDisliked: req.body.userDisliked,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: 'Sauce updated successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

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
