import { ErrorType } from "../types";

const User = require('../models/user');
const Post = require('../models/post');

const utilityFunctions = require('../utils/utilityFunctions');

exports.getPostById = (req: any, res: any, next: any) => {
    Post.findOne({ where: { id: req.params.id }, include: User }).then((post: any) => {
        return res.status(200).json({
            message: "Post data has been fetched successfully!",
            post
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

exports.getAllPosts = (req: any, res: any, next: any) => {
    Post.findAll({ include: User }).then((posts: any) => {
        return res.status(200).json({
            message: "Posts data has been fetched successfully!",
            posts
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

exports.createPost = (req: any, res: any, next: any) => {
    const { userId } = req.userData;
    const { title, description, status, location, category } = req.body;
    const images = JSON.parse(req.body.images);
    const tags = JSON.parse(req.body.tags);

    Post.create({ title, description, status, tags, location, images, category, userId }).then((newPost: any) => {
        return res.status(201).json({
            message: "Post data has been created successfully!",
            postData: newPost
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

exports.editPost = (req: any, res: any, next: any) => {
    // Check authorization
    const { id } = req.params;

    Post.findByPk(id).then((fetchedPost: any) => {
        if (!fetchedPost) {
            let error: ErrorType = new Error();
            error.statusCode = 404;
            error.message = 'No such user was found!';

            return next(error);
        }

        const { userId } = req.userData;

        if (fetchedPost.userId !== userId) {
            let error: ErrorType = new Error();
            error.statusCode = 401;
            error.message = 'You are not authorized!';

            return next(error);
        }

        const { title, description, status, location, category } = req.body;
        const images = req.body.images && JSON.parse(req.body.images || '[]');
        const tags = req.body.tags && JSON.parse(req.body.tags || '[]');
        const formData = {
            title, description, status, location, category, images, tags
        };

        // Remove the empty fields
        let sanitizedFormData = utilityFunctions.removeUndefinedValuesFromObject(formData);

        fetchedPost.set({
            ...sanitizedFormData
        });

        return fetchedPost.save();
    }).then((result: any) => {
        return res.status(200).json({
            message: 'Post data has successfully been updated!',
            data: result
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

exports.deletePost = async (req: any, res: any, next: any) => {
    const { userId } = req.userData;

    try {
        const fetchedPost = await Post.findByPk(req.params.id);

        if (!fetchedPost) {
            let error: ErrorType = new Error();
            error.statusCode = 404;
            error.message = 'No such post was found!';

            return next(error);
        }

        if (userId !== fetchedPost.userId) {
            let error: ErrorType = new Error();
            error.statusCode = 404;
            error.message = 'This post doesn\'t belong to you!';

            return next(error);
        }

        fetchedPost.destroy().then(() => {
            return res.status(200).json({
                message: 'The post has been successfully removed',
                postId: req.params.id
            });
        }).catch((error: ErrorType) => {
            if(!error.statusCode) {
                error.statusCode = 500;
            }
    
            if(!error.message) {
                error.message = 'Something went wrong while deleting the post!';
            }
    
            next(error);
        });
    } catch (e) {
        return res.status(500).json({
            message: 'Something went wrong!'
        });
    }
}