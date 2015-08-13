$(function() {

  /*Post the layout to server*/

  $('#layout-download').click(function(e){
    e.preventDefault();
    console.log('button clicked');

    var code = $('#code').prop('outerHTML');

    var data = {};
    data.title = "title";
    data.code = code;

    $.ajax({
      type: 'POST',
      data: JSON.stringify(data),
          contentType: 'application/json',
          url: 'http://localhost:3000/download',
          success: function(data) {
              console.log('success');
              console.log(JSON.stringify(data));
          }
    });

   });

});
