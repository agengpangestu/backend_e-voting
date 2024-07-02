const { faker, fa } = require('@faker-js/faker');

const UserController = require('../controllers/user.controller');
const prisma = require('../database/prisma');
const { uploadIdentityCards } = require('../middlewares/multer.handler');
const userHandler = require('../middlewares/user.handler');

const router = require('express').Router();

const bulkUsers = () => {
    return {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        email: faker.internet.email(),
        role: "PEMILIH",
        fullName: faker.person.fullName(),
        age: 20,
    }
};

const createRandomUsers = async (count) => {
    const userData = Array.from({ length: count }, () => bulkUsers());
    const createdUsers = await prisma.user.createMany({
        data: userData.map(user => ({
            username: user.username,
            password: user.password,
            email: user.email,
            role: user.role,
            fullName: user.fullName,
            age: user.age,
        }))
    });
    return createdUsers;
};

router.get('/', UserController.Get);
router.get('/:id/user', UserController.GetByID);
router.post('/post',
    uploadIdentityCards.single('identityPicture'),
    userHandler.checkInputData,
    userHandler.checkUsername,
    UserController.Post
);
router.post('/post-bulk', async (req, res) => {
    try {
        const { count } = req.body;
        const createdUsers = await createRandomUsers(count);
        res.json({ message: "OK", data: createdUsers });
    } catch (error) {
        console.log(error);
        res.json({ message: error })
    }
});
router.patch('/:id/user-update', 
    uploadIdentityCards.single('identityPicture'),
    UserController.Update
);
router.delete('/:id/user-delete', UserController.Deleted);

module.exports = router;