import { useEffect, useState, useContext } from "react"
import { useParams } from "react-router"
import { TournamentContext } from "../../contexts/TournamentContext"

import styles from "./match-details.module.css"

export const MatchDetails = () => {
    // const [playersRecords, setPlayersRecords] = [];
    const [currentMatch, setCurrentMatch] = useState({});
    // const [playersInCurrentMatch, setPlayersInCurrentMatch] = useState({});
    const { matches, playersMappedWithMatches } = useContext(TournamentContext);
    const { id } = useParams();
    console.log(id)
    useEffect(() => {
        const tempCurrentMatch = matches.find((el) => el.ID == id);
        const allPlayersInMatch = playersMappedWithMatches[id]
        const { ATeamID, BTeamID } = tempCurrentMatch;

        const playersFromAteam = allPlayersInMatch.filter((playerRecord) => playerRecord['playerDetails'].TeamID === ATeamID);
        const playersFromBteam = allPlayersInMatch.filter((playerRecord) => playerRecord['playerDetails'].TeamID === BTeamID);


        console.log(playersFromAteam, 'a team');
        console.log(playersFromBteam, 'a team');


        setCurrentMatch(oldState => tempCurrentMatch);

    }, [id])

    return (
        <section className={styles.matchDetails}>
            <h1>Match Details</h1>
            <div></div>
            <h2>Players:</h2>
        </section>
    )
}