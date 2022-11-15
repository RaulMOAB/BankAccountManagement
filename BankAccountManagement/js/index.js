//______________Global_vars__________________//
let data_clients;
let entry_date; 
let accounts = [];

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
    
    data_clients.forEach((element, index) => {
        table_body.append('<tr>');
        table_body.append(`<td><input type='text' class='dni_input' disabled value='${element.DNI}'></td>`);
        table_body.append(`<td><input type='text' id='names_input_${index}' value='${element.NAME}'></td>`);

        let account_options = ["Savings account", "Investement account", "Personal account", "Solidaryaccount", "Individual Savings Account", "Fixed deposit account", "Tax-Free Savings Account"];
        let select = 
            `<td><select>`;

        account_options.forEach((item, index) => {
            
            if (element.ACCOUNT_TYPE === item) {
                
                select += `<option value='${index}' selected >${item}</option>`;           
            }else{
                select += `<option value='${index}'>${item}</option>`;           
            }
        });

        select += '</select> </td>';
        
        table_body.append(select);


        table_body.append(`<td><input type='text' id='amount_input_${index}' value='${element.AMOUNT}'></td>`);

        table_body.append(`<td><input type='text' id='client_type_${index}' value='${element.CLIENT_TYPE}'></td>`);

        $(function(){
            $('.date_input').datepicker();
        })
        let date = formatDate(element.ENTRY_DATE);

        entry_date = table_body.append(`<td><input type='text' id='date_input_${index}' value='${date}'></td>`);
        table_body.append('</tr>');

        let client_account = new AccountTypeObj(element.DNI, element.ACCOUNT_TYPE);
        let client_type = new ClientTypeObj(element.DNI, element.CLIENT_TYPE, "");
        let account = new AccountObj(element.DNI, element.NAME, element.AMOUNT, element.ENTRY_DATE,client_account, client_type);//*Parent Obj
        accounts.push(account);//*Add all clients into an array

        
    });
    validateNames();
    

    
    
}

function validateNames(){
    $('#names_input_0').click(function () { 
            console.log('blurr');
             
         });
}
function formatDate(db_date) {

  let new_date = new Date(db_date);
  let date_formated =
    new_date.getMonth() +
    1 +
    "/" +
    new_date.getDate() +
    "/" +
    new_date.getFullYear();

  return date_formated;
}
 

