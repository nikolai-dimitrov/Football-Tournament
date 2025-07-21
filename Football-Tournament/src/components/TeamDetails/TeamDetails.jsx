import { useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'

import { TournamentContext } from '../../contexts/TournamentContext'

import { FadeTransition } from '../FadeTransition/FadeTransition'
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation'

import styles from './team-details.module.css'
export const TeamDetails = () => {
    const { playersMappedWithTeams, isLoading } = useContext(TournamentContext);
    const { id } = useParams();

    useEffect(() => {
        if (isLoading) {
            return;
        }

    }, [])
    return (
        <div className={styles.teamDetails}>
            <AnimatePresence mode="wait">
                {isLoading ?
                    <FadeTransition
                        className={styles.loadingLayoutContainer}
                        keyString="loadingLayoutContainer"
                        durationSeconds={0.3}
                        isInAnimatePresence={true}
                    >
                        <LoadingAnimation />
                    </FadeTransition >
                    :
                    <FadeTransition
                        keyString="contentContainer"
                        isInAnimatePresence={false}
                        durationSeconds={0.7}
                    >
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
                    </FadeTransition>
                }
            </AnimatePresence>
        </div>
    )
}