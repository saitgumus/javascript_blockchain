
const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAdress, toAdress, amount ){
        this.fromAdress = fromAdress;
        this.toAdress = toAdress;
        this.amount = amount;
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

    createTransaction(transaction){
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
    /*
    addNewBlock(newBlock) {
        newBlock.preHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.dificulty);
        this.chain.push(newBlock);
    }  */


    ischainValid(){
        for(let i=1 ; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const prevBlock = this.chain[i-1];

            if(currentBlock.hash !== currentBlock.calculateHash())
                return false;

            if( currentBlock.preHash !== prevBlock.calculateHash())
                return false;

        }

        return true;
    }

}


let saitCoin = new BlockChain();

/*
saitCoin.addNewBlock(new block(1, '12/12/2018', {amoun : 100} ));
saitCoin.addNewBlock(new block(2, '13/12/2018', {amoun : 80}));

console.log('chain valid : ' + saitCoin.ischainValid().toString() )
saitCoin.chain[1].data = {amoun : 30};
console.log('chain valid : ' + saitCoin.ischainValid().toString() )

console.log(JSON.stringify(saitCoin, null , 4) ) ;

*/

saitCoin.createTransaction(new Transaction('adress1', 'address2',100));
saitCoin.createTransaction(new Transaction('adress2', 'adress1', 50));

console.log(" \n starting miner...");
saitCoin.minePendingTransactions("saitid");

console.log("\n balance of sait adress: ", saitCoin.getBalanceOfAddress("saitid"));

console.log('\n start mining again..');
saitCoin.minePendingTransactions("saitid");
console.log("\n balance of sait adress: ", saitCoin.getBalanceOfAddress("saitid"));
