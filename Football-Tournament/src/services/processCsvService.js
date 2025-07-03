const parseCsv = (textData) => {
    let splittedData = textData.split("\n");
    let headers = splittedData.shift().split(',').map(currentHeader => currentHeader.trim());
    
    let arrayWithDataObjects = splittedData.map((currentLine) => {
        const lineValues = currentLine.split(',').map(currentElement => currentElement.trim());
        const tempObject = {};
        // for each header map its corresponding value from the line !(headers and lines length is equal)!
        // header[0] -> id : line[0] -> 1 = id: 1 
        headers.forEach((value, index) => tempObject[value] = lineValues[index]);
        return tempObject
    })
    
    return arrayWithDataObjects
}

const fetchCsv = async (filePath) => {
	const someData = await fetch(filePath); // "/data/players.csv"
	const textData = await someData.text();

    return parseCsv(textData);
};


export const csvFileProcessor = {
    getPlayers: () => fetchCsv("/data/players.csv"),
    getTeams: () => fetchCsv("/data/teams.csv"),
    getMatches: () => fetchCsv("/data/matches.csv"),
    getRecords: () => fetchCsv("/data/records.csv"),
}