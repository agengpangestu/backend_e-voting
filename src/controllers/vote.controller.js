const prisma = require("../database/prisma");

const Vote = prisma.vote;

class VoteController {
    async Get(req, res, next) {

        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 15
        } = req.query;

        const query = {};

        if (parseInt(req.query.electionID))
            query.electionID = parseInt(req.query.electionID);

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        await Vote.findMany({
            where: query,
            // include: { Candidate: { include: true }, User: { include: true }, Election_Schedul: true },
            include: {
                Election_Schedul: { include: true },
                ketua: { include: true },
                wakilKetua: { include: true },
                User: { include: true }
            },
            skip: offset,
            take: limitOfNumber
        })
            .then(async (result) => {
                const countPages = await prisma.candidate.count(),
                    totalPages = Math.ceil(countPages / limitOfNumber),
                    currentPage = page ? +page : 0;

                return res
                    .status(200)
                    .json({
                        message: "OK",
                        status: 200,
                        data: result,
                        currentPage: currentPage,
                        countPages: countPages,
                        page: pageOfNumber,
                        totalPages: totalPages,
                    });
            }).catch((err) => {
                next(err);
            });
    };

    async Post(req, res, next) {
        const { userID, electionID, ketuaID, wakilKetuaID } = req.body;


        const votePair = `${ketuaID} - ${wakilKetuaID}`

        await Vote.create({
            data: {
                userID: parseInt(userID),
                electionID: parseInt(electionID),
                ketuaID: parseInt(ketuaID),
                wakilKetuaID: parseInt(wakilKetuaID),
                votePair: votePair,
            }
        }).then(async (created) => {

            console.log(created);

            await prisma.user.update({
                where: { id: parseInt(userID) },
                data: { ifVoted: true }
            });

            await prisma.candidate.update({
                where: { candidateID: parseInt(ketuaID) },
                data: { result_votes: { increment: 1 } }
            }).then(res => console.log(res.candidateID))

            await prisma.candidate.update({
                where: { candidateID: parseInt(wakilKetuaID) },
                data: { result_votes: { increment: 1 } }
            }).then(res => console.log(res.candidateID))

            return res
                .status(200)
                .json({
                    message: "OK",
                    status: 200
                });
        }).catch((err) => {
            next(err);
        });
    };

}

module.exports = new VoteController();