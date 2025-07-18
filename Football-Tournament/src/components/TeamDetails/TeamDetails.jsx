import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'

import { TournamentContext } from '../../contexts/TournamentContext'
import styles from './team-details.module.css'
export const TeamDetails = () => {
    const { playersMappedWithTeams } = useContext(TournamentContext);
    const { id } = useParams();

    return (
        <div className={styles.teamDetails}>
            <ul className={styles.teamDetailsTable}>
                <div className={styles.titlesContainer}>
                    <div>
                        <p>No</p>
                        <p>Name</p>
                    </div>
                    <p>Pos.</p>
                </div>
                {playersMappedWithTeams[id].map(currentPlayer => (
                    <li className={styles.teamDetailsRow} key={currentPlayer.FullName}>
                        <div>
                            <p>
                                {currentPlayer.TeamNumber}
                            </p>
                            <p>
                                {currentPlayer.FullName}
                            </p>
                        </div>
                        <p>
                            {currentPlayer.Position}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    )
}