function doWork () {
	// manually throw an error
	throw new Error('Unable to do work!');
}

try {
	doWork();
} catch (e) {
	console.log('Catch: ' + e.message);
} finally {
	console.log('Finally block executed!');
}

console.log('try catch ended');