import { useState, useEffect, createContext } from "react";
import { csvFileProcessor } from "../services/processCsvService";

import { mapMatchesWithTournamentPhases, createTournamentRoundsMatrix, convertMatrixToSortedArray, createPlayersToTeamsRelations, createPlayersToMatchesRelations } from "../utils/buildTournament";

export const TournamentContext = createContext();
export const TournamentProvider = ({ children }) => {
    const [playersMappedWithTeams, setPlayersMappedWithTeams] = useState({});
    const [playersMappedWithMatches, setPlayersMappedWithMatches] = useState({});
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [matchesGroupStageSchema, setMatchesGroupStageSchema] = useState([]);
    const [matchesPlayedAfterGroupsSchema, setMatchesPlayedAfterGroupsSchema] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            csvFileProcessor.getMatches(),
            csvFileProcessor.getTeams(),
            csvFileProcessor.getPlayers(),
            csvFileProcessor.getRecords(),
        ]).then(([matchesData, teamsData, playersData, playerRecordsData]) => {

            const teamsObject = {};
            // Create object with id = Team Name and Group
            teamsData.forEach((el) => {
                teamsObject[el.ID] = [el.Name, el.Group]
            });
            // check teams data

            // tempMatchesPlayedInGroups - object with group names as keys and for each key there is array which contains all matches played in this group.
            // tempMatchesPlayedAfterGroups - array with matches which are played after the groups
            let { tempMatchesPlayedInGroups, tempMatchesPlayedAfterGroups } = mapMatchesWithTournamentPhases(matchesData, teamsObject);

            // Create array with nested arrays and sort them by group name which is in nested arrays at index 0 from A -> F
            const tempMatchesGroupStageSchema = Object.entries(tempMatchesPlayedInGroups).sort((a, b) => a[0].localeCompare(b[0]));

            // Convert matches to matrix which every array represent each round of the tournament.
            // Matrix contains arrays, each array contains matches for every stage of tournament after the groups. (array[0] => 8 matches (rounds of eight), array[1] => 4 (quarter finals) and following.)
            const tempMatchesPlayedAfterGroupsSchema = createTournamentRoundsMatrix([8, 4, 2, 1], tempMatchesPlayedAfterGroups);

            // Convert matrix with rounds of the tournament to sorted array with match objects.
            // Sort the array based on which pair of teams in the quarter-finals from which pairs of teams in the round of 16 it comes from and same for next stages of the tournament.
            const sortedMatchesArray = convertMatrixToSortedArray(tempMatchesPlayedAfterGroupsSchema);

            // Convert sorted array with match objects to matrix which represents the final sorted tournament schema.
            const tempSortedMatchesPlayedAfterGroupsSchema = createTournamentRoundsMatrix([8, 4, 2, 1], sortedMatchesArray);

            // Object with key - TeamID, value - Array with players which plays in this team. { TeamID:[{player}, {player} ...]}
            const playersTeamsRelationsObject = createPlayersToTeamsRelations(playersData);

            // Object with key MatchID, value - Array with object each of this objects represents players who played in this match. { MatchID:[{playerRecord}, {playerRecord}] }
            // There is additional property playerDetails added to each player object which contains player information like FullName Position etc.
            const playersMatchesRelationsObject = createPlayersToMatchesRelations(playerRecordsData, playersData);

            setTeams(teamsData);
            setMatches(matchesData);
            setPlayersMappedWithTeams(playersTeamsRelationsObject);
            setPlayersMappedWithMatches(playersMatchesRelationsObject);
            setMatchesGroupStageSchema(tempMatchesGroupStageSchema);
            setMatchesPlayedAfterGroupsSchema(tempSortedMatchesPlayedAfterGroupsSchema);

        }).catch((error) => {
            console.log(error);
            setIsLoading(false)
        });

        const loadingTimeoutId = setTimeout(() => (
            setIsLoading(false)
        ), 500);

        return () => clearTimeout(loadingTimeoutId);
    }, []);

    const values = {
        teams,
        matches,
        playersMappedWithTeams,
        playersMappedWithMatches,
        matchesGroupStageSchema,
        matchesPlayedAfterGroupsSchema,
        isLoading,

    };

    return (
        <TournamentContext.Provider value={values}>
            {children}
        </TournamentContext.Provider>
    )
}

