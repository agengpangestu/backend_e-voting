const fs = require('fs');

const prisma = require("../database/prisma");

const bcrypt = require('bcrypt');

const User = prisma.user;
const salt = 14;
class UserController {
    async Get(req, res, next) {
        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 6,
            sortByCreated = req.query.sortByCreated,
            sortByName = req.query.sortByName,
            role = req.query.role
        } = req.query;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        // (role !== "PEMILIH" && role !== "ADMIN")

        // ? res.status(400).json({ message: "Roles that don't exist", status: 400 })

        // : 
        await User.findMany({
            where: {
                role: role
            },
            orderBy: {
                createdAt: sortByCreated,
                fullName: sortByName,
            },
            take: limitOfNumber,
            skip: offset,
        })
            .then(async (users) => {
                const countAllPages = await User.count();
                const countWithRole = await User.count({
                    where: {
                        role: role
                    }
                });

                const totalPages = Math.ceil(countAllPages / limitOfNumber);
                const totalPagesROLE = Math.ceil(countWithRole / limitOfNumber);
                const currentPage = page ? +page : 0;

                res.json({
                    message: "OK",
                    currentPage: currentPage,
                    countAllPages: countAllPages,
                    countROLE: countWithRole,
                    page: pageOfNumber,
                    totalPages: totalPages,
                    totalPagesROLE: totalPagesROLE,
                    data: users,
                })
            }).catch((err) => {
                next(err);
            });
    };

    async Post(req, res, next) {
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/identity_cards/${req.file === undefined ? "" : req.file.filename}`;
        const { username, password, email, role, fullName, age, identityNumber } = req.body;

        const generatedSalt = await bcrypt.genSalt(salt);

        const hashPassword = await bcrypt.hash(password, generatedSalt);

        await User.create({
            data: {
                username: username,
                password: hashPassword,
                email: email,
                role: role,
                fullName: fullName,
                age: parseInt(age),
                identityNumber: parseInt(identityNumber),
                identityPicture: dirPath
            }
        })
            .then((created) => {
                console.log(created);
                return res
                    .status(201)
                    .json({
                        message: "Created",
                        status: 201
                    })
            }).catch((err) => {
                next(err);
            });
    };

    async GetByID(req, res, next) {
        const { id } = req.params;

        await User.findUnique({
            where: {
                id: parseInt(id)
            }
        }).then((result) => {
            if (!result) return res
                .status(404)
                .json({
                    message: "User not found",
                    status: 404
                })

            return res
                .status(200)
                .json({ message: "OK", data: result });
        }).catch((err) => {
            next(err);
        });
    };

    async Update(req, res, next) {
        const { id } = req.params;
        const { username, password, email, role, fullName, age, identityNumber, newPassword } = req.body;
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/identity_cards/${req.file === undefined ? "" : req.file.filename}`;

        let identityPicture = null;

        const checkUser = await User.findUnique({
            where: { id: parseInt(id) }
        });

        if (!checkUser) return res
            .status(404)
            .json({
                message: "User Not Found",
                status: 404
            });

        // const checkPw = await bcrypt.compare(password, checkUser.password);

        // if (!checkPw) return res.status(400).json({ message: "Password Lama Salah", status: 400 });

        if (req.file) {
            identityPicture = dirPath;
            const rmvFromDir = checkUser.identityPicture.replace(`${req.protocol}://${req.get('host')}/`, "");
            fs.unlink(rmvFromDir, (err) => {
                console.log(err);
            })
        } else {
            identityPicture = checkUser.identityPicture;

            // const generatedSalt = await bcrypt.genSalt(salt);

            // const hashPassword = await bcrypt.hash(newPassword, generatedSalt);
        };
        await User.update({
            where: {
                id: parseInt(id)
            }, data: {
                // username: username,
                // password: hashPassword,
                email: email,
                role: role,
                fullName: fullName,
                age: parseInt(age),
                identityNumber: parseInt(identityNumber),
                identityPicture: identityPicture
            }
        })
            .then((updated) => {

                if (updated) return res
                    .status(200)
                    .json({
                        message: "OK", data: updated
                    });
            }).catch((err) => {
                next(err);
            });
    }

    async Deleted(req, res, next) {
        const { id } = req.params;

        const checkUser = await User.findUnique({ where: { id: parseInt(id) } });
        const rmvFromDir = checkUser.identityPicture.replace(`${req.protocol}://${req.get('host')}/`, "");

        if (!checkUser) return res
            .status(404)
            .json({
                message: "User Not Found",
                status: 404
            });
        else
            fs.unlink(rmvFromDir, (err) => {
                console.log(err);
            });
        await User.delete({
            where: { id: parseInt(id) }
        })
            .then((result) => {
                return res.status(200).json({ message: "OK", status: 200 })
            }).catch((err) => {
                console.log(err);
                next(err);
            });
    };
};


module.exports = new UserController();