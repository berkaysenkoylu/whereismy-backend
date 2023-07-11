const User = require('../models/user');

exports.signup = (req: any, res: any, next: any) => {
	const { firstname, lastname, username, email, password } = req.body;

	// TODO: The password will be hashed.
	User.create({ firstname, lastname, username, email, password }).then((result: any) => {
		return res.status(201).json({
            message: "User has been created successfully!",
            result: {
				firstname, lastname, username, email
			}
        });
	}).catch((error: any) => {
        if(!error.statusCode) {
            error.statusCode = 500;
        }

        if(!error.message) {
            error.message = 'Something went wrong!';
        }

        next(error);
    });
}