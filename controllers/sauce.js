const Sauce = require("../models/sauce");
const chalk = require("chalk");

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      console.log('getAllSauces: Success');
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
  const sauceId = req.params.id;

  const host = req.protocol + '://' + req.get('host');

  let newObj = {};

  // Picture has changed
  if (req?.body?.sauce) {
    const parsedData = JSON.parse(req.body.sauce);
    const imageUrl = host + '/images/' + req.file.filename;
    newObj = {
      name: parsedData.name,
      manufacturer: parsedData.manufacturer,
      description: parsedData.description,
      mainPepper: parsedData.mainPepper,
      heat: parsedData.heat,
      userId: parsedData.userId,
      imageUrl,
    };

    // Picture hasn't changed
  } else {
    newObj = { ...req.body }; 
  }

  Sauce.findByIdAndUpdate(
    { _id: sauceId },
    { ...newObj },
    (err, updatedSauce) => {
      if (err) {
        console.log('ERROR');
      } else {
        res.status(201).json({
          message: 'Sauce successfully modified!',
        });
      }
    },
  );
}

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
  
const removeLike = (ID, usersLiked) => usersLiked.filter((likes) => likes !==ID);
const removeDislike = (ID, usersLiked) => usersLiked.filter((likes) => likes !==ID);

  exports.likeSauce = (req, res, next) => {
    const input = req.body.like;
    const ID = req.body.userId;  

    Sauce.findOne(
      {
        _id: req.params.id, 
      },
      (err, sauceFound) => {
        if (err) {
        // Error is found
        console.log(chalk.red.inverse('Error'), err);
        }
        else {
           const { usersLiked, usersDisliked} = sauceFound;
           let { likes, dislikes } = sauceFound;

           const alreadyLiked = usersLiked.includes(ID);
           const alreadyDisliked = usersDisliked.includes(ID);
         
          if (input === 1) {
            if (!alreadyLiked && !alreadyDisliked) {
            likes += 1;
            usersLiked.push(ID);
            sauceFound.likes = likes;

            sauceFound.save();
            res.status(201).json({
              message: 'Sauce successfully evaluated!',
              });
            }
          }
      
          if (input === -1) {
            if (!alreadyLiked && !alreadyDisliked) {
              dislikes += 1;
              usersDisliked.push(ID);
              sauceFound.dislikes = dislikes;
              sauceFound.save();
              res.status(201).json({
                message: 'Sauce successfully evaluated!',
              });
            }
          }
          if (input === 0 ) {          
            if (alreadyLiked) {
              likes -= 1;            
              const newUsersLiked = removeLike(ID, usersLiked);
    
              sauceFound.likes = likes;
              sauceFound.usersLiked = newUsersLiked;

              sauceFound.save();

              res.status(201).json({
                message: 'Like deleted!',
              });
            }
              if (alreadyDisliked) {
                dislikes -= 1;            
                const newUsersDisliked = removeDislike(ID, usersDisliked);
    
                sauceFound.dislikes = dislikes;
                sauceFound.usersDisliked = newUsersDisliked;

                sauceFound.save();

              res.status(201).json({
                message: 'Dislike deleted!',
              });
            
            }; 
          }
        }
      }
    )          
}     
 
