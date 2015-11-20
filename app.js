angular.module('app', []);

angular.module('app').run(['$q', '$rootScope',function ($q, $rootScope) {

}]);

angular.module('app').controller('controller1', ['$scope', function ($scope) {
    $scope.title = 'Sukhumi';
    $scope.getDate = function() {
        return new Date().toString();
    };
}]);

angular.module('app').directive('directive1', ['$window', function ($window) {
    // Usage:
    // 
    // Creates:
    // 
    var directive = {
        link: link, // The link function gets called for every instance of this directive.
        restrict: 'A'
    };
    return directive;

    function link(scope, element, attrs) {
    }
}]);

// Input field and text to show it
// <span my-sample></span>
angular.module('app').directive('mySample', ['$compile', function ($compile) {
    return {
        restrict: 'A', // <-- default, doesn't need to be specified.
        link: function (scope, element, attrs, controller) { // The link function gets called for every instance of this directive.
            var markup = "<input type='text' ng-model='sampleData' /> {{sampleData}}<br/>";
            angular.element(element).html($compile(markup)(scope));
        }
    };
}]);

// Version that restricts it to be an element.
// <my-sample2 />
angular.module('app').directive('mySample2', ['$compile', function ($compile) {
    return {
        restrict: 'E', // <-- indicates it has to be an element
        link: function (scope, element, attrs, controller) { // The link function gets called for every instance of this directive.
            var markup = "<input type='text' ng-model='sampleData2' /> {{sampleData2}}<br/>";
            angular.element(element).html($compile(markup)(scope));
        }
    };
}]);

// Same as mySample2, but using template syntax.
// <my-sample3 />
angular.module('app').directive('mySample3', ['$compile', function ($compile) {
    return {
        restrict: 'E',
        template: "<input type='text' ng-model='sampleData3' /> {{sampleData3}}<br/>"
    };
}]);

// Same as mySample3, but using 'C' for class instead.
// <span class="my-sample4"></span>
angular.module('app').directive('mySample4', ['$compile', function ($compile) {
    return {
        restrict: 'C',  // <-- indicates it has to be an class
        template: "<input type='text' ng-model='sampleData4' /> {{sampleData4}}<br/>"
    };
}]);

// using templateUrl and isolate scope
// <span my-sample5 samp5-attr="samp5ScopeVar1"></span>
angular.module('app').directive('mySample5', ['$compile', function ($compile) {
    return {
        restrict: 'A',
        templateUrl: "sample5.html",
        scope: {
            samp5ScopeVar: "=samp5Attr", // if samp5ScopeVar matches samp5Attr, then you just need "="
            now: "&samp5FuncAttr", // If samp5FuncAttr was called now, we could just say "&"
            samp5AttrA: "@", // @ = string
            samp5AttrB: "@", // @ = string
        } // isolate scope, not inherited.
    };
}]);


// Input field and text to show it
// <span my-sample></span>
angular.module('app').directive('dateKeys', ['$compile', function ($compile) {
    return {
        restrict: 'A', // <-- default, doesn't need to be specified.
        link: function (scope, element, attrs, controller) {  // The link function gets called for every instance of this directive.
            element.on('keydown', function(event) {
                if ((event.keyCode >= 48 && event.keyCode <= 57) || // numbers
                    (event.keyCode === 191) || // forward slash
                    (event.keyCode === 8) // backslash
                    ) {
                    return true;
                }
                return false;
            });
        }
    };
}]);


angular.module('app').directive('ball', ['googleFactory', function (googleFactory) {

    var setAttribute = function(attrs, newValue, element) {

        googleFactory.getSearchResults("+ball " + newValue, 'images').then(function (response) {
            var currentValue = element[0].attributes['type'].value;
            if (currentValue !== newValue) {
                setAttribute(attrs, currentValue, element);
            } else {
                var results = response.data.responseData.results;
                attrs.$set('src', results[0].unescapedUrl);
            }
        }).catch(function (error) {
            console.error(error);
        });
    };

    return {
        restrict: 'E',
        template: '<img height="250"/>',
        replace: true,
        link: function (scope, element, attrs) { // The link function gets called for every instance of this directive.
            attrs.$observe('type', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    setAttribute(attrs, newValue, element);
                }
            });
        },
    };
}]);


angular.module('app').factory('googleFactory', ['$http', function ($http) {

    // what = 'web', 'images', 'local', 'video', blogs', 'news', 'books', 'patent', etc.
    var getSearchResults = function (searchTerm, what) {

        if (httpPromise) {
            console.log("Rejected: " + searchTerm);
            return httpPromise;
        }

        console.log("Searching: " + searchTerm);

        var host = 'https://ajax.googleapis.com/ajax/services/search/' + what;
            
        var args = {
            'version': '1.0',
            'searchTerm': searchTerm,
            'results': '1',
            'callback': 'JSON_CALLBACK'
        };
        var params = ('?v=' + args.version + '&q=' + args.searchTerm + '&rsz=' +
            args.results + '&callback=' + args.callback);

        httpPromise = $http.jsonp(host + params);

        return httpPromise.then(function (response) {
            return response;
        }).catch(function(error) {
            console.error(error);
        }).finally(function() {
            httpPromise = null;
        });
    };

    var httpPromise = null;

    return {
        getSearchResults: getSearchResults
    };
}]);

// Controller's built-in to the directive.
angular.module('app').directive('greeting1', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: "<button class='btn' ng-click='sayHello1()'>Say Hello1</button>",
        controller: function($scope) {
            $scope.sayHello1 = function() {
                alert('Hello1');
            }
        }
    };
}]);

// Controller's specified externally.
angular.module('app').directive('greeting2', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: "<button class='btn' ng-click='sayHello2()'>Say Hello2</button>",
        controller: 'greetingController2'
    };
}]);

angular.module('app').controller('greetingController2', ['$scope', function ($scope) {
    $scope.sayHello2 = function() {
        alert('Hello2');
    };
}]);

// Controller's specified explictly via attribute.
angular.module('app').directive('greeting3', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: "<button class='btn' ng-click='sayHello3()'>Say Hello3</button>",
        controller: '@', // This means the controller is specified via HTML
                         // in the attribute whose name is indicated in the name property of this object
        name: 'greetingController' // The attribute name that contains the name of the controller.
    };
}]);

angular.module('app').controller('greetingController3', ['$scope', function ($scope) {
    $scope.sayHello3 = function () {
        alert('Hello3');
    };
}]);


// Controller's built-in to the directive.
angular.module('app').directive('greeting', [function () {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: "<div><button class='btn' ng-click='sayHello()'>Say Hello</button><div ng-transclude></div></div>",
        controller: function ($scope) {
            var greetings = ['hello'];
            $scope.sayHello = function () {
                alert(greetings.join());
            }
             
            // Let's add on this controller a way to add different greetings.
            this.addGreeting = function (greeting) {
                greetings.push(greeting);
            }
        }
    };
}]);


angular.module('app').directive('finnish', [function () {
    return {
        restrict: 'A',

        // The ^ tells Angular to support this direcitve being nested in the specified directive.
        require: '^greeting', // << require a name of a directive that has a controller in it.
                            // "In order to use this 'finnish' directive, i'm going require that there
                            // be another directive called 'greeting' and that 'greeting' controller needs
                            // to have a controller on it, which will become the shared controller for
                            // these directives.   Also, needs to be on the same element.
        // The link function gets called for every instance of this directive.
        link: function (scope, element, attrs, controller) { // The link function gets called for every instance of this directive.
            controller.addGreeting('hei');
        }
      };
}]);

angular.module('app').directive('hindi', [function () {
    return {
        restrict: 'A',
        // The ^ tells Angular to support this direcitve being nested in the specified directive.
        require: '^greeting', // << require a name of a directive that has a controller in it.
        link: function (scope, element, attrs, controller) { // The link function gets called for every instance of this directive.
            controller.addGreeting('नमस्ते');
        }
    };
}]);

// Use transclusion, without it, the replace=true will replace all child elements, too.
// by transclude=true will replace the element with the ng-transclude attribute with the child elements.
angular.module('app').directive('collapsible', [function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div><h4 class="well-title" ng-click="toggleVisibility()" ng-bind="title"></h4><div ng-show="visible" ng-transclude></div></div>',
        controller: function($scope) {
            $scope.visible = true;
            $scope.toggleVisibility = function() {
                $scope.visible = !$scope.visible;
            }
        },
        transclude: true,
        scope: {
            title: "@"
        }
    };
}]);

//// Directive to repeat an element x number of times
//angular.module('app').directive('repeatX', ['$compile', function ($compile) {
//    return {
//        link: function (scope, element, attrs, controller) { // The link function gets called for every instance of this directive.
//            for (var i = 0; i < Number(attrs.repeatX) - 1; i++) {
//                // When we clone the element, we need to modify the attribute because it has repeat-x attribute.
//                // We modify the attribute of the cloned element so that they repeat zero times.
//                // The $compile function is used to manipulate the dom prior to the link function executing
//                element.after($compile(element.clone().attr('repeat-x', 0))(scope));
//            }
//        }
//    };
//}]);


// Directive to repeat an element x number of times
angular.module('app').directive('repeatX', [function () {
    return {
        // The compile function is used to manipulate the dom prior to the link function executing
        // Note that unlike the link function, there's no scope or controller being passed in.
        // compile function runs once and affects all instances of the directive the same way.
        // The link function runs individually for each instance / usage of the directive in the HTML.
        compile: function(element, attrs) {
            for (var i = 0; i < Number(attrs.repeatX) - 1; i++) {
                // When we clone the element, we need to modify the attribute because it has repeat-x attribute.
                // We modify the attribute of the cloned element so that they repeat zero times.
                element.after(element.clone().attr('repeat-x', 0));
            }

            // Optionally return a link function, which will be executed for each element.
            return function (scope, element, attrs, controller) {
                attrs.$observe('text', function(newValue) {
                    if (newValue === 'Hello World') {
                        element.css('color', 'red');
                    }
                });
            };
        }
    };
}]);


angular.module('app').factory('factory1', ['$http', function ($http) {
    var service = {
        getData: getData
    };

    return service;

    function getData() {

    }
}]);
