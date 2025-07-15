import { useState, useEffect, createContext } from "react";
import { csvFileProcessor } from "../services/processCsvService";

import { createTournamentRoundsMatrix, convertMatrixToSortedArray, createPlayersToTeamsRelations, createPlayersToMatchesRelations } from "../utils/buildTournament";

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    const [playersMappedWithTeams, setPlayersMappedWithTeams] = useState({});
    const [playersMappedWithMatches, setPlayersMappedWithMatches] = useState({});
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [matchesGroupStageSchema, setMatchesGroupStageSchema] = useState([]);
    const [matchesPlayedAfterGroupsSchema, setMatchesPlayedAfterGroupsSchema] = useState([]);

    useEffect(() => {
        Promise.all([
            csvFileProcessor.getMatches(),
            csvFileProcessor.getTeams(),
            csvFileProcessor.getPlayers(),
            csvFileProcessor.getRecords(),
        ]).then(([matchesData, teamsData, playersData, playerRecordsData]) => {

            const tempTeamsObject = {};
            // Create object with id = Team Name and Group
            teamsData.forEach((el) => {
                tempTeamsObject[el.ID] = [el.Name, el.Group]
            });

            let tempMatchesGroupStageSchema = {};
            // Array with all matches played after group
            let tempMatchesPlayedAfterGroups = [];
            // Matrix contains arrays, each array contains matches for every stage of tournament after the groups. (array[0] => 8 matches (rounds of eight), array[1] => 4 (quarter finals) and following.)
            let tempMatchesPlayedAfterGroupsSchema = [];
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

                if (teamAscore.length > 1) {
                    // Get scored penalties if match finishes with equal result
                    const teamApenaltyScore = teamAscore[2];
                    const teamBpenaltyScore = teamBscore[2];

                    if (Number(teamApenaltyScore) > Number(teamBpenaltyScore)) {
                        teamWinner = ATeamName;
                    }
                    else if (Number(teamApenaltyScore) < Number(teamBpenaltyScore)) {
                        teamWinner = BTeamName;
                    }

                } else {
                    if (Number(teamAscore) > Number(teamBscore)) {
                        teamWinner = ATeamName;
                    }
                    else if (Number(teamAscore) < Number(teamBscore)) {
                        teamWinner = BTeamName;
                    }
                }

                const tempExtendedMatchObject = {
                    ...currentMatch,
                    ATeamName,
                    BTeamName,
                    teamAscore,
                    teamBscore,
                    teamWinner
                }

                if (currentMatchDate <= groupStageFinalDate) {
                    // Get only matches which are played in groups stage.
                    if (!tempMatchesGroupStageSchema[currentMatchGroup]) {
                        tempMatchesGroupStageSchema[currentMatchGroup] = [];
                    }

                    tempMatchesGroupStageSchema[currentMatchGroup].push(tempExtendedMatchObject);
                } else {
                    // Get only matches which are played after the group stage.
                    tempMatchesPlayedAfterGroups.push(tempExtendedMatchObject);
                }
            });

            // Create array with nested arrays and sort them by group name which is in nested arrays at index 0 from A -> F
            tempMatchesGroupStageSchema = Object.entries(tempMatchesGroupStageSchema).sort((a, b) => a[0].localeCompare(b[0]));

            // Sort by date to ensure last match will be the final
            tempMatchesPlayedAfterGroups.sort((a, b) => new Date(a.Date) - new Date(b.Date));

            // Convert matches to matrix which every array represent each round of the tournament.
            // Convert array to a matrix because i have to iterate over the round of 16 and quarter-finals together and check each pair of teams in the quarter-finals from which pairs of teams in the round of 16 it comes from.
            tempMatchesPlayedAfterGroupsSchema = createTournamentRoundsMatrix([8, 4, 2, 1], tempMatchesPlayedAfterGroups);

            // Convert matrix with rounds of the tournament to sorted array with match objects.
            // Sort the array based on which pair of teams in the quarter-finals from which pairs of teams in the round of 16 it comes from and same for next stages of the tournament.
            const sortedMatchesArray = convertMatrixToSortedArray(tempMatchesPlayedAfterGroupsSchema);

            // Convert sorted array with match objects to matrix which represents the final sorted tournament schema.
            const tempSortedMatchesPlayedAfterGroupsSchema = createTournamentRoundsMatrix([8, 4, 2, 1], sortedMatchesArray);

            // Mapped TeamID:[{player}, {player}]
            // TODO: Use playersMatchesRelation in Team Details and remove that.
            const playersTeamsRelationsObject = createPlayersToTeamsRelations(playersData);

            // Record object with added additional property playerDetails which contains player information like FullName Position etc.
            // Mapped MatchID:[{playerRecord}, {playerRecord}] where playerRecord is object with information matchId, playerId, fromMinutes, toMinutes and playerDetails: {} where playerDetails contains player information like: name position etc.
            const playersMatchesRelationsObject = createPlayersToMatchesRelations(playerRecordsData, playersData);

            setTeams(teamsData);
            setMatches(matchesData)
            setPlayersMappedWithTeams(playersTeamsRelationsObject);
            setPlayersMappedWithMatches(playersMatchesRelationsObject);
            setMatchesGroupStageSchema(tempMatchesGroupStageSchema);
            setMatchesPlayedAfterGroupsSchema(tempSortedMatchesPlayedAfterGroupsSchema);
            // console.log('INVOKE START APP')
        }).catch((error) => console.log(error));

    }, []);

    const values = {
        teams,
        matches,
        playersMappedWithTeams,
        playersMappedWithMatches,
        matchesGroupStageSchema,
        matchesPlayedAfterGroupsSchema,

    };

    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}

