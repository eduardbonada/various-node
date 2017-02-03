console.log('Starting password manager');

// setup node-persist module
var storage = require('node-persist');
storage.initSync();

// persist an accounts object
//storage.setItemSync('accounts', [{username:'edu', balance: 0}]);

// get the persisted accounts, push a new account and persist it
// var accounts = storage.getItemSync('accounts');
// accounts.push({username:'anna', balance: 0});
// storage.setItemSync('accounts', accounts);

storage.clearSync();

console.log(storage.getItemSync('accounts'));

