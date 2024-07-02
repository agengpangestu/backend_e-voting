const prisma = require("../database/prisma");
const { generateTokenPemilih } = require("../middlewares/auth");

const User = prisma.user;
const IdentityVerif = prisma.identity_Verif;

class RegistrationController {
    async Post(req, res, next) {

        try {

            const dirPath = `${req.protocol}://${req.get('host')}/public/images/identity_card_pemilih/${req.file === undefined ? "" : req.file.filename}`;

            const body = {
                identityNumber: parseInt(req.body.identityNumber),
                fullName: req.body.fullName,
                identityPicture: dirPath
            };

            if (!body.identityNumber && !body.fullName) return res.status(400).json({ message: "Masukkan Nomor identitas dan Nama!", status: 400 });
            if (!body.identityNumber) return res.status(400).json({ message: "Masukkan Nomor identitas", status: 400 });
            if (!body.fullName) return res.status(400).json({ message: "Masukkan Nama", status: 400 });

            await User.create({
                data: body
            })
                .then((result) => {

                    let user = [];

                    const arr = Array.of(result)

                    arr.forEach(data => {
                        user.push({
                            id: data.id,
                            nama_pemilih: data.fullName,
                            nomor_identitas: data.identityNumber,
                            role: data.role,
                            createdAt: data.createdAt,
                            identity_picture: data.identityPicture
                        })
                    });
                    const token = generateTokenPemilih(user);

                    res
                        .status(200)
                        .json({
                            message: "OK",
                            status: 201,
                            token: token,
                            token_expriedIn: 'expired in 5 minutes',
                            data: user,
                        })
                })
        } catch (err) {
            next(err);
        }



        // await User.findUnique({
        //     where: { identityNumber: body.identityNumber }
        // }).then(async (resultIdentity) => {
        //     if (!resultIdentity) return res.status(404).json({ message: "Data tidak ditemukan" });
        //     await IdentityVerif.findUnique({
        //         select: { NoKTP: true },
        //         where: { NoKTP: resultIdentity.identityNumber }
        //     }).then((result) => {
        //         if (!result) return res.status(400).json({ message: "Maaf, anda tidak terdaftar" });
        //         // if (resultIdentity.identityNumber !== result.NoKTP) return res.json({ message: "Maaf, anda tidak terdaftar" })
        //     })

        //     return res.json({ message: "Anda sudah terdaftar", token: "12345678" })
        // }).catch((err) => {
        //     next(err);
        // });
    }
}

module.exports = new RegistrationController();