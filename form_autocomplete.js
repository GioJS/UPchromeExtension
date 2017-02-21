const SpecialWebsites = {
	GOOGLE: "google",
	LINKEDIN: "linkedin"
}

//altro content script che si occupa del recupero dei dati se presenti nel background
//cioè se l'utente ha fatto richiesta
$(function() {
	chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

        console.log('Messaggio ricevuto', request)

        if(request.name == 'form_autocomplete') {
            let loginData = request.loginData;

            if(loginData == null) {
                console.error('Dati di login nulli');
                return;
            }

			loginData = JSON.parse(loginData);

      console.log('Login data', loginData);

			const host = window.location.host;
			//casi speciali
			if(host.includes(SpecialWebsites.GOOGLE)) {
				completeGoogleForm(loginData);
			} else if(host.includes(SpecialWebsites.LINKEDIN)) {
				completeLinkedinForm(loginData);
			} else {
				completeForm(loginData);
			}

        }

	});

});
//form standard
function completeForm(loginData, preventClick) {
    var submit = null;

    loginData.forEach(function(data) {

		// Testiamo il name che deve essere non random
        let input = $('input[name="' + data.id + '"]');
        if(submit == null){
            submit = input.closest("form").find("input[type=submit],button[type=submit]");
        }

        if(input != null){
         	input.val(data.value);
        };
    });

	// Se il submit deve essere premuto allora lo preme
	if(!preventClick) {
		submit.click();
	}
}
// form google
function completeGoogleForm(loginData) {
	var submit = null;

	let googleData = {};

	loginData.forEach(function(data) {
		if(data.type == 'email' || data.type == 'text') {
			googleData.email = data.value;
		} else if(data.type == 'password') {
			googleData.password = data.value;
		}
	});

	// Aggiunge l'observer per osservare quando il form relativo alla password
	// diverrà visibile
	let observer = new MutationObserver(function(mutations, observer) {
		$('#Passwd').val(googleData.password);
		$('#signIn').click();
		observer.disconnect();
	});

	let hiddenForm = $('.hide-form.slide-in')[0];

	observer.observe(hiddenForm, {
	  attributes: true
	});

	// Compila la email
	$('#Email').val(googleData.email);
	$('#next').click();
}

function completeLinkedinForm(loginData) {
	completeForm(loginData, true);
	$("#login-submit").attr('disabled', false);
	$("#login-submit").click();
}
