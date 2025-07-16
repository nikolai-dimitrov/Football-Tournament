import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router"
import { TournamentContext } from "../../contexts/TournamentContext"

import { BiTransfer } from "react-icons/bi";
import { countryFlags } from "../../constants/countryFlags";
import styles from "./match-details.module.css"

export const MatchDetails = () => {
    const { id } = useParams();
    const { teams, matches, playersMappedWithMatches } = useContext(TournamentContext);
    const [countries, setCountries] = useState([]);
    const [currentMatch, setCurrentMatch] = useState({});
    const [teamsAndPositionsSchema, setTeamsAndPositionsSchema] = useState([]);
    const [starterAndBenchPlayersSchema, setStarterAndBenchPlayersSchema] = useState([]);

    useEffect(() => {
        const tempCurrentMatch = matches.find((el) => el.ID == id);
        const formattedScore = tempCurrentMatch.Score.replace("-", " : ");


        const { ATeamID, BTeamID } = tempCurrentMatch;

        const ACountryName = teams.find((currentTeam) => currentTeam.ID == ATeamID).Name;
        const BCountryName = teams.find((currentTeam) => currentTeam.ID == BTeamID).Name;

        const allPlayersInMatch = playersMappedWithMatches[id];


        const tempTeamsAndPositionsSchema = [
            [ATeamID, {
                "GK": [],
                "DF": [],
                "MF": [],
                "FW": []
            }],

            [BTeamID, {
                "GK": [],
                "DF": [],
                "MF": [],
                "FW": []
            }]
        ];

        const tempStarterAndBenchPlayersSchema = [
            [ATeamID, {
                "starters": [],
                "substitutes": [],
            }],

            [BTeamID, {
                "starters": [],
                "substitutes": [],
            }]

        ]

        const [ATeamPositionsArray, BTeamPositionsArray] = tempTeamsAndPositionsSchema;
        const [ATeamStartersBenchesArray, BTeamStartersBenchesArray] = tempStarterAndBenchPlayersSchema;

        const ATeamPositionsObj = ATeamPositionsArray[1];
        const BTeamPositionsObj = BTeamPositionsArray[1];

        const ATeamStartersBenchesObj = ATeamStartersBenchesArray[1];
        const BTeamStartersBenchesObj = BTeamStartersBenchesArray[1];

        // Move in separate function.
        allPlayersInMatch.forEach((currentPlayer) => {
            const currentPlayerPosition = currentPlayer.playerDetails.Position;
            const currentPlayerTeamId = currentPlayer.playerDetails.TeamID;

            if (currentPlayerTeamId == ATeamID) {
                ATeamPositionsObj[currentPlayerPosition].push(currentPlayer);
                if (currentPlayer.fromMinutes == "0") {
                    ATeamStartersBenchesObj["starters"].push(currentPlayer)
                } else {
                    ATeamStartersBenchesObj["substitutes"].push(currentPlayer)
                }
            } else {
                BTeamPositionsObj[currentPlayerPosition].push(currentPlayer);
                if (currentPlayer.fromMinutes == "0") {
                    BTeamStartersBenchesObj["starters"].push(currentPlayer)
                } else {
                    BTeamStartersBenchesObj["substitutes"].push(currentPlayer)
                }
            }

        });

        setCountries(state => [ACountryName, BCountryName]);
        setCurrentMatch(state => ({ ...tempCurrentMatch, Score: formattedScore }));
        setStarterAndBenchPlayersSchema(state => tempStarterAndBenchPlayersSchema);
        setTeamsAndPositionsSchema(state => tempTeamsAndPositionsSchema);

    }, [id]);

    return (
        <section className={styles.matchDetails}>
            <>
                <div className={styles.matchResultContainer}>
                    {countries.map((countryName) => (
                        <div>
                            {countryName == 'Scotland' ?
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png" width="64px" height="44px" alt="Flag Image" />
                                :
                                <img src={countryFlags[countryName]} alt="Flag Image" />

                            }
                            <p >{countryName}</p>
                        </div>

                    ))}
                    <p className={styles.score} >{currentMatch.Score}</p>
                </div>
                <div className={styles.fieldsContainer}>
                    {teamsAndPositionsSchema.map(([teamID, positionObject], index) => (

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
                    {starterAndBenchPlayersSchema.map(([teamID, substitutesAndStartersArray], index) => (
                        <div key={index} className={styles.playersContainer}>
                            {/* type: starter OR substitutes, playersArray: array with objects which is corresponding to starter or substitute type for the current team and match */}
                            {Object.entries(substitutesAndStartersArray).map(([type, playersArray], index) => (
                                <>
                                    {playersArray.length > 0 ?
                                        <ul>
                                            <h3>{type.toUpperCase()}</h3>
                                            <div className={styles.subHeading}>
                                                <div className={styles.firstColumnContainer}>
                                                    <p>No</p>
                                                    <p>Name</p>
                                                </div>
                                                <p>In</p>
                                                <p>Finish</p>
                                            </div>
                                            {/* currentPlayerRecord contains all information for the player and information for its participation in the current match */}
                                            {playersArray.map((currentPlayerRecord) => (
                                                <li className={styles.playerRecord}>
                                                    <div className={styles.playerNameWrapper}>
                                                        <p className={styles.playerNumber}>{currentPlayerRecord.playerDetails.TeamNumber}</p>
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