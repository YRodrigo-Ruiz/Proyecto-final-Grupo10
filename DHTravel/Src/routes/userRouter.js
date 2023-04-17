const express = require('express');
const path = require('path');
const userRouter = express.Router();
const userController = require('../controller/userController');
const multer = require('multer');
const { body } = require('express-validator');

const registerValidation = require('../middlewares/registerValidationMiddleware');
const loginValidation = require('../middlewares/loginValidateMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const authMiddleware = require('../middlewares/authentificationMiddleware');

const storage = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, path.join(__dirname, '../../public/img/users'))
    },
    filename: (req, file, cb) => {
        const newUserAvatar = `user-${Date.now()}_img${path.extname(file.originalname)}`
        cb(null,newUserAvatar);
    }
});

const upload = multer({storage});

userRouter.get('/users/listall', userController.getAllUsers);
userRouter.get('/user/:id', userController.getUser);

userRouter.get('/user/:id/edit', userController.getUserEdit);
userRouter.put('/user/:id/edit',upload.single('image'), userController.userEdit);

// userRouter.get('/user/:id/delete', userController.getUserEdit);
userRouter.delete('/user/:id', userController.userDelete);

userRouter.get('/register', guestMiddleware, userController.register);
userRouter.post('/register',upload.single('userImage'), registerValidation, userController.registerPost);

userRouter.get('/login',guestMiddleware, userController.login);
userRouter.post('/login',loginValidation, userController.loginPost);

userRouter.get('/profile',authMiddleware, userController.profile);
userRouter.get('/profile/edit',authMiddleware, userController.getProfile);
userRouter.put('/profile/:id/edit',authMiddleware,upload.single('image'), userController.profileEdit);

userRouter.get('/profile/logout/', userController.logout);

module.exports = userRouter;