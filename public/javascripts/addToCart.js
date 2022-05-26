

function addToCart(proId){
    $.ajax({
        url:'/users/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            // var x = document.getElementById("form1").value;
            if(response){
                console.log(response.count);
                $('#cart-count').html(response.count)
                alert('Item added to Cart')
            }
        }, 
        error: function(status=400) {
            alert("Please login first");
          }
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
            quan:quantity
        },
          method:'post',
        success:(response)=>{
            console.log(response);
            location.reload();
            
        }
    })
}