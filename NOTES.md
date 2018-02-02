# NOTES
Key points of the framework

## Validation

- Supported validator:
    - Native:
        - length
        - length.max
        - length.min
        
    - Chris O'Hara Validators map:

        ```
            equals -> validator["equals"],
            contains -> validator["contains"],
            matches -> validator["matches"],
            email -> validator["isEmail"],
            url -> validator["isURL"],
            MACAddress -> validator["isMACAddress"],
            IP -> validator["isIP"],
            FQDN -> validator["isFQDN"],
            boolean -> validator["isBoolean"],
            alpha -> validator["isAlpha"],
            alphanumeric -> validator["isAlphanumeric"],
            numeric -> validator["isNumeric"],
            port -> validator["isPort"],
            lowercase -> validator["isLowercase"],
            uppercase -> validator["isUppercase"],
            ascii -> validator["isAscii"],
            fullWidth -> validator["isFullWidth"],
            halfWidth -> validator["isHalfWidth"],
            variableWidth -> validator["isVariableWidth"],
            multibyte -> validator["isMultibyte"],
            surrogatePair -> validator["isSurrogatePair"],
            int -> validator["isInt"],
            float -> validator["isFloat"],
            decimal -> validator["isDecimal"],
            hexadecimal -> validator["isHexadecimal"],
            divisibleBy -> validator["isDivisibleBy"],
            hexColor -> validator["isHexColor"],
            ISRC -> validator["isISRC"],
            MD5 -> validator["isMD5"],
            hash -> validator["isHash"],
            json -> validator["isJSON"],
            empty -> validator["isEmpty"],
            length -> validator["isLength"],
            byteLength -> validator["isByteLength"],
            uuid -> validator["isUUID"],
            mongoId -> validator["isMongoId"],
            after -> validator["isAfter"],
            before -> validator["isBefore"],
            in -> validator["isIn"],
            creditcard -> validator["isCreditCard"],
            ISIN -> validator["isISIN"],
            ISBN -> validator["isISBN"],
            ISSN -> validator["isISSN"],
            phoneNumber -> validator["isMobilePhone"],
            postalCode -> validator["isPostalCode"],
            currency -> validator["isCurrency"],
            ISO8601 -> validator["isISO8601"],
            ISO31661Alpha2 -> validator["isISO31661Alpha2"],
            base64 -> validator["isBase64"],
            dataURI -> validator["isDataURI"],
            mime -> validator["isMimeType"],
            latlong -> validator["isLatLong"]
            
        ```    

- For every data object submitted to a form middleware, any field defined in the form **rules** but does not appear in the data object will be casted into an empty string `""`.

- A validator always accepts 2 most important parameters: **data** and **field** instead of getting just the field value. 
This is will help us be able to write some cross-field validators, ex: password & re-password match. 
Some multi-fields validators, ex: address fields: city, district, street. 
And **required** validator as well.

- We highly recommend write a form as described bellow:

    ```javascript
    @singleton(MyModelFactory)
    @form({
        // Your validation rules here
    })
    export class MyForm extends Form {
        
        /**
         * Inject your needed services for factory a model
         * 
         * @return {Promise<void>}
         */
        constructor(modelFactory) {
            super();
            this.factory = modelFactory;
        } 
        
        /**
         * Provide a helper for getting the Model related to the form data, 
         * instead of getting the raw form data
         */
        async model() {
            return await this.factory.make(this.getData());
        }
        
        /**
         * Override this method from the Form base class for customizing your invalid response
         */
        async invalid(context, next) {
            // Return the invalid reasons to the client by one of these methods:
    
            // Perform redirect with session.flash()
            // In the most cases the destination is the form view itself.
            // With the reasons flashed on Session, the view can re-render the form, with error reason displayed once.
            context.session.flash('myform.invalid', this.getRules().reasons());
            context.redirect('SomeController@action');
            
            // Or response a json invalid reason (which is the default behavior of the form)
            // If the client want to have json response (mostly by Ajax form submit)
            context.body = this.getRules().reasons();
        }
    }
    ```
    
    So in your controller, you should write something like this:
    
    ```javascript
    
    @controller()
    export class MyController {
        
        @post('/your/url', [MyForm])
        async actionMethod(context) {
            // Retrieve your model here
            let myModel = await context.form.model();
        }
    }
    
    ```
    
    This is what we are trying to make a good way to implement **DDD**. 
    If we have a valid data (which have passed through the form) then, we can build it as a **Domain Model**. 
    And vice-versa, a **Domain Model** should always has valid state.
    
    
    
## Database

- DatabaseManger can handle multiple database connections
- QueryScoper -> knex.modify
- Result Morpher -> knex.postProcess