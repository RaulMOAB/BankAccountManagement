

class ClientTypeObj{
    #DNI;
    #client_type;
    #description;

    constructor(dni, client_type, description){
        this.#DNI = dni;
        this.#client_type = client_type;
        this.#description = description;
    }

    //Getters and Setters

    get DNI(){
        return this.#DNI;
    }

    get client_type(){
        return this.#client_type;
    }

    get description(){
        return this.#description;
    }

    set DNI(dni){
        this.#DNI = dni;
    }

    set client_type(client_type){
        this.#client_type = client_type;
    }
}