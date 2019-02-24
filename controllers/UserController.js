class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();

    }//Closing constructor()

    onSubmit(){

        //Submit button event using an Arrow Function
        //This makes that the "this" object becomes the "this" of the class
        //and not the 'function' inside the addEventListener parameter
        this.formEl.addEventListener("submit", (event) => {
            
            //cancels the default command that the event would have
            event.preventDefault();            
            
            let user = this.getValues();

            //adds a user line in table
            this.addLine(user);

        });

    }//Closing onSubmit()

    getValues(){
       
        let user = {};

        //gets all values from fields and put in the user array
        this.formEl.elements.forEach(function(field, index){

            if ( field.name == "gender" && field.checked ){
        
                user[field.name] = field.value;
        
            } else {
        
                user[field.name] = field.value;
        
            }
        
        });

        //instantiates a new user
        return new User(
            user.name,
            user.gender, 
            user.birth, 
            user.country, 
            user.email, 
            user.password, 
            user.photo, 
            user.admin
        );

    }//Closing getValues()

    addLine(dataUser){
    
        //Uses the template string to create a table row
        this.tableEl.innerHTML = `        
            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;
        
    }//Closing addline()

}