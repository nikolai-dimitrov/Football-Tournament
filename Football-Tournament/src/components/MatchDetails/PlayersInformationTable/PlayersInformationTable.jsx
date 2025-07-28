import { BiTransfer } from "react-icons/bi";

import styles from "./players-information-table.module.css"

export const PlayersInformationTable = ({ substitutesAndStarters, teamId }) => {

    return (
        <div className={styles.playersContainer}>
            {/* type: starter OR substitutes, playersArray: array with objects which is corresponding to starter or substitute type for the current team and match */}
            {Object.entries(substitutesAndStarters).map(([type, playersArray], index) => (
                (playersArray.length > 0 ?
                    (
                        <ul key={`${teamId}-${type}`}>
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
                            {playersArray?.map((currentPlayerRecord) => (
                                <li key={currentPlayerRecord.playerDetails.FullName} className={styles.playerRecord}>
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
                        </ul>)
                    : null)
            ))}
        </div>
    )
}