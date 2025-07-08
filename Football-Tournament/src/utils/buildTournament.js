export const generateMatchesRelation = (rounds) => {
    const matchesRelations = {};
	for (let i = 1; i < rounds.length; i++) {

		// rounds[i - 1][1] -> [1] index because rounds contains nested arrays with index[0] - phase name and index[1] array with match objects for that phase
		const previousRound = rounds[i - 1][1];
		const currentRound = rounds[i][1];

		currentRound.forEach((currentMatch) => {
			const links = previousRound.filter(
				(previousMatch) =>
					previousMatch.teamWinner === currentMatch.ATeamName ||
					previousMatch.teamWinner === currentMatch.BTeamName
			);

            if(links.length === 2) {
                matchesRelations[currentMatch.ID] = links.map((el) => el)
            }
		});
	}
    console.log(matchesRelations)
    return matchesRelations
};


export const createMatrix = (arrayWithRowsCount, arrayWithElements) => {
	const matrix = [];
	let currentIndex = 0;
	for (let i = 0; i < arrayWithRowsCount.length; i++) {
		const tempArray = [];
		for (let j = 0; j < arrayWithRowsCount[i]; j++) {
			tempArray.push(arrayWithElements[currentIndex]);
			currentIndex += 1;
		}

		matrix.push(tempArray);
	}

	return matrix;
};
