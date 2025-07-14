import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router"
import { TournamentContext } from "../../contexts/TournamentContext"

import styles from "./match-details.module.css"

export const MatchDetails = () => {
    // const [playersRecords, setPlayersRecords] = [];
    const [currentMatch, setCurrentMatch] = useState({});
    const [teamsAndPositionsSchema, setTeamsAndPositionsSchema] = useState({});
    const { matches, playersMappedWithMatches } = useContext(TournamentContext);
    const { id } = useParams();

    useEffect(() => {
        const tempCurrentMatch = matches.find((el) => el.ID == id);
        const { ATeamID, BTeamID } = tempCurrentMatch;

        const allPlayersInMatch = playersMappedWithMatches[id];
        console.log(allPlayersInMatch, 'All players in match')
        const tempTeamsAndPositionsSchema = {
            [ATeamID]: {
                "GK": [],
                "DF": [],
                "MF": [],
                "FW": []
            },

            [BTeamID]: {
                "GK": [],
                "DF": [],
                "MF": [],
                "FW": []
            }
        };


        allPlayersInMatch.forEach((currentPlayer) => {
            const currentPlayerPosition = currentPlayer.playerDetails.Position;
            const currentPlayerTeamId = currentPlayer.playerDetails.TeamID;

            // Check if player already exist before adding him to the array
            tempTeamsAndPositionsSchema[currentPlayerTeamId][currentPlayerPosition].push(currentPlayer);

        })

        // console.log(tempTeamsAndPositionsSchema, 'players in the match with their positions')

        setCurrentMatch(state => tempCurrentMatch);
        setTeamsAndPositionsSchema(state => tempTeamsAndPositionsSchema);

    }, [id])

    return (
        <section className={styles.matchDetails}>
            <>
                <div className={styles.fieldsContainer}>
                    <div className={styles.matchResult}>
                        {currentMatch.Score}
                    </div>
                    {Object.entries(teamsAndPositionsSchema).map(([teamID, positionObject], index) => {
                        return (
                            <div key={teamID} className={styles.field}>
                                {/* center */}
                                <div className={styles.centerLine}></div>
                                <div className={styles.centerCircle}></div>

                                {/* bottom */}
                                <div className={styles.penaltyFieldBottom}></div>
                                <div className={styles.goalTargetFieldBottom}></div>
                                <div className={styles.goalTargetBottom}></div>

                                {/* top */}
                                <div className={styles.penaltyFieldTop}></div>
                                <div className={styles.goalTargetFieldTop}></div>
                                <div className={styles.goalTargetTop}></div>

                                {/* penalty half circles */}
                                <div className={styles.penaltyArcBottom}></div>
                                <div className={styles.penaltyArcTop}></div>

                                {Object.entries(positionObject).map(([positionName, playersArray], index) => {
                                    return (
                                        <div key={positionName} className={`${styles.positionLine} ${styles[positionName]}`}>
                                            {playersArray.map((currentPlayer) => {
                                                return (
                                                    <>
                                                        {
                                                            currentPlayer.fromMinutes == '0' &&
                                                            <div className={styles.playerInformationContainer}>
                                                                <div className={styles.playerPosition}>
                                                                    {
                                                                        currentPlayer.playerDetails.isCaptain &&
                                                                        <div className={styles.captainIcon}>C</div>
                                                                    }
                                                                    {currentPlayer.playerDetails.Position}
                                                                </div>
                                                                <div>{currentPlayer.playerDetails.TeamNumber}</div>
                                                                <div className={styles.playerName}>{currentPlayer.playerDetails.FullName}</div>
                                                            </div>
                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </>
        </section>
    )
}