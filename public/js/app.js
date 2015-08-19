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

      $(el).find(".img-deletable").addClass("hidden");
      $(el).find(".code").removeClass("hidden");
      $(el).addClass("container");

    }).on('cancel', function (el) {
      $(el).find(".code").addClass("hidden");
      $(el).find(".img-deletable").removeClass("hidden");
      $(el).removeClass("container");
      
    }).on('drop', function (el,container, source) {

     if(container != source) {
         var clonedMovedElem = el.cloneNode(true);
         $(clonedMovedElem).find(".code").addClass("hidden");
         $(clonedMovedElem).find(".img-deletable").removeClass("hidden");
         $(clonedMovedElem).removeClass("container");
         $(clonedMovedElem).removeClass("gu-transit");

         if(position === 0){
           $(source).eq(position).prepend($(clonedMovedElem).fadeIn(300));
         }else{
           $(source).children().eq(position - 1).after($(clonedMovedElem).fadeIn(300));
         }
     }

     $(el).removeClass("container");

    /*Modify the pattern container dragged from sidebar to match others*/
    if(container != source){

      $(el).find(".img-deletable").remove();

      $(el).find(".sidebar-thumbnail-title").children().removeClass("col-md-12").addClass("col-md-6");
      $(el).find(".sidebar-thumbnail-title").append('<div class="col-md-6"><div class="button-group btn-group pull-right"><a class="delete btn btn-default" href="#"><i class="fa fa-trash"> Remove</i></a><a class="btn btn-default" href="#"><i class="fa fa-arrows"></i></a></div></div>');
    }

    /*Remove the container which is shown when every pattern is deleted*/
    if($("#info-container").length){
      $("#info-container").remove();
    }

  });

  /*Enable deleting patterns*/
  $(document).on("click","a.delete", function() {
      event.preventDefault();
      $(this).parents('.panel-container').fadeOut(300, function() {
        $(this).remove();

        /*Add new container to drag to when there are no patterns in layout*/
        if($("#dragcontainer").children().length === 0){
          $("#dragcontainer").html('<div id="info-container" class="well"><h4 class="info-text">Drag and drop new patterns around me from left sidebar.</h4></div>');
        }
    });



  });

  /*Hide elements in container for better preview*/

  $(document).on({
      mouseenter: function () {
          //stuff to do on mouse enter
          $(this).stop().css({
              outline: "0px solid #373839",
              marginBottom: "0px"
          }).animate({
              outlineWidth: '4px',
              marginBottom: "20px"
          }, 150);

          $(this).find('.container-fluid').stop().fadeIn(400).removeClass("hidden");
      },
      mouseleave: function () {
          //stuff to do on mouse leave
          $(this).stop().animate({
              outlineWidth: 0
          }, 150);

          $(this).find('.container-fluid').stop().fadeOut(150);
      }
  }, "#code .panel-container");


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
