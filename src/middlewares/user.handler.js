const prisma = require("../database/prisma");

const User = prisma.user;

const checkRole = async (req, res, next) => {
    const { role } = req.query.role;

    if (!role) return res.status(404).json({ message: "Roles Not Found", status: 404 });

    if (role !== "PEMILIH" && role !== "ADMIN") return res.status(400).json({ message: "Roles that don't exist", status: 400 });

    next();
};
const checkUsername = async (req, res, next) => {
    const { username, email, identityNumber } = req.body;

    const usernameExist = await User.findUnique({ where: { username: username } })
    const emailExist = await User.findUnique({ where: { email } });
    const identityNumberExist = await User.findUnique({ where: { identityNumber: parseInt(identityNumber) } })

    if (usernameExist) {
        return res.status(400).json({ message: "Username telah digunakan", status: 400 })
    } else if (emailExist) {
        return res.status(400).json({ message: "Email telah digunakan", status: 400 })
    } else if (identityNumberExist) {
        return res.status(400).json({ message: "Nomor identitas telah digunakan", status: 400 })
    }
    next();
};

const checkInputData = async (req, res, next) => {
    const { username, password, email, role, fullName, identityNumber, age } = req.body;
    console.log(username, password, email, role, fullName);

    const parseIdentityNum = parseInt(identityNumber),
        parseAge = parseInt(age);

    if (!username) return res.status(400).json({ message: "Username harus diisi", status: 400 });
    if (!password) return res.status(400).json({ message: "Password harus diisi", status: 400 });
    if (!role) return res.status(400).json({ message: "Role harus diisi", status: 400 });
    if (!fullName) return res.status(400).json({ message: "Nama Lengkap harus diisi", status: 400 });
    if (!parseIdentityNum) return res.status(400).json({ message: "Nomor Identitas harus diisi", status: 400 });
    if (!parseAge) return res.status(400).json({ message: "Umur harus diisi", status: 400 });
    next();
};


module.exports = { checkRole, checkUsername, checkInputData };