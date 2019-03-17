class UserController {

    constructor(formId, tableId){

        this.formEl = document.getElementById(formId);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();

    }//Closing constructor()

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();

        });

    }

    onSubmit(){

        //Submit button event using an Arrow Function
        //This makes that the "this" object becomes the "this" of the class
        //and not the 'function' inside the addEventListener parameter
        this.formEl.addEventListener("submit", (event) => {
            
            //cancels the default command that the event would have
            event.preventDefault();            
            
            let btnSubmit = this.formEl.querySelector("[type=submit]");

            //Locks the submit button
            btnSubmit.disabled = true;

            let values = this.getValues();

            if ( !values ){

                //Unlock the submit button
                btnSubmit.disabled = false;
                return false;

            }            

            this.getPhoto().then(
                (content) => {

                    //If everything goes OK
                    values.photo = content;

                    //adds a user line in table
                    this.addLine(values);

                    this.formEl.reset();

                    //Unlock the submit button
                    btnSubmit.disabled = false;
    
                },
                
                (e) => {

                    //If any failure
                    console.error(e);

                }
            );

        });

    }//Closing onSubmit()

    getPhoto(){

        //Return a Promise to the caller
        return new Promise( (resolve, reject) => {

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
                
                resolve(fileReader.result);

            };

            //Adds a onError that will be executed if any error occurs
            fileReader.onerror = () => {

                reject(e);

            };

            //create a base64 from the uploaded file
            if (file){
                fileReader.readAsDataURL(file);
            } else {
                resolve('dist/img/boxed-bg.jpg');
            }

        });

    }

    getValues(){
       
        let user = {};
        let isValid = true;

        //gets all values from fields
        //using the spread (...) to transform a collection object
        //into a array - So we will can use forEach in it
        [...this.formEl.elements].forEach(function(field, index){

            if ( ['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value ){

                //Gets the input parent div
                field.parentElement.classList.add('has-error');
                isValid = false;

            }

            if ( field.name == "gender" && field.checked ){
        
                user[field.name] = field.value;
        
            } else if (field.name == "admin"){

                user[field.name] = field.checked;

            } else {
        
                user[field.name] = field.value;
        
            }
        
        });

        if (!isValid){

            return false;

        }
        
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
    
        let tr = document.createElement('tr');

        //Sets the tr dataset for further actions
        tr.dataset.user = JSON.stringify(dataUser);

        tr.innerHTML = `        
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Sim': 'Não'}</td>
            <td>${dataUser.register.toLocaleDateString('pt-br') + " " + dataUser.register.toLocaleTimeString('pt-br')}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        `;

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);
            let form = document.querySelector("#form-user-update");

            for (let name in json){

                let field = form.querySelector("[name=" + name.replace("_", "") + "]");
                
                if (field){

                    switch (field.type){

                        case 'file':
                            continue;
                        break;

                        case 'radio':
                            field = form.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
                            field.checked = true;
                        break;
                        
                        case 'checkbox':
                            field.checked = json[name];
                        break;

                        default:
                            field.value = json[name];
                        break;

                    }//End of switch

                }//End of if(field)

            } //End ofr for...

            this.showPanelUpdate();

        });

        //Uses the template string to create a table row
        this.tableEl.appendChild(tr);

        this.updateCount();
        
    }//Closing addline()

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#form-user-update").style.display = "none";
        
    }

    showPanelUpdate(){

        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector("#box-user-update").style.display = "block";

    }

    updateCount(){

        let numberUsers = 0;
        let numberAdmin = 0;


        [...this.tableEl.children].forEach( tr => {

            numberUsers++;

            let user = JSON.parse(tr.dataset.user);

            if (user._admin){
                numberAdmin++;
            }

        });

        document.querySelector("#number-users").innerHTML = numberUsers;
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;

    }

}