const fs = require('fs');

const prisma = require("../database/prisma");

const Candidate = prisma.candidate;
const User = prisma.user;

class CandidateController {
    async GetByGroup(req, res, next) {

        const query = {};

        if (parseInt(req.query.electionID))
            query.electionID = parseInt(req.query.electionID);
        if (req.query.group)
            query.group = req.query.group;

        await Candidate.findMany({
            where: query
        })
            .then((result) => {

                const grouped = result.reduce((acc, candidate) => {
                    if (!acc[candidate.group])
                        acc[candidate.group] = { KETUA: [], WAKIL_KETUA: [], DATA: [] };
                    // if (!acc[candidate.group])
                    //     acc[candidate.group] = { KETUA: [], WAKIL_KETUA: [] };
                    if (candidate.candidateRole === 'KETUA' || candidate.candidateRole === 'WAKIL_KETUA') {

                        acc[candidate.group].DATA.push(candidate);
                    }
                    // else if (candidate.candidateRole === 'WAKIL_KETUA') {
                    //     acc[candidate.group].WAKIL_KETUA.push(candidate)
                    // }

                    return acc;
                }, {});
                // console.log(JSON.stringify(grouped));
                console.log(grouped);

                res.status(200).json({
                    message: "OK",
                    status: 200,
                    data: grouped
                });

            }).catch((err) => {
                next(err);
            });
    };

    async Get(req, res, next) {
        const {
            page = req.query.page ?? 1,
            limit = req.query.limit ?? 6,
            sortByCreated = req.query.sortByCreated,
            sortByName = req.query.sortByName,
        } = req.query;

        const query = {};

        if (parseInt(req.query.electionID))
            query.electionID = parseInt(req.query.electionID);
        if (req.query.level)
            query.level = req.query.level;
        if (req.query.group)
            query.group = req.query.group;

        const pageOfNumber = parseInt(page),
            limitOfNumber = parseInt(limit);

        const offset = (pageOfNumber - 1) * limitOfNumber;

        await Candidate.findMany({
            where: query,
            include: {
                User: true,
                Election: true
            },
            orderBy: {
                createdAt: sortByCreated,
                candidateName: sortByName,
            },
            take: limitOfNumber,
            skip: offset,
        })
            .then(async (data) => {

                const countPages = await Candidate.count(),
                    countWithLevel = await Candidate.count({
                        where: query
                    }),
                    countWithElection = await Candidate.count({
                        where: query
                    });

                const totalPages = Math.ceil(countPages / limitOfNumber),
                    totalPagesLEVEL = Math.ceil(countWithLevel / limitOfNumber),
                    totalPagesElection = Math.ceil(countWithElection / limitOfNumber),
                    currentPage = page ? +page : 0;

                res.json({
                    message: "OK",
                    page: pageOfNumber,
                    countPages: countPages,
                    countLevel: countWithLevel,
                    countWithElection: countWithElection,
                    totalPages: totalPages,
                    totalPagesLEVEL: totalPagesLEVEL,
                    totalPagesElection: totalPagesElection,
                    currentPage: currentPage,
                    data: data,
                })
            }).catch((err) => {
                next(err);
            });
    };

    async GetByID(req, res, next) {
        const { id } = req.params;

        await Candidate.findUnique({
            where: {
                candidateID: parseInt(id)
            },
            include: { Election: true, User: true }
        }).then((candidate) => {
            !candidate
                ?
                res.status(404).json({
                    message: "Candidate Not Found",
                    status: 404
                })
                :
                res.status(200).json({
                    message: "OK",
                    data: candidate
                })

        }).catch((err) => {
            next(err);
        });
    }

    async Post(req, res, next) {
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/candidate/${req.file === undefined ? "" : req.file.filename}`;
        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: dirPath,
            candidateRole: req.body.candidateRole,
            group: req.body.group,
            level: req.body.level,
            createdBy: parseInt(req.body.createdBy),
            electionID: parseInt(req.body.electionID),
        };

        await Candidate.create({
            data: body
        }).then((data) => {
            if (data) return res
                .status(201)
                .json({
                    message: "Created",
                    status: 201,
                    data: data
                })
        }).catch((err) => {
            next(err);
        });
    };

    async Update(req, res, next) {
        const { id } = req.params;
        const dirPath = `${req.protocol}://${req.get('host')}/public/images/candidate/${req.file === undefined ? "" : req.file.filename}`;

        let candidateAvatar = null;

        const checkCandidate = await Candidate.findUnique({
            where: {
                candidateID: parseInt(id)
            }
        });

        if (!checkCandidate) return res
            .status(404)
            .json({
                message: "Candidate Not Found",
                status: 404
            });

        if (req.file) {
            candidateAvatar = dirPath;
            const rmvFromDir = checkCandidate.candidateAvatar.replace(`${req.protocol}://${req.get('host')}/`, "");
            fs.unlink(rmvFromDir, async (err) => {
                console.log(err);
            })
        } else {
            candidateAvatar = checkCandidate.candidateAvatar;
        }

        const body = {
            candidateName: req.body.candidateName,
            candidateVisi: req.body.candidateVisi,
            candidateMisi: req.body.candidateMisi,
            candidateAvatar: candidateAvatar,
            candidateRole: req.body.candidateRole,
            group: req.body.group,
            level: req.body.level,
            createdBy: parseInt(req.body.createdBy),
            electionID: parseInt(req.body.electionID),
        };

        await Candidate.update({
            where: {
                candidateID: parseInt(id)
            }, data: body
        }).then((updated) => {
            if (updated) return res
                .status(200)
                .json({
                    message: "OK",
                    data: updated
                });
        }).catch((err) => {
            next(err);
        });
    };

    async Deleted(req, res, next) {
        const { id } = req.params;

        const checkCandidate = await Candidate.findUnique({ where: { candidateID: parseInt(id) } });

        if (!checkCandidate) return res
            .status(404)
            .json({
                message: "Candidate Not Found",
                status: 404
            });

        else {
            const rmvFromDir = checkCandidate.candidateAvatar.replace(`${req.protocol}://${req.get('host')}/`, "")

            fs.unlink(rmvFromDir, (err) => {
                console.log(err);
            })
            await Candidate.delete({
                where: { candidateID: parseInt(id) }
            })
                .then((deletedCandidate) => {
                    return res
                        .status(200)
                        .json({
                            message: "OK",
                            ststus: 200
                        })
                }).catch((err) => {
                    next(err);
                });
        }
    }
};

module.exports = new CandidateController();