

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
    
}