$(function() {


  /*Initiate Dragula for sidebar and main view*/

  dragula([document.querySelector('#sidedragcontainer'), document.querySelector('#dragcontainer')]).on('drop', function (el) {

    el.className += ' ex-moved';
    $(el).find(".img-deletable").remove();
    $(el).find(".code").removeClass();

  });

  /*Post the layout to server*/

  $('#layout-download').click(function(e){
    e.preventDefault();

    var code = $('.pattern').children().map(function() {
          return $(this).prop('outerHTML');
    }).get().join("\n\n");

    var form = $('#layout-form');
    form.append($('<input>', {type: 'hidden',name: 'code', value: code}));
    form.submit();

    /*$.ajax({
      type: 'POST',
      data: JSON.stringify(data),
          contentType: 'application/json',
          url: 'http://localhost:3000/download',
          success: function(data) {
              console.log('success');
              console.log(JSON.stringify(data));
          }
    });*/

   });

});
