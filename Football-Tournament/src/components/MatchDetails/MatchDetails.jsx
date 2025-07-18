import { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { TournamentContext } from "../../contexts/TournamentContext"

import { TeamLines } from "./TeamLines/TeamLines";
import { PlayersInformationTable } from "./PlayersInformationTable/PlayersInformationTable";
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation";

import { IoInformationSharp } from "react-icons/io5";

import { countryFlags } from "../../constants/countryFlags";
import styles from "./match-details.module.css"

export const MatchDetails = () => {
    const { id } = useParams();
    const { teams, matches, playersMappedWithMatches, isLoading } = useContext(TournamentContext);
    const [countries, setCountries] = useState([]);
    const [currentMatch, setCurrentMatch] = useState({});
    const [teamsAndPositionsSchema, setTeamsAndPositionsSchema] = useState([]);
    const [starterAndBenchPlayersSchema, setStarterAndBenchPlayersSchema] = useState([]);

    useEffect(() => {
        if (isLoading) {
            return;
        }

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

    }, [id, isLoading]);

    return (
        <section className={styles.matchDetails}>
            <AnimatePresence mode="wait">
                {
                    isLoading ?
                        <motion.div className={styles.loadingLayoutContainer}
                            key="loadingLayoutContainer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}

                        >
                            <LoadingAnimation />
                        </motion.div >
                        :
                        <motion.div
                            key="contentContainer"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <div className={styles.matchResultContainer}>
                                {countries.map((countryName) => (
                                    <div key={countryName}>
                                        {countryName == 'Scotland' ?
                                            <img className={styles.scotlandFlag} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png" alt="Flag Image" />
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
                                        <Link className={styles.teamInformationIconContainer} to={`/team/details/${teamID}`}>
                                            <IoInformationSharp size={34} />
                                        </Link>
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

                                        {Object.entries(positionObject).map(([positionName, playersArray]) => (
                                            <TeamLines key={`${teamID}-${positionName}`} positionName={positionName} playersArray={playersArray} />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className={styles.playersSection}>
                                {starterAndBenchPlayersSchema.map(([teamID, substitutesAndStartersObj], index) => (
                                    <PlayersInformationTable key={teamID} substitutesAndStartersObj={substitutesAndStartersObj} teamId={teamID} />
                                ))}
                            </div>
                        </motion.div>
                }
            </AnimatePresence>
        </section >
    )
}