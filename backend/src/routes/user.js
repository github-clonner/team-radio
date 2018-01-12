import jwt from 'jsonwebtoken';
import User from '../models/user';
import authController from '../controllers/auth';
import * as userController from '../controllers/user';
import * as stationController from '../controllers/station';

export default router => {
  router.post('/signup', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        res.status(400).json({ message: 'This email has already been taken.' });
      } else {
        const newUser = await userController.createUser(
          req.body.email,
          req.body.password,
          req.body.name,
        );

        const payload = {
          email: newUser.email,
          name: newUser.name,
          userId: newUser._id,
        };
        const token = jwt.sign(payload, req.app.get('superSecret'), {
          expiresIn: 604800,
        });
        res.json({
          message: 'signup success',
          token: token,
          userId: newUser._id,
          name: newUser.name,
          avatar_url: newUser.avatar_url,
          username: newUser.username,
        });
      }
    } catch (err) {
      throw err;
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Incorrect email or password',
        });
      } else if (user) {
        if (!user.validPassword(req.body.password)) {
          res.status(401).json({
            success: false,
            message: 'Incorrect email or password',
          });
        } else {
          const payload = {
            email: user.email,
            name: user.name,
            userId: user._id,
          };

          const token = jwt.sign(payload, req.app.get('superSecret'), {
            expiresIn: 604800,
          });
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            userId: user._id,
            name: user.name,
            avatar_url: user.avatar_url,
            username: user.username,
          });
        }
      }
    } catch (err) {
      throw err;
    }
  });
  router.post('/signupWithSocialAccount', async (req, res) => {
    try {
      const user = await userController.createUserWithSocialAccount(
        req.body.email,
        req.body.googleId,
        req.body.facebookId,
        req.body.avatar_url,
        req.body.name,
      );
      const payload = {
        email: user.email,
        name: user.name,
        userId: user._id,
      };
      const token = jwt.sign(payload, req.app.get('superSecret'), {
        expiresIn: 604800,
      });
      res.json({
        message: 'signup success',
        token: token,
        userId: user._id,
        googleId: user.google_id,
        facebookId: user.facebook_id,
        name: user.name,
        avatar_url: user.avatar_url,
        username: user.username,
      });
    } catch (err) {
      throw err;
    }
  });

  router.post('/isExistUser', async (req, res) => {
    try {
      const alreadyUser = await User.getUserByEmail(req.body.email);
      if (alreadyUser) res.json({ data: { isExist: true } });
      else res.json({ data: { isExist: false } });
    } catch (err) {
      throw err;
    }
  });

  router.post('/isExistUsername', async (req, res) => {
    try {
      const alreadyUser = await User.getUserByUsername(req.body.username);
      if (alreadyUser) res.json({ data: { isExist: true } });
      else res.json({ data: { isExist: false } });
    } catch (err) {
      throw err;
    }
  });

  router.post('/isVerifidedToken', (req, res) => {
    try {
      const token = req.body.token;
      if (token) {
        // verifies secret and checks exp
        jwt.verify(token, req.app.get('superSecret'), async (err, decoded) => {
          if (err) {
            return res.status(400).json({ tokenError: 'Verify token failed.' });
          }
          const user = await userController.getUserById(decoded.userId);
          const userRes = { ...user._doc, userId: user._id };
          return res.json(userRes);
          // return res.json(decoded);
        });
      } else {
        return res.status(400).json({ tokenError: 'No token provided.' });
      }
    } catch (err) {
      throw err;
    }
  });

  router.get('/Profile/:username', async (req, res) => {
    // INPUT  : req.headers['access-token'], req.params.username
    // OUTPUT :
    // Return res.json({
    //     message: 'Success',
    //     isOwner: isOwner,  true if return user have userId match with userId in token
    //                        false if invalid token or return user have userId not match with userId in token
    //     user: user,
    // }); if username is exist
    // Return res.json({
    //     message: 'User not found!',
    // }); if username is not exist
    try {
      const user = await userController.getUserProfile(req.params.username);
      const token = req.headers['access-token'];
      if (user) {
        // verify token
        const isOwner = await userController.isVerifidedToken(
          user._id.toString(),
          token,
          req.app.get('superSecret'),
        );
        return res.json({
          message: 'Success',
          isOwner: isOwner,
          user: user,
        });
      }
      return res.json({
        message: 'User not found!',
      });
    } catch (err) {
      throw err;
    }
  });

  router.post('/setAvatar', async (req, res) => {
    // INPUT  : req.headers['access-token'], req.body.userId, req.body.avatar_url
    // OUTPUT :
    // Return res.json({
    //     message: 'Success',
    //     user: user,
    // }); if updating success
    // Return res.json({
    //     message: 'Can not update avatar!',
    // }); if updating fail
    try {
      let user = await userController.getUserById(req.body.userId);
      const token = req.headers['access-token'];
      if (user) {
        // verify token
        const isOwner = await userController.isVerifidedToken(
          user._id.toString(),
          token,
          req.app.get('superSecret'),
        );
        if (isOwner) {
          user = await userController.setAvatar(
            req.body.userId,
            req.body.avatar_url,
          );
          return res.json(user);
        }
      }
      return res.json({
        message: 'Can not update avatar!',
      });
    } catch (err) {
      throw err;
    }
  });

  router.post('/setUsername', async (req, res) => {
    // INPUT  : req.headers['access-token'], req.body.userId, req.body.username
    // OUTPUT :
    // Return res.json({
    //     message: 'Success',
    //     user: user,
    // }); if updating success
    // Return res.json({
    //     message: 'Can not update username!',
    // }); if updating fail
    try {
      let user = await userController.getUserById(req.body.userId);
      const AlreadyUser = await userController.getUserProfile(
        req.body.username,
      );
      const token = req.headers['access-token'];
      if ((!AlreadyUser || AlreadyUser.username === user.username) && user) {
        const isOwner = await userController.isVerifidedToken(
          user._id.toString(),
          token,
          req.app.get('superSecret'),
        );
        if (isOwner) {
          user = await userController.setUsername(
            user.email,
            req.body.username,
          );
          return res.json({
            message: 'Success',
            ...user._doc,
            userId: user._id,
          });
        }
      }
      return res.json({
        message: 'Can not update username!',
      });
    } catch (err) {
      throw err;
    }
  });

  router.post('/updatePassword', async (req, res) => {
    // INPUT  : req.headers['access-token'], req.body.userId, req.body.oldPassword, req.body.newPassword
    // OUTPUT :
    // Return res.json({
    //     message: 'Success',
    // }); if updating success
    // Return res.json({
    //     message: 'Old password is wrong!',
    // }); if password not true
    // Return res.json({
    //     message: 'Can not update password!',
    // }); if password not true
    try {
      let user = await User.findOne({ _id: req.body.userId });
      const token = req.headers['access-token'];
      if (user) {
        const isOwner = await userController.isVerifidedToken(
          user._id.toString(),
          token,
          req.app.get('superSecret'),
        );
        if (isOwner) {
          if (user.password && !user.validPassword(req.body.oldPassword)) {
            return res.json({
              message: 'Old password is wrong!',
            });
          }
          await userController.setPassword(
            user.email,
            user.generateHash(req.body.newPassword),
          );
          user = await User.findOne({ _id: req.body.userId });
          return res.json({
            message: 'Success',
            ...user._doc,
            userId: user._id,
          });
        }
      }
      return res.json({
        message: 'Can not update password!',
      });
    } catch (err) {
      throw err;
    }
  });

  router.get('/stations/getstationbyadded/:user_id', async (req, res) => {
    const stations = await stationController.getListStationUserAddedSong(
      req.params.user_id,
    );
    res.json({
      message: 'Success',
      stations: stations,
    });
  });

  router.get('/stations/getstationbyuserid/:user_id', async (req, res) => {
    const stations = await stationController.getStationsByUserId(
      req.params.user_id,
    );
    res.json({
      message: 'Success',
      stations: stations,
    });
  });
  //router.use(authController);

  // test function *************************************
  router.get('/', (req, res) => {
    res.json({ message: 'Welcome to the coolest API on earth!' });
  });
};
