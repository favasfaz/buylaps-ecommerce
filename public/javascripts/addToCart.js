


function getAll(proId){
    let parent = document.getElementById("parent");
    console.log(parent, "parent")
    parent.innerHTML="";
    $.ajax({
        url:'/users/getAll/'+proId,
        method:'get',
        success:(response)=>{
           let product=response.product;
          console.log(product, "product");
          product.forEach((p,i) => {
            let div = document.createElement('div')
            let parentDiv =document.createElement('div')
            parentDiv.setAttribute("class",
            "col-sm-12 col-md-4")
            let proName = document.createElement('h6')
                let prodImg = document.createElement("img");
            prodImg.src= `/uploads/${p.images[0].img1}`;
            prodImg.alt=p.brand;
            proName=p.productName
            parentDiv.append(prodImg);
            parentDiv.append(proName);
            parent.append(parentDiv);
            
          });
        }
    })
}
function addToCart(proId){

    console.log(proId);
    $.ajax({
        url:'/users/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                $('#cart-count').html(response.count)
              alert('added to cart')
                           }
                           else{
                               alert('please login')
                           }
                            
        }, 
        error: function(err) {
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
            // const coupon = require("../../Model/coupon-schema");

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
                location.reload()
                $('#wishlist-count').html(response.count)
                alert('item added to wishlist')
            }
            if(response.oldProduct){
                alert('item already in wishlist')
            }
         
           
        }, 
       
          
    })
}
function getCoupons(){
    let coupon = document.getElementById("coupon");
    $.ajax({
        url:'/users/couponOffer',
          method:'get',
        success:(response)=>{
            let data=response.data;
          console.log(data)
            data.forEach((p,i) => {
              let div = document.createElement('div')
              let parentDiv =document.createElement('div')
              let proName = document.createElement('h6')
               
              proName=p.couponCode
              parentDiv.append(proName);
              coupon.append(parentDiv);
              
            });
                    
        }, 
       
          
    })}

    $("#checkout-form").submit((e)=>{
        e.preventDefault()
        $.ajax({
            url:'/users/placeOrder',
            method:'post',
            data:$('#checkout-form').serialize(),
            success:(response)=>{
                console.log('success');
              if(response.status){
                window.location.href= "/users/orderSuccessfull"
              }else{
                  razorpayPayment(response)
              }
            }
        })
    })
 
function razorpayPayment(order){
    console.log(order,'order');
    console.log(order.response.amount,'amount');
    console.log(order.response.id,'id');
    var options = {
        "key": "rzp_test_BGehHwSUiY0EOA", // Enter the Key ID generated from the Dashboard
        "amount": order.response.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Feizy",
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": order.response.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
           

            verifyPayment(response,order)
        },
        "prefill": {
            "name": "Gaurav Kumar",
            "email": "gaurav.kumar@example.com",
            "contact": "9999999999"
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };
    var rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
       paymentFailed(order)
});
    rzp1.open();

}

function verifyPayment(payment,order){
    console.log(payment,'payment');
    $.ajax({
        url:'/users/verifyPayment',
        data:{
            payment,
            order
        },
        method:'post',
        success:(response)=>{
            window.location.href= "/users/orderSuccessfull"
        },
      
    })
}

$("#priceFilter").submit((e)=>{
    let datas = document.getElementById("datas");
    console.log('success');
    datas.innerHTML='';
    e.preventDefault()
    $.ajax({
        url:'/users/filter',
        method:'post',
        data:$('#priceFilter').serialize(),
        success:(response)=>{
            let data=response.data;
          console.log(data);
            data.forEach((p,i) => {
              let div = document.createElement('div')
              let parentDiv =document.createElement('div')
              parentDiv.setAttribute("class",
              "col-sm-12 col-md-4")
              let proName = document.createElement('h6')
                  let prodImg = document.createElement("img");
              console.log(prodImg, "pro")
              prodImg.src= `/uploads/${p.images[0].img1}`;
              prodImg.alt=p.brand;
              proName=p.productName
              parentDiv.append(prodImg);
              var lineBreak = document.createElement("br");
              parentDiv.append(lineBreak)
              parentDiv.append(proName);
              datas.append(parentDiv);    
            });
        }
    })
})

        function cancel(id){
           if(confirm('are you sure')){
               canceling(id)
           }
        }

        function canceling(id){
            console.log(id,'id ');
            $.ajax({
                url:'/users/cancelOrder/'+id,
                method:'get',
                success:(response)=>{
                    location.reload()
                }
            })
        }
  
        function downloadInvoice(){
            console.log('success');
            $.ajax({
                url:'/users/download',
                method:"get",
                success:(response)=>{
                   console.log('success');
                }
            })
        }

        $("body").on("keyup", "#search-box" ,function(event) {
            var element = event.target;
            searchFunction(element.value);
        });

       function searchFunction(search){
       $.ajax({
        url:'/users/search',
        method:'post',
        data:{
            search
        },
        success:(response)=>{
               console.log(response);
        }
       })
        }

     
function changeStatus(id,user){

    let data = document.getElementById('exampleSelectGender1').value
  
    console.log(data,'data');
    console.log(id);
    console.log(user,'user');
   
   $.ajax({
       url:'/changeStatus',
       data:{
           id,
           user,
           data
       },
       method:'post',
       success:(response)=>{
           location.reload()
        console.log('success');
       }
   })
}

function deleteOrder(id){
    $.ajax({
        url:'/users/deleteOrder/'+id,
        method:'get',
        success:(response)=>{
                window.location.href='/users/viewOrder'
        }

    })
}

function paymentFailed(order){
    $.ajax({
        url:'/users/paymentFailed',
        method:'post',
        data:{
          
            order
        },
        success:(response)=>{

        }
    })
}


async function allData(){
    console.log('success1');
    const totalAmount = []
    $.ajax({
        url:'/getData',
        method:'get',
        success:(response)=>{
            response.data.map((e)=>{
                totalAmount.push(e.totalAmount)
              })
        }})

console.log(totalAmount,'toatalAmout');
  var ctx = document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ["Monday", "Tuesday", "Wednsday", "Thursday", "Friday", "Saturday", "Sunday"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data:totalAmount,
        }]
    },

    // Configuration options go here
    options: {
      tooltips:{
        mode:'index'
      }
    }
});
}

allData()

// function getData(){
//     console.log('successss2');
//     $.ajax({
//         url:'/getData',
//         method:'get',
//         success:(response)=>{
//             let total = []
//             response.data.map((e)=>{
//               total.push(e.totalAmount)
//             })
           
//             console.log(total,'total');
           
//             totalAmount = total
//         }
//     })
// }


 

async function forHome(){
    console.log('success1');
    const totalAmount = []
    const totalDate = []
   await $.ajax({
        url:'/getData',
        method:'post',
        success:(response)=>{
            console.log(response,'reponse');
            var ctx = document.getElementById('rice').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',
            
                // The data for our dataset
                data: {
                    labels:response.dateArray,
                    datasets: [{
                        label: "last week dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data:response.totalArray,
                    }]
                },
            
                // Configuration options go here
                options: {
                  tooltips:{
                    mode:'index'
                  }
                }
            });
            var ctx = document.getElementById('brand').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',
            
                // The data for our dataset
                data: {
                    labels:response.brandArray,
                    datasets: [{
                        label: "brand base dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data:response.sumArray,
                    }]
                },
            
                // Configuration options go here
                options: {
                  tooltips:{
                    mode:'index'
                  }
                }
            });
        }})
console.log(totalAmount,'toatalAmout');
 
}

forHome()

$(".getUpdate").submit(()=>{
    console.log('success3');
    $.ajax({
        url:'/getUpdate',
        data:$('.getUpdate').serialize(),
        method:'post',
        success:(response)=>{
            console.log(response,'updatereponse');
            var ctx = document.getElementById('chart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',
            
                // The data for our dataset
                data: {
                    labels:response.dateArray,
                    datasets: [{
                        label: "last week dataset",
                        backgroundColor: 'rgb(255, 99, 132)',
                        borderColor: 'rgb(255, 99, 132)',
                        data:response.totalArray,
                    }]
                },
            
                // Configuration options go here
                options: {
                  tooltips:{
                    mode:'index'
                  }
                }
            });
            window.location.href="/totalRevenue"
        }
    })
})

