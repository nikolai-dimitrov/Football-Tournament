// Create matrix which represent the structure of matches after group stage. Every array contains match objects represents the state of tournament like round of 8 , round of 4 round of 2 and final round.
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
