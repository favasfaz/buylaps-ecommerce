
    // validate the comment form when it is submitted


    // validate signup form on keyup and submit
    $("#signup-form").validate({
        rules: {
            fName: {
                required: true,
                minlength: 5,
            },
            lName: {
                required:true
            },
           

            password: {
                required: true,
                minlength: 4
            },
            cpassword:
             {
                minlength: 4,
                equalTo: "#password"
            },
            email: {
                required: true,
                email: true
            },
            phone:{
                required:true,
                        minlength:10,
                    maxlength:10
                
            }

           
        },
        messages: {
            firstname: "Please enter your first name",
            lastname: "Please enter your last name",
         
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long"
            },
            cpassword: {
                required: "Please provide a password",
                minlength: "Your password must be at least 5 characters long",
                equalTo: "Please enter the same password as above"
            },
            email: "Please enter a valid email address",
         
        },
    
        
    });

