//______________Global_vars__________________//

let data_clients;
let accounts = []; //*Raw data from database
let modified_accounts = []; //*Copy from original data contains modified data
let row_index; //*Useful variable to get the row index that was modified
let list_client_types = ["Poor client", "Normal client", "Very rich client"];

let account;
let client_type;
let client_account;

let flag;
let is_valid_name = true;
let is_valid_amount = true;
let is_valid_date = true;
//___________________DOM_____________________//
$(document).ready(function () {
  getApiClients();
  $("input").on("click", ".names", function () {
    console.log("click");
  });
});
//______________Functions_here________________//

function getApiClients() {
  $.ajax({
    url: "http://127.0.0.1:3000/api/clients",
    success: function (result) {
      console.log("Llamada a api, results");
      //console.log(result.response[0]);
      data_clients = result.response;
      setDinamicClients(data_clients);
    },
  });
}

function setDinamicClients(data_clients) {
  let table_body = $("#tbody");

  //--------CREATE DINAMIC TABLE--------//

  data_clients.forEach((element, index) => {
    let row = `<tr>`;

    row += `<td><input type='text' class='dni_input' disabled value='${element.DNI}'></td>`;

    row += `<td><input type='text' class='names' id='names_input_${index}' value='${element.NAME}' maxlength='30'></td>`;

    let account_options = [
      "Savings account",
      "Investement account",
      "Personal account",
      "Solidary account",
      "Individual Savings Account",
      "Fixed deposit account",
      "Tax-Free Savings Account",
    ];
    let select = `<td><select>`;

    //*Add options to select tag
    account_options.forEach((item, index) => {
      if (element.ACCOUNT_TYPE === item) {
        select += `<option value='${item}' selected >${item}</option>`;
      } else {
        select += `<option value='${item}'>${item}</option>`;
      }
    });

    select += "</select></td>";

    row += select;

    row += `<td><input type='text' class='amount' id='amount_input_${index}' value='${element.AMOUNT}'></td>`;

    row += `<td><input type='text' class='client' id='client_type_${index}' disabled value='${element.CLIENT_TYPE}'></td>`;

    //****DATEPICKER******/
    setDatePicker();

    let date = formatDate(element.ENTRY_DATE);

    row += `<td><input type='text' class='entry_date' id='date_input_${index}' value='${date}'></td>`;

    row += "</tr>";
    table_body.append(row);

    //***INICIALIZE OBJ*******/
    client_account = new AccountTypeObj(element.DNI, element.ACCOUNT_TYPE);
    client_type = new ClientTypeObj(element.DNI, element.CLIENT_TYPE, "");
    account = new AccountObj(
      element.DNI,
      element.NAME,
      element.AMOUNT,
      element.ENTRY_DATE,
      client_account,
      client_type
    ); //*Parent Obj
    accounts.push(account); //*Add all clients into an array
  });

  //*******TEST********/
  $(".names").change(function () {
    if (validateFullName($(this))) {
      row_index = $(this).parent().parent().index();
      //*Add new name to object
      accounts[row_index].fullNameClient = $(this).val();
    } 
  });

  $(".amount").change(function () {
    if (validateAmount($(this))) {
      row_index = $(this).parent().parent().index();
      accounts[row_index].amount = $(this).val();
    }
  });

  $(".entry_date").change(function () {
    if (validateDate($(this))) {
      row_index = $(this).parent().parent().index();
      accounts[row_index].entryDate = $(this).val();
    }
  });

  $("select").change("option", function () {
    row_index = $(this).parent().parent().index();
    client_dni = accounts[row_index].DNI; //*Get DNI client to initialize the obj AccountTypeObj
    //*Add the new account type to object
    accounts[row_index].accountType = new AccountTypeObj(
      client_dni,
      $(this).val(),
      ""
    );
  });

  //-----------BUTTON EVENT------------//
  $("#modify_btn").click(function () {
    let names = $(".names");
    let amounts = $(".amount");
    let entry_dates = $(".entry_date");

    is_valid_name = names.hasClass("error");
    is_valid_amount = amounts.hasClass("error");
    is_valid_date = entry_dates.hasClass("error");

    if (!is_valid_name && !is_valid_amount && !is_valid_date) {
      //*Obj is valid to a post request
      accounts.forEach((account) => {

        let auxObj = {
          DNI: account.DNI,
          NAME: account.fullNameClient,
          ACCOUNT_TYPE: account.accountType.accountType,
          AMOUNT: account.amount,
          CLIENT_TYPE: account.clientType.client_type,
          ENTRY_DATE: account.entryDate,
        };

        //*Compare objects to get only the row that was modified
        data_clients.forEach((element) => {
          let original_clients = JSON.stringify(element);
          let rows_modified = JSON.stringify(auxObj);

          if (rows_modified != original_clients && element.DNI === auxObj.DNI) {
            modified_accounts.push(auxObj);
          }
        });
      });

      sendDataToDB(modified_accounts);
      modified_accounts = []; //*Reset array

      //*Store object in LocalStorage
      storeObjectLocalStorage(data_clients);
    } else {
      console.log("hay clase error");
    }
  });
}
//-----------------FUNCTIONS---------------//
/**
 * Function to set datePicker
 */
function setDatePicker() {
  $.datepicker.regional["ca"] = {
    closeText: "Tanca",
    prevText: "< Anterior",
    nextText: "Següent >",
    currentText: "Avui",
    monthNames: [
      "Gener",
      "Febrer",
      "Març",
      "Abril",
      "Maig",
      "Juny",
      "Juliol",
      "Agost",
      "Setembre",
      "Octubre",
      "Novembre",
      "Decembre",
    ],
    monthNamesShort: [
      "Gen",
      "Feb",
      "Març",
      "Abr",
      "Maig",
      "Juny",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Des",
    ],
    dayNames: [
      "Diumenge",
      "Dilluns",
      "Dimarts",
      "Dimecres",
      "Dijuous",
      "Divendres",
      "Disabte",
    ],
    dayNamesShort: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    dayNamesMin: ["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"],
    weekHeader: "Sm",
    dateFormat: "mm/dd/yy",
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: "",
  };
  $.datepicker.setDefaults($.datepicker.regional["ca"]);
  $(function () {
    $(".entry_date").datepicker();
  });
}

/**
 * Function to format data from BD to a format mm/dd/yyyy
 * @param {*} db_date date recieved from base date
 * @returns formated date
 */
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

/**
 * Function that validates client's full name by a regExp
 * @param {*} name client name
 * @returns true or false
 */
function validateFullName(name) {
  let name_value = $(name).val();
  const regExp =
    /(^[a-zA-Z\u00C0-\u017F]{3,16})([ ]{0,1})([a-zA-Z\u00C0-\u017F]{3,16})?([ ]{0,1})?([a-zA-Z\u00C0-\u017F]{3,16})?([ ]{0,1})?([a-zA-Z\u00C0-\u017F]{3,16})/;

  if (regExp.test(name_value)) {
    $(name).removeClass("error");
    $(name).css("border-color", "green");
    return true;
  } else {
    $(name).css("border-color", "crimson");
    $(name).addClass("error");
    return false;
  }
}

/**
 * Function that validates the client's amount by a regExp
 * @param {*} amount client amount
 * @returns true or false
 */
function validateAmount(amount) {
  let amount_value = $(amount).val();

  const regExp =
    /\b((?:\d+|\d{1,3}(?:[,.\s]\d{3})*)(?:[,.\s]*\d+)?)\s(?:euros?|€)/;

  if (regExp.test(amount_value)) {
    $(amount).removeClass("error");
    $(amount).css("border-color", "green");
    let format_amount = parseFloat(
      amount_value.replace(" €", "").replace(".", "").trim()
    );

    if (format_amount > 0 && format_amount <= 10000) {
      $(amount).parent().next().children().val(list_client_types[0]);
    } else if (format_amount > 10000 && format_amount <= 100000) {
      $(amount).parent().next().children().val(list_client_types[1]);
    } else if (format_amount > 100000) {
      $(amount).parent().next().children().val(list_client_types[2]);
    } else if (format_amount < 0) {
      $(amount).parent().next().children().val(list_client_types[0]);
      $(amount).css("color", "red");
    }
    return true;
  } else {
    $(amount).addClass("error");
    $(amount).css("border-color", "crimson");
    return false;
  }
}

/**
 * Function that valisdate if date picked by user to modify it it is a valid date or not
 * @param {*} date new date to modify
 * @returns true or false
 */
function validateDate(date) {
  let bd_date = $(date).val();
  let new_date = new Date(bd_date);
  let today = new Date();
  //? To solve the problem when user put today date compared to today
  //? Reset the time to solve miliseconds bug
  today.setHours(0, 0, 0, 0);
  new_date.setHours(0, 0, 0, 0);

  let correct_date = new_date.getTime() < today.getTime();

  if (correct_date) {
    $(date).removeClass("error");
    $(date).css("border-color", "green");
    return true;
  } else {
    $(date).addClass("error");
    $(date).css("border-color", "crimson");
    return false;
  }
}

/**
 * Function that stores an object in localStorage
 * @param {*} object object to store
 */
function storeObjectLocalStorage(object) {
  window.localStorage.setItem("ClientsAccounts", JSON.stringify(object));
}

/**
 * Function that send all data from modified rows to the server side
 * and shows a response message in to the modal window
 * @param {*} modified_accounts rows that contains modified data
 */
function sendDataToDB(modified_accounts) {
  $.ajax({
    type: "POST",
    url: "http://127.0.0.1:3000/api/updates",
    data: { accounts: modified_accounts },
    dataType: "json",
    success: function (result) {
      console.log("Llamada a api, updates");
      server_response = result.response;

      if (server_response !== null) {
        $("#server-msg").text("Update succesfully");
        $("#success-icon").hide();
        $("#spinner").show();
        setTimeout(function () {
          $("#spinner").hide();
          $("#success-icon").show();
        }, 3000);
      } else {
        $("#server-msg").text("Error, Try again");
        $("#spinner").show();
        setTimeout(function () {
          $("#spinner").hide();
          $("#error-icon").show();
        }, 3000);
      }
    },
  });
}
