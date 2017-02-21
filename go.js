$(function() {
    $('#go').click(function(event) {
        let pin = $('#pin').val();

        if(pin.length > 0) {
            requestLoginData(pin);
        } else {
            alert('Pin empty!');
        }
    });
});

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
                console.log('Website login - result', result);
                sendMessage(result.loginData)
            }).fail(function(error) {
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
