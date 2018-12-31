
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');


class Transaction{
    constructor(fromAdress, toAdress, amount ){
        this.fromAdress = fromAdress;
        this.toAdress = toAdress;
        this.amount = amount;
    }

    calculateHash(){
        return SHA256(this.fromAdress + this.toAdress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAdress ){
            throw new error("başkasının hesabından işlem yapamazsın!");
        }        

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAdress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new error("imzasız işlem yapılamaz.");
        }

        const publicKey = ec.keyFromPublic(this.fromAdress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }
}

class Block {
    constructor( date, transactions, preHash = ''){
        this.date = date;
        this.transactions = transactions;
        this.preHash = preHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
        
    }


    calculateHash(){
        return SHA256(this.date + JSON.stringify(this.transaction)+ this.nonce).toString();
    }

    mineBlock(dificulty){
        while(this.hash.substring(0, dificulty) !== Array(dificulty+1).join('0') ){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("mined block.. " );
    }

    hasValidTransaction(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }

}



class BlockChain{

    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.dificulty = 1;
        this.pendingTransaction = [];
        this.miningReward = 100;
    }


    createGenesisBlock(){
        return new Block('1/1/2000',"genesis block","0");
    }


    getLatestBlock() {
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block('1/1/2010', this.pendingTransaction);
        block.mineBlock(this.dificulty);

        console.log('yeni blok oluşturuldu. :' + block.hash );

        this.chain.push(block);

        this.pendingTransaction = [
            new Transaction(null , miningRewardAddress , this.miningReward)
        ];

    }

    addTransaction(transaction){
        if(!transaction.fromAdress || !transaction.toAdress){
            throw new error('işlem yapılacak adresler eksiksiz girilmeli..');
        }
        if(!transaction.isValid()){
            throw new error('cannot add invalid this transaction to this chain');
        }
        this.pendingTransaction.push(transaction);
    }

    getBalanceOfAddress(address){

        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions ){
                if(trans.fromAdress === address){
                    balance -= trans.amount;
                }

                if(trans.toAdress === address){
                    balance += trans.amount;
                }

            }
        }
           
        
        return balance;
    }


    ischainValid(){
        for(let i=1 ; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransaction())
                return false;

            if(currentBlock.hash !== currentBlock.calculateHash())
                return false;

            if( currentBlock.preHash !== prevBlock.calculateHash())
                return false;

        }

        return true;
    }

}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;