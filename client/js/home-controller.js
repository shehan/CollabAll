(function () {
    'use strict';

    angular.module('HomeControllerModule', ['AuthModule'])

        .controller('homeController', ['$scope', '$state', '$http','AuthService','$window', function($scope, $state, $http, AuthService,$window) {

            var user = 'userid=' + $scope.userID;
            var socket = io.connect({query: user});
            socket.on('notification message', function (msg) {
                alert(msg);
                $scope.hasNotifications = true;
                $scope.$apply();
            });
            console.log(socket);

            $scope.title = "CollabAll";
            $scope.user =  AuthService.authenticatedUser();




            var args = {
                frequency:1000,					// ( How often the object sends the values - milliseconds )
                gravityNormalized:true,			// ( If the garvity related values to be normalized )
                orientationBase:GyroNorm.WORLD,		// ( Can be GyroNorm.GAME or GyroNorm.WORLD. gn.GAME returns orientation values with respect to the head direction of the device. gn.WORLD returns the orientation values with respect to the actual north direction of the world. )
                decimalCount:2,					// ( How many digits after the decimal point will there be in the return values )
                logger:null,					// ( Function to be called to log messages from gyronorm.js )
                screenAdjusted:true			// ( If set to true it will return screen adjusted values. )
            };

            var gn = new GyroNorm();

            gn.init(args).then(function(){
                gn.start(function(data){
                    $scope.deviceOrientation = "Magnetometer: "
                        + data.do.alpha + ", "
                        + data.do.beta + ", "
                        + data.do.gamma;

                    $scope.deviceMotion = "Accelerometer: "
                        + data.dm.gx + ", "
                        + data.dm.gy + ", "
                        + data.dm.gz;

                    $scope.$apply();
                    // Process:
                    // data.do.alpha	( deviceorientation event alpha value )
                    // data.do.beta		( deviceorientation event beta value )
                    // data.do.gamma	( deviceorientation event gamma value )
                    // data.do.absolute	( deviceorientation event absolute value )

                    // data.dm.x		( devicemotion event acceleration x value )
                    // data.dm.y		( devicemotion event acceleration y value )
                    // data.dm.z		( devicemotion event acceleration z value )

                    // data.dm.gx		( devicemotion event accelerationIncludingGravity x value )
                    // data.dm.gy		( devicemotion event accelerationIncludingGravity y value )
                    // data.dm.gz		( devicemotion event accelerationIncludingGravity z value )

                    // data.dm.alpha	( devicemotion event rotationRate alpha value )
                    // data.dm.beta		( devicemotion event rotationRate beta value )
                    // data.dm.gamma	( devicemotion event rotationRate gamma value )
                });
            }).catch(function(e){
                // Catch if the DeviceOrientation or DeviceMotion is not supported by the browser or device
            });

/*
            if ($window.DeviceMotionEvent) {
                $window.addEventListener("devicemotion", motion, true);
            }
            else{
                alert("DeviceMotionEvent NOT supported");
            }

            if ($window.DeviceOrientationEvent) {
                $window.addEventListener("deviceorientation", orientation, true);
            }
            else{
                alert("DeviceOrientation NOT supported");
            }

            function motion(event){
                $scope.deviceMotion = "Accelerometer: "
                    + event.accelerationIncludingGravity.x + ", "
                    + event.accelerationIncludingGravity.y + ", "
                    + event.accelerationIncludingGravity.z
                $scope.$apply();
            }

            function orientation(event){
                $scope.deviceOrientation = "Magnetometer: "
                    + event.alpha + ", "
                    + event.beta + ", "
                    + event.gamma;
                $scope.$apply();
            }
*/

        }]);

}());
