$(function() {


  /*Initiate Dragula for sidebar and main view*/
  var dragcontainerId = document.getElementById("dragcontainer").id;
  var sidedragcontainerId = document.getElementById("sidedragcontainer").id;
  var position = 0;

  dragula([document.querySelector('#sidedragcontainer'), document.querySelector('#dragcontainer')], {
    accepts: function (el, target, source, sibling) {
    var boolean = false;

      if(sidedragcontainerId === source.id){
        boolean = dragcontainerId === target.id;
      }else if(dragcontainerId === source.id){
        boolean = dragcontainerId === target.id;
      }
      return boolean;

    }

    }).on('drag', function (el) {
      position = $(el).index();


    }).on('drop', function (el,container, source) {

     if(container != source) {
         var clonedMovedElem = el.cloneNode(true);
         clonedMovedElem.classList.remove("gu-transit");

         if(position === 0){
           $(source).eq(position).prepend($(clonedMovedElem).fadeIn(300));
         }else{
           $(source).children().eq(position - 1).after($(clonedMovedElem).fadeIn(300));
         }
     }

    $(el).find(".img-deletable").remove();
    $(el).find(".code").removeClass();

  });

  /*Enable deleting patterns*/


  /*Hide elements in container for better preview*/




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
