const prisma = require("../database/prisma");

const Identity_Verif = prisma.identity_Verif;

class IdentityVerifController {
    async Get(req, res, next) {

        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 20,
            sortByCreated = req.query.sortByCreated,
        } = req.query;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit),
            offset = (pageOfNumber - 1) * limitOfNumber;

        await Identity_Verif.findMany({
            orderBy: {
                createdAt: sortByCreated
            },
            take: limitOfNumber,
            skip: offset
        })
            .then(async (result) => {
                const countAllPages = await Identity_Verif.count();

                const totalPages = Math.ceil(countAllPages / limitOfNumber),
                    currentPage = page ? +page : 0;

                return res
                    .status(200)
                    .json({
                        message: "OK",
                        status: 200,
                        data: result,
                        currentPage: currentPage,
                        countAllPages: countAllPages,
                        page: page,
                        totalPages: totalPages,
                    });
            }).catch((err) => {
                next(err);
            })
    };

    async Post(req, res, next) {
        const body = {
            fullName: req.body.fullName,
            NoKTP: req.body.NoKTP,
            userId: req.body.userId
        };

        await Identity_Verif.create({
            data: body
        }).then((result) => {
            return res
                .status(201)
                .json({
                    message: "OK",
                    status: 201,
                    data: result
                })
        }).catch((err) => {
            next(err);
        })
    };

    async PostWithNISN(req, res, next) {
        const body = {
            fullName: req.body.fullName,
            NoNISN: req.body.NoNISN
        };

        await Identity_Verif.create({
            data: body
        }).then((result) => {
            return res.status(201).json({
                message: "OK",
                status: 201,
                data: result
            })
        }).catch((err) => {
            next(err);
        });
    };

    async PostWithNoAnggota(req, res, next) {
        const body = {
            fullName: req.body.fullName,
            NoAnggota: parseInt(req.body.NoAnggota)
        };

        await Identity_Verif.create({
            data: body
        }).then((result) => {
            return res.status(201).json({
                message: "OK",
                status: 201,
                data: result
            })
        }).catch((err) => {
            next(err);
        });
    }

    async GetByID(req, res, next) {
        const { id } = req.params;

        await Identity_Verif.findUnique({
            where: {
                identityID: parseInt(id)
            }
        }).then((result) => {
            return res.status(200).json({
                message: "OK",
                data: result
            });
        }).catch((err) => {
            next(err);
        })
    };

    async Update(req, res, next) {
        const { id } = req.params;

        const body = {
            NoKTP: req.body.NoKTP,
            NoNISN: req.body.NoNISN,
            NoAnggota: req.body.NoAnggota
        };

        await Identity_Verif.update({
            where: { identityID: parseInt(id) },
            data: body
        }).then((updated) => {
            if (updated) return res
                .status(200)
                .json({
                    message: "OK",
                    data: updated
                });
        }).catch((err) => {
            next(err);
        })
    };

    async Deleted(req, res, next) {
        const { id } = req.params;

        await Identity_Verif.delete({
            where: { identityID: parseInt(id) }
        })
            .then((result) => {
                return res.status(200).json({
                    message: "OK",
                    status: 200
                })
            }).catch((err) => {
                next(err);
            });
    };
};


module.exports = new IdentityVerifController();