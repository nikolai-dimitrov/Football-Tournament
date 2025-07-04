import { useState, useEffect, createContext } from "react"
import { csvFileProcessor } from "../services/processCsvService";

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    const [players, setPlayers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [records, setRecords] = useState([]);
    const [matches, setMatches] = useState([]);
    const [matchesGroupStageSchema, setMatchesGroupStageSchema] = useState([]);
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

            let tempMatchesGroupStageSchema = {};
            let tempMatchesPlayedAfterGroups = [];

            // Iterate all matches and set ATeamName = Team Name and same operation for BTeamName = Team Name and set a group where match is played
            matchesData.forEach((currentMatch) => {

                const ATeamName = tempTeamsObject[currentMatch.ATeamID][0];
                const BTeamName = tempTeamsObject[currentMatch.BTeamID][0];

                const groupStageFinalDate = new Date('6/26/2024');
                const currentMatchDate = new Date(currentMatch.Date);
                // The group where match is played in (a team and b team are always in same group during the group stage)
                const currentMatchGroup = tempTeamsObject[currentMatch.ATeamID][1];
                const currentMatchScore = currentMatch.Score;

                const [teamAscore, teamBscore] = currentMatchScore.split('-');
                let teamWinner = null;

                if (Number(teamAscore) > Number(teamBscore)) {
                    teamWinner = ATeamName;
                }
                else if (Number(teamAscore) < Number(teamBscore)) {
                    teamWinner = BTeamName;
                }

                const tempExtendedMatchObject = {
                    ...currentMatch,
                    ATeamName,
                    BTeamName,
                    teamAscore,
                    teamBscore,
                    teamWinner

                }

                // Get only matches which are played in groups stage
                if (currentMatchDate <= groupStageFinalDate) {
                    if (!tempMatchesGroupStageSchema[currentMatchGroup]) {
                        tempMatchesGroupStageSchema[currentMatchGroup] = [];
                    }
                    tempMatchesGroupStageSchema[currentMatchGroup].push(tempExtendedMatchObject);
                } else {
                    tempExtendedMatchObject['group'] = null;
                    tempMatchesPlayedAfterGroups.push(tempExtendedMatchObject);
                }
            });

            // Create array with nested arrays and sort them by group name which is in nested arrays at index 0 from A -> F
            tempMatchesGroupStageSchema = Object.entries(tempMatchesGroupStageSchema).sort((a, b) => a[0].localeCompare(b[0]));

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

