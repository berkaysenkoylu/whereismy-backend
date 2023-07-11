require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req: any, res: any, next: any) => {
    try 
    {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.secret_key);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId, status: decodedToken.status };
        next();
    }
    catch (error) 
    {
        res.status(401).json({
            message: 'You are not authenticated'
        });
    }
}