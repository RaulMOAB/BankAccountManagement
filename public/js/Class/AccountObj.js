

class AccountObj{
    #DNI;
    #fullNameClient;
    #amount;
    #entryDate;
    #accountType;
    #clientType;

    constructor(DNI, fullNameClient, amount, entryDate, accountType, clientType){
        this.#DNI = DNI;
        this.#fullNameClient = fullNameClient;
        this.#amount = amount;
        this.#entryDate = entryDate;
        this.#accountType = accountType;
        this.#clientType = clientType;
    }

    get DNI(){
        return this.#DNI;
    }

    get fullNameClient(){
        return this.#fullNameClient;
    }

    get amount(){
        return this.#amount;
    }

    get entryDate(){
        return this.#entryDate;
    }

    get accountType(){
        return this.#accountType;
    }

    get clientType(){
        return this.#clientType
    }

    set fullNameClient(fullNameClient){
        this.#fullNameClient = fullNameClient;
    }
    set amount(amount){
        this.#amount = amount;
    }

    set entryDate(entry_date){
        this.#entryDate = entry_date;
    }

    set accountType(account_type){
        this.#accountType = account_type;
    }

    
}