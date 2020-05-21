const fs = require('fs');
const fsAsync = fs.promises;

async function readJson(filename) {
	const data = await fsAsync.readFile(filename, 'utf-8');
	const item = JSON.parse(data);
	// console.log(item);
	// console.log(`Is ${item.name} in New Horizons? ${isInNewHorizons(item) ? 'yes' : 'no'}`);
	return new Promise((resolve) => { resolve(item); });
}

function isInNewHorizons(item) {
	return !!item.games.nh;
}

// readJson(`${__dirname}/items/1-up-cap.json`);
// readJson(`${__dirname}/items/anchor-statue.json`);


function generateItemList({destinationFileName, dataDirectory}) {
	fs.readdir(dataDirectory, async function(err, fileNames) {
		if(err) {throw err;}
		const itemsInNewHorizons = await findItemsInNewHorizons(fileNames, dataDirectory);
		// const itemsFormatted = JSON.stringify(itemsInNewHorizons);
		writeItemsFile(destinationFileName, itemsInNewHorizons);
	});
}

async function findItemsInNewHorizons(fileNames, dataDirectory) {
	const itemsInNewHorizons = []

	for(const fileName of fileNames) {
		const item = await readJson(`${dataDirectory}/${fileName}`);
		if (isInNewHorizons(item)) {
			const cleanedItem = cleanItemData(item);
			itemsInNewHorizons.push(cleanedItem);
		}
	}

	return new Promise( resolve => { resolve(itemsInNewHorizons); } );
}

function cleanItemData(item) {	
	return {
		name: item.name,
		category: item.category,
		id: item.id,
	};
}

function writeItemsFile(destinationFileName, jsonContent) {
	fs.writeFile(destinationFileName, JSON.stringify(jsonContent), function(err) {
		if(err) {throw err;}
		console.log('Write successful for: ' + destinationFileName);
	});
}

generateItemList({
	destinationFileName: 'items.json',
	dataDirectory: `${__dirname}/items`
});
