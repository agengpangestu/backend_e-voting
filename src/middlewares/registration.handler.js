const prisma = require("../database/prisma");

const IdentityVerif = prisma.identity_Verif,
    User = prisma.user;

const RegistrationHandler = async (req, res, next) => {
    try {

        const { identityNumber, fullName } = req.body;

        

        const checkIdentity = await IdentityVerif.findUnique({
            where: { NoAnggota: parseInt(identityNumber) }
        })

        if (!checkIdentity)
            res.status(400).json({ message: "Anda tidak terdaftar di pemilihan", status: 400 });

        if (checkIdentity.fullName !== fullName) return res.status(400).json({ message: 'Nama harus sesuai!', status: 400 });


        const findUniqueUser = await User.findUnique({
            where: { identityNumber: parseInt(identityNumber), }
        })

        // jika tidak ada user di table user, null!!!
        if (findUniqueUser)
            return res.status(400).json({ message: "Nomor identitas sudah ada dan harus unik", status: 400 })


        // prisma.$disconnect();
        next();

    } catch (err) {
        next(err);
    }
};

module.exports = { RegistrationHandler };