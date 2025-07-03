import { useState, useEffect, createContext } from "react"
import { csvFileProcessor } from "../services/processCsvService";

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [records, setRecords] = useState([]);
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        Promise.all([
            csvFileProcessor.getMatches(),
            csvFileProcessor.getTeams(),
        ]).then(([matchesData, teamsData]) => {
            setMatches(matchesData);
            setTeams(teamsData)
        }).catch((error) => console.log(error));
    }, [])

    // Map ATeam name with ATeamID and BTeam name with BTeamID (implement reduce for better performance)
    const mappedTeamsWithMatches = matches.map((currentMatch) => {
        const aTeam = teams.find((el) => el.ID === currentMatch.ATeamID)
        const bTeam = teams.find((el) => el.ID === currentMatch.BTeamID)
        
        return {
            ...currentMatch,
            ATeamName: aTeam?.Name,
            BTeamName: bTeam?.Name
        }
    })

    console.log(mappedTeamsWithMatches)
    
    let values = {
        x: 5
    }



    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}