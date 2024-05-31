// Not Found

const notFound = (req, res, next) =>{
    const error = new Error('Not Found : ${req.originalURI}');
    res.status(404);
    next(error)
};

//Error Handler

const errorHandler = (err, req, res, next) =>{
    const statuscode = res.statusCode == 200 ? 500 : res.statusCode;;
    res.status(statuscode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = {errorHandler, notFound};