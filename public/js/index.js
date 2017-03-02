$(document).ready(function(){
  $('#scrape-nav-btn').click(function(e){
    e.preventDefault();
    $.ajax({
      method: GET,
      url: "/scrape",
    }).done(function(data){
        var numArticles = data.length;
        console.log(numArticles);
        alert("You have added " + numArticles + " articles");
    })
  })
 
  // To add a new note
  $('#add-note').click(function(){
    // grab the id of the article 
    var articleId = $(this).parent('.content-box').attr('id');
    // open the corresponding modal
    $('#modal-' + articleId).modal();
  
    $.ajax({
      method: GET,
      url: "/note/all" + articleId,
      success: function(data){
         console.log(data);
         for (var i = 0; i < data.notes.length; i++){
            var html = '<div class="note-body" id="'
            + data.notes[i]._id
            +'"><p>'
            + data.notes[i].notes
            +'</p><button type="button" class="close del-notes" aria-label="Close"><span aria-hidden="true">&times;</span></button></div>';
           $('#notes-' + articleId).append(html);
         }
      },
    })
  })

  // To delete a note
  $('.del-notes').click(function(e){
    e.preventDefault();
    var noteId = $(this).parent().attr('id');

    $.ajax({
      method: POST,
      url: "/note/del/" + noteId,
    }).done(function(){
        $(this).parent().remove();
    })

  });

  
});
