const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const inputValidation = require('../utils/validateInput');
const utilityFunctions = require('../utils/utilityFunctions');
import type { ErrorType, UserType } from '../types';

// TODO Type tanımlamaları yapılmalı
exports.getUserById = async (req: any, res: any, next: any) => {
    const fetchedUser = await User.findOne({
        where: {
            id: req.params.id
        },
        attributes: {
            exclude: ['password', 'resetToken', 'resetTokenExpiration', 'createdAt', 'updatedAt']
        }
    });

    if(!fetchedUser) {
        let error: ErrorType = new Error();
        error.statusCode = 404;
        error.message = 'No such user was found!';

        return next(error);
    }

    return res.status(200).json({
        message: 'Users data has been fetched successfully!',
        user: fetchedUser
    });
}

// TODO Type tanımlamaları yapılmalı
exports.getAllUsers = (req: any, res: any, next: any) => {
    User.findAll({
        attributes: {
            exclude: ['password', 'resetToken', 'resetTokenExpiration']
        }
    }).then((result: UserType[]) => {
        return res.status(200).json({
            message: 'Users data has been fetched successfully!',
            users: result
        });
    }).catch((error: ErrorType) => {
        if(!error.statusCode) {
            error.statusCode = 500;
        }

        if(!error.message) {
            error.message = 'Something went wrong!';
        }

        next(error);
    });
}

// TODO Type tanımlamaları yapılmalı
exports.signup = async (req: any, res: any, next: any) => {
	const { firstname, lastname, username, email, password } = req.body;
    const formData = {
        firstname,
        lastname,
        username,
        email,
        password
    };

     // Check if anyfield is empty
     if(!inputValidation.isFieldNotEmpty(formData)) {
        let error: ErrorType = new Error();
        error.statusCode = 412;
        error.message = 'You cannot leave empty fields!';

        return next(error);
    }

    // Check if email is in a correct form
    if(!inputValidation.isEmail(req.body.email)) {
        let error: ErrorType = new Error();
        error.statusCode = 412;
        error.message = 'E-mail is not in a correct form!';

        return next(error);
    }

    // Check if any input field has non english characters
    if(inputValidation.includesNonEnglish(formData)) {
        let error: ErrorType = new Error();
        error.statusCode = 412;
        error.message = 'Make sure to use only english characters!';

        return next(error);
    }

    // Check if the password is in a correct form
    if(!inputValidation.isPasswordValid(req.body.password)) {
        let error: ErrorType = new Error();
        error.statusCode = 412;
        error.message = 'Make sure to enter a valid password!';

        return next(error);
    }

    const fetchedUser: UserType = await User.findOne({
        where: {
            email: email
        }
    });

    if(fetchedUser) {
        let error: ErrorType = new Error();
        error.statusCode = 400;
        error.message = 'Such an email already exists!';

        return next(error);
    }

    bcrypt.hash(password, 12).then((hashedPassword: string) => {
        return User.create({ firstname, lastname, username, email, password: hashedPassword });
    }).then((createdUser: any) => {
        const { password, city, avatarUrl, resetToken, resetTokenExpiration, ...otherAttr} = createdUser.dataValues;

        return res.status(201).json({
            message: 'User has been created successfully!',
            createdUser: otherAttr
        });
    }).catch((error: ErrorType) => {
        if(!error.statusCode) {
            error.statusCode = 500;
        }

        if(!error.message) {
            error.message = 'Something went wrong!';
        }

        next(error);
    });
}

exports.loginUser = (req: any, res: any, next: any) => {
    const { email, password } = req.body;
    const formData = {
        email, password
    };

    // Check if any form field is empty.
    if (!inputValidation.isFieldNotEmpty(formData)) {
        let error: ErrorType = new Error();
        error.statusCode = 412;
        error.message = 'You cannot leave empty fields!';

        return next(error);
    }

    let userData = {} as UserType;

    User.unscoped().findOne({
        where: {
            email: email
        }
    }).then((fetchedUser: UserType) => {
        if (!fetchedUser) {
            let error: ErrorType = new Error();
            error.statusCode = 400;
            error.message = 'Such a user doesn\'t exist! Please make sure to enter the credentials correctly!';

            return next(error);
        }

        userData = fetchedUser;

        return bcrypt.compare(password, userData?.password);
    }).then((passwordMatch: boolean) => {
        if (!passwordMatch) {
            let error: ErrorType = new Error();
            error.statusCode = 400;
            error.message = 'Wrong password! Please make sure to enter the credentials correctly!';

            return next(error);
        }

        const token = jwt.sign({ userId: userData.id, email: userData.email }, process.env.secret_key, { expiresIn: '1h' });
        
        return res.status(200).json({
            message: 'Successfully logged in!',
            userData: {
                id: userData.id,
                firstname: userData.firstname,
                lastname: userData.lastname,
                username: userData.username,
                email: userData.email,
                avatarUrl: userData.avatarUrl
            },
            expiresIn: '3600',
            token
        });
    }).catch((error: ErrorType) => {
        if(!error.statusCode) {
            error.statusCode = 500;
        }

        if(!error.message) {
            error.message = 'Something went wrong!';
        }

        next(error);
    });
}

exports.editUserProfile = (req: any, res: any, next: any) => {
    // Check authorization
    const { id } = req.params;
    const { userId } = req.userData;

    if (id !== userId) {
        let error: ErrorType = new Error();
        error.statusCode = 401;
        error.message = 'You are not authorized!';

        return next(error);
    }

    const { firstname, lastname, email, username, password, avatarUrl, city } = req.body;
    const formData = {
        firstname, lastname, email, username, password, avatarUrl, city
    };

    // Remove the empty fields
    let sanitizedFormData = utilityFunctions.removeUndefinedValuesFromObject(formData);

    if (!inputValidation.isFieldNotEmpty(sanitizedFormData)) {
        let error: ErrorType = new Error();
        error.statusCode = 412;
        error.message = 'You cannot leave empty fields!';

        return next(error);
    }

    User.findByPk(id).then(async (fetchedUser: UserType) => {
        if (!fetchedUser) {
            let error: ErrorType = new Error();
            error.statusCode = 404;
            error.message = 'No such user was found!';

            return next(error);
        }

        const { password } = sanitizedFormData;

        // Check if the user wants to change the password as well.
        if (password) {
            // Check if the password is in a correct form
            if(!inputValidation.isPasswordValid(password)) {
                let error: ErrorType = new Error();
                error.statusCode = 412;
                error.message = 'Make sure to enter a valid password!';

                console.log("ADASDASDASDASD")

                return next(error);
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            sanitizedFormData = {
                ...sanitizedFormData,
                password: hashedPassword
            };
        }

        fetchedUser?.set({
            ...sanitizedFormData
        });

        const result: UserType = await fetchedUser?.save();

        return res.status(200).json({
            message: 'User data has successfully been updated!',
            newUserData: {
                firstname: result.firstname,
                lastname: result.lastname,
                email: result.email,
                username: result.username,
                avatarUrl: result.avatarUrl,
                city: result.city
            }
        });
    }).catch((error: ErrorType) => {
        if(!error.statusCode) {
            error.statusCode = 500;
        }

        if(!error.message) {
            error.message = 'Something went wrong!';
        }

        next(error);
    });
}

// For account termination
exports.deleteUser = async (req: any, res: any, next: any) => {
    // Check authorization
    const { id } = req.params;
    const { userId } = req.userData;

    if (id !== userId) {
        let error: ErrorType = new Error();
        error.statusCode = 401;
        error.message = 'You are not authorized!';

        return next(error);
    }

    const result = await User.destroy({
        where: {
            id: id
        }
    });

    if (result === 1) {
        return res.status(200).json({
            message: 'The user has successfully deleted',
            terminateAccount: true
        });
    } else {
        return res.status(404).json({
            message: 'Failed to delete the user!',
            terminateAccount: false
        });
    }
}