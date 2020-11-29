const sauce = require("../models/sauce");
const Sauce = require("../models/sauce");

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

exports.createSauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");  
  const {
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
  } = JSON.parse(req.body.sauce);

  const imageUrl = url + "/images/" + req.file.filename;

  const likes = 0;
  const dislikes = 0;
  const usersLiked = '';
  const usersDisliked = '';

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
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Post saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifySauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");  
  const {
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
  } = JSON.parse(req.body.sauce);

  const imageUrl = url + "/images/" + req.file.filename;
  
  const sauce = new Sauce({
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
    imageUrl,
  });

  console.log('Modified sauce' + sauce);

  Sauce.findOneAndUpdate({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Sauce updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteSauce = (req, res, next) => { 
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: "Deleted!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
  };

exports.likeSauce = (req, res, next) => {
  Sauce.findOneAndUpdate({
    _id: req.params.id,
  })

  //determine input - 1/ 0/ -1

  if (input = 1) {
    const alreadyLiked = usersLiked.includes(userId); 
    const alreadyDisliked = usersDisliked.includes(userId);
    if (alreadyLiked && alreadyDisliked === -1) {
      // sauce.likes +=
      usersLiked.push(userId);
    }
    if (alreadyLiked || alreadyDisliked >= 0) {
        (error) => {
          res.status(400).json({
            error: "You already evaluated this sauce!" 
          });
      }
    }
  }
  if (input = -1) {
    const alreadyLiked = usersLiked.includes(userId); 
    const alreadyDisliked = usersDisliked.includes(userId);
    if (alreadyLiked && alreadyDisliked === -1) {
      // sauce.disLikes +=
      usersDisliked.push(userId);
    }
    if (alreadyLiked || alreadyDisliked >= 0) {
        (error) => {
          res.status(400).json({
            error: "You already evaluated this sauce!" 
          });
      }
    }
  }
  if (input = 0) {
    const alreadyLiked = usersLiked.includes(userId); 
    const alreadyDisliked = usersDisliked.includes(userId);
    if (alreadyLiked && alreadyDisliked === -1) {
      (error) => {
        res.status(400).json({
          error: "You have not evaluated this sauce yet!" 
        });
    }
    if (alreadyLiked >= 0) {
      //sauce.likes -=
      //remove userId from array
    }
    if (alreadyDisliked >= 0) {
        //sauce.likes +=
        //remove userId from array
    }
    };
  } 

  // check if object is updated

  // POST object

  // catch 

}