module.exports = (error: any, req: any, res: any, next: any) => {
    const status = error.statusCode || 500;
    const message = error.message;

    res.status(status).json({
        message: message,
        error: error
    });
}