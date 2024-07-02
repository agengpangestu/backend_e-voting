const jwt = require('jsonwebtoken');

const secret = process.env.SECRET;
const expired = process.env.EXPIRED_IN;
const expiredPemilih = process.env.EXPIRED_PEMILIH_IN;

class TokenJWT {
    generateToken(user) {
        const payload = {
            userID: user.id ?? null,
            username: user.username ?? null,
            role: user.role,
            createdAt: user.createdAt
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: expired
        });
    };

    generateTokenPemilih(user) {
        const payload = {
            identityNumber: user.identityNumber,
            fullName: user.fullName,
            createdAt: user.createdAt
        };
        return jwt.sign(payload, secret, {
            algorithm: 'HS256',
            allowInsecureKeySizes: true,
            expiresIn: expiredPemilih
        });
    };

    accessAuthentication(req, res, next) {
        const authorizationHeader = req.header('Authorization');
        const token = authorizationHeader && authorizationHeader.split(' ')[1];
        console.log(authorizationHeader, token);

        (token == null)
            ? res.status(401).json({ message: "Unauthorized", status: 401 })

            : jwt.verify(token, secret, (err, user) => {

                if (err) return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengakses sumber daya ini", status: 403 }) //Forbidden

                req.user = user;
                console.log(req.user);
                next();
            })
    }
};

module.exports = new TokenJWT();