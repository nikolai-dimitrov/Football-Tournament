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
