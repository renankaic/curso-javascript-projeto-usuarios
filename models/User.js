class User {

    constructor(name, gender, birth, country, email, password, photo, admin) {

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    //Getter
    get id(){
        
        return this._id;

    }

    get name(){

        return this._name;

    }

    get gender(){
        
        return this._gender;

    }

    get birth(){
        
        return this._birth;

    }

    get country(){
        
        return this._country;

    }

    get email(){
        
        return this._email;

    }

    get password(){
        
        return this._password;

    }

    get photo(){
        
        return this._photo;

    }

    get admin(){

        return this._admin;

    }    

    get register(){

        return this._register;

    }
    //End Getters

    //Setters
    set name(value){

        this._name = value;

    }

    set gender(value){
        
        this._gender = value;

    }

    set birth(value){
        
        this._birth = value;

    }

    set country(value){
        
        this._country = value;

    }

    set email(value){
        
        this._email = value;

    }

    set password(value){
        
        this._password = value;

    }

    set photo(value){
        
        this._photo = value;

    }

    set admin(value){

        this._admin = value;

    }   
    //End Setters
    
    loadFromJSON(json){

        for (let name in json){

            switch(name){

                case '_register':
                    this[name] = new Date(json[name]);
                break;

                default:
                    this[name] = json[name];
                break;

            }

        }

    }//End loadFromJSON

    static getUsersStorage() {

        let users = [];

        if (localStorage.getItem("users")) { //Works also with "sessionStorage"

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;

    }//Closing getUsersStorage

    getNewId(){

        let usersID = parseInt(localStorage.getItem("usersID"));

        if (!usersID > 0) usersID = 0;

        usersID++;

        localStorage.setItem("usersID", usersID);

        return usersID;

    }

    save(){

        //Inserts the user to the localStorage

        //Get all users from local storage
        let users = User.getUsersStorage();

        if (this.id > 0){

            //let user = users.filter( u => { return u._id === this.id });
            users.map( u => {

                if (u._id == this.id){

                    Object.assign(u, this);

                }

                return u;

            });

        } else {

            this._id = this.getNewId();

            users.push(this);

            //sessionStorage.setItem("users", JSON.stringify(users));
            
        }        
        
        localStorage.setItem("users", JSON.stringify(users));

    }// Closing save

    remove(){

        //Remove the user from localStorage

        let users = User.getUsersStorage();

        //Search for the user in the array and remove it
        users.forEach((userData, index) => {

            if (this._id == userData._id){

                users.splice(index, 1);

            }

        });

        localStorage.setItem("users", JSON.stringify(users));

    }//Closing remove

}