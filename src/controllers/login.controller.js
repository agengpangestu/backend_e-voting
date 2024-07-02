const bcrypt = require('bcrypt');
const prisma = require('../database/prisma');
const { generateToken } = require('../middlewares/auth');

const User = prisma.user;

class LoginController {
    async login(req, res, next) {
        const { username, password } = req.body;

        if (!username && !password) return res.status(400).json({ message: "Isi username dan password!", status: 400 });
        else if (!username) return res.status(400).json({ message: "Isi username!", status: 400 });
        else if (!password) return res.status(400).json({ message: "Isi password!", status: 400 });

        else await User.findUnique({ where: { username: username } })
            .then(async (retrieved) => {
                (!retrieved)
                    ? res.status(404).json({ message: "Username tidak ditemukan", status: 404 })
                    : await bcrypt.compare(password, retrieved.password).then((ifMatching) => {
                        if (!ifMatching) return res.status(404).json({ message: "Password salah", status: 400 });

                        let data = {
                            id: retrieved.id,
                            name: retrieved.fullName,
                            role: retrieved.role,
                            email: retrieved.email
                        };

                        const token = generateToken(retrieved);
                        res.status(200).json({ message: "Log in success", token: token, data: data })

                    })
            }).catch((err) => {
                console.log(err);
                next(err);
            });
    }
}

module.exports = new LoginController();