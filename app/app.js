var username = "";
      var socket  = "";
      var deferred = $.Deferred();

      $('.chat form').submit(function(){
        socket.emit("clientData" , {message : $('.chat input').val() , username : username});
        $('.chat input').val('');
        return false;
      });


      $('.enterChat form').submit(function(){ 
       
        username = $('.enterChat input').val();

        //connecting to the chat room
        socket = io();

        deferred.resolve('success');
       
        $('.enterChat').hide();
        $('.chat').show();

        return false;
      });

      deferred.done(function(status){
        
           socket.on('serverResponse' , function(data){
                if(data.username === username){
                   if(!($('li:last').hasClass('status'))){
                     if($('li span').last().html().indexOf(username) != -1){
                        var text = $('li').last().html() +" "+data.message;
                        $('li').last().html(text);
                        return
                     }
                   }
                   var child = '<li class="align-right">'+'<span>'+data.username + '</span>: '+ data.message+'</li>';
                    $('#messages').append(child);
                  
                }else{
                    if(!($('li:last').hasClass('status'))){
                     if($('li span').last().html().indexOf(data.username) != -1){
                        var text = $('li').last().html() +" "+data.message;
                        $('li').last().html(text);
                        return;
                     }
                   }
                  var child = '<li class="align-left">'+'<span>'+data.username + '</span>: '+ data.message+'</li>';
                  $('#messages').append(child);
                }
               
              });

            socket.on('clientStatus' , function(status){
              
                var child = '<li class="status">'+ username + " "+status+'</li>';
                $('#messages').append(child);
                socket.emit('broadcastOthers' , username);
            });

            socket.on('userStatus' , function(status){
             
               var child = '<li class="status">'+ status+'</li>';
                $('#messages').append(child);
            })
      });