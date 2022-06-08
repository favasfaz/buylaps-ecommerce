

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
        }
    })
}

$("#priceFilter").submit((e)=>{
    let datas = document.getElementById("datas");
    console.log('success');
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
                    let products = []
                    response.data.forEach((e)=>{
                        products.push=(e.orders)
                    })
                    let prod = products.pop()
                    console.log(prod);
                  let datas = response.data
                  datas.forEach((p,i)=>{
                    var data = {
                        // Customize enables you to provide your own templates
                        // Please review the documentation for instructions and examples
                        "customize": {
                            //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html 
                        },
                        "images": {
                            // The logo on top of your invoice
                            "logo": "https://public.easyinvoice.cloud/img/logo_en_original.png",
                            // The invoice background
                            "background": "https://public.easyinvoice.cloud/img/watermark-draft.jpg"
                        },
                        // Your own data
                        "sender": {
                            "company": "FEIZY.COM",
                            "address": "Sample Street 123",
                            "zip": "1234 AB",
                            "city": "Sampletown",
                            "country": "Samplecountry"
                            //"custom1": "custom value 1",
                            //"custom2": "custom value 2",
                            //"custom3": "custom value 3"
                        },
                        // Your recipient
                        "client": {
                            "company": p.userId,
                            "address": p.address.town,
                            "zip": p.address.postCode,
                            "city": p.address.state,
                            "country": p.address.country
                            // "custom1": "custom value 1",
                            // "custom2": "custom value 2",
                            // "custom3": "custom value 3"
                        },
                        "information": {
                            // Invoice number
                            "number": "2021.0001",
                            // Invoice data
                            "date": "12-12-2021",
                            // Invoice due date
                            "due-date": "31-12-2021"
                        },
                        // The products you would like to see on your invoice
                        // Total values are being calculated automatically
                        "products": prod,
                        // The message you would like to display on the bottom of your invoice
                        "bottom-notice": "Kindly pay your invoice within 15 days.",
                        // Settings to customize your invoice
                        "settings": {
                            "currency": "USD", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                            // "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')
                            // "tax-notation": "gst", // Defaults to 'vat'
                            // "margin-top": 25, // Defaults to '25'
                            // "margin-right": 25, // Defaults to '25'
                            // "margin-left": 25, // Defaults to '25'
                            // "margin-bottom": 25, // Defaults to '25'
                            // "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
                            // "height": "1000px", // allowed units: mm, cm, in, px
                            // "width": "500px", // allowed units: mm, cm, in, px
                            // "orientation": "landscape", // portrait or landscape, defaults to portrait
                        },
                        // Translate your invoice to your preferred language
                        "translate": {
                            // "invoice": "FACTUUR",  // Default to 'INVOICE'
                            // "number": "Nummer", // Defaults to 'Number'
                            // "date": "Datum", // Default to 'Date'
                            // "due-date": "Verloopdatum", // Defaults to 'Due Date'
                            // "subtotal": "Subtotaal", // Defaults to 'Subtotal'
                            // "products": "Producten", // Defaults to 'Products'
                            // "quantity": "Aantal", // Default to 'Quantity'
                            // "price": "Prijs", // Defaults to 'Price'
                            // "product-total": "Totaal", // Defaults to 'Total'
                            // "total": "Totaal" // Defaults to 'Total'
                        },
                    };
                    
                    //Create your invoice! Easy!
                    easyinvoice.createInvoice(data, function (result) {
                        //The response will contain a base64 encoded PDF file
                        console.log('PDF base64 string: ', result.pdf);
                        easyinvoice.download('invoice')
                    });
                  })
                       
                      
                }
            })
        }


       function sendData(e){
         $.ajax({
             url:'/users/search',
             method:'post',
             data:{
                 id:e
             }
         })
       }
     
       $(document).ready( function () {
        $('#orderTable').DataTable();
    } );