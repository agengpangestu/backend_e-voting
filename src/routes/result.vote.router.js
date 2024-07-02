const resultsVoteController = require('../controllers/results.vote.controller');
const prisma = require('../database/prisma');

const router = require('express').Router();

router.get('/', resultsVoteController.GetResults);
router.get('/group', resultsVoteController.GetResultsGroup);


router.get('/result-new', resultsVoteController.GetResultNew);

router.get('/:id', resultsVoteController.GetResult);


module.exports = router;