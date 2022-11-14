//______________Global_vars__________________//
let data_clients;

//___________________DOM_____________________//
$(document).ready(function(){
console.log('dsfsdfsf');
    getApiClients();

    
});
//______________Functions_here________________//

function getApiClients(){
   
    $.ajax({
        url: 'http://127.0.0.1:3000/api/clients',
        success: function (result){
            console.log('Llamada a api, results');
            console.log(result.response[0]);
            data_clients = result.response;
            setDinamicClients(data_clients);
        }
    })
};

function setDinamicClients(data_clients){
    let table_body = $('#tbody');

    //--------CREATE ELEMENTS--------//
    
    data_clients.forEach(element => {
        table_body.append('<tr>')
        let client_dni      = table_body.append(`<td><input type='text' class='dni_input' value='${element.DNI}'></td>`)
        let client_names    = table_body.append(`<td><input type='text' class='names_input' value='${element.NAME}'></td>`)
        let account_options = ["Savings account", "Investement account", "Personal account", "Solidaryaccount", "Individual Savings Account", "Fixed deposit account", "Tax-Free Savings Account"];
       
        let select = 
            `<td><select>`;

        account_options.forEach((item, index) => {
            select += `<option value='${index}'>${item}</option>`;           
        });

        select += '</select> </td>';
        
        table_body.append(select);

        console.log(element.ACCOUNT_TYPE);
        let amount = table_body.append(`<td><input type='text' class='amount_input' value='${element.AMOUNT}'></td>`);
        let client_type;
        table_body.append('</tr>');

    });


    //---------APPEND ELEMENTS-------//
    
}

 

