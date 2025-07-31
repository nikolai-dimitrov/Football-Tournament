import { useState, useEffect, useContext } from "react"
import { Link } from "react-router"
import { motion } from "framer-motion"
import { FadeTransition } from "../FadeTransition/FadeTransition"
import { TournamentContext } from "../../contexts/TournamentContext"

import { Match } from "./Match/Match"

import styles from './home.module.css'

export const Home = () => {
    const [isScrollable, setIsScrollable] = useState(() => {
        return window.innerWidth < 1600 ? true : false;
    });

    const { matchesGroupStageSchema, matchesPlayedAfterGroupsSchema } = useContext(TournamentContext);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 1600px)");

        const handleMediaQueryChange = (e) => {
            if (e.matches) {
                setIsMobile(true);
            };

        }

        mediaQuery.addEventListener("change", handleMediaQueryChange);

        return () => mediaQuery.removeEventListener("change", handleMediaQueryChange);

    }, [])

    const classNamesMapper = {
        0: 'roundOfEight',
        1: 'quarterFinals',
        2: 'semiFinals',
        3: 'finals'
    };

    return (
        <FadeTransition
            durationSeconds={0.3}
            isInAnimatePresence={false}
        >
            <div className={styles.home}>
                <section className={styles.groupsLayout}>
                    <h2>Groups</h2>
                    <div className={styles.groupsContainer}>
                        {matchesGroupStageSchema?.map(([matchGroupName, groupMatchesArray], index) => (
                            <div className={styles.group} key={index}>
                                <h3>{matchGroupName}</h3>
                                <ul className={styles.groupContent}>
                                    {groupMatchesArray.map((currentMatch, index) => {
                                        return (
                                            <Link
                                                key={currentMatch.ID}
                                                to={`/match/details/${currentMatch.ID}`}
                                            >
                                                <li className={styles.matchContainer}>
                                                    <Match currentMatch={currentMatch} />
                                                </li>
                                            </Link>
                                        )
                                    })}
                                </ul>
                            </div>

                        ))}
                    </div>
                </section>

                <section className={styles.matchBracketsLayout} >
                    <motion.div
                        className={styles.matchBracketsContainer}
                        whileInView={
                            isScrollable ? {
                                x: [0, -15, 15, 0],
                                transition: {
                                    duration: 1.3,
                                }
                            } : {}
                        }

                        viewport={{
                            once: false,
                            amount: 0.8
                        }}
                    >
                        {matchesPlayedAfterGroupsSchema.map((matchesArray, index) => (
                            <div key={index} className={styles.qualificationMatchesContent}>
                                <h3>{['Round of Eight', 'Quarter-Finals', 'Semi-Finals', 'Finals'][index]}</h3>
                                <ul className={styles[classNamesMapper[index]]}>
                                    {matchesArray.map((currentMatch, matchIndex) => (
                                        <Link
                                            key={currentMatch.ID}
                                            to={`/match/details/${currentMatch.ID}`}
                                        >
                                            <li className={matchIndex % 2 === 1 ? `${styles.matchBracket} ${styles.even}` : `${styles.matchBracket}`}>
                                                <div className={styles.connector}></div>
                                                <Match currentMatch={currentMatch} />
                                            </li>
                                        </Link>
                                    ))}
                                </ul>
                            </div>
                        )
                        )}
                    </motion.div>
                </section >
            </div >
        </FadeTransition>
    )
}
