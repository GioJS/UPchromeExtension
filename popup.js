$(function(){

    chrome.storage.local.get("token", function(token) {
       console.log('Token ottenuto: ', token.token)

        if(token.token == null){
            console.log('noooo');
            $('#go_cont').hide();
            $('#form_cont').show();
            $('#reg_cont').hide();
            //$("#register_form").hide()
          //  $('#reg_sito_cont').hide();
            $('#logout').hide();
        }else{
            console.log("goooooo");
            $('#form_cont').hide();
            $('#go_cont').show();
            $('#reg_cont').hide();
          //  $('#reg_sito_cont').hide();
            $('#logout').show();
            
        }
 })
    $('#back').click(function(event){
        event.preventDefault();
        $('#go_cont').hide();
        $('#form_cont').show();
        $('#reg_cont').hide();
        //$("#register_form").hide()
      //  $('#reg_sito_cont').hide();
        $('#logout').hide();
    })
    $("#register_link").click(function(event){
        event.preventDefault();
        $('#go_cont').hide();
        $('#reg_cont').show();
        $('#form_cont').hide();
      //  $('#reg_sito_cont').hide();
      //  $('#reg_sito_cont').show();
    });

    // $("#registra_sito").click(function(event){
    //     event.preventDefault();
    //     $('#go_cont').hide();
    //     $('#reg_cont').hide();
    //     $('#form_cont').hide();
    //   //  $('#reg_sito_cont').show();
    // });
    /*	$.post({
    url: "http://10.220.243.241:3000/websites",
    data:{id: '3', url:'www.amazon.com', psw:'ciao'}
},function(result){
console.log(result)
})
*/
$("#login_form").submit(function(event){
    event.preventDefault();
    //creamo una variabile formata da due campi 'email' e 'password'
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

        // chrome.cookies.set({"url":"http://localhost","name":"token","value":result.token},function (cookie){
        //     console.log(JSON.stringify(cookie));
        //     console.log(chrome.extension.lastError);
        //     console.log(chrome.runtime.lastError);
        // });

        chrome.storage.local.set({
            token: result.token
        }, function() {
            console.log('Token salvato: ', result.token)
        });

       
        //localStorage.setItem("token", result.token);
        $('#go_cont').show();
        $('#form_cont').hide();
        $("#register_form").hide();
        $('#logout').show();
    }).fail(function(result){
        //nel caso l'inserimento non è andato a buon fine mostra l'errore avvenuto
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

$("#register_form").submit(function(event){
    event.preventDefault();
    //creamo una variabile formata da due campi 'email' e 'password'
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
        //localStorage.setItem("token", result.token);
        // chrome.cookies.set({"url":"http://localhost","name":"token","value":result.token},function (cookie){
        //     console.log(JSON.stringify(cookie));
        //     console.log(chrome.extension.lastError);
        //     console.log(chrome.runtime.lastError);
        // });
        chrome.storage.local.set({
            token: result.token
        }, function() {
            console.log('Token salvato: ', result.token)
        })
        $('#go_cont').show();
        $('#form_cont').hide();
        $("#register_form").hide();
        $('#logout').show();
        $('#back').hide();
    }).fail(function(result){
        //nel caso l'inserimento non è andato a buon fine mostra l'errore avvenuto
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
// $('#reg_sito_form').submit(function(event){
//     event.preventDefault();
//     var accessData = {
//         username: $('#username_sito').val(),
//         password: $('#password_sito').val()
//     }
//     $.post({
//         url: 'http://one-password.herokuapp.com/website/add',
//         beforeSend: function(request){
//             chrome.storage.local.get("token", function(token) {
//                 request.setRequestHeader('Authorization', token.token);
//             });
//         },
//         data: {
//             home: $('#url').val(),
//             pin: $('#pin').val()
//         }
//     },function(result){
//         console.log(result);
//
//     }).fail(function(result){
//         //nel caso l'inserimento non è andato a buon fine mostra l'errore avvenuto
//         let err = result.responseJSON;
//         if(err.error == 'website_already_registered'){
//             alert('Sito gia\' registrato.');
//         }
//         else if (err.error == 'invalid_params'){
//             alert('Campi errati');
//         }
//         else{
//             alert('Errore.');
//         }
//         console.log('errore', result);
//     });
//
// });
$('#logout').click(function(event){
    event.preventDefault();
    //localStorage.removeItem("token");
    chrome.storage.local.clear(function() {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
    window.location.reload();
});
});
