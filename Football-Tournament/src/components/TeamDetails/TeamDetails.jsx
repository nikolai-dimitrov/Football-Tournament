import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'

import { TournamentContext } from '../../contexts/TournamentContext'
import styles from './team-details.module.css'
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation'
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
                    <motion.div className={styles.loadingLayoutContainer}
                        key="loadingLayoutContainer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <LoadingAnimation />
                    </motion.div >
                    :
                    <motion.div
                        key="contentContainer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7 }}
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
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    )
}