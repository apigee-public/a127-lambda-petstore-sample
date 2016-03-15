//var base_url = 'http://emea-demo1-test.apigee.net/petstore_lambda_api/';
var base_url = 'http://emea-demo1-test.apigee.net/petstore_aws_api_gateway/';

// document ready stuff
$(function() {
  function showNavbar() {
    dust.isDebug = true;
    dust.render("navbar", {}, function(err,out) {
      if (err != undefined) {
        console.log('This is the err: %s', err );
      }
      else {
        $('#navbar').empty();
        $('#navbar').html( out );
      }
    });
  }

  function showMainPage() {
    dust.isDebug = true;
    dust.render("mainPage", {"test":"this is a test"}, function(err, out) {
      if (err != undefined) {
        console.log('This is the err: %s', err );
      }
      else {
        console.log('this is the output' + out);
        $('#page').empty();
        $('#page').html( out );
      }
    });
  }

  function showLogin() {
    dust.render("signin", {}, function(err, out) {
      if (err != undefined) {
        console.log('This is the err: %s', err );
      }
      else {
        $('#page').empty();
        $('#page').html( out );

        $(document).on('click','#signinButton',function(){
          login($('#inputUsername').val(),$('#inputPassword').val());
          return false;
        });

        $(document).on('click','#registerButton',function(){
          register($('#inputUsername').val(),$('#inputPassword').val());
          return false;
        });
      }
    });
  }

  function login( username,password ) {
    $(document).off('click','#signinButton');
    $(document).off('click','#registerButton');
    console.log("logging in user %s : %s", username, password);
      async.series([
        function(cb) {
          $.ajax({
            url: base_url + '/login',
            headers: {"content-type": "application/json",
                      "accept": "application/json"
            },
            method: 'POST',
            data: JSON.stringify({"username":username,"password":password}),
            success: function( data ) {
              cb( null, data );
            }
          });
        },
        function(cb) {
          //showOrderList( cust );
          showNavbar();
          showPetList();
          cb( null );
        }
      ], function(err,r) {
        if (err) {
          console.log('failed while logging in: %s', id);
        }
      });
  }

  function register( username,password ) {
    $(document).off('click','#signinButton');
    $(document).off('click','#registerButton');
    console.log("logging in user %s : %s", username, password);
      async.series([
        function(cb) {
          $.ajax({
            url: base_url + '/users',
            headers: {"content-type": "application/json",
                      "accept": "application/json"
            },
            method: 'POST',
            data: JSON.stringify({"username":username,"password":password}),
            success: function( data ) {
              cb( null, data );
            }
          });
        },
        function(cb) {
          //showOrderList( cust );
          showNavbar();
          showPetList();
          cb( null );
        }
      ], function(err,r) {
        if (err) {
          console.log('failed while logging in: %s', id);
        }
      });
  }

  function showPetList( ) {
    $(document).off('click','.petDetails');
    $(document).off('click','.petSelector');
    $(document).off('click','#newPet');
    $(document).off('click','#addNewPetBTN');
    console.log("showing pet list");
    async.waterfall([
      function(cb) {
        $.ajax({
          url: base_url + '/pets',
          headers: {"content-type": "application/json",
                    "accept": "application/json"
          },
          method: 'GET',
          success: function( data ) {
            console.log("showing pet list success");
            cb( null, data );
          }
        });;
      },
      function( data, cb ) {
        dust.isDebug=true;
        console.log(JSON.stringify(data.pets));
        dust.render("petsList", { list: data.pets }, function(err,out) {

          //console.log("Payload is %s", json.Payload);
          if (err != undefined) {
            console.log('This is the error: %s', err);
          }
          else {
            $('#page').empty();
            $('#page').html( out );

            $(document).on('click','.petDetails', function() {
              var theId = this.id;
              showPetInfo(theId);
              console.log('Calling showPetInfo with id %s', theId);
            });
            $(document).on('click','#newPet', function() {
              console.log("trying to call new pet");
              newPetDialog();
            });
          }
        });
        cb( null, 'done' );
      }
    ],
    function( err, res ) {
      if (err) {
        console.log("This is the error: %s", err);
      }
      else {
        console.log("Succeeded in showing pets");
      }
    });
  }


  function showPetInfo(petId) {

    console.log("showPetInfo called with petId %s", petId);

    $(document).off('click','.orderDetails');
    $(document).off('click','.productSelector');
    $(document).off('click','#newOrder');
    $(document).off('click','#addNewOrderBTN');

    async.waterfall([
      function(cb) {

        $.ajax({
          url: base_url + '/pets/' + petId,
          headers: {"content-type": "application/json",
                    "accept": "application/json"
          },
          method: 'GET',
          success: function( data ) {
            cb( null, data );
          }
        });
      },
      function( data, cb ) {
        dust.isDebug = true;
        dust.render("petDetails", { "petDetail" : data }, function(err,out) {
          if (err != undefined) {
            console.log('This is the err: %s', err );
          }
          else {
            BootstrapDialog.show({
              id: 'petDetailModalDialog',
              title: 'Pet Detail',
              message: out
            });

          }
        });
        cb( null, 'done' );
      }],
      function(err,res) {
        if (err) {
          console.log("This is the error: %s", err);
        }
        else {
          console.log("Succeeded in showing customers");
        }
      }
    );
  }


  function newPetDialog() {
    dust.isDebug = true;
    dust.render("newPet", {}, function(err, out) {
      if (err != undefined) {
        console.log('This is the err: %s', err );
      }
      else {
        BootstrapDialog.show({
          id: 'newPetModalDialog',
          title: 'Add a new pet',
          message: out
        });

        $(document).on('click','#addNewPetBTN',function(){
          var newData = { petType: $('#petType').val(), petName: $('#petName').val(), petAge: Number($('#petAge').val()) }
          console.log(newData);
          commitPet( newData );
        });

      }
    });
  }

    function commitPet( data ) {

      console.log("commit pet called with data %s", JSON.stringify(data));
      async.series([
        function(cb) {
          $.ajax({
            url: base_url + '/pets',
            method: 'POST',
            headers: {"content-type": "application/json",
                      "accept": "application/json"
            },
            dataType: 'json',
            data: JSON.stringify(data),
            success: function( data ) {
              cb( null, data );
            }
          });
        }],
        function(err,res) {
          if (err) {
            console.log("This is the error: %s", err);
          }
          else {
            console.log("Succeeded in adding new pet: %s", res);
            //$('#newOrderModalDialog').modal('hide');
            showPetList();
          }
        }
      );
    }

  showLogin();
}); // end document ready
