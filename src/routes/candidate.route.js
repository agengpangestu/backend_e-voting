const { faker } = require('@faker-js/faker');
const CandidateController = require('../controllers/candidate.controller');
const CandidateHandler = require('../middlewares/candidate.handler');
const prisma = require('../database/prisma');
const { uploadAvatarCandidate } = require('../middlewares/multer.handler');

const router = require('express').Router();

const bulkCandidates = () => {
    return {
        candidateName: faker.person.fullName(),
        candidateVisi: faker.word.words(),
        candidateMisi: faker.word.words(),
        candidateAvatar: faker.image.avatar(),
        electionID: 1,
        candidateRole: "RT", //check prisma.schema
        group: faker.company.name(),
        level: "SEKOLAH", //check prisma.schema
        createdBy: 51, //id user role admin
        electionID: 21,
    }
};

const createRandom = async (count) => {
    const candidateData = Array.from({ length: count }, () => bulkCandidates());
    const created = await prisma.candidate.createMany({
        data: candidateData.map(res => ({
            candidateName: res.candidateName,
            candidateVisi: res.candidateVisi,
            candidateMisi: res.candidateMisi,
            candidateAvatar: res.candidateAvatar,
            electionID: res.electionID,
            candidateRole: res.candidateRole,
            group: res.group,
            level: res.level,
            createdBy: res.createdBy,
            electionID: res.electionID,
        }))
    });
    return created;
};

router.get('/', CandidateController.Get);
router.get('/group', CandidateController.GetByGroup);

router.get('/:id/candidate', CandidateController.GetByID);

router.post('/post',
    uploadAvatarCandidate.single('candidateAvatar'),
    CandidateHandler.CandidateBodyRequired,
    CandidateHandler.CheckWhoCreated,
    CandidateHandler.CheckSchedule,
    CandidateController.Post);

router.patch('/:id/candidate-update',
    uploadAvatarCandidate.single('candidateAvatar'),
    CandidateHandler.CheckWhoCreated,
    CandidateHandler.CheckSchedule,
    CandidateHandler.CandidateBodyRequired,
    CandidateController.Update);

router.delete('/:id/candidate-delete', CandidateController.Deleted);

router.post('/post-bulk', async (req, res, next) => {
    try {
        const { count } = req.body;
        const createdCandidates = await createRandom(count);
        res.json({ message: "OK", data: createdCandidates });
    } catch (err) {
        console.log(err);
        // next(err);
    }
});

module.exports = router;