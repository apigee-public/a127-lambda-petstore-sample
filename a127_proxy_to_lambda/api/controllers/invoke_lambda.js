'use strict';
/*
 'use strict' is not required but helpful for turning syntactical errors into true errors in the program flow
 http://www.w3schools.com/js/js_strict.asp
*/

/*
 Modules make it possible to import JavaScript files into your application.  Modules are imported
 using 'require' statements that give you a reference to the module.

  It is a good idea to list the modules that your application depends on in the package.json in the project root
 */
var util = require('util');
var AWS = require('aws-sdk');
var apigee = require('apigee-access');
var lambda;

/*
 Once you 'require' a module you can reference the things that it exports.  These are defined in module.exports.

 For a controller in a127 (which this is) you should export the functions referenced in your Swagger document by name.

 Either:
  - The HTTP Verb of the corresponding operation (get, put, post, delete, etc)
  - Or the operationId associated with the operation in your Swagger document

  In the starter/skeleton project the 'get' operation on the '/hello' path has an operationId named 'hello'.  Here,
  we specify that in the exports of this module that 'hello' maps to the function named 'hello'
 */
module.exports = {
  CreateUserDemoAction: create_user_demo,
  LoginDemoAction: login_demo,
  ListPetsDemoAction: list_pets_demo,
  GetPetDemoAction: get_pet_demo,
  CreatePetDemoAction: create_pet_demo
};

//get the aws access details from the apigee vault and setup the AWS Config object
var orgVault = apigee.getVault('awscreds', '');
orgVault.get('access_key', function(err, secretValue) {
  console.log('The deployment mode is ' + apigee.getMode());
  AWS.config.accessKeyId = secretValue;

  orgVault.get('secret_key', function(err, secretValue) {
      AWS.config.secretAccessKey = secretValue;

      orgVault.get('region', function(err, secretValue) {
         AWS.config.region = secretValue;

         console.log('AWS Region is ' + AWS.config.region);

         lambda = new AWS.Lambda();
       });
    });
 });

/*
  Call the lambda function passing in the required values
 */
function invoke_lambda(req, res, action) {

  console.log(action + ' called, with body ' + JSON.stringify(req.body));

  var params = {
   FunctionName: 'test-function',
   Payload: JSON.stringify(
     {
       "action" : action,
       "body" : req.body
     }
   )
  };

  //Invokes Lambda function
  lambda.invoke(params, function(err, data) {
   if (err) { console.log("Error: for lambda", err); }
   else {

     if (/.*BAD_REQ.*/.test( JSON.stringify(data) ) ){
       console.log("BAD REQUEST");
       res.status(400)
     } else if (/.*INT_ERROR.*/.test( JSON.stringify(data) ) ) {
       console.log("INTERNAL ERROR");
       res.status(500)
     }

     console.log("Response:" + JSON.stringify(data));
     res.json(JSON.parse(data.Payload));
   }
  });


}


function create_user_demo(req, res) {
  invoke_lambda(req, res, "com.amazonaws.apigatewaydemo.action.RegisterDemoAction")
}

function login_demo(req, res) {
  invoke_lambda(req, res, "com.amazonaws.apigatewaydemo.action.LoginDemoAction")
}

function list_pets_demo(req, res) {
  invoke_lambda(req, res, "com.amazonaws.apigatewaydemo.action.ListPetsDemoAction")
}

function create_pet_demo(req, res) {
  invoke_lambda(req, res, "com.amazonaws.apigatewaydemo.action.CreatePetDemoAction")
}

function get_pet_demo(req, res) {
    req.body = {"petId": req.swagger.params.petId.value}
    invoke_lambda(req, res, "com.amazonaws.apigatewaydemo.action.GetPetDemoAction")
}
