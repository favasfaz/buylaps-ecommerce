const res = require("express/lib/response");
const { $where } = require("../../Model/user-schema");

function addToCart(proId){
    $.ajax({
        url:'/users/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            var x = document.getElementById("form1").value;
            if(response){
                console.log(response.count);
                location.reload();
                $('#cart-count').html(response.count)
            }
        }, 
        error: function(status=400) {
            alert("Please login first");
          }
    })
}
function decProduct(proId){
    $.ajax({
        url:'/users/decProduct/'+proId,
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