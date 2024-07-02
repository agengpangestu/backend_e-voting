const prisma = require("../database/prisma");

const User = prisma.user;
const CheckWhoCreated = async (req, res, next) => {
    const userID = req.body.createdBy;
    console.log(userID);

    await User.findUnique({
        where: {
            id: parseInt(userID)
        }
    }).then((aUser) => {
        (!aUser)
            ? res
                .status(404)
                .json({
                    message: "User Not Found",
                    status: 404
                })
            : (aUser.role !== "ADMIN")
                ? res.status(400).json({
                    message: "You dont have access",
                    status: 401
                })
                : next();
    })
};

module.exports = { CheckWhoCreated };