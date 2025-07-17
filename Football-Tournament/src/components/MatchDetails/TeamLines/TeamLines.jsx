import { BiTransfer } from "react-icons/bi";

import styles from "./team-lines.module.css"

export const TeamLines = ({ positionName, playersArray}) => {

    return (
        <div className={`${styles.positionLine} ${styles[positionName]}`}>
            {playersArray.map((currentPlayer) => (
                currentPlayer.fromMinutes == '0' ? (
                    <div key={`${currentPlayer.playerDetails.FullName}`}>
                        {
                            currentPlayer.fromMinutes == '0' &&
                            <div key={currentPlayer.playerDetails.FullName} className={styles.playerInformationContainer}>
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
                    </div>
                ) : null
            ))}
        </div>
    )
}