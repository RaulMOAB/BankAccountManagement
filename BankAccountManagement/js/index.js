//______________Global_vars__________________//

let data_clients;
let accounts = [];
let list_client_types = ['Poor client', 'Normal client', 'Very rich client'];

let account;
let client_type;
let client_account;




let flag
let is_valid_name   = true;
let is_valid_amount = true;
let is_valid_date   = true;
//___________________DOM_____________________//
$(document).ready(function(){
    getApiClients();
    $('input').on('click', '.names', function(){
        console.log('click');
    })
    
    
    

    
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
        table_body.append(`<td><input type='text' class='names' id='names_input_${index}' value='${element.NAME}' maxlength='30'></td>`);

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


        table_body.append(`<td><input type='text' class='amount' id='amount_input_${index}' value='${element.AMOUNT}'></td>`);

        table_body.append(`<td><input type='text' class='client' id='client_type_${index}' disabled value='${element.CLIENT_TYPE}'></td>`);

        $(function(){
            $('.entry_date').datepicker();
        })
        let date = formatDate(element.ENTRY_DATE);

        entry_date = table_body.append(`<td><input type='text' class='entry_date' id='date_input_${index}' value='${date}'></td>`);
        table_body.append('</tr>');

        client_account = new AccountTypeObj(element.DNI, element.ACCOUNT_TYPE);
        client_type = new ClientTypeObj(element.DNI, element.CLIENT_TYPE, "");
        account = new AccountObj(element.DNI, element.NAME, element.AMOUNT, element.ENTRY_DATE,client_account, client_type);//*Parent Obj
        accounts.push(account);//*Add all clients into an array

        
    });

   /* is_valid_name   = validateFullName();
   is_valid_amount = validateAmount();
   is_valid_date   = validateDate(); */

   
   
   
   //-----------BUTTON EVENT------------//
   $('#modify_btn').click(function(){
     let names = $('.names');
     let amount = $('.amount');
     
     
     names.each(function(index, element){
      validateFullName(element)    
     })
     
     is_valid_name = names.hasClass('error');

     if (!is_valid_name) {//*si is_valid_names NO tiene la clase error esta Ok
       console.log('modificando datos');
       //*los names estan listos para ser añadidos al objeto
      }else{
       console.log('hay clase error');
     }
    
      amount.each(function(index, element){
        validateAmount(element);
      })  
       
    })
   
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

function validateFullName(name) {
  let name_value = $(name).val();
    const regExp =
      /(^[a-zA-Z\u00C0-\u017F]{3,16})([ ]{0,1})([a-zA-Z\u00C0-\u017F]{3,16})?([ ]{0,1})?([a-zA-Z\u00C0-\u017F]{3,16})?([ ]{0,1})?([a-zA-Z\u00C0-\u017F]{3,16})/;

    if (regExp.test(name_value)) {
      $(name).removeClass('error');
      $(name).css("border-color", "green");
     
    } else {
      $(name).css("border-color", "crimson");
      $(name).addClass('error');
     
    }

    //$(name).hasClass('error')
    
  
}

function validateAmount(amount) {
  let amount_value = $(amount).val();

    const regExp = /\b((?:\d+|\d{1,3}(?:[,.\s]\d{3})*)(?:[,.\s]*\d+)?)\s(?:euros?|€)/
     

    if (regExp.test(amount_value)) {
      $(amount).removeClass('error');
      $(amount).css("border-color", "green");

      let format_amount = parseFloat(amount_value.replace(" €","").replace(".","").trim());
      
      if ((format_amount > 0) && (format_amount <= 10000)) {
        $(amount).parent().next().children().val(list_client_types[0]);
      }else if((format_amount > 10000) && (format_amount <= 100000)){
        $(amount).parent().next().children().val(list_client_types[1]);
      }else if (format_amount > 100000){
        $(amount).parent().next().children().val(list_client_types[2]);
      }else if(format_amount < 0){
        $(amount).parent().next().children().val(list_client_types[0]);
        $(amount).css('color', 'red');
      }

    } else {
      $(amount).addClass('error');
      $(amount).css("border-color", "crimson");
    }
    
  
}

function validateDate(){
    $('td').on('change', ".entry_date", function (){
        let bd_date = $(this).val();
        let new_date = new Date(bd_date);
        let today = new Date();

        let correct_date = new_date.getTime() < today.getTime();
        console.log(new_date.getTime());
        console.log(today.getTime());
        if (correct_date && (correct_date !== today.getTime())) {//!PREGUNTAR MANEL
            $(this).css("border-color", "green");
            is_valid_date = true;
        } else {
            $(this).css("border-color", "crimson");
            is_valid_date = false;
        }
        return is_valid_date;     
    })
}
 

