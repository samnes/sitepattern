'use strict';
$(function() {

  /*Initiate Dragula for sidebar and main view*/
  var dragcontainerId = 'dragcontainer';
  var sideDragClass = 'sidedraggable';
  var position = 0;

  var arraylike = document.getElementsByClassName('draggable');
  var containers = Array.prototype.slice.call(arraylike);

  dragula(containers, {
    accepts: function (el, target, source) {
    var boolean = false;

    var sourceClass = source.className.split(' ')[0];

      if(sideDragClass === sourceClass){
        boolean = dragcontainerId === target.id;
      }else if(dragcontainerId === source.id){
        boolean = dragcontainerId === target.id;
      }

      return boolean;
    }

    }).on('drag', function (el) {
      position = $(el).index();

      var element = $(el);
      element.addClass('container-pattern-width');
      element.find('.img-deletable').prop('hidden', 'hidden');
      element.find('.code').removeProp('hidden');

    }).on('cancel', function (el, source) {
      var element = $(el);

      if(sideDragClass === source.className.split(' ')[0]){
        element.find('.code').prop('hidden', 'hidden');
        element.find('.img-deletable').removeProp('hidden');
      }
        element.removeClass('container-pattern-width');

    }).on('shadow', function (el, source) {
      Holder.run();
    }).on('drop', function (el,container, source) {

     if(container !== source) {
         var clonedMovedElem = el.cloneNode(true);
         clonedMovedElem = $(clonedMovedElem);

         clonedMovedElem.find('.code').prop('hidden', 'hidden');
         clonedMovedElem.find('.img-deletable').removeProp('hidden');
         clonedMovedElem.removeClass('container-pattern-width');
         clonedMovedElem.removeClass('gu-transit');

         if(position === 0){
           $(source).eq(position).prepend($(clonedMovedElem).fadeIn(300));
         }else{
           $(source).children().eq(position - 1).after($(clonedMovedElem).fadeIn(300));
         }
     }

     $(el).removeClass('container-pattern-width');
     $(el).find('.code').removeProp('hidden');

    /*Modify the pattern container dragged from sidebar to match others*/
    if(container !== source){

      var element = $(el);
      element.find('.img-deletable').remove();

      //element.find('.sidebar-thumbnail-title').children().removeClass('col-md-12').addClass('col-md-6');
      element.find('.sidebar-thumbnail-title .pull-right').append('<div class="button-group btn-group pull-right"><a class="delete btn btn-default" href="#"><i class="fa fa-trash"> Remove</i></a></div>');
    }

    /*Remove the container which is shown when every pattern is deleted*/
    if($('#info-container').length){
      $('#info-container').remove();
    }
  });


  /*Enable deleting patterns*/
  $(document).on('click','a.delete', function() {
      event.preventDefault();
      $(this).parents('.card-container').fadeOut(300, function() {
        $(this).remove();

        /*Add new container to drag to when there are no patterns in layout*/
        if($('#dragcontainer').children().length === 0){
          $('#dragcontainer').html('<div id="info-container" class="card"><div class="card-block"><h4 class="info-text">Drag and drop new patterns around me from left sidebar.</h4></div></div>');
        }
    });
  });

  /*Hide elements in container for better preview*/

  $(document).on({
      mouseenter: function () {
          //stuff to do on mouse enter
          $(this).stop().css({
              outline: '0px solid #373839',
              marginBottom: '0px'
          }).animate({
              outlineWidth: '4px',
              marginBottom: '20px'
          }, 150);

          $(this).find('.container-fluid').stop().fadeIn(400).removeProp('hidden');
      },
      mouseleave: function () {
          //stuff to do on mouse leave
          $(this).stop().animate({
              outlineWidth: 0
          }, 150);

          $(this).find('.container-fluid').stop().fadeOut(150);
      }
  }, '#code .card-container');


    //  Switch the accordion icons state
     function toggleChevron(e) {
      e.stopPropagation();
      $(e.target).prev('.card-header').find('i.fa').toggleClass('fa-caret-down fa-caret-right');
      console.log($(e.target).prev('.card-header').find('i.fa'));
     }

    $('.card-collapse').on('hidden.bs.collapse shown.bs.collapse', toggleChevron);


  /*Change the view port container size by clicking the icons TODO: Switch to using iframe */

  var columns = $('.col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12');

  $('#viewport-mobile').click(function(){
      $('.container-resizable').removeClass('xl lg md xs-sm').addClass('sm');
      columns.removeClass('pull-none');
      Holder.run();
  });

  $('#viewport-tablet').click(function(){
      $('.container-resizable').removeClass('xl lg sm xs-sm').addClass('md');
      columns.removeClass('pull-none');
      Holder.run();
  });

  $('#viewport-laptop').click(function(){
      $('.container-resizable').removeClass('xl md sm xs-sm').addClass('lg');
      columns.removeClass('pull-none');
      Holder.run();
  });

  $('#viewport-desktop').click(function(){
      $('.container-resizable').removeClass('lg md sm xs-sm').addClass('xl');
      columns.removeClass('pull-none');
      Holder.run();
  });

  $('#viewport-mobile-small').click(function(){
      $('.container-resizable').removeClass('xl lg md sm').addClass('xs-sm');
      columns.addClass('pull-none');
      Holder.run();
  });


  /*Post the layout to server*/
  $('#layout-download').click(function(e){
    e.preventDefault();

    var code = $('.pattern').children().map(function() {
          return $(this).prop('outerHTML');
    }).get().join('\n\n');

    var form = $('#layout-form');
    form.append($('<input>', {type: 'hidden',name: 'code', value: code}));
    form.submit();

   });

});
