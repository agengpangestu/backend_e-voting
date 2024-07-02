const { Prisma } = require("@prisma/client");
const multer = require("multer");

const ErrorHandler = (err, req, res, next) => {
    console.log(err);

    if (err instanceof TypeError) {
        return res.json({
            name: err.name,
            message: err.message,
            stack: err.stack
        });
    }

    if (err instanceof Prisma.PrismaClientValidationError) {
        return res.status(400).json({
            name: err.name,
            messsage: `Validation Error: ${err.message}`,
            stack: err.stack
        });
    }

    if (err instanceof Prisma.PrismaClientInitializationError)
        return res.status(err.errorCode).json({
            name: err.name,
            message: `Initialization Error: ${err.message}`,
            stack: err.stack,
            retryable: err.retryable

        })

    if (err instanceof Prisma.PrismaClientKnownRequestError)
        res.status(400).json({
            name: err.name,
            message: `Know Req Error: ${err.message}`,
            stack: err.stack,
            meta: err.meta
        })

    if (err instanceof Prisma.PrismaClientRustPanicError)
        res.status(400).json({
            name: err.name,
            message: `Rust Panic Error: ${err.message}`,
            stack: err.stack
        })

    if (err instanceof Prisma.PrismaClientUnknownRequestError)
        res.status(400).json({
            name: err.name,
            message: `Unknow Req Error: ${err.message}`,
            stack: err.stack
        })

        //this for catch error multer
    if (err) {
        return res
            .status(400)
            .json({
                name: err.name,
                message: err.message,
                stack: err.stack
            })
    }

    const statusCode = err.statusCode || 500;
    const errMsg = err.messsage || "Something went wrong";

    return res
        .status(statusCode)
        .json({
            success: false,
            status: statusCode,
            messsage: errMsg,
            stack: process.env.NODE_ENV === 'development' ? err.stack : {}
        });
};

module.exports = ErrorHandler;