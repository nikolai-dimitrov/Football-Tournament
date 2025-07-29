import { useEffect, useMemo, useContext } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { AnimatePresence } from 'framer-motion'

import { TournamentContext } from '../../contexts/TournamentContext'

import { FadeTransition } from '../FadeTransition/FadeTransition'
import { LoadingAnimation } from '../LoadingAnimation/LoadingAnimation'

import { countryFlags } from '../../constants/countryFlags'

import styles from './team-details.module.css'
export const TeamDetails = () => {
    const { playersMappedWithTeams, isLoading } = useContext(TournamentContext);
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const countryName = searchParams.get('country');

    useEffect(() => {
        if (isLoading) {
            return;
        }

    }, [id]);

    const sortingPriorityObject = {
        'GK': 0,
        'DF': 1,
        'MF': 2,
        'FW': 3,
    }
    
    const players = playersMappedWithTeams[id];

    // useMemo to prevent unnecessary sorting when components re-render
    const sortedPlayersByPosition = useMemo(() => players?.sort((playerA, playerB) => {
        return sortingPriorityObject[playerA.Position] - sortingPriorityObject[playerB.Position]
    }), [players]);

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
                        <div className={styles.headingContainer}>
                            <img className={countryName == 'Scotland' ? `${styles.scotlandFlag}` : ''} src={countryFlags[countryName]} alt="Flag Image" />

                            <h2>{countryName}</h2>
                        </div>
                        <ul className={styles.teamDetailsTable}>
                            <div className={styles.titlesContainer}>
                                <div>
                                    <p>No</p>
                                    <p>Name</p>
                                </div>
                                <p>Pos.</p>
                            </div>
                            {sortedPlayersByPosition.map(currentPlayer => (
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