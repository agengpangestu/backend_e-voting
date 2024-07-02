const express = require('express');
const router = express.Router();

const UserRouter = require('./user.route');
const CandidateRouter = require('./candidate.route');
const ScheduleRouter = require('./schedule.route');
const VoteRouter = require('./vote.route');
const ResultVoteRouter = require('./result.vote.router');
const prisma = require('../database/prisma');
const resultsVoteController = require('../controllers/results.vote.controller');
const Identity_VerifRouter = require('./identity.verif.route');
const RegistrationRouter = require('./registration.route');
const LoginRouter = require('./login.route');

router.use('/users', UserRouter);
router.use('/candidates', CandidateRouter);
router.use('/schedules', ScheduleRouter);
router.use('/votes', VoteRouter);
router.use('/result-vote', ResultVoteRouter);
router.use('/identity-verif', Identity_VerifRouter);
router.use('/registration-user/', RegistrationRouter);
router.use('/login/', LoginRouter);

//get result for voted candidate by Vote when is true
// router.get('/results-voted/:id',
//   // resultsVoteController.GetResult
//   async (req, res, next) => {
//     try {
//       const resultsVoted = await prisma.candidate.findMany({
//         include: {
//           _count: { //count total user vote a candidate
//             select: {
//               Vote: true
//             }
//           }
//         }
//       });

//       res.status(200).json({ message: "OK", data: resultsVoted })
//     } catch (err) {
//       next(err);
//     }
//   }
// )

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
