const Sauce = require('../models/sauce');
const chalk = require('chalk');
const url = require('url');
const e = require('express');
const { isWorker } = require('cluster');

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
    { _id: sauceId },
    { ...newObj },
    (err, updatedSauce) => {
      if (err) {
        console.log('ERROR');
      } else {
        console.log('Changed sauce:');
        console.log(updatedSauce);
        res.status(201).json({
          message: 'Sauce successfully modified!',
        });
      }
    },
  );
};

const removeLike = (ID, usersLiked) =>
  usersLiked.filter((likes) => likes !== ID);

// OLD FUNCTION CONVERTED TO ARROW FUNCTION
/*
function removeLike(ID, usersLiked) {
  // const { usersLiked, usersDisliked, userId } = sauceFound;

  console.log(chalk.magenta('usersLiked in function ' + usersLiked));

  return  usersLiked.filter((likes) => likes !== ID);


  // console.log({newUsersLiked});
}
*/

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
  const input = req.body.like;
  const ID = req.body.userId;

  console.log(chalk.magenta.inverse('current userID ' + ID));

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

        const { usersLiked, usersDisliked, userId } = sauceFound;
        let { likes, dislikes } = sauceFound;
        console.log(chalk.magenta('usersLiked in the beginning ' + usersLiked));
        console.log(chalk.magenta('type of usersLiked ' + typeof usersLiked));

        const alreadyLiked = usersLiked.includes(ID);
        const alreadyDisliked = usersDisliked.includes(userId);

        console.log({ input });

        if (input === 1) {
          console.log('Liked is 1');
          console.log({ alreadyLiked, alreadyDisliked });
          if (!alreadyLiked && !alreadyDisliked) {
            console.log('Both alreadyLiked and alreadyDisliked false');
            likes += 1;
            usersLiked.push(ID);
            console.log('Sauce liked!', likes);
            sauceFound.likes = likes;
            sauceFound.save();
            res.status(201).json({
              message: 'Sauce successfully evaluated!',
            });
          }
          if (alreadyLiked || alreadyDisliked) {
            console.log('alreadyLiked or alreadyDisliked true');
            res.status(201).json({
              message: 'Sauce already evaluated!',
            });
          }
        }

        if (input === -1) {
          console.log('Liked is -1');
          console.log({ alreadyLiked, alreadyDisliked });
          if (!alreadyLiked && !alreadyDisliked) {
            console.log('Both alreadyLiked and alreadyDisliked false');
            dislikes += 1;
            usersDisliked.push(ID);
            console.log('Sauce disliked!', dislikes);
            sauceFound.dislikes = dislikes;
            sauceFound.save();
            res.status(201).json({
              message: 'Sauce successfully evaluated!',
            });
          }
          if (alreadyLiked || alreadyDisliked) {
            console.log('error');
            (err) => {
              // I changed this error -> res (error was in grey)
              res.status(400).json({
                error: `You already evaluated this sauce!: ${err}`,
              });
            };
          }
        }
        if (input === 0) {
          console.log('deleting like/dislike');
          console.log({ alreadyLiked });
          console.log({ alreadyDisliked });

          // Rianne pointed out that this won't be running
          /* if (!alreadyLiked && !alreadyDisliked) {
            (error) => {
              res.status(400).json({
                error: 'You have not evaluated this sauce yet!' + error,
              });
              //This is not possible? It will only send a 0 if already like, the only reason to include this, is to for see errors
            };
          } */
          if (alreadyLiked) {
            console.log('deleting like');
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
            console.log('deleting dislike');

            dislikes -= 1;
            //remove userId from array
            sauceFound.dislikes = dislikes;
            sauceFound.save();
            res.status(201).json({
              message: 'Dislike deleted!',
            });
          }
        }
      }
    },
  );
};
