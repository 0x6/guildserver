$(function(){
  var times = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 1, 2, 3];
  
  var calendar = $('.calendar');
  var tbody = $('.calendar tbody');
  var tr = [];
  
  //Initial Setup
  $.each(times, function(i, time){
    tr.push($('<tr>').append($('<td>').html(timeByZone(time)).css({'text-align': 'right'})).appendTo(tbody));
    
    for(var j = 0; j < 7; j++){
      $('<td>').data('x', j).data('y', i).data('status', false).appendTo(tr[i]);
    }
  });

  $('.calendar td').click(function(e){
    if($(this).data('status'))
      $(this).css({'background-color': 'lightgrey'});
    else
      $(this).css({'background-color': 'grey'});
    
    $(this).data('status', !$(this).data('status'));
  });
  
  $('.calendar td').hover(function(){
    if(!$(this).data('status'))
      $(this).css({'background-color': 'lightgrey'});
  });
  
  $('.calendar td').on("mouseout", function(){
    if($(this).data('status'))
      $(this).css({'background-color': 'grey'});
    else
      $(this).css({'background-color': 'white'});
  })
  
  $('#submit').click(calendarSubmit);
});

function timeByZone(time){
  var timezone;
  var timezoneOffset = -2 + 24;
  return ((time + timezoneOffset) % 12 == 0 ? '12': (time + timezoneOffset) % 12) + ":00" + ((time + timezoneOffset) % 24 < 12 ? ' AM' : ' PM');
}

function calendarSubmit(){
  var available = [];
  $.each($('.calendar td'), function(i, td){
    if($(td).data('status'))
      available.push([$(td).data('x'), $(td).data('y')]);
  });
  
  return available;
};