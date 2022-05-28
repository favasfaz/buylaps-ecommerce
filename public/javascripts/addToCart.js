

function getAll(proId){
    const luck = document.getElementById('luck')
    $.ajax({
        url:'/users/getAll/'+proId,
        method:'get',
        dataType:'json',
        success:(response)=>{
            if(response){
                console.log(response);
            //    product= JSON.stringify(response)
            //     luck.innerHTML=product
            for(var i = 0; i < response.length; i++) {
                console.log(i);
                $('body').append('<div id="luck' + response + '"></div>');
                (function(){
                  var x = $('#luck' + response);
                    AJAX.call(response,function(html){
                      x.append(html);
                    });
                })();
              }
            }
        }
    })
}
function addToCart(proId){
    $.ajax({
        url:'/users/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            // var x = document.getElementById("form1").value;
            if(response.status){
                $('#cart-count').html(response.count)
                alert('Item added to Cart')
            }
            else{
                alert('please login first')
            }
        }, 
        // error: function() {
        //     alert("Please login first");
        //   }
    })
}
function decProduct(proId,quantity){
    $.ajax({
        url:'/users/decProduct',
        data:{
            productId:proId,
            quan:quantity
        },
        method:'post',
        success:(response)=>{
            var x = document.getElementById("form1").value;
            if(response){
                location.reload();
                document.getElementById('form1').innerHTML=x+1
            }
        }
    })
}
function delProduct(proId){
    $.ajax({
        url:'/users/delete-cart/'+proId,
          method:'get',
        success:(response)=>{
            location.reload();
            alert('product deleted from cart successfully')
        }
    })
}
function addProductCount(proId,quantity){
    $.ajax({
        url:'/users/addProductCount',
        data:{
            productId:proId,
            quan:quantity,
        },
          method:'post',
        success:(response)=>{
            console.log(response);
            location.reload();
            
        }
    })
}
function addToWishlist(proId){
    $.ajax({
      
        url:'/users/addToWishlist/'+proId,
          method:'get',
        success:(response)=>{
            if(response.newProduct){
                $('#wishlist-count').html(response.count)
                alert('item added to wishlist')
            }
            if(response.oldProduct){
                alert('item already in wishlist')
            }
         
           
        }, 
       
          
    })
}