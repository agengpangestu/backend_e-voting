const prisma = require("../database/prisma");

class ResultsVote {

    async GetResultNew(req, res, next) {
        const {
            electionID = req.query.electionID,
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 10,
            createdAt = req.query.createdAt
        } = req.query;

        const query = {};
        if (parseInt(electionID))
            query.electionID = parseInt(electionID);

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        const votee = await prisma.candidate.findMany({
            where: query,
            select: {
                candidateName: true,
                candidateRole: true,
                _count: true,
                candidateAvatar: true,
                Election: true,
                candidateID: true,
                electionID: true,
                group: true,
                createdAt: true,
                // voteKetua: true,
                // voteWakilKetua: true
            },
            orderBy: { createdAt: createdAt },
            skip: offset,
            take: limitOfNumber
        })


        const votes = await prisma.vote.groupBy({
            by: ['votePair','electionID'], //jika pakai 'voteID', ada data double   
            _count: {
                votePair: true,
                ketuaID: true,
            },
            where: query,
        });
        console.log(votes);

        // const totalVotes = votes.length;

        const countPages = await prisma.candidate.count(),
            countWithElection = await prisma.candidate.count({
                where: query
            });

        const totalPages = Math.ceil(countPages / limitOfNumber),
            totalPagesElection = Math.ceil(countWithElection / limitOfNumber),
            currentPage = page ? +page : 0;

        const results = await Promise.all(votes.map(async vote => {
            const [ketuaID, wakilKetuaID] = vote.votePair.split('-').map(Number);

            const ketua = await prisma.candidate.findUnique({ where: { candidateID: ketuaID }, include: { Election: true } });
            const wakil_ketua = await prisma.candidate.findUnique({ where: { candidateID: wakilKetuaID } });

            return {
                ketua: ketua.candidateName,
                avatar_ketua: ketua.candidateAvatar,
                wakil_ketua: wakil_ketua.candidateName,
                avatar_wakil_ketua: wakil_ketua.candidateAvatar,
                role_ketua: ketua.candidateRole,
                role_wakil_ketua: wakil_ketua.candidateRole,
                group: ketua.group,
                schedule_election: ketua.electionID,
                schedule: ketua.Election.electionName,
                count_result_vote: vote._count.votePair
            };
        }));


        res.status(200).json({
            message: "OK",
            status: 200,
            data: results,
            // countPages: countPages,
            // countElection: countWithElection,
            // currentPage: currentPage,
            // page: pageOfNumber,
            // totalPages: totalPages,
            // totalPagesElection: totalPagesElection
        });
    };

    async GetResultsGroup(req, res, next) {

        const { electionID = req.query.electionID } = req.query;

        const query = {};

        if (parseInt(electionID))
            query.electionID = parseInt(electionID);

        await prisma.candidate.findMany({
            where: query,
            // include: { _count: { select: { Vote: true } } }
            include: { _count: { select: { voteKetua: true } } }
        }).then((result) => {
            const data = result.reduce((acc, candidate) => {
                if (!acc[candidate.group])
                    acc[candidate.group] = { DATA: [] };
                if (candidate.candidateRole === 'KETUA' || candidate.candidateRole === 'WAKIL_KETUA')
                    acc[candidate.group].DATA.push({
                        name: candidate.candidateName,
                        role: candidate.candidateRole,
                        group: candidate.group,
                        result_votes: candidate._count.voteKetua
                    });

                return acc;
            }, {});

            // console.log(data);

            res.status(200).json({
                message: "OK",
                status: 200,
                data: data
            });
        }).catch((err) => {
            next(err);
        });
    };

    async GetResults(req, res, next) {
        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 10,
            electionID = req.query.electionID
        } = req.query;

        const query = {};
        if (parseInt(electionID))
            query.electionID = parseInt(electionID);

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        await prisma.candidate.findMany({
            where: query,
            include: {
                _count: { select: { voteKetua: true } },
                Election: true
            },
            skip: offset,
            take: limitOfNumber
        })
            .then(async (result) => {
                const countPages = await prisma.candidate.count(),
                    countWithElection = await prisma.candidate.count({
                        where: query
                    });

                const totalPages = Math.ceil(countPages / limitOfNumber),
                    totalPagesElection = Math.ceil(countWithElection / limitOfNumber),
                    currentPage = page ? +page : 0;

                const formatedResult = result.map(data => ({
                    id: data.candidateID,
                    name: data.candidateName,
                    role: data.candidateRole,
                    avatar: data.candidateAvatar,
                    group: data.group,
                    level: data.level,
                    electionID: data.electionID,
                    Election: data.Election,
                    result_vote: data._count.Vote
                }))
                res.status(200).json({
                    message: "Result Vote",
                    status: 200,
                    data: formatedResult,
                    countPages: countPages,
                    countElection: countWithElection,
                    currentPage: currentPage,
                    page: pageOfNumber,
                    totalPages: totalPages,
                    totalPagesElection: totalPagesElection
                })
            }).catch((err) => {
                next(err)
            });
    };

    async GetResult(req, res, next) {
        const { id } = req.params;

        await prisma.candidate.findMany({
            where: { electionID: parseInt(id, 10) },
            // include: {
            //     Election: true,
            //     _count: {
            //         select: {
            //             Vote: true
            //         }
            //     }
            // }
        }).then((result) => {

            const formatedResult = result.map(data => ({
                id: data.candidateID,
                name: data.candidateName,
                group: data.group,
                level: data.level,
                electionID: data.electionID,
                Election: data.Election,
                result_vote: data._count.Vote
            }))

            res.status(200).json({
                message: "Result Vote",
                status: 200,
                data: formatedResult
            })
        }).catch((err) => {
            next(err);
        });
    }
};

// setInterval(async () => {
//     try {
//         await prisma.candidate.findMany({
//             include: {
//                 Election: true,
//                 _count: {
//                     select: {
//                         Vote: true
//                     }
//                 }
//             }
//         }).then((result) => {

//             const formated = result.map(data => ({
//                 name: data.candidateName,
//                 role: data.candidateRole,
//                 group: data.group,
//                 level: data.level,
//                 election_id: data.electionID,
//                 schdule_name: data.Election.electionName,
//                 vote_result: data._count.Vote
//             }))
//             console.log(`result vote ${JSON.stringify(formated, null, 2)}`);
//         })

//     } catch (err) {
//         console.log(err);
//     }
// }, 5000);

module.exports = new ResultsVote();