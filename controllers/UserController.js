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
            
            let values = this.getValues();

            this.getPhoto((content) => {

                values.photo = content;

                //adds a user line in table
                this.addLine(values);

            });

        });

    }//Closing onSubmit()

    getPhoto(callback){

        //Uses the FileReader() API to read the img file
        let fileReader = new FileReader();

        //From elements array, filter the item that his name is "photo"
        let elements = [...this.formEl.elements].filter(item => {
            if (item.name === "photo") return item;
        });

        //Get the file from filtered element
        let file = elements[0].files[0];

        //Adds a onload that will be executed after readAsDataUrl()
        fileReader.onload = () => {
            
            callback(fileReader.result);

        };

        //create a base64 from the uploaded file
        fileReader.readAsDataURL(file);

    }

    getValues(){
       
        let user = {};

        //gets all values from fields
        //using the spread (...) to transform a collection object
        //into a array - So we will can use forEach in it
        [...this.formEl.elements].forEach(function(field, index){

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
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
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