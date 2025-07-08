import { useContext } from "react"
import { TournamentContext } from "../../contexts/TournamentContext"

import styles from './home.module.css'

export const Home = () => {
    const { matchesGroupStageSchema, matchesPlayedAfterGroupsSchema} = useContext(TournamentContext);

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
                                        <li className={styles.matchContainer} key={currentMatch.ID}>
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
                        <ul key={index} className={styles.qualificationMatchesContent}>
                            <h3>{['Round of 16', 'Quarter-Finals', 'Semi-Finals', 'Finals'][index]}</h3>
                            {matchesArray.map((currentMatch) => {
                                return (
                                    <li key={currentMatch.ID} className={styles.matchBracket}>
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
                                )
                            })}
                        </ul>
                    )
                })}
            </section>
        </div>

    )
}
