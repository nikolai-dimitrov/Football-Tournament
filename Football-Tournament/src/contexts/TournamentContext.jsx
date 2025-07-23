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

            const allTeams = {};

            // If csv file order changes it will prevent wrong relations, because of keys.
            // Easier to take Team Data by ID and avoid using .find() method for every match record to get the Team Data
            teamsData.forEach((el) => {
                allTeams[el.ID] = {
                    ...el
                }
            });

            let { matchesPlayedInGroups, matchesPlayedAfterGroups } = mapMatchesWithTournamentPhases(matchesData, allTeams);

            // Create sorted matrix by group A -> F
            const groupStageSchema = Object.entries(matchesPlayedInGroups).sort((a, b) => a[0].localeCompare(b[0]));

            // Convert matches to matrix where every array represent each round of the tournament after group stage.
            const matchesAfterGroups = createTournamentRoundsMatrix([8, 4, 2, 1], matchesPlayedAfterGroups);

            // Sort the array based on which pair of teams in the quarter-finals from which pairs of teams in the round of 16 it comes from and same for next stages of the tournament.
            const sortedMatchesAfterGroups = convertMatrixToSortedArray(matchesAfterGroups);

            // Convert sorted array with match objects to matrix which represents the final sorted tournament schema.
            const matchesPlayedAfterGroupsSchema = createTournamentRoundsMatrix([8, 4, 2, 1], sortedMatchesAfterGroups);

            // Object with key - TeamID, value - Array with players which plays in this team. { TeamID:[{player}, {player} ...]}
            const playersTeamsRelationsObject = createPlayersToTeamsRelations(playersData);

            // Object with key MatchID, value - Array with object each of this objects represents players who played in this match. { MatchID:[{playerRecord}, {playerRecord}] }
            // There is additional property playerDetails added to each player object which contains player information like FullName Position etc.
            const playersMatchesRelationsObject = createPlayersToMatchesRelations(playerRecordsData, playersData);

            setTeams(teamsData);
            setMatches(matchesData);
            setPlayersMappedWithTeams(playersTeamsRelationsObject);
            setPlayersMappedWithMatches(playersMatchesRelationsObject);
            setMatchesGroupStageSchema(groupStageSchema);
            setMatchesPlayedAfterGroupsSchema(matchesPlayedAfterGroupsSchema);

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

