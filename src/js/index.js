const $ = require('./jQuery.js')

$(function() {
  $('input').keyup(function(event) {
    if (event.which === 13) {
      $('#submit').click();
    }
  });
  $('#submit').bind('click', function() {
    let login = $('#login').val();
    let password = $('#password').val();
    if (checkData(login, password)) {
      $.ajax('login', {
        method: 'POST',
        data: {
          login, password,
        },
        success: function(data) {
          window.location.href = '/panel';
        },
        error: function(data) {
          $('.error').removeAttr('hidden');
        }
      })
    }
  });
});

function checkData(login, password) {
  if (login && password) {
    return true;
  } else {
    return false;
  }
}