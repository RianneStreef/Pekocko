const Sauce = require('../models/sauce');
const chalk = require('chalk');
const url = require('url');
const e = require('express');

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
  const url = req.protocol + '://' + req.get('host');
  const {
    userId,
    name,
    manufacturer,
    description,
    mainPepper,
    heat,
  } = JSON.parse(req.body.sauce);

  const imageUrl = url + '/images/' + req.file.filename;

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
        message: 'Post saved successfully!',
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
  console.log(chalk.blue('--------------------------'));

  // // Get sauce id from URL
  const sauceId = req.originalUrl.substring(
    req.originalUrl.lastIndexOf('/') + 1,
  );

  // req.body
  //   /--> req.body.sauce
  // --
  //   \--> req.body

  // 1. Define our variables so we can set them
  // 2. Figure out if image uploaded or not
  // 2.1 If image is upload, parse it
  // 2.2 If no image, then use as-is
  // 3. Find the sauce we want to update
  // 4. Update the sauce
  // 5. Send back the request and also deal with errors

  const host = req.protocol + '://' + req.get('host');

  // Create obj so we can use it throughout the function.
  let newObj = {};

  // Picture has changed
  if (req?.body?.sauce) {
    console.log(chalk.red.inverse('NEW IMAGE'));
    const parsedData = JSON.parse(req.body.sauce);
    const imageUrl = host + '/images/' + req.file.filename;
    // Create an object with all of the data
    newObj = {
      name: parsedData.name,
      manufacturer: parsedData.manufacturer,
      description: parsedData.description,
      mainPepper: parsedData.mainPepper,
      heat: parsedData.heat,
      userId: parsedData.userId,
      imageUrl,
    };
    console.log('new object = ' + newObj);

    // Picture hasn't changed
  } else {
    // No need to do anything with the data since it's already parsed for us.
    console.log(chalk.red.inverse('NO IMAGE'));
    newObj = { ...req.body }; // Spread out to create copy of object. No mutation
    console.log('new object = ' + newObj);
  }

  // We aren't creating a new sauce so don't create a new one like this.
  //    This would be if you were going to add a new sauce to the db.
  // const sauce = new Sauce({ ...newObj });

  Sauce.findByIdAndUpdate(
    { _id: sauceId }, // Filter
    { ...newObj }, // What's getting updated
    (err, updatedSauce) => {
      // Callback
      if (err) {
        console.log('ERROR');
      } else {
        console.log('Changed sauce:');
        console.log(updatedSauce);
      }
    },
  );
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

exports.likeSauce = (req, res, next) => {
  // // POST route, so get Sauce info and POST again? Of will that cause
  // // duplicates

  const input = req.body.like;

  Sauce.findOne(
    {
      _id: req.params.id, // Filter
    },
    (err, sauceFound) => {
      if (err) {
        // Error is found
        console.log(chalk.red.inverse('Error'), err);
      } else {
        // Found sauce
        console.log(chalk.inverse('Sauce found:'));
        console.log(sauceFound);
        // // Get sauce object to use usersLiked

        const input = req.body.like;

        const { usersLiked, usersDisliked, userId } = sauceFound;
        let { likes, dislikes } = sauceFound;

        const alreadyLiked = usersLiked.includes(userId);
        const alreadyDisliked = usersDisliked.includes(userId);

        if (input === 1) {
          console.log('Liked is 1');
          console.log({ alreadyLiked, alreadyDisliked });
          if (!alreadyLiked && !alreadyDisliked) {
            console.log('Both alreadyLiked and alreadyDisliked === -1');
            likes += 1;
            usersLiked.push(userId);
            console.log('Sauce liked!', likes);
            sauceFound.likes = likes;
            sauceFound.save();
            res.status(201).json({
              message: 'Sauce successfully evaluated!',
            });
          }
          if (alreadyLiked >= 0 || alreadyDisliked >= 0) {
            (error) => {
              console.log('Both alreadyLiked and alreadyDisliked >= 0');
              res.status(400).json({
                error: 'You already evaluated this sauce!',
              });
            };
          }
        }
        if (input === -1) {
          console.log('Liked is -1');
          if (alreadyLiked === -1 && alreadyDisliked === -1) {
            sauce.disLikes += 1;
            usersDisliked.push(userId);
          }
          if (alreadyLiked >= 0 || alreadyDisliked >= 0) {
            (error) => {
              res.status(400).json({
                error: 'You already evaluated this sauce!',
              });
            };
          }
        }
      }
    },
  );

  console.log(chalk.magenta('LIKE SAUCE'));
  console.log(chalk.magenta('----------'));
  console.log(chalk.magenta(input));

  // if (input === 0) {
  //   const alreadyLiked = usersLiked.includes(userId);
  //   const alreadyDisliked = usersDisliked.includes(userId);
  //   if (alreadyLiked && alreadyDisliked === -1) {
  //     (error) => {
  //       res.status(400).json({
  //         error: "You have not evaluated this sauce yet!"
  //       });
  //   }
  //   if (alreadyLiked >= 0) {
  //     sauce.likes -= 1;
  //     //remove userId from array - filter and only return the id that are not this one

  //   }
  //   if (alreadyDisliked >= 0) {
  //     sauce.likes -= 1;
  //       //remove userId from array
  //   }
  //   };
  // }

  /* const likedSauce = {
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
  };
  likedSauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Sauce successfully evaluated!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    }); */

  // check if object is updated

  // POST object

  // catch
};
