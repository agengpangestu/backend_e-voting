const cron = require('node-cron');

const prisma = require("../database/prisma");

const ElectionSchedule = prisma.election_Schedulling;

async function CheckElectionStatus(req, res, next) {
    const currentTime = new Date();

    try {
        const elections = await ElectionSchedule.findMany();

        for (const election of elections) {
            const { electionID, status, startedAt, endedAt } = election;

            if (currentTime > new Date(startedAt) && status !== "ACTIVE") {
                await ElectionSchedule.update({
                    where: { electionID: electionID },
                    data: { status: "ACTIVE" }
                });
                console.log(`Schedule ID ${electionID} has been actived`);
            }

            if (currentTime > new Date(endedAt) && status !== "CLOSED") {
                await ElectionSchedule.update({
                    where: { electionID: electionID },
                    data: { status: "CLOSED" }
                });
                console.log(`Schedule ID ${electionID} has been closed`);
            }

            next(console.log(`Nothing schedule`))
        }
    } catch (error) {
        next(err);
    }
};
cron.schedule('*/2 * * * *', async (req, res, next) => {
    await CheckElectionStatus()
}, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
})

module.exports = CheckElectionStatus;