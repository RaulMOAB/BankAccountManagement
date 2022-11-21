

class AccountTypeObj{
    #DNI;
    #account_type;

    constructor(DNI, account_type){
        this.#DNI = DNI;
        this.#account_type = account_type;
    }

    get accountType(){
        return this.#account_type;
    }
    get DNI(){
        return this.#DNI;
    }
}