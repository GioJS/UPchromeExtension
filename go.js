$(function() {
  //effettua la richiesta al server dei dati per effettuare il login automatico
    $('#go').click(function(event) {
        let pin = $('#pin').val();

        if(pin.length > 0) {
            requestLoginData(pin);
        } else {
            alert('Pin empty!');
        }
    });
});

//manda il messaggio alla tab attiva 
function sendMessage(data){
    chrome.windows.getCurrent((w) => {
        chrome.tabs.getSelected(w.id, (tab) => {
            chrome.tabs.sendMessage(tab.id, {
                name: 'form_autocomplete',
                loginData: data
            });
        });
    });
}
//richiede i dati login al server
function requestLoginData(pin){
    chrome.storage.local.get("token", function(token) {
        if(token.token != null) {

            let data = {
                 pin: pin
            }

            $.post({
                url: 'https://one-password.herokuapp.com/website/login',
                data: data,
                headers: {
                    "Authorization": token.token
                }
            }, function(result) {
              //richiesta andata a buon fine
                console.log('Website login - result', result);
              //mando il messaggio a form_autocomplete
                sendMessage(result.loginData)
            }).fail(function(error) {
              //richiesta fallita
                let err = error.responseJSON;
                console.log('Website login - error', err);
                if(err.error == 'invalid_login_pin') {
                    alert('Invalid login pin');
                } else {
                    alert('Error during login');
                }
            });
        }
   })

}
