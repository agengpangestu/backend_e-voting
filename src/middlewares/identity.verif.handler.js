const prisma = require("../database/prisma");

const Identity_Verif = prisma.identity_Verif;

const checkData = async (req, res, next) => {
    const { id } = req.params;

    await Identity_Verif.findUnique({
        where: { identityID: parseInt(id) }
    })
        .then((data) => {
            (!data)
                ? res.status(404).json({
                    message: "Identity Not Found",
                    status: 404
                })
                : next()
        }).catch((err) => {
            next(err);
        });
}

const checkNoKTP = async (req, res, next) => {
    const { NoKTP } = req.body;

    await Identity_Verif.findUnique({
        where: { NoKTP: NoKTP }
    }).then((ifExist) => {
        (ifExist)
            ? res.status(400).json({
                message: "Nomor KTP sudah terdaftar",
                status: 400
            })
            : next()
    }).catch((err) => {
        next(err);
    })
};

const checkNISN = async (req, res, next) => {
    const { NoNISN } = req.body;

    await Identity_Verif.findUnique({
        where: {
            NoNISN: NoNISN
        }
    }).then((ifExist) => {
        (ifExist)
            ? res.status(400).json({
                message: "NISN sudah terdaftar",
                status: 400
            })
            : next()
    }).catch((err) => {
        next(err);
    });
};

const checkNoAnggota = async (req, res, next) => {
    const { NoAnggota } = req.body;

    await Identity_Verif.findUnique({
        where: {
            NoAnggota: parseInt(NoAnggota)
        }
    }).then((ifExist) => {
        (ifExist)
            ? res.status(400).json({ message: "No Anggota sudah terdaftar", status: 400 })
            : next()
    }).catch((err) => {
        next(err);
    });
};

module.exports = { checkNoKTP, checkData, checkNISN, checkNoAnggota };