var accounts = [];

function createAccount(account){
	accounts.push(account);

	console.log('createAccount: Account with username ' + account.username + ' and balance ' + account.balance + ' created');

	return account;
}


function getAccount(username){
	if(typeof username !== 'undefined'){
		var account2return;
		accounts.forEach(function(account){
			if(username === account.username){
				console.log('getAccount: Found account with username ' + username);		
				account2return = account;
			}
		});
		return account2return;
	}
	else{
		console.log('getAccount: Invalid username ' + username);		
	}
}

function deposit(account, amount){
	if(amount>0){
		account.balance = account.balance + amount;
		console.log('deposit: $' + amount + ' deposited');
		console.log('deposit: Current Balance: ' + getBalance(account));
	}
	else{
		console.log('deposit: Could not deposit $' + amount);
	}
}

function withdraw(account, amount){
	if(amount>0){
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

console.log(accounts);

createAccount({username: 'edu', balance: 0});
createAccount({username: 'anna', balance: 0});

console.log(accounts);

var myAccount;

myAccount = getAccount('edu');
deposit(myAccount, 300);
deposit(myAccount, 200);
withdraw(myAccount, 100);
deposit(myAccount, 500);

console.log(accounts);

myAccount = getAccount('anna');
deposit(myAccount, 900);
withdraw(myAccount, 300);

console.log(accounts);


