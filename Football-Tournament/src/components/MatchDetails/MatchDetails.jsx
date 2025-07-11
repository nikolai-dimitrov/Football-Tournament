import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router"
import { TournamentContext } from "../../contexts/TournamentContext"

import styles from "./match-details.module.css"

export const MatchDetails = () => {
    // const [playersRecords, setPlayersRecords] = [];
    const [currentMatch, setCurrentMatch] = useState({});
    const [teamsAndPositionsSchema, setTeamsAndPositionsSchema] = useState({});
    const { matches, playersMappedWithMatches } = useContext(TournamentContext);
    const { id } = useParams();

    useEffect(() => {
        const tempCurrentMatch = matches.find((el) => el.ID == id);
        const { ATeamID, BTeamID } = tempCurrentMatch;

        const allPlayersInMatch = playersMappedWithMatches[id];

        const tempTeamsAndPositionsSchema = {
            [ATeamID]: {},
            [BTeamID]: {}
        };

        allPlayersInMatch.forEach((currentPlayer) => {
            const currentPlayerPosition = currentPlayer.playerDetails.Position;
            const currentPlayerTeamId = currentPlayer.playerDetails.TeamID;

            // For each position create key DF, MF, CF and value array which contains players who play in that position
            if (!(currentPlayerPosition in tempTeamsAndPositionsSchema[currentPlayerTeamId])) {
                tempTeamsAndPositionsSchema[currentPlayerTeamId][currentPlayerPosition] = [];
            }

            tempTeamsAndPositionsSchema[currentPlayerTeamId][currentPlayerPosition].push(currentPlayer);

        })

        console.log(tempTeamsAndPositionsSchema, 'players in the match with their positions')

        setCurrentMatch(state => tempCurrentMatch);
        setTeamsAndPositionsSchema(state => tempTeamsAndPositionsSchema);
        console.log(Object.entries(teamsAndPositionsSchema))

    }, [id])

    return (
        <section className={styles.matchDetails}>
            <>
                <h1>Match Details</h1>
                <div className={styles.fieldsContainer}>
                    {Object.entries(teamsAndPositionsSchema).map(([teamID, positionObject]) => {
                        return (
                            <div className={styles.field}>
                                {Object.entries(positionObject).map(([positionName, playersArray]) => {
                                    return (
                                        <div>
                                            {playersArray.map((currentPlayer) => {
                                                return (
                                                    <>
                                                        {
                                                            currentPlayer.fromMinutes == '0' &&
                                                            <div>
                                                                <div>{currentPlayer.playerDetails.Position}</div>
                                                            </div>

                                                        }
                                                    </>
                                                )
                                            })}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                </div>
            </>
        </section>
    )
}