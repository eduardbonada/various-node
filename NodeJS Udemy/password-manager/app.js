// setup node-persist module
var storage = require('node-persist');
storage.initSync();

// crypto
var crypto = require('crypto-js');

// yargs
var argv = require('yargs')
    .command('create', 'Create a new password manager account', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'The name of the account',
                type: 'string'
            },
            username: {
                demand: true,
                alias: 'u',
                description: 'Your username for this account',
                type: 'string'
            },
            password: {
                demand: true,
                alias: 'p',
                description: 'Your password for this account',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Your master password (encryption) for this account',
                type: 'string'
            }
        }).help('help');
    })
    .command('get', 'Get a password manager account', function (yargs) {
        yargs.options({
            name: {
                demand: true,
                alias: 'n',
                description: 'The name of the account',
                type: 'string'
            },
            masterPassword: {
                demand: true,
                alias: 'm',
                description: 'Your master password (encryption) for this account',
                type: 'string'
            }
        }).help('help');
    })
    .help('help')
    .argv;
var command = argv._[0];

function getAccounts(masterPassword){
    var encryptedAccounts = storage.getItemSync('accounts');
    var decryptedAccounts = [];

    if(typeof encryptedAccounts !== 'undefined'){
        // Decrypt
        var bytes = crypto.AES.decrypt(encryptedAccounts, masterPassword);
        var decryptedAccounts = JSON.parse(bytes.toString(crypto.enc.Utf8));
    }

    return decryptedAccounts;
}

function saveAccounts(accounts, masterPassword){
    // Encrypt
    var encryptedAccounts = crypto.AES.encrypt(JSON.stringify(accounts), masterPassword);

    storage.setItemSync('accounts', encryptedAccounts.toString());

    return accounts;
}

function createAccount(account, masterPassword){

    var accounts = getAccounts(masterPassword);

    accounts.push(account);

    saveAccounts(accounts, masterPassword);

    return account;

}

function getAccount(accountName, masterPassword){

    var accounts = getAccounts(masterPassword);

    var matchingAccount;
    accounts.forEach(function(account){
        if(account.name === accountName){
            matchingAccount = account;
        }
    });

    return matchingAccount;

}

//console.log(argv);

if (command === 'create') {
    try{
        var accountCreated = createAccount({
            name: argv.name,
            username: argv.username,
            password: argv.password
        }, argv.masterPassword);
        console.log('Created account with name ' +argv.name);        
    }
    catch(e){
        console.log('Unable to create account');
    }
    finally{
    };

} 
else if (command === 'get') {
    try{
        var fetchedAccount = getAccount(argv.name, argv.masterPassword);

        if(typeof fetchedAccount === 'undefined'){
            console.log('No account exists with name ' + argv.name);
        }
        else{
            console.log('Fetched account with name ' + argv.name);
        }
    }
    catch(e){
        console.log('Unable to fetch account');
    }
    finally{
    };
}

/*
CODE TO TEST createAccount & getAccount
createAccount({
    name: 'Twitter',
    username: 'eduardbonada',
    password: 'qwerty'
});

createAccount({
    name: 'Facebook',
    username: 'eduardbonada',
    password: '12345'
});

console.log(getAccount('Twitter'));
console.log(getAccount('Facebook'));

console.log(storage.getItemSync('accounts'));
*/
