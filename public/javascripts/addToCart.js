


function getAll(proId){
    let parent = document.getElementById("parent");
    console.log(parent, "parent")
    parent.innerHTML="";
    $.ajax({
        url:'/getAll/'+proId,
        method:'get',
        success:(response)=>{
           let product=response.product;
          console.log(product, "product");
          product.forEach((p,i) => {
            let div = document.createElement('div')
            let parentDiv =document.createElement('div')
            parentDiv.setAttribute("class",
            "col-sm-12 col-md-4")
            let subDivOne = document.createElement("div");
            subDivOne.setAttribute(
                "class",
                " block2-img wrap-pic-w of-hidden pos-relative block2-labelnew d-flex justify-content-center"
              );
              subDivOne.classList.add("block2");
              let subDivTwo = document.createElement("div");
              subDivTwo.setAttribute(
                "class",
                " block2-img wrap-pic-w of-hidden pos-relative block2-labelnew "
              );
            let proName = document.createElement('h6')
                let prodImg = document.createElement("img");
            prodImg.src= `/uploads/${p.images[0].img1}`;
            prodImg.alt=p.brand;
            proPrice = document.createElement('h6')
            proName=p.productName
            proPrice = p.price
            subDivTwo.append(prodImg);
            var lineBreak = document.createElement("br");
            // parentDiv.append(lineBreak)
            let overlay = document.createElement("div");
              overlay.setAttribute("class", "block2-overlay", "trans-0-4");
              let link1 = document.createElement("a");
            //   link1.href = "#";
              link1.setAttribute(
                "class",
                "block2-btn-addwishlist hov-pointer trans-0-4 d-flex justify-content-center align-items-center mt-4 mb-3"
              );
            // subDivOne.append(proName);
            let icon1 = document.createElement("i");
            icon1.ariaHidden = "true";
            icon1.setAttribute("class", "icon_heart_alt height-50",onclick="addToCart('{{p._id}}')");
            let icon2 = document.createElement("i");
            icon2.setAttribute("class", "icon_bag_alt ml-3  ");
            icon2.ariaHidden = "true";
            icon2.onclick = function() {addToCart(p._id)};
            icon1.onclick = function() {addToWishlist(p._id)};
            subDivTwo.append(overlay,proName+'  '+'$'+proPrice);
            subDivTwo.append(lineBreak)
            link1.append(icon1,icon2);
            overlay.append(link1);
            subDivOne.append(subDivTwo);
              parentDiv.append(subDivOne);
            parent.append(parentDiv);
            
          });
        }
    })
}
function addToCart(proId){

    console.log(proId);
    $.ajax({
        url:'/add-to-cart/'+proId,
        method:'get',
        success:(response)=>{
            if(response.status){
                $('#cart-count').html(response.count)
               
                swal("", "Item added to Cart", "success");
                $("#form1").load(location.href + " #load");
                           }
                           else{
                            swal( "!","please login first", "error");
                           }
                            
        }, 
        error: function(err) {
            swal( "!","please login first", "error");
        }
    })
}
function decProduct(proId,quantity){
    $.ajax({
        url:'/decProduct',
        data:{
            productId:proId,
            quan:quantity
        },
        method:'post',
        success:(response)=>{
            // const coupon = require("../../Model/coupon-schema");

            var x = document.getElementById("form1").value;
            if(response){
                // console.log('decremetn');
                // location.reload();
                // document.getElementById('form1').innerHTML=x+1
                $("#cartDiv").load(location.href + " #cartDiv");

            }
        }
    })
}
 function delProduct(proId){

    swal({
        title: "Are you sure?",
        text: "YOu want to delete the Product",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {

            $.ajax({
                url:'/delete-cart/'+proId,
                  method:'get',
                success:(response)=>{
                    if(response.status){
                        swal("! Your product from  cart has been deleted!", {
                            icon: "success",
                          });
                    location.reload()
                    }
                }
            })
          
        } 
        // else {
        //   swal("Your imaginary file is safe!");
        // }
      });
    
}
function addProductCount(proId,quantity){
    $.ajax({
        url:'/addProductCount',
        data:{
            productId:proId,
            quan:quantity,
        },
          method:'post',
        success:(response)=>{
            if(response){
                $("#cartDiv").load(location.href + " #cartDiv");
            }

            // console.log(response);
            // location.reload();
            
        }
    })
}
function addToWishlist(proId){

    console.log(proId,'success');

    $.ajax({
      
        url:'/addToWishlist/'+proId,
          method:'get',
        success:(response)=>{
            if(response){
            if(response.newProduct){
                // location.reload()
                $('#wishlist-count').html(response.count)
                $("#wishlist-count").load(location.href + " #wishlist-count");

                // swal("", "Item added to Wishlist", "success");
                swal({
                    title: "",
                    text: "Item added to wishlist",
                    type: "success",
                    
                    });
            }
            else if(response.oldProduct){
                swal( "!","Item already in wishlist", "error");
            }
        }else{
            console.log('success1');
            swal( "!","You might be login", "error");
        }
           
        }, 
       
          
    })
}
function getCoupons(){
    let coupon = document.getElementById("coupon");
    $.ajax({
        url:'/couponOffer',
          method:'get',
        success:(response)=>{
            if(response.length!=0){
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
            }
            else{
                console.log('nocoupon');
                swal( "!","NO coupon is available", "error");
                document.getElementById('coupon').innerHTML='NO coupon available'
            }
          
                    
        }, 
       
          
    })}

    $("#checkout-form").submit((e)=>{
        e.preventDefault()
        $.ajax({
            url:'/placeOrder',
            method:'post',
            data:$('#checkout-form').serialize(),
            success:(response)=>{
                if(response.stockout){
                    swal( "!","product is stockout", "error");

                }else{
                    if(response.status){
                    //    swal("", "Item added to Wishlist", "success");
                        window.location.href= "/orderSuccessfull"
                      }else{
                          razorpayPayment(response)
                      }
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
   
    $.ajax({
        url:'/verifyPayment',
        data:{
            payment,
            order
        },
        method:'post',
        success:(response)=>{
            window.location.href= "/orderSuccessfull"
        },
      
    })
}

$("#priceFilter").submit((e)=>{
    let datas = document.getElementById("datas");
    console.log('success');
    datas.innerHTML='';
    e.preventDefault()
    $.ajax({
        url:'/filter',
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
                url:'/cancelOrder/'+id,
                method:'get',
                success:(response)=>{
                    location.reload()
                        
                }
            })
        }
  
        function downloadInvoice(){
            console.log('success');
            $.ajax({
                url:'/download',
                method:"get",
                success:(response)=>{
                   console.log('success');
                }
            })
        }

    

     
function changeStatus(id,user){

    let data = document.getElementById('example').value
 
   $.ajax({
       url:'/admin/changeStatus',
       data:{
           id,
           user,
           data
       },
       method:'post',
       success:(response)=>{
        // if(data == 1){
        //     $("#example").load(location.href + " #example");
        //     $("#status").load(location.href + " #status");

        // }
        // else{
        //     document.getElementById('example').style.display = 'none'
        //     $("#status").load(location.href + " #status");
        // }
           location.reload()
        console.log('success');
       }
   })
}

function deleteOrder(id){
    $.ajax({
        url:'/deleteOrder/'+id,
        method:'get',
        success:(response)=>{
                window.location.href='/viewOrder'
        }

    })
}

function paymentFailed(order){
    $.ajax({
        url:'/paymentFailed',
        method:'post',
        data:{
          
            order
        },
        success:(response)=>{

        }
    })
}


async function allData(response){
    console.log(response,'new response');

    document.getElementById('Sales').innerHTML = response.Sales
    document.getElementById('orderCount').innerHTML = response.orderCount
    document.getElementById('successPayment').innerHTML = response.successPayment


  var ctx = document.getElementById('rice').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels:response.dateArray,
        datasets: [{
            label: "My First dataset",
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

}


// async function forHome(){
//     console.log('success1');
//     const totalAmount = []
//     const totalDate = []
//     $.ajax({
//         url:'/admin/getData',
//         method:'post',
//         success:(response)=>{
//             console.log(response,'reponse of home');
//             var ctx = document.getElementById('rice').getContext('2d');
//             var chart = new Chart(ctx, {
//                 // The type of chart we want to create
//                 type: 'bar',
            
//                 // The data for our dataset
//                 data: {
//                     labels:response.dateArray,
//                     datasets: [{
//                         label: "last week dataset",
//                         backgroundColor: 'rgb(255, 99, 132)',
//                         borderColor: 'rgb(255, 99, 132)',
//                         data:response.totalArray,
//                     }]
//                 },
            
//                 // Configuration options go here
//                 options: {
//                   tooltips:{
//                     mode:'index'
//                   }
//                 }
//             });
//             var ctx = document.getElementById('brand').getContext('2d');
//             var chart = new Chart(ctx, {
//                 // The type of chart we want to create
//                 type: 'bar',
            
//                 // The data for our dataset
//                 data: {
//                     labels:response.brandArray,
//                     datasets: [{
//                         label: "brand base dataset",
//                         backgroundColor: 'rgb(255, 99, 132)',
//                         borderColor: 'rgb(255, 99, 132)',
//                         data:response.sumArray,
//                     }]
//                 },
            
//                 // Configuration options go here
//                 options: {
//                   tooltips:{
//                     mode:'index'
//                   }
//                 }
//             });
//         }})
 
// }

// forHome()

$(document).ready(function (){
    $("#getUpdate").submit((e)=>{
        console.log('success3');
        $.ajax({
            url:'/admin/getData',
            data:$('#getUpdate').serialize(),
            method:'post',
            success:(response)=>{
                console.log(response,'before passing');
                allData(response)
                
            }
            
        })
        e.preventDefault()
    
    })
})

