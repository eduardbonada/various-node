function deposit(account, amount){
	if(amount>0){
		account.balance = account.balance + amount;
		console.log('$' + amount + ' deposited');
		console.log('Current Balance: ' + getBalance(account));
	}
	else{
		console.log('Could not deposit $' + amount);
	}
}

function withdraw(account, amount){
	if(amount>0){
		account.balance = account.balance - amount;
		console.log('$' + amount + ' deposited');
		console.log('Current Balance: ' + getBalance(account));
	}
	else{
		console.log('Could not deposit $' + amount);
	}

}

function getBalance(account){
	return account.balance;

}

var myAccount = {
	balance : 0
}

getBalance(myAccount);
deposit(myAccount, 300);
withdraw(myAccount, 100);