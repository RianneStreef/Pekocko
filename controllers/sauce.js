const Sauce = require("../models/sauce");
const chalk = require("chalk");

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
  console.log(chalk.blue('modify sauce RUNNING'));
  
  const url = req.protocol + "://" + req.get("host");  

  const { name, manufacturer, description, mainPepper, heat } = req.body;

  let imageUrl;

  if (req.hasOwnProperty('file')) {
    imageUrl = url + '/images/' + req.file.filename;
  } 

  // why not if ....
  // let imageUrl = .. 

  const sauce = new Sauce({
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
    imageUrl,
  });

  console.log('Modified sauce' + sauce);

/* why does it add usersLiked but not likes?! Also imageUrl dislikes and userID
are missing */

  // sauce.name = name;
  // sauce.manufacturer = manufacturer;
  // sauce.description = description;
  // sauce.mainPepper = mainPepper;
  // sauce.heat = heat;
  // sauce.imageUrl = imageUrl ;
  
// do I need this? Why? I am creating an object ( just with missing info )

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


  // sauce.save();

  // Sauce.findOneAndUpdate({_id: req.params.id}, sauce).then(
  //   () => {
  //     res.status(201).json({
  //       message: 'Sauce updated successfully!'
  //     });
  //   }
  // ).catch(
  //   (error) => {
  //     res.status(400).json({
  //       error: error
  //     });
  //   }
  // );
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
// POST route, so get Sauce info and POST again? Of will that cause 
// duplicates

  Sauce.findOneAndUpdate({
    _id: req.params.id,
  })

  console.log(chalk.magenta('LIKE SAUCE'));
  console.log(chalk.magenta('----------'));
  console.log(chalk.magenta(req.body.like));

console.log(chalk.cyan('Sauce found'));
console.log(chalk.blue(Sauce));
// Get sauce object to use usersLiked

  const input = req.body.like;

  if (input === 1) {
    const alreadyLiked = usersLiked.includes(userId); 
    const alreadyDisliked = usersDisliked.includes(userId);
    if (alreadyLiked && alreadyDisliked === -1) {
    sauce.likes += 1;
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
  if (input === -1) {
    const alreadyLiked = usersLiked.includes(userId); 
    const alreadyDisliked = usersDisliked.includes(userId);
    if (alreadyLiked && alreadyDisliked === -1) {
      sauce.disLikes += 1;
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
  if (input === 0) {
    const alreadyLiked = usersLiked.includes(userId); 
    const alreadyDisliked = usersDisliked.includes(userId);
    if (alreadyLiked && alreadyDisliked === -1) {
      (error) => {
        res.status(400).json({
          error: "You have not evaluated this sauce yet!" 
        });
    }
    if (alreadyLiked >= 0) {
      sauce.likes -= 1;
      //remove userId from array - filter and only return the id that are not this one
      
    }
    if (alreadyDisliked >= 0) {
      sauce.likes -= 1;
        //remove userId from array
    }
    };
  } 

  // check if object is updated

  // POST object

  // catch 
}