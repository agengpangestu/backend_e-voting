const identityVerifController = require('../controllers/identity.verif.controller');
const identityVerifHandler = require('../middlewares/identity.verif.handler');

const router = require('express').Router();

router.get('/', identityVerifController.Get);
router.post('/post',
    identityVerifHandler.checkNoKTP,
    // identityVerifHandler.checkNISN,
    // identityVerifHandler.checkNoAnggota,
    identityVerifController.Post);

router.post('/post-nisn',
    identityVerifHandler.checkNISN,
    identityVerifController.PostWithNISN);

router.post('/post-no_anggota',
    identityVerifHandler.checkNoAnggota,
    identityVerifController.PostWithNoAnggota);

router.get('/:id',
    identityVerifHandler.checkData,
    identityVerifController.GetByID);
router.patch('/:id/identity-update',
    identityVerifHandler.checkData,
    identityVerifController.Update);
router.delete('/:id/identity-deleted',
    identityVerifHandler.checkData,
    identityVerifController.Deleted);


module.exports = router;