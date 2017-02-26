//script innestato nella pagina corrente
$(function(){
    //var token = localStorage.getItem("token");
	//intercetta un submit
	let forms = document.forms;
    let binded = false
    if(window.location.host.includes("instagram.com")){
        console.log('aoo')
        //let button = document.getElementsByTagName('button')[0];
        $('._nvyyp').bind("DOMSubtreeModified",function(){
        var buttons = document.getElementsByClassName('_ah57t _84y62 _i46jh _rmr7s');
        console.log(buttons)
        buttons[0].addEventListener('click',function(event){
            if(binded){
                return;
            }
            binded = true;
            event.preventDefault();
            console.log('oooo')
            chrome.storage.local.get("token", function(token) {
            $.get({
            url: 'https://one-password.herokuapp.com/website/list',
            async: false,
            headers: {
                "Authorization": token.token
            }
        }, function(result){
            let form = forms[0];
                if(!result.websites.some(item => item.home === window.location.host)){

                    let pin = prompt('Do you want to save login data? Insert registration pin');
                    if(pin != null){
                        let accessData = [];
                        Array.from(form).forEach(function(input) {
                          //testiamo il name
                            if(input.type == 'email' || input.type == 'password' || input.type == 'text') {
                             console.log('Input', input);
                                let data = {
                                    id: input.name,
                                    type: input.type,
                                    value: input.value
                                }
                                accessData.push(data);
                            }

                        });

                        let stringData = JSON.stringify(accessData)

                        console.log('accessData', stringData);
                        let data = {
                            home: window.location.host,
                            pin: pin,
                            loginData: stringData
                        };
                        console.log(data)
                        chrome.storage.local.get("token", function(token) {
                            console.log('Token preso: ', token);

                            if(token != null) {
                                $.post({
                                    url: 'https://one-password.herokuapp.com/website/add',
                                    data: data,
                                    async: false,
                                    headers: {
                                        "Authorization": token.token
                                    }
                                },function(result){
                                    console.log(result);

                                }).fail(function(result){
                                    console.log(result.responseJSON)
                                    alert('error during registration')

                                });
                            }
                        }
                        );
                    }

                    }

                }
            ).fail(function(result){
            console.log(result);
            });
        })
      });

    })
    }else{
    Array.from(forms).forEach(function(form) {
        form.addEventListener("submit", function(event) {
        event.preventDefault();
        chrome.storage.local.get("token", function(token) {
            $.get({
            url: 'https://one-password.herokuapp.com/website/list',
            async: false,
            headers: {
                "Authorization": token.token
            }
        }, function(result){
            if(window.location.host.includes("google") && $('.hide-form.slide-in')[0] != null  ) {
							console.log('google',$('.hide-form.slide-in'))
                $(form).unbind('submit');
            }
            else if(!result.websites.some(item => item.home === window.location.host)){

                    let pin = prompt('Do you want to save login data? Insert registration pin');
                    if(pin != null){
                        let accessData = [];
                        Array.from(form).forEach(function(input) {
                          //testiamo il name
                            if(input.type == 'email' || input.type == 'password' || input.type == 'text') {
                             console.log('Input', input);
                                let data = {
                                    id: input.name,
                                    type: input.type,
                                    value: input.value
                                }
                                accessData.push(data);
                            }

                        });

                        let stringData = JSON.stringify(accessData)

                        console.log('accessData', stringData);
                        let data = {
                            home: window.location.host,
                            pin: pin,
                            loginData: stringData
                        };
                        console.log(data)
                        chrome.storage.local.get("token", function(token) {
                            console.log('Token preso: ', token);

                            if(token != null) {
                                $.post({
                                    url: 'https://one-password.herokuapp.com/website/add',
                                    data: data,
                                    async: false,
                                    headers: {
                                        "Authorization": token.token
                                    }
                                },function(result){
                                    console.log(result);
                                }).fail(function(result){
                                    let error = result.responseJSON;
																		if(error.error == 'invalid_registration_pin') {
																				alert('Invalid registration pin')
																		} else {
																			alert('Error during registration')
																		}
                                });
                            }
                        }
                        );
                    }

                    }

                }

            ).fail(function(result){
            console.log(result);
            });
        })


            $(form).unbind('submit');
            $(form).submit()

        });

   });
}
});
