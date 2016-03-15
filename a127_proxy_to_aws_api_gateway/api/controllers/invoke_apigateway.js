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
var aws4 = require('aws4');
var apigee = require('apigee-access');
var https = require('https');


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

var region;
var accessKeyId;
var secretAccessKey;

//get the aws access details from the apigee vault
var orgVault = apigee.getVault('awscreds', '');
orgVault.get('access_key', function(err, secretValue) {
  console.log('The deployment mode is ' + apigee.getMode());
  accessKeyId = secretValue;

  orgVault.get('secret_key', function(err, secretValue) {
      secretAccessKey = secretValue;

      orgVault.get('region', function(err, secretValue) {
         region = secretValue;

         console.log('AWS Region is ' + AWS.config.region);

         lambda = new AWS.Lambda();
       });
    });
 });

/*
  Call the AWS Gateway
 */
function invoke_awsgateway(req, res) {

  console.log("request method is " + req.method);
  console.log("request url is " + req.url);

  // given an options object you could pass to http.request
  var opts = {method: req.method, host: 'r1hrc0iwdc.execute-api.eu-west-1.amazonaws.com', service: 'execute-api', "region": region, path: '/test' + req.url,
    body: JSON.stringify(req.body),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }

  //remove the body if this is a get
  if (req.method == 'GET' ) {
    delete opts.body;
  }

  //generate the s4 signature
  aws4.sign(opts, {"accessKeyId": accessKeyId, "secretAccessKey": secretAccessKey})

  //console.log(opts);

  //if this is a post then remove the body and Content-Length that aren't needed for the actual callout
  if (req.method == 'POST' ) {
    delete opts.body;
    delete opts.headers['Content-Length'];
  }

  //make the https callout
  var inner_request = https.request(opts, function(inner_response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    inner_response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    inner_response.on('end', function () {
      console.log(str);
      res.json(JSON.parse(str));
    });
  })

  if (req.method == 'POST' ) {
    inner_request.write(JSON.stringify(req.body));
  }

  inner_request.end();
}

function create_user_demo(req, res) {
  invoke_awsgateway(req, res)
}

function login_demo(req, res) {
  invoke_awsgateway(req, res)
}

function list_pets_demo(req, res) {
  invoke_awsgateway(req, res)
}

function create_pet_demo(req, res) {
  invoke_awsgateway(req, res)
}

function get_pet_demo(req, res) {
    req.body = {"petId": req.swagger.params.petId.value}
    invoke_awsgateway(req, res)
}
