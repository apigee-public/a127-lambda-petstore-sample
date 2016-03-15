<h3>Overview</h3>

This is a demo of how Apigee Edge can be used to either RESTify an AWS Lambda function, or to allow you to put an Apigee Proxy in front of an AWS API Gateway.

As a pre-requisite it is assumed that you have installed and configured the AWS Pet Store Demo (https://github.com/awslabs/api-gateway-secure-pet-store), and that you have the access key and secret for an AWS user that has permission to invoke the Lambda function and execute methods on the AWS API Gateway.

The demo consists of two a127 node.js Proxies which can be deployed to Apigee Edge and a sample UI.

<h3>Setup</h3>

To use the demo you first need to provide your AWS access credentials. For this demo these will be stored in the secure vault inside Apigee. To set them up, open up the setup_vault.sh script and put in your Apigee organisation name & username and your AWS access key, secret key and region. Once that's done save and run the file - note that you will be prompted for your Apigee password 4 times.

You should see output like this:

Enter host password for user 'xxxx@apigee.com':</br>
{</br>
  "name" : "awscreds",</br>
  "value" : "*****"</br>
}Enter host password for user 'xxxx@apigee.com':</br>
{</br>
  "name" : "awscreds",</br>
  "value" : "*****"</br>
}Enter host password for user 'xxxx@apigee.com':</br>
{</br>
  "name" : "awscreds",</br>
  "value" : "*****"</br>
}Enter host password for user 'xxxx@apigee.com':</br>
{</br>
  "name" : "awscreds",</br>
  "value" : "*****"</br>
}</br>


Next you need to install the required packages for the proxies with the npm tool. Open a terminal window and go into the <b><i>a127_proxy_to_lambda</b></i> folder and run:

<b><i>npm install</b></i>

You should now have a fully functional proxy, the final step is to deploy it up to Apigee so you can start testing with it. If you don't have it already, install a127 ('<b><i>npm install -g a127</b></i>'), configure it to point at your organisation for deployment ('<b><i>a127 account create &lt;my-account&gt;</i></b>' and then follow the prompts) and from the <b><i>a127_proxy_to_lambda</i></b> folder run:

<b><i>a127 project deploy --upload</b></i>

You should now have a working proxy deployed to Edge that can invoke AWS lambda functions.

Repeat the above two steps in the <b><i>a127_proxy_to_aws_api_gateway</b></i> folder. Note that for this to work you will need to be deploying this to an Apigee organisation that has SNI enabled.

You can test out the 2 proxies using the sample client. You will need bower to setup the client, if you don't have it then install it with '<b><i>npm install -g bower</b></i>'. To configure the client, go into the <b><i>awslamdademo_client</b></i> folder, and run the following commands:

<b><i>bower install<br>
npm install gulp<br>
npm install --save-dev gulp-uglify gulp-dust gulp-flatten del gulp-bower gulp-concat gulp-sourcemaps gulp-serve vinyl-paths gulp-strip-debug</b></i>

Next, open up the <b><i>src/lib/appLogic.js</b></i> and change the base_url at the top of the file to match either the base url for the <b><i>a127_proxy_to_lambda</b></i> or the <b><i>a127_proxy_to_aws_api_gateway</b></i> proxy.

Launch the demo client by running 'gulp'. You should now be able to access the client by opening a browser and pointing at 'http://localhost:3000/'. If you want you can start session tracing via the Edge UI whilst you use the client to exercise the API. You can also edit the <b><i>src/lib/appLogic.js</b></i> to switch between the <b><i>a127_proxy_to_lambda</b></i> or the <b><i>a127_proxy_to_aws_api_gateway</b></i> proxy. These changes will be automatically picked up.
