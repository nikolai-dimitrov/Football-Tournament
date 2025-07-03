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

            const tempTeamsObject = {};
            // Create object with id = Team Name
            teamsData.forEach((el, index) => {
                tempTeamsObject[el.ID] = el.Name
            });
        
            // Iterate all matches and set ATeamName = Team Name and same operation for BTeamName = Team Name
            const mappedMatches = matchesData.map((currentMatch) => {
                return {
                    ...currentMatch,
                    ATeamName: tempTeamsObject[currentMatch.ATeamID],
                    BTeamName: tempTeamsObject[currentMatch.BTeamID]
                }
            });

            setMatches(matchesData);
            setTeams(teamsData)
            setMappedMatchesWithTeamNames(mappedMatches)

        }).catch((error) => console.log(error));
    }, [])

    console.log(mappedMatchesWithTeamNames)

    const values = {
        mappedMatchesWithTeamNames,
    }

    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}