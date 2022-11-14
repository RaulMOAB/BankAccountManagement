//______________Global_vars__________________//


//___________________DOM_____________________//
$(document).ready(function(){
console.log('dsfsdfsf');
    getApiClients();
    
});
//______________Functions_here________________//

function getApiClients(){
   
    $.ajax({
        url: 'http://localhost:3000/api/clients',
        success: function (result){
            console.log('Llamada a api, results');
        }
    })
};

 

