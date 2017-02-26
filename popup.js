
$(function(){
    chrome.storage.local.get("token", function(token) {
       console.log('Token ottenuto: ', token.token)
       //controllo se l'utente è loggato
        if(token.token == null){
            console.log('no login');
            $('#go_cont').hide();
            $('#form_cont').show();
            $('#reg_cont').hide();
            $('#logout').hide();
        }else{
            console.log("logged");
            $('#form_cont').hide();
            $('#go_cont').show();
            $('#reg_cont').hide();
            $('#logout').show();
            }
 })
    //torno alla pagina di login dalla pagina di registrazione
    $('#back').click(function(event){
        event.preventDefault();
        $('#go_cont').hide();
        $('#form_cont').show();
        $('#reg_cont').hide();
        $('#logout').hide();
    })
    //accedo alla pagina di registrazione
    $("#register_link").click(function(event){
        event.preventDefault();
        $('#go_cont').hide();
        $('#reg_cont').show();
        $('#form_cont').hide();
    });

//effettuo il login
$("#login_form").submit(function(event){
    event.preventDefault();
    //creiamo una variabile formata da due campi 'email' e 'password'
    let user = {
        email: $('#user').val(),
        password: $('#psw').val()
    }
    //stampiamo su console i valori di 'user'
    console.log(user);
    //collegamento al server
    $.post({
        url: 'https://one-password.herokuapp.com/auth/login',
        data: user,
    },function(result){
        //nel caso l'inserimento è andato a buon fine stampo il risultato sulla console
        //e faccio visualizzare la schermata d'inserimento 'pin'
        console.log('risposta',result);
        //salvo il token
        chrome.storage.local.set({
            token: result.token
        }, function() {
            console.log('Token salvato: ', result.token)
        });
        //schermata pin
        $('#go_cont').show();
        $('#form_cont').hide();
        $("#register_form").hide();
        $('#logout').show();
    }).fail(function(result){
        //nel caso l'inserimento del login non è andato a buon fine mostra l'errore avvenuto
        let err = result.responseJSON;
        console.log(err);
        if(err.error == 'login_failed'){
            alert('Email or password wrong.');
        }
        else if (err.error == 'invalid_params'){
            alert('Invalid fields');
        }
        else{
            alert('Error.');
        }
        console.log('errore', result);
    });


});
//effettuo la registrazione
$("#register_form").submit(function(event){
    event.preventDefault();
    //creiamo una variabile formata da due campi 'email' e 'password'
    let user = {
        email: $('#reg_user').val(),
        password: $('#reg_psw').val()
    }
    //stampiamo su console i valori di 'user'
    console.log(user);
    //collegamento al server
    $.post({
        url: 'https://one-password.herokuapp.com/auth/register',
        data: user,
    },function(result){
        //nel caso l'inserimento è andato a buon fine stampo il risultato sulla console
        //e faccio visualizzare la schermata d'inserimento 'pin'
        console.log('risposta',result);
        alert('User registered.')
        //salvo il token
        chrome.storage.local.set({
            token: result.token
        }, function() {
            console.log('Token salvato: ', result.token)
        })
        //schermata di pin
        $('#go_cont').show();
        $('#form_cont').hide();
        $("#register_form").hide();
        $('#logout').show();
        $('#back').hide();
    }).fail(function(result){
        //nel caso l'inserimento registrazione non è andato a buon fine mostra l'errore avvenuto
        let err = result.responseJSON;
        if(err.error == 'user_already_registered'){
            alert('User already registered.');
        }
        else if (err.error == 'invalid_params'){
            alert('Invalid fields');
        }
        else{
            alert('Error.');
        }
        console.log('errore', result);
    });


});

//effettuo il logout
$('#logout').click(function(event) {
  event.preventDefault();

  chrome.storage.local.get("token", function(token) {

    $.get({
      url: 'https://one-password.herokuapp.com/auth/logout',
      headers: {
        "Authorization": token.token
      }
    }, function(result) {
      chrome.storage.local.clear(function() {
        window.location.reload();
      });

    }).fail(function(error) {
          alert('Error during logout');
    });

  });

});


});
