# NOTES
Key points of the framework

## Validation

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
        // Most of the time the destination is the form view itself.
        // With the reasons flashed on Session, the view can re-render the form, with error reason displayed once.
        context.session.flash('myform.invalid', this.getRules().reasons());
        context.redirect('SomeController@action');
        
        // Or response a json error (which is the default behavior of the form)
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