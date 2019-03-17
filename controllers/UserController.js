class UserController {

    constructor(formIdCreate, formIdUpdate, tableId){

        this.formEl = document.getElementById(formIdCreate);
        this.formUpdateEl = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);

        this.onSubmit();
        this.onEdit();

    }//Closing constructor()

    onEdit(){

        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{

            this.showPanelCreate();

        });

        this.formUpdateEl.addEventListener("submit", event => {

            //cancels the default command that the event would have
            event.preventDefault();  

            let btnSubmit = this.formUpdateEl.querySelector("[type=submit]");

            //Locks the submit button
            btnSubmit.disabled = true;

            let values = this.getValues(this.formUpdateEl);

            let index = this.formUpdateEl.dataset.trIndex;

            let tr = this.tableEl.rows[index];

            let userOld = JSON.parse(tr.dataset.user);

            //Creater a new Object ("{}" - first parameter, copying the content from values to userOld)
            let result = Object.assign({}, userOld, values);

            this.getPhoto(this.formUpdateEl).then(
                (content) => {

                    if (!values.photo) {
                        result._photo = userOld._photo;   
                    } else {
                        result._photo = content;
                    }

                    tr.dataset.user = JSON.stringify(result);

                    tr.innerHTML = `        
                        <td><img src="${result._photo}" alt="User Image" class="img-circle img-sm"></td>
                        <td>${result._name}</td>
                        <td>${result._email}</td>
                        <td>${(result._admin) ? 'Sim' : 'Não'}</td>
                        <td>${result._register.toLocaleDateString('pt-br') + " " + result._register.toLocaleTimeString('pt-br')}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
                        </td>
                    `;

                    this.addEventsTr(tr);

                    this.updateCount();

                    //If everything goes OK
                    //result.photo = content;

                    //adds a user line in table
                    //this.addLine(values);

                    this.formUpdateEl.reset();

                    this.showPanelCreate();

                    //Unlock the submit button
                    btnSubmit.disabled = false;

                },

                (e) => {

                    //If any failure
                    console.error(e);

                }
            );

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

            let values = this.getValues(this.formEl);

            if ( !values ){

                //Unlock the submit button
                btnSubmit.disabled = false;
                return false;

            }            

            this.getPhoto(this.formEl).then(
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

    getPhoto(formEl){

        //Return a Promise to the caller
        return new Promise( (resolve, reject) => {

            //Uses the FileReader() API to read the img file
            let fileReader = new FileReader();

            //From elements array, filter the item that his name is "photo"
            let elements = [...formEl.elements].filter(item => {
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

    getValues(formEl){
       
        let user = {};
        let isValid = true;

        //gets all values from fields
        //using the spread (...) to transform a collection object
        //into a array - So we will can use forEach in it
        [...formEl.elements].forEach(function(field, index){

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
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);

        //Uses the template string to create a table row
        this.tableEl.appendChild(tr);

        this.updateCount();
        
    }//Closing addline()

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if (confirm("Deseja realmente excluir?")){

                tr.remove();
                
                this.updateCount();

            }

        });

        tr.querySelector(".btn-edit").addEventListener("click", e => {

            let json = JSON.parse(tr.dataset.user);

            this.formUpdateEl.dataset.trIndex = tr.sectionRowIndex;

            for (let name in json) {

                let field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "]");

                if (field) {

                    switch (field.type) {

                        case 'file':
                            continue;
                            break;

                        case 'radio':
                            field = this.formUpdateEl.querySelector("[name=" + name.replace("_", "") + "][value=" + json[name] + "]");
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

            this.formUpdateEl.querySelector(".photo").src = json._photo;

            this.showPanelUpdate();

        });

    } //closing addEventsTr

    showPanelCreate(){

        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector("#box-user-update").style.display = "none";

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