const getCaptainStatusAndFullName = (playerDetails) => {
	// Split string into two separated elements -> FullName and captain. Original string: Cristiano Ronaldo (captain)
	// FullName: Cristiano Ronaldo, captainString: captain OR undefined if player is not captain
	const [FullName, captainString] = playerDetails.FullName.split("(");

	let isCaptain = false;
	if (captainString) {
		isCaptain = true;
	}

	return [isCaptain, FullName];
};

const isStarterPlayerChanged = (currentPlayerRecord) => {
	let isStarterPlayerChanged = true;
	const { fromMinutes, toMinutes } = currentPlayerRecord;
	if (fromMinutes == "0") {
		if (toMinutes == "NULL" || toMinutes == "90") {
			isStarterPlayerChanged = false;
		}
	}

	return isStarterPlayerChanged;
};

const addPlayerToPosition = (currentPlayer, teamPositionsObj) => {
	const currentPlayerPosition = currentPlayer.playerDetails.Position;
	teamPositionsObj[currentPlayerPosition].push(currentPlayer);
};

const addPlayerToStarterOrSubs = (currentPlayer, startersSubsObj) => {
	const keyString =
		currentPlayer.fromMinutes == "0" ? "starters" : "substitutes";
	startersSubsObj[keyString].push(currentPlayer);
};

const getTeamWinner = (teamAscore, teamBscore, ATeamName, BTeamName) => {
	let teamWinner = null;

	if (teamAscore.length > 1) {
		// Get scored penalties if match finishes with equal result
		const teamApenaltyScore = teamAscore[2];
		const teamBpenaltyScore = teamBscore[2];

		if (Number(teamApenaltyScore) > Number(teamBpenaltyScore)) {
			teamWinner = ATeamName;
		} else if (Number(teamApenaltyScore) < Number(teamBpenaltyScore)) {
			teamWinner = BTeamName;
		}
	} else {
		if (Number(teamAscore) > Number(teamBscore)) {
			teamWinner = ATeamName;
		} else if (Number(teamAscore) < Number(teamBscore)) {
			teamWinner = BTeamName;
		}
	}

	return teamWinner;
};

const extendMatchObject = (currentMatch, tempTeamsObject) => {
	const ATeamName = tempTeamsObject[currentMatch.ATeamID][0];
	const BTeamName = tempTeamsObject[currentMatch.BTeamID][0];

	const currentMatchScore = currentMatch.Score;
	const [teamAscore, teamBscore] = currentMatchScore.split("-");
	const teamWinner = getTeamWinner(
		teamAscore,
		teamBscore,
		ATeamName,
		BTeamName
	);

	const extendedCurrentMatchObj = {
		...currentMatch,
		ATeamName,
		BTeamName,
		teamAscore,
		teamBscore,
		teamWinner,
	};

	return extendedCurrentMatchObj;
};

export const mapMatchesWithTournamentPhases = (
	matchesData,
	tempTeamsObject
) => {
	let tempMatchesPlayedInGroups = {};
	let tempMatchesPlayedAfterGroups = [];

	const groupStageFinalDate = new Date("6/26/2024");

	matchesData.forEach((currentMatch) => {
		const currentMatchDate = new Date(currentMatch.Date);
		// // The group where match is played in (ATeam and BTeam are always in same group during the group stage)
		const currentMatchGroup = tempTeamsObject[currentMatch.ATeamID][1];

		const extendedMatchObj = extendMatchObject(
			currentMatch,
			tempTeamsObject
		);

		if (currentMatchDate <= groupStageFinalDate) {
			// Get only matches which are played in groups stage.
			if (!tempMatchesPlayedInGroups[currentMatchGroup]) {
				tempMatchesPlayedInGroups[currentMatchGroup] = [];
			}

			tempMatchesPlayedInGroups[currentMatchGroup].push(extendedMatchObj);
		} else {
			// Get only matches which are played after the group stage.
			tempMatchesPlayedAfterGroups.push(extendedMatchObj);
		}
	});

	// Sort by date to ensure last match will be the final if csv file structure changes
	tempMatchesPlayedAfterGroups.sort(
		(a, b) => new Date(a.Date) - new Date(b.Date)
	);

	return { tempMatchesPlayedInGroups, tempMatchesPlayedAfterGroups };
};

// Create matrix which represent the structure of matches after group stage. Every array contains match objects represents the state of tournament like round of 8 , round of 4 round of 2 and final round.
// Convert array to a matrix because there will be iterating over the round of 16 and quarter-finals together and check each pair of teams in the quarter-finals from which pairs of teams in the round of 16 it comes from.
export const createTournamentRoundsMatrix = (
	arrayWithRowsLength,
	arrayWithElements
) => {
	const matrix = [];
	let currentIndex = 0;

	for (let i = 0; i < arrayWithRowsLength.length; i++) {
		const tempArray = [];
		for (let j = 0; j < arrayWithRowsLength[i]; j++) {
			tempArray.push(arrayWithElements[currentIndex]);
			currentIndex += 1;
		}

		matrix.push(tempArray);
	}

	return matrix;
};

// Iterate over rounds which is matrix and creates an array with object with sorted matches arranged matches in order depending on which team plays against which team one after the others and grouped by 2.
// sortedMatches[0] plays vs sortedMatches[1], sortedMatches[2] plays vs sortedMatches[3] and all others.
// This function returns array with sorted matches.
export const convertMatrixToSortedArray = (rounds) => {
	const sortedMatches = [];

	for (let i = 1; i < rounds.length; i++) {
		const previousRound = rounds[i - 1];
		const currentRound = rounds[i];

		currentRound.forEach((currentMatch) => {
			const links = previousRound.filter(
				(previousMatch) =>
					previousMatch.teamWinner === currentMatch.ATeamName ||
					previousMatch.teamWinner === currentMatch.BTeamName
			);

			sortedMatches.push(...links);
		});

		if (i === 3) {
			sortedMatches.push(...currentRound);
		}
	}

	return sortedMatches;
};

export const createPlayersToTeamsRelations = (playersData) => {
	const playersToTeamsRelations = {};

	playersData.forEach((currentPlayer) => {
		if (!playersToTeamsRelations[currentPlayer.TeamID]) {
			playersToTeamsRelations[currentPlayer.TeamID] = [];
		}

		playersToTeamsRelations[currentPlayer.TeamID].push(currentPlayer);
	});

	return playersToTeamsRelations;
};

export const createPlayersToMatchesRelations = (
	playersRecords,
	playersData
) => {
	const playersRecordsToMatchesRelation = {};

	// Sort playersData to prevent iterating to get the player detailed information because if using array method which iterates over the players there will be 600 iterations for every playerRecords
	playersData.sort((a, b) => a.ID - b.ID);

	playersRecords.forEach((currentPlayerRecord) => {
		if (!playersRecordsToMatchesRelation[currentPlayerRecord.MatchID]) {
			playersRecordsToMatchesRelation[currentPlayerRecord.MatchID] = [];
		}

		const currentPlayerId = currentPlayerRecord["PlayerID"];
		// playersData is sorted in incrementing order by ID. player on index - 0 contains ID: 1
		const playerDetails = playersData[currentPlayerId - 1];

		const [isCaptain, FullName] =
			getCaptainStatusAndFullName(playerDetails);
		const isPlayerChanged = isStarterPlayerChanged(currentPlayerRecord);

		currentPlayerRecord = {
			...currentPlayerRecord,
			isPlayerChanged,
			playerDetails: { ...playerDetails, isCaptain, FullName },
		};

		playersRecordsToMatchesRelation[currentPlayerRecord.MatchID].push(
			currentPlayerRecord
		);
	});

	return playersRecordsToMatchesRelation;
};

// Add current player to starters and benched players and also map players with their positions in this function to avoid duplicate logic and and doing 1 additional iteration over the all players array.
export const processMatchPlayers = (allPlayersInMatch, ATeamID, BTeamID) => {
	const ATeamPositionsObj = {
		GK: [],
		DF: [],
		MF: [],
		FW: [],
	};

	const BTeamPositionsObj = {
		GK: [],
		DF: [],
		MF: [],
		FW: [],
	};

	const ATeamStartersBenchesObj = {
		starters: [],
		substitutes: [],
	};

	const BTeamStartersBenchesObj = {
		starters: [],
		substitutes: [],
	};

	const teamsAndPositionsSchema = [
		[ATeamID, ATeamPositionsObj],
		[BTeamID, BTeamPositionsObj],
	];

	const starterAndBenchPlayersSchema = [
		[ATeamID, ATeamStartersBenchesObj],
		[BTeamID, BTeamStartersBenchesObj],
	];

	allPlayersInMatch.forEach((currentPlayer) => {
		const currentPlayerTeamId = currentPlayer.playerDetails.TeamID;

		if (currentPlayerTeamId == ATeamID) {
			addPlayerToPosition(currentPlayer, ATeamPositionsObj);
			addPlayerToStarterOrSubs(currentPlayer, ATeamStartersBenchesObj);
		} else {
			addPlayerToPosition(currentPlayer, BTeamPositionsObj);
			addPlayerToStarterOrSubs(currentPlayer, BTeamStartersBenchesObj);
		}
	});

	return [starterAndBenchPlayersSchema, teamsAndPositionsSchema];
};
