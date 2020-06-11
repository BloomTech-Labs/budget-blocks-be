const router = require('express').Router();
const dataBase = require('./okta-model');

// SECTION Middleware
const requireAuthentication = require('./middleware/require_authentication');
const { response } = require('express');
const { route } = require('../plaid/plaidRouter');

// SECTION GET -- Get All Users
router.get('/users', requireAuthentication, (req, res) => {
  dataBase
    .findAllUsers()
    .then((users) => {
      res.status(200).json({ data: users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// SECTION POST - Add User
// Send Only Full Name & E-mail
// FIXME Needs to have more descriptive errors for missing fields
// FIXME May need to include the access token from plaid IF user exists
router.post('/users', requireAuthentication, (req, res) => {
  const oktaInfo = req.body;
  const userInfo = {
    name: oktaInfo.name,
    email: oktaInfo.email,
  };
  // console.log('email: ', userInfo.email);
  // console.log('name: ', userInfo.name);
  // const email = userInfo.email;

  dataBase
    .findUserByEmail(userInfo.email)
    .then((user) => {
      if (user === undefined) {
        dataBase
          .addUser(userInfo)
          .then((user) => {
            res.status(201).json({ data: user, message: 'User created.' });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
            console.log(err.message);
          });
      } else {
        res
          .status(200)
          .json({ data: user, message: 'User already exists.' });
      }
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ error: err.message });
    });
});

// SECTION DELETE - Delete User
router.delete('/users', requireAuthentication, (req, res) => {
  const email = req.body.email;

  dataBase
    .deleteUser(email)
    .then(() => {
      res.status(200).json({ message: 'User successfully deleted!' });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

// SECTION PUT - Update User
router.put('/users/:userId', requireAuthentication, (req, res) => {
  const userId = req.params.userId;
  const { city, state, onboarding_complete } = req.body;

  dataBase
    .updateUser(city, state, onboarding_complete, userId)
    .then((response) => {
      res.status(200).json({ data: response[0] });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

///////////////////////////////////////////
///////////TEST ENDPOINTS//////////////////
// router.get('/users/:email', (req, res) => {
//   const email = req.params.email;

//   dataBase
//     .findUserByEmail(email)
//     .then((response) => {
//       res.status(200).json({ data: response });
//       console.log(response);
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// });

// router.post('/users/test', (req, res) => {
//   const userInfo = req.body;

//   dataBase
//     .addUser(userInfo)
//     .then((response) => {
//       res.status(201).json({ data: response });
//     })
//     .catch((err) => {
//       res.status(500).json({ error: err.message });
//     });
// });

module.exports = router;

// router.post('/users', requireAuthentication, (req, res) => {
//   const oktaInfo = req.body;
//   const userInfo = {
//     name: oktaInfo.name,
//     email: oktaInfo.email,
//   };
//   console.log('email: ', userInfo.email);
//   console.log('name: ', userInfo.name);
//   // const email = userInfo.email;

//   dataBase
//     .findUserByEmail(userInfo.email)
//     .then((user) => {
//       if(user === undefined){

//       }
//       console.log('findBy:', user);
//       if (Object.keys(user).length > 0) {
//         res
//           .status(200)
//           .json({ data: user, message: 'User already exists.' });
//       } else {
//         dataBase
//           .addUser(userInfo)
//           .then((user) => {
//             console.log('add:', user);
//             res.status(201).json({ data: user, message: 'User created.' });
//           })
//           .catch((err) => {
//             res.status(500).json({ error: err.message });
//             console.log(err.message);
//           });
//       }
//     })
//     .catch((err) => {
//       console.log(err.message);
//       res.status(500).json({ error: err.message });
//     });
// });
