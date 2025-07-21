import { useContext } from "react"
import { Link } from "react-router"
import { FadeTransition } from "../FadeTransition/FadeTransition"
import { TournamentContext } from "../../contexts/TournamentContext"

import { Match } from "./Match/Match"

import styles from './home.module.css'

export const Home = () => {
    const { matchesGroupStageSchema, matchesPlayedAfterGroupsSchema } = useContext(TournamentContext);

    const classNamesMapper = {
        0: 'roundOfEight',
        1: 'quarterFinals',
        2: 'semiFinals',
        3: 'finals'
    }

    return (
        <FadeTransition
            durationSeconds={0.3}
            isInAnimatePresence={false}
        >
            <div className={styles.home}>
                <section className={styles.groupCardsContainer}>
                    <h2>Groups</h2>
                    {matchesGroupStageSchema?.map(([matchGroupName, groupMatchesArray], index) => {
                        return (
                            <div className={styles.groupContainer} key={index}>
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
                        )
                    })}
                </section>
                <section className={styles.matchBracketsContainer}>
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
                </section >
            </div >
        </FadeTransition>
    )
}
