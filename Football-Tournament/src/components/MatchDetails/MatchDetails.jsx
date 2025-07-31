import { useEffect, useState, useContext } from "react"
import { useParams, Link } from "react-router"
import { AnimatePresence, motion } from "framer-motion"
import { Tooltip } from 'react-tooltip'
import { TournamentContext } from "../../contexts/TournamentContext"

import { FadeTransition } from "../FadeTransition/FadeTransition"
import { TeamLines } from "./TeamLines/TeamLines";
import { PlayersInformationTable } from "./PlayersInformationTable/PlayersInformationTable";
import { LoadingAnimation } from "../LoadingAnimation/LoadingAnimation";

import { processMatchPlayers } from "../../utils/buildTournament"
import { countryShortName } from "../../constants/countryShortName"

import { IoInformationSharp } from "react-icons/io5";
import { RiFlipHorizontal2Line } from "react-icons/ri";

import { countryFlags } from "../../constants/countryFlags";
import styles from "./match-details.module.css"

export const MatchDetails = () => {
    const { id } = useParams();
    const [isFlipped, setIsFlipped] = useState(false);
    const [triggerAnimation, setTriggerAnimation] = useState(true);
    const { teams, matches, playersMappedWithMatches, isLoading } = useContext(TournamentContext);
    const [countries, setCountries] = useState([]);
    const [currentMatch, setCurrentMatch] = useState({});
    const [teamsAndPositionsSchema, setTeamsAndPositionsSchema] = useState([]);
    const [starterAndBenchPlayersSchema, setStarterAndBenchPlayersSchema] = useState([]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(min-width: 1224px)");

        const handleResetCard = (e) => {
            if (e.matches) {
                setTriggerAnimation(false);
                setIsFlipped(false);
            };

            requestAnimationFrame(() => setTriggerAnimation(true));

        }

        mediaQuery.addEventListener("change", handleResetCard);

        if (isLoading) {
            return;
        }

        const match = matches.find((el) => el.ID == id);
        const formattedScore = match.Score.replace("-", " : ");

        const { ATeamID, BTeamID } = match;

        const ACountryName = teams.find((currentTeam) => currentTeam.ID == ATeamID).Name;
        const BCountryName = teams.find((currentTeam) => currentTeam.ID == BTeamID).Name;

        const allPlayersInMatch = playersMappedWithMatches[id];

        const [tempStarterAndBenchPlayersSchema, tempTeamsAndPositionsSchema] = processMatchPlayers(allPlayersInMatch, ATeamID, BTeamID);

        setCountries(state => [ACountryName, BCountryName]);
        setCurrentMatch(state => ({ ...match, Score: formattedScore }));
        setStarterAndBenchPlayersSchema(state => tempStarterAndBenchPlayersSchema);
        setTeamsAndPositionsSchema(state => tempTeamsAndPositionsSchema);

        return () => mediaQuery.removeEventListener("change", handleResetCard);

    }, [id, isLoading]);

    return (
        <section className={styles.matchDetails}>
            <AnimatePresence mode="wait">
                {
                    isLoading ?
                        <FadeTransition
                            className={styles.loadingLayoutContainer}
                            keyString="loadingLayoutContainer"
                            durationSeconds={0.3}
                            isInAnimatePresence={true}
                        >
                            <LoadingAnimation />
                        </FadeTransition>
                        :
                        <FadeTransition
                            keyString="contentContainer"
                            durationSeconds={0.7}
                            isInAnimatePresence={true}
                        >
                            <div className={styles.matchResultContainer}>
                                {countries.map((countryName) => (
                                    <div key={countryName}>
                                        <img className={countryName == 'Scotland' ? `${styles.scotlandFlag}` : ''} src={countryFlags[countryName]} alt="Flag Image" />
                                        <p >{countryShortName[countryName]}</p>
                                    </div>
                                ))}
                                <p className={styles.score} >{currentMatch.Score}</p>
                            </div>
                            <div className={styles.teamsContentContainer}>
                                <motion.div
                                    className={styles.flipCardsContainer}
                                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                                    transition={{ duration: triggerAnimation ? 0.7 : 0 }}
                                >
                                    {teamsAndPositionsSchema.map(([teamID, positionObject], index) => (
                                        <div key={teamID} className={index == 0 ? `${styles.frontSide}` : `${styles.backSide}`}>
                                            <div className={styles.field}>
                                                <Link className={styles.teamInformationIconContainer} to={`/team/details/${teamID}?country=${countries[index]}`}>
                                                    <div data-tooltip-id="my-tooltip-1">
                                                        <IoInformationSharp size={34} />

                                                        <Tooltip
                                                            id="my-tooltip-1"
                                                            place="top"
                                                            content={`Team Details - ${countries[index]}`}
                                                            hidden={window.innerWidth < 1000 ?true : false}

                                                        />
                                                    </div>
                                                </Link>
                                                <div className={styles.flipCardIconContainer} data-tooltip-id="my-tooltip-2" onClick={() => setIsFlipped(!isFlipped)}>
                                                    <RiFlipHorizontal2Line size={34} />

                                                    <Tooltip
                                                        id="my-tooltip-2"
                                                        place="top"
                                                        // Show the name of the opposite team as tooltip content
                                                        content={index == 0 ? `${countries[1]}` : `${countries[0]}`}
                                                    />
                                                </div>
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
                                            <div className={styles.playersSection}>
                                                <PlayersInformationTable substitutesAndStarters={starterAndBenchPlayersSchema[teamID]} teamId={teamID} />
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </FadeTransition>
                }
            </AnimatePresence>
        </section >
    )
}