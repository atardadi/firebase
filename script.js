angular.module('tweeter', [])
.constant('PATHS', {
	FIREBASE_ROOT: 'https://twitter-clone-app.firebaseio.com/',
	USERS_REF: 'users'
})
.service('Firebase', ['PATHS','$q',function(PATHS,$q){
	var usersRef = new Firebase(PATHS.FIREBASE_ROOT + PATHS.USERS_REF);

	var data = [
		{
			email: 'test@gmail.com',
			following: [],
			tweets: [],
			name: 'Test Gmail'
		},
		{
			email: 'test@Yahoo.com',
			following: [],
			tweets: [],
			name: 'Test Yahoo'
		}
	];

	var getUsers = function() {
		var deferred = $q.defer();
		usersRef.on('value', function(snap) {
			deferred.resolve(snap.val());
		});

		return deferred.promise;
	};

	return {
		getUsers: getUsers
	};

}])
.service('Users', ['Firebase', '$rootScope', function(Firebase,$rootScope){
	var users;

	var init = function() {		
		Firebase.getUsers()
		.then(function(data) {
			users = data;
			$rootScope.$broadcast('refreshUsers');
		});
	};

	var getUsers = function() {
		return users;
	};
	
	init();
	return {
		getUsers: getUsers
	};
}])
.controller('MainCtrl', ['$scope','Users', function($scope,Users){
	$scope.$on('refreshUsers', function(){
		$scope.users = Users.getUsers();	
		$scope.selectedUser = $scope.users[0];
	});
	
}]);