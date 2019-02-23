var fields = document.querySelectorAll("#form-user-create [name]");
var user = {};

function addLine(dataUser){

    //Create a tr element to put in a table tbody
    var tr = document.createElement("tr");

    //Uses the template string to create a table row
    tr.innerHTML = `
        <tr>
            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${dataUser.admin}</td>
            <td>${dataUser.birth}</td>
            <td>
                <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
            </td>
        </tr>
    `;

    //Appends the new created table row to table's tbody
    document.querySelector("#table-users tbody").appendChild(tr);

}


//Submit button event
document.getElementById("form-user-create").addEventListener("submit", function(event) {
    
    //cancels the default command that the event would have
    event.preventDefault();
    
    //gets all values from fields and put in the user array
    fields.forEach(function(field, index){

        if ( field.name == "gender" && field.checked ){
    
            user[field.name] = field.value;
    
        } else {
    
            user[field.name] = field.value;
    
        }
    
    });

    //adds a user line in table
    addLine(user);

});