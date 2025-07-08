import { useContext } from "react"
import { Link } from "react-router"
import { TournamentContext } from "../../contexts/TournamentContext"

import styles from './home.module.css'

export const Home = () => {
    const { matchesGroupStageSchema, matchesPlayedAfterGroupsSchema } = useContext(TournamentContext);

    return (
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
                                                <p>{currentMatch.Date}</p>
                                                <div className={styles.scoreInformationContainer}>
                                                    <div className={currentMatch.teamWinner == currentMatch.ATeamName ? styles.winnerHighlight : ''}>
                                                        <p>{currentMatch.ATeamName}</p>
                                                        <p>{currentMatch.teamAscore}</p>
                                                    </div>
                                                    <div className={currentMatch.teamWinner == currentMatch.BTeamName ? styles.winnerHighlight : ''}>
                                                        <p>{currentMatch.BTeamName}</p>
                                                        <p>{currentMatch.teamBscore}</p>
                                                    </div>
                                                </div>
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
                {matchesPlayedAfterGroupsSchema.map((matchesArray, index) => {

                    return (
                        <div key={index} className={styles.qualificationMatchesContent}>
                            <h3>{['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Finals'][index]}</h3>
                            <ul>
                                {matchesArray.map((currentMatch) => {
                                    return (
                                        <Link
                                            key={currentMatch.ID}
                                            to={`/match/details/${currentMatch.ID}`}
                                        >
                                            <li className={styles.matchBracket}>
                                                <p>{currentMatch.Date}</p>
                                                <div className={styles.scoreInformationContainer}>
                                                    <div className={currentMatch.teamWinner == currentMatch.ATeamName ? styles.winnerHighlight : ''}>
                                                        <p>{currentMatch.ATeamName}</p>
                                                        <p>{currentMatch.teamAscore}</p>
                                                    </div>
                                                    <div className={currentMatch.teamWinner == currentMatch.BTeamName ? styles.winnerHighlight : ''}>
                                                        <p>{currentMatch.BTeamName}</p>
                                                        <p>{currentMatch.teamBscore}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        </Link>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </section>
        </div>

    )
}
