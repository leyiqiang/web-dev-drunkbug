/**
 * Created by leyiqiang on 5/29/16.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("ProfileController", ProfileController)
        .controller("RegisterController", RegisterController);


    function ProfileController($location, $rootScope, $routeParams, UserService) {
        var vm = this;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;
        var id = $routeParams["id"];

        function init() {
            UserService
                .findUserById(id)
                .then(function (res) {
                    vm.user = res.data;
                });
        }

        init();


        function updateUser() {
            UserService
                .updateUser(vm.user._id, vm.user)
                .then(function (res) {
                    if (res.status === 200) {
                        Materialize.toast("Success", 1000);
                    } else {
                        Materialize.toast("User Not Found", 1000);
                    }
                });
        }

        function deleteUser() {
            UserService
                .deleteUser(vm.user._id)
                .then(function (res) {
                    if (res.status === 200) {
                        Materialize.toast("Successfully Deleted", 1000);
                        $location.url("/login")
                    } else {
                        Materialize.toast("Unable to delete user", 1000);
                    }
                });
        }


        function logout() {
            $rootScope.currentUser = null;
            UserService
                .logout()
                .then(
                    function() {
                        $location.url("/login");
                    },
                    function() {
                        $location.url("/login");
                    }
                );
        }
    }

    function LoginController($location, UserService) {

        var vm = this;
        vm.login = Login;
        function Login(username, password) {
            UserService
                .login(username, password)
                .then(function (res) {
                    var user = res.data;
                    if (user) {
                        var id = user._id;
                        $location.url("/profile/" + id);
                    } else {
                        Materialize.toast("User Not Found", 1000);
                    }
                });
        }
    }

    function RegisterController($location, $rootScope, UserService) {
        var vm = this;
        vm.checkDupUser = checkDupUser;
        function checkDupUser(username, password) {
            var newUser = {
                username: username,
                password: password,
                firstname: "",
                lastName: ""
            };
            UserService
                .register(newUser)
                .then(function (res) {
                        var user = res.data;
                        $rootScope.currentUser = user;
                        $location.url("/profile/" + res.data._id);
                    },
                    function (err) {
                        $location.url("/register/");
                        Materialize.toast("Illegal username", 1000);
                    });
            // UserService
            //     .findUserByUsername(username)
            //     .then(function (res){
            //         var user = res.data;
            //         if(user!= ""|| username == null || username=="" ) {
            //             $location.url("/register/");
            //             Materialize.toast("Illegal username", 1000);
            //         } else {
            //             var newUser =  {
            //                 username:username,
            //                 password:password,
            //                 firstname:"",
            //                 lastName:""
            //             };
            //             UserService
            //                 .register(newUser)
            //                 .then(function(res) {
            //                     $location.url("/profile/"+res.data._id);
            //                 });
            //
            //         }
            //     });

        }
    }
})();