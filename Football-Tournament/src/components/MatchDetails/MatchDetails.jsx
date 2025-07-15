import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router"
import { TournamentContext } from "../../contexts/TournamentContext"

import { BiTransfer } from "react-icons/bi";
import styles from "./match-details.module.css"

export const MatchDetails = () => {
    // const [playersRecords, setPlayersRecords] = [];
    const [currentMatch, setCurrentMatch] = useState({});
    const [teamsAndPositionsSchema, setTeamsAndPositionsSchema] = useState({});
    const [starterAndBenchPlayersSchema, setStarterAndBenchPlayersSchema] = useState({});
    const { matches, playersMappedWithMatches } = useContext(TournamentContext);
    const { id } = useParams();

    useEffect(() => {
        const tempCurrentMatch = matches.find((el) => el.ID == id);
        const { ATeamID, BTeamID } = tempCurrentMatch;

        const allPlayersInMatch = playersMappedWithMatches[id];

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

        const tempStarterAndBenchPlayersSchema = {
            [ATeamID]: {
                "starters": [],
                "substitutes": [],
            },
            [BTeamID]: {
                "starters": [],
                "substitutes": [],
            }

        }

        allPlayersInMatch.forEach((currentPlayer) => {
            const currentPlayerPosition = currentPlayer.playerDetails.Position;
            const currentPlayerTeamId = currentPlayer.playerDetails.TeamID;

            // Check if player already exist before adding him to the array
            tempTeamsAndPositionsSchema[currentPlayerTeamId][currentPlayerPosition].push(currentPlayer);

            if (currentPlayer.fromMinutes == "0") {
                tempStarterAndBenchPlayersSchema[currentPlayerTeamId]["starters"].push(currentPlayer)
            } else {
                tempStarterAndBenchPlayersSchema[currentPlayerTeamId]["substitutes"].push(currentPlayer)
            }

        });

        setCurrentMatch(state => tempCurrentMatch);
        setStarterAndBenchPlayersSchema(state => tempStarterAndBenchPlayersSchema);
        setTeamsAndPositionsSchema(state => tempTeamsAndPositionsSchema);

    }, [id]);
    console.log(Object.entries(starterAndBenchPlayersSchema), 'x')
    return (
        <section className={styles.matchDetails}>
            <>
                <div className={styles.fieldsContainer}>
                    {/* <div className={styles.matchResult}>
                        {currentMatch.Score}
                    </div> */}
                    {Object.entries(teamsAndPositionsSchema).map(([teamID, positionObject], index) => (

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

                            {Object.entries(positionObject).map(([positionName, playersArray], index) => (
                                <div key={index} className={`${styles.positionLine} ${styles[positionName]}`}>
                                    {playersArray.map((currentPlayer) => (
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

                                                        {
                                                            currentPlayer.isPlayerChanged &&
                                                            <div className={styles.changeIconContainer}><BiTransfer size={16} /></div>
                                                        }
                                                    </div>
                                                    <div>{currentPlayer.playerDetails.TeamNumber}</div>
                                                    <div className={styles.playerName}>{currentPlayer.playerDetails.FullName}</div>
                                                </div>
                                            }
                                        </>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles.playersSection}>
                    {Object.entries(starterAndBenchPlayersSchema).map(([teamID, substitutesAndStartersArray], index) => (
                        <div key={index} className={styles.playersContainer}>
                            {/* type: starter OR substitutes, playersArray: array with objects which is corresponding to starter or substitute type for the current team and match */}
                            {Object.entries(substitutesAndStartersArray).map(([type, playersArray], index) => (
                                <>
                                    {playersArray.length > 0 ?
                                        <ul>
                                            <h3>{type.toUpperCase()}</h3>
                                            <div className={styles.subHeading}>
                                                <p>Name</p>
                                                <p>In</p>
                                                <p>Finish</p>
                                            </div>
                                            {/* currentPlayerRecord contains all information for the player and information for its participation in the current match */}
                                            {playersArray.map((currentPlayerRecord) => (
                                                <li className={styles.playerRecord}>
                                                    <div className={styles.playerNameWrapper}>
                                                        <p>{currentPlayerRecord.playerDetails.FullName}</p>
                                                        {(type == 'starters' && currentPlayerRecord.isPlayerChanged) && <div><BiTransfer size={16} /></div>}
                                                    </div>
                                                    <span>{currentPlayerRecord.fromMinutes}</span>
                                                    <span>
                                                        {
                                                            (currentPlayerRecord.toMinutes == 'NULL' || currentPlayerRecord.toMinutes == "90") ?
                                                                "90" :
                                                                currentPlayerRecord.toMinutes
                                                        }
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                        : null
                                    }
                                </>
                            ))}
                        </div>
                    ))}
                </div>
            </>
        </section>
    )
}