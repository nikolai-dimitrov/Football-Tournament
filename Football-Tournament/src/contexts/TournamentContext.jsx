import { useState, useEffect, createContext } from "react"
import { csvFileProcessor } from "../services/processCsvService";

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [records, setRecords] = useState([]);
    const [matches, setMatches] = useState([]);
    const [mappedMatchesWithTeamNames, setMappedMatchesWithTeamNames] = useState([]);

    useEffect(() => {
        Promise.all([
            csvFileProcessor.getMatches(),
            csvFileProcessor.getTeams(),
        ]).then(([matchesData, teamsData]) => {
            setMatches(matchesData);
            setTeams(teamsData)

            const tempTeamsObject = {};
            // Create object with id = Team Name
            teams.forEach((el, index) => {
                tempTeamsObject[el.ID] = el.Name
            });
        
            // Iterate all matches and set ATeamName = Team Name and same operation for BTeamName = Team Name
            const mappedMatches = matches.map((currentMatch) => {
                return {
                    ...currentMatch,
                    ATeamName: tempTeamsObject[currentMatch.ATeamID],
                    BTeamName: tempTeamsObject[currentMatch.BTeamID]
                }
            });

            setMappedMatchesWithTeamNames((state) => ({...state , mappedMatches}))
        }).catch((error) => console.log(error));
    }, [])

    console.log(mappedMatchesWithTeamNames)

    let values = {
        mappedMatchesWithTeamNames
    }

    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}