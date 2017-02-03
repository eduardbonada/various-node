var accounts = [];

function createAccount(account){
	accounts.push(account);

	console.log('createAccount: Account with username ' + account.username + ' and balance ' + account.balance + ' created');

	return account;
}


function getAccount(username){
	if(typeof username !== 'undefined'){
		var account2return;

		for(var i=0 ; i<accounts.length ; i++){
			if(username === accounts[i].username){
				console.log('getAccount: Found account with username ' + username);		
				account2return = accounts[i];
			}

		}

		return account2return;
	}
	else{
		console.log('getAccount: Invalid username ' + username);		
	}
}

function deposit(account, amount){
	if(typeof amount === 'number' && amount >0){
		account.balance = account.balance + amount;
		console.log('deposit: $' + amount + ' deposited');
		console.log('deposit: Current Balance: ' + getBalance(account));
	}
	else{
		console.log('deposit: Could not deposit $' + amount);
	}
}

function withdraw(account, amount){
	if(typeof amount === 'number' && amount >0){
		account.balance = account.balance - amount;
		console.log('withdraw: $' + amount + ' deposited');
		console.log('withdraw: Current Balance: ' + getBalance(account));
	}
	else{
		console.log('withdraw: Could not deposit $' + amount);
	}

}

function getBalance(account){
	return account.balance;
}

function createBalanceGetter(account){
	return function(){return account.balance};
}


createAccount({username: 'edu', balance: 0});
createAccount({username: 'anna', balance: 0});

var myAccount;

myAccount = getAccount('edu');
var balanceGetterEdu = createBalanceGetter(myAccount); // to use closures
deposit(myAccount, 300);
deposit(myAccount, 200);
console.log('balanceGetterEdu: ' + balanceGetterEdu());
withdraw(myAccount, 100);
deposit(myAccount, 500);
console.log('balanceGetterEdu: ' + balanceGetterEdu());

myAccount = getAccount('anna');
deposit(myAccount, 900);
withdraw(myAccount, 300);

console.log(accounts);


