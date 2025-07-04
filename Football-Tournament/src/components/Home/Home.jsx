import { useContext } from "react"
import { TournamentContext } from "../../contexts/TournamentContext"

import styles from './home.module.css'

export const Home = () => {
    const { matchesGroupStageSchema, matchesPlayedAfterGroups, teams } = useContext(TournamentContext);
    console.log(matchesGroupStageSchema)

    return (
        <div>
            <section className={styles.groupCardsContainer}>
                {matchesGroupStageSchema?.map(([matchGroupName, groupMatchesArray], index) => {
                    return (
                        <div className={styles.groupContainer} key={index}>
                            <h3>{matchGroupName}</h3>
                            <ul className={styles.groupContent}>
                                {groupMatchesArray.map((currentMatch, index) => {
                                    return (
                                        <li className={styles.matchContainer} key={currentMatch.ID}>
                                            <p>{currentMatch.Date}</p>
                                            <div className={styles.scoreInformationContainer}>
                                                <div className={currentMatch.teamWinner == currentMatch.ATeamName ? styles.winnerHighlight : '' }>
                                                    <p>{currentMatch.ATeamName}</p>
                                                    <p>{currentMatch.teamAscore}</p>
                                                </div>
                                                <div className={currentMatch.teamWinner == currentMatch.BTeamName ? styles.winnerHighlight : '' }>
                                                    <p>{currentMatch.BTeamName}</p>
                                                    <p>{currentMatch.teamBscore}</p>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                })}
            </section>
            <section>
                {/* Qualified teams schema section */}
            </section>
        </div>

    )
}
