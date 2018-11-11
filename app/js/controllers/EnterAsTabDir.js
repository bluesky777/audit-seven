angular.module("auditoriaApp")
// Usa JQuery
.directive('enterAsTab', function () {

    return function(scope,element,attrs){
        element.bind("keydown keypress",function(event){
            if(event.which===13){
                event.preventDefault();
                var fields=$(this).parents('form:eq(0),body').find('input, textarea, select, button');
                var index=fields.index(this);
                if(index> -1&&(index+1)<fields.length)
                    fields.eq(index+1).focus();
            }
        });
    };
})




.directive('focusMe', ['$timeout', '$parse', function($timeout, $parse){
	return {
		scope: { trigger: '=focusMe' },
		link: function(scope, element, attrs){
			scope.$watch('trigger', function(value){
				// console.log('trigger', value)
				if(value == true) 
					element[0].focus()
					scope.trigger = false
            })
        }
	}
}])

.directive('autofocus', ['$timeout', function($timeout) {
    return {
      restrict: 'A',
      link : function($scope, $element) {
        $timeout(function() {
          $element[0].focus();
        });
      }
    }
}]);