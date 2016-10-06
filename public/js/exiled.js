window.onload = function(){
  $(".navbar-nav li a").click(function(e){
    $(".navbar-nav li").removeClass("active");
    $(e.toElement).parent().addClass("active");
    
    var target = $(e.toElement).attr('data-page');
    $('.content-box').hide();
    $('#' + target).show();
  });
};