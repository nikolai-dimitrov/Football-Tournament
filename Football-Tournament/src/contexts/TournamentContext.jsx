import { useState, useEffect, createContext } from "react"
import { csvFileProcessor } from "../services/processCsvService";

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [records, setRecords] = useState([]);
    const [matches, setMatches] = useState([]);
    const [matchesGroupStageSchema, setMatchesGroupStageSchema] = useState({});
    const [matchesPlayedAfterGroups, setMatchesPlayedAfterGroups] = useState([]);

    useEffect(() => {
        Promise.all([
            csvFileProcessor.getMatches(),
            csvFileProcessor.getTeams(),
        ]).then(([matchesData, teamsData]) => {

            const tempTeamsObject = {};
            // Create object with id = Team Name and Group
            teamsData.forEach((el, index) => {
                tempTeamsObject[el.ID] = [el.Name, el.Group]
            });

            const tempMatchesGroupStageSchema = {};
            const tempMatchesPlayedAfterGroups = [];

            // Iterate all matches and set ATeamName = Team Name and same operation for BTeamName = Team Name and set a group where match is played
            matchesData.forEach((currentMatch) => {

                const groupStageFinalDate = new Date('6/26/2024');
                const matchDate = new Date(currentMatch.Date);
                // The group where match is played in (a team and b team are always in same group during the group stage)
                const currentMatchGroup = tempTeamsObject[currentMatch.ATeamID][1];

                const tempExtendedMatchObject = {
                    ...currentMatch,
                    ATeamName: tempTeamsObject[currentMatch.ATeamID][0],
                    BTeamName: tempTeamsObject[currentMatch.BTeamID][0]
                }

                // Get only matches which are played in groups stage
                if (matchDate <= groupStageFinalDate) {
                    if(!tempMatchesGroupStageSchema[currentMatchGroup]) {
                        tempMatchesGroupStageSchema[currentMatchGroup] = [];
                    }
                    tempMatchesGroupStageSchema[currentMatchGroup].push(tempExtendedMatchObject);
                } else {
                    tempExtendedMatchObject['group'] = null;
                    tempMatchesPlayedAfterGroups.push(tempExtendedMatchObject);
                }
            });

            setTeams(teamsData);
            setMatchesGroupStageSchema(tempMatchesGroupStageSchema);
            setMatchesPlayedAfterGroups(tempMatchesPlayedAfterGroups);

        }).catch((error) => console.log(error));
    }, [])

    const values = {
        matchesGroupStageSchema,
        matchesPlayedAfterGroups,
        teams
    }

    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}

