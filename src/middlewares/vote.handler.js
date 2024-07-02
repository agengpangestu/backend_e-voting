const prisma = require("../database/prisma");

const Candidate = prisma.candidate;
const ElectionSchedule = prisma.election_Schedulling;
const User = prisma.user;
const Vote = prisma.vote;

const checkUserWhenVoted = async (req, res, next) => {
    const userID = req.body.userID;

    await User.findUnique({
        where: { id: parseInt(userID) }
    }).then((result) => {
        (!result) ? res
            .status(404)
            .json({
                message: "Invalid user",
                status: 404
            }) : next()
    }).catch((err) => {
        next(err);
    });
}

// const CheckCandidateWhenVoted = async (req, res, next) => {
//     const candidateID = req.body.candidateID;

//     await Candidate.findUnique({
//         where: {
//             candidateID: parseInt(candidateID)
//         }
//     }).then((result) => {
//         (!result) ? res
//             .status(404)
//             .json({
//                 message: "Invalid candidate",
//                 status: 404
//             }) : next()
//     }).catch((err) => {
//         next(err);
//     });
// };

const CheckElectionWhenVoted = async (req, res, next) => {
    const electionID = req.body.electionID;

    await ElectionSchedule.findUnique({
        where: {
            electionID: parseInt(electionID)
        }
    }).then((result) => {
        (!result) ? res
            .status(404)
            .json({
                message: "Invalid schedule",
                status: 404
            }) : next()
    }).catch((err) => {
        next(err);
    });
};

async function CheckUniqueVoted(req, res, next) {
    const { userID, candidateID, ketuaID, wakilKetuaID } = req.body;

    await User.findUnique({ where: { id: parseInt(userID) } })
        .then((result) => {


            if (result.ifVoted)
                res.status(400).json({
                    message: "You've chosen",
                    status: 400
                });

            next();
        }).catch((err) => {
            next(err);
        });

    // await Vote.findUnique({
    //     where: {
    //         userID: parseInt(userID),
    //         // User: {
    //         //     id: parseInt(userID)
    //         // },

    //         // userID_candidateID: {
    //         //     userID: parseInt(userID),
    //         //     candidateID: parseInt(candidateID)
    //         // }
    //     }
    // }).then((result) => {
    //     console.log(`vote handler: ${result}`);
    //     (result)
    //         ? res.status(400).json({
    //             message: "You've chosen",
    //             status: 400
    //         })
    //         : next()
    // }).catch((err) => {
    //     next(err)
    // });
};

async function CheckTokenBeforeVoted(req, res, next) {
    const { token } = req.body.token;


};

module.exports = {
    checkUserWhenVoted,
    // CheckCandidateWhenVoted, 
    CheckElectionWhenVoted,
    CheckUniqueVoted
};