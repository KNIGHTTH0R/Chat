angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
 
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

				  
  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {

      scope.$watch(function() {
          return attrs['ngSrc'];
        }, function (value) {
          if (!value) {
            element.attr('src', attrs.errSrc);  
          }
      });

      element.bind('error', function() {
        element.attr('src', attrs.errSrc);
      });
    }
  }
})
		
.controller('PlaylistsCtrl', function($http, $scope, $stateParams, $rootScope, sharedProperties, $ionicLoading) {
	
			$scope.loadingIndicator = $ionicLoading.show({
				//content: 'Loading Data',
				template: '<i class="ion ion-loading-b" style="font-size: 300%;"></i>',
				animation: 'fade-in',
				noBackdrop: false,
				maxWidth: 400,
				showDelay: 0 
				//duration:30000
			});
			
	var url = "http://YOURDOMAINURL/chat/services/rooms.php?callback=JSON_CALLBACK";
	var server = "http://YOURDOMAINURL/chat/index.php?room=";
	
	if ( sharedProperties.getAll().length == 0 ){
	    $scope.playlists =       
			$http.jsonp(url)
				.success(function(json_response){  //angular.callbacks._0(json_response)
       // console.log(json_response);
					$scope.playlists = json_response ;
			
					sharedProperties.setAll(json_response);
		
		$ionicLoading.hide();

	}).error(function(d){ alert("Error connecting..."); $scope.playlists=[]; $ionicLoading.hide(); });
	}else{ $scope.playlists = sharedProperties.getAll();
		   $ionicLoading.hide();
	}
	
	
})

.controller('PlaylistCtrl', function($scope, $stateParams, $sce, $rootScope, sharedProperties, $ionicLoading) {
	
			$scope.loadingIndicator = $ionicLoading.show({
				//content: 'Loading Data',
				template: '<i class="ion ion-loading-b" style="font-size: 300%;"></i>',
				animation: 'fade-in',
				noBackdrop: false,
				//maxWidth: 400,
				showDelay: 0, duration: 2500
			});
			
	
	$scope.trustUrl = function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	
	$scope.room = sharedProperties.getValue($stateParams.playlistId); 
})


//TODO: por às var as {}
.controller('SearchCtrl', function($scope, $stateParams, $http, sharedProperties, $ionicLoading) {
		
   var url = "http://YOURDOMAINURL/chat/services/rooms.php?callback=JSON_CALLBACK";
   var server = 'http://YOURDOMAINURL/chat/index.php?room=';
   
   $scope.playlists = $http.jsonp(url)
						.success(function(json_response){  		
									//angular.callbacks._0(json_response)
							console.log(json_response);
							$scope.playlists = json_response ;
							//rooms = $scope.playlists;
						});	
  var resultado;

  $scope.logala = function() { 
	
		$scope.loadingIndicator = $ionicLoading.show({
			//content: 'Loading Data',
			template: '<i class="ion ion-loading-b" style="font-size: 300%;"></i>',
			animation: 'fade-in',
			noBackdrop: false,
			maxWidth: 400,
			showDelay: 0
		});
		
   // onSuccess Callback
	// This method accepts a Position object, which contains the
	// current GPS coordinates
	//
	
	var onSuccess = function(position) {
		/* alert('Latitude: '          + position.coords.latitude          + '\n' +
			  'Longitude: '         + position.coords.longitude         + '\n' +
			  'Altitude: '          + position.coords.altitude          + '\n' +
			  'Accuracy: '          + position.coords.accuracy          + '\n' +
			  'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
			  'Heading: '           + position.coords.heading           + '\n' +
			  'Speed: '             + position.coords.speed             + '\n' +
			  'Timestamp: '         + position.timestamp                + '\n');
		*/			

                var geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
							var resultado = { rs: results[1].formatted_address, rs2: results[4].formatted_address, rs3: results[5].formatted_address};
							//alert ("resultado.rs:"+resultado.rs);
							 $scope.latlon = [];
							 $scope.latlon.push ({ /* lat: position.coords.latitude, lon: position.coords.longitude, */ res: resultado.rs, res2: resultado.rs2, res3: resultado.rs3 }
												);
							
						
							// test if Room Title already exists before inserting
							var existTitle = false;
							var existTitle2 = false;
							var existTitle3 = false;
							
							var allr = sharedProperties.getAll();
							for (i=0; i < allr.length; i++)
							{ 
								if (allr[i].title == resultado.rs)
								   { existTitle = true;}
								if (allr[i].title == resultado.rs2)
								   { existTitle2 = true;}
								if (allr[i].title == resultado.rs3)
								   { existTitle3 = true;}
							}
							if ( !existTitle ) //TODO: test if room exists
							{
								sharedProperties.setValue
								( $scope.playlists.length, resultado.rs, server + encodeURIComponent(resultado.rs, 'utf-8') + '.txt' );
							}
							if ( !existTitle2 ) //TODO: test if room exists
							{
								sharedProperties.setValue
								( $scope.playlists.length+1, resultado.rs2, server + encodeURIComponent(resultado.rs2) + '.txt' );
							}
							if ( !existTitle3 ) //TODO: test if room exists
							{
								sharedProperties.setValue
								( $scope.playlists.length+2, resultado.rs3, server + encodeURIComponent(resultado.rs3) + '.txt' );
							}
				
							
							$scope.room = sharedProperties.getValue($scope.playlists.length);
							
							$scope.$apply();
							
							
                        } else {
                           
                            alert('Location not found');
                        }
                    } else {
                
                        alert('Geocoder failed due to: ' + status);
                    }
                });
            
		
		
	$ionicLoading.hide();
	
	};
	
	
	// onError Callback receives a PositionError object
	//
	function onError(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
		
		$ionicLoading.hide();
	}

	navigator.geolocation.getCurrentPosition(onSuccess, onError);


  };
});
