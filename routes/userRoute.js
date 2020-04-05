const {Router} = require('express');
const User = require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = Router();

// router.put('/address', (req, res) => {
//     try {
//         const token = req.headers.token;
//         jwt.verify(token, 'secretkey', async (err, decoded) => {
//             if (err) return res.status(401).json({ title: "error" });
//             await User.findByIdAndUpdate({ _id: decoded.userId }, {
//                 country: req.body.country,
//                 city: req.body.city,
//                 address: req.body.address,
//                 phonenumber: req.body.phonenumber,
//                 cityIndex: req.body.cityIndex
//             });
//             return res.status(200).json({ title:  'Updated'});
//         });
//     } catch (e) {
//         console.log(e);
//     }
// });

router.put('/edit', (req, res) => {
  try {
    if (!req.body.name || !req.body.surname) {
      return res.status(401).json({title: 'Name, Surname must not be empty'});
    }
    const token = req.headers.token;
    jwt.verify(token, 'secretkey', async (err, decoded) => {
      if (err) return res.status(401).json({title: "error"});
      await User.findByIdAndUpdate({_id: decoded.userId}, {
        name: req.body.name,
        surname: req.body.surname,
        gender: req.body.gender,
        country: req.body.country || '',
        city: req.body.city || '',
        address: req.body.address || '',
        phonenumber: req.body.phonenumber || '',
        cityIndex: req.body.cityIndex || ''
      });
      return res.status(200).json({title: 'Updated'});
    });
  } catch (e) {
    console.log(e);
  }
});

router.get('/user', (req, res, next) => {
  try {
    const token = req.headers.token;  // token which returned from frontend
    jwt.verify(token, 'secretkey', async (err, decoded) => {
      if (err) return res.status(401).json({
        title: 'unauthorized'
      });
      await User.findOne({_id: decoded.userId}, (err, user) => {
        if (err) return console.log(err);
        return res.status(200).json({
          user
        });
      });
    })
  } catch (e) {
    console.log(e);
  }
});

//REGISTRATION
router.post('/signup', async (req, res, next) => {
  try {
    await User.findOne({email: req.body.email}, async (err, user) => {
      if (err) return res.status(500).json({error: 'server error'});
      if (!req.body.name || !req.body.email || !req.body.surname || !req.body.password || !req.body.gender) {
        return res.status(401).json({error: 'All fields must not be empty'})
      }
      if (user) {
        return res.status(401).json({error: 'User with that email already exist'})
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        surname: req.body.surname,
        password: hashPassword,
        gender: req.body.gender,
        country: '',
        city: '',
        address: '',
        phonenumber: '',
        cityIndex: '',
        googleId: '',
        cart: {items: []},
        liked: {items: []}
      });
      await newUser.save();
      return res.status(200).json({title: 'success'});
    });
  } catch (e) {
    console.log(e);
  }
});

//AUTH
router.post('/login', async (req, res, next) => {
  await User.findOne({email: req.body.email}, (err, user) => {
    if (err) return res.status(500).json({
      title: 'server error',
      error: err
    });
    if (!req.body.email || !req.body.password) {
      return res.status(401).json({error: 'Fields must not be empty'});
    }
    if (!user) {
      return res.status(401).json({error: 'Invalid password or Email'});
    }
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json({error: 'Invalid password or Email'});
    }

    // if all is good then ...
    //create a token and send it to frontend...
    let token = jwt.sign({userId: user._id}, 'secretkey');
    return res.status(200).json({
      title: 'Login success',
      token: token
    });
  });
});

module.exports = router;