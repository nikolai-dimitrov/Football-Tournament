import { countryFlags } from "../../../constants/countryFlags"

import styles from "./match.module.css"

export const Match = ({currentMatch}) => {
    return (
        <>
            <p>{currentMatch.Date}</p>
            <div className={styles.scoreInformationContainer}>
                <div className={currentMatch.teamWinner == currentMatch.ATeamName ? styles.winnerHighlight : ''}>
                    <div>
                        {currentMatch.ATeamName == 'Scotland' ?
                            <img className={styles.scotlandFlag} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png" alt="Flag Image" />
                            :
                            <img src={countryFlags[currentMatch.ATeamName]} alt="Flag Image" />

                        }
                        <p>{currentMatch.ATeamName}</p>
                    </div>
                    <p>{currentMatch.ATeamScore}</p>
                </div>
                <div className={currentMatch.teamWinner == currentMatch.BTeamName ? styles.winnerHighlight : ''}>
                    <div>
                        {currentMatch.BTeamName == 'Scotland' ?
                            <img className={styles.scotlandFlag} src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Flag_of_Scotland.svg/1200px-Flag_of_Scotland.svg.png" alt="Flag Image" />
                            :
                            <img src={countryFlags[currentMatch.BTeamName]} alt="Flag Image" />

                        }
                        <p>{currentMatch.BTeamName}</p>
                    </div>
                    <p>{currentMatch.BTeamScore}</p>
                </div>
            </div>
        </>
    )
}