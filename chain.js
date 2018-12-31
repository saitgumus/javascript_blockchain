
const {BlockChain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('3131cb2daa887908f92169a36ad99b979abcee04cd2fbfdd76c806e3a52a5fae');
const myWalletAddress = myKey.getPublic('hex');



let saitCoin = new BlockChain();

const tx = new Transaction(myWalletAddress,'iletilecek adress', 20);
tx.signTransaction(myKey);
saitCoin.addTransaction(tx);



console.log(" \n starting miner...");
saitCoin.minePendingTransactions(myWalletAddress);

console.log("\n balance of sait adress: ", saitCoin.getBalanceOfAddress(myWalletAddress));
