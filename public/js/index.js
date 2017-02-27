$(document).ready(function(){
  $('#scrape-nav-btn').click(function(){
    $.getJSON('/scrape', function(data){
      
    })
    })
  })

  $('#add-note').click(function(){
    // grab the id of the article 
    var articleId = $(this).parent('.content-box').attr('id');
    // open the corresponding modal
    $('#modal-' + articleId).modal();

    
  })

  $('#submit-note').click(function(){

  })
})
