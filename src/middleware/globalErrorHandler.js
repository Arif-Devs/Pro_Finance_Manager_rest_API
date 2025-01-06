export const notFoundHandler = (_req, _res, next) => {
    const error = new Error('404 Not Found')
    error.status = 404
    next(error)
};

export const globalErrorHandler = (error, _req, res, _next) => {
    if (error.status) {
        return res.status(error.status).json({
            message: error.message
        })
    } else {
        return res.status(500).json({ message: error.message })
    }
};
