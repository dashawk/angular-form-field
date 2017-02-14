(function () {
	'use strict';
	
	angular
		.module('ngFormField', [])
		.directive('formField', formField);
	
	function formField() {
		return {
			require: 'ngModel',
			restrict: 'E',
			replace: true,
			scope: {
				type: '@',
				label: '@',
				cols: '@',
				name: '@',
				required: '=?',
				rows: '@',
				items: '=?',
				value: '=?ngModel'
			},
			template: [
				'<div class="form-group">',
				'<label class="control-label {{ labelClass }}">{{ label | translate }}</label>',
				'<div class="form-directive" ng-class="controlClass">',
				'<input type="text" class="form-control" ng-model="value" />',
				'</div>',
				'</div>'
			].join(''),
			link: function (scope, element, attrs, ngModel) {
				scope.subtype = 'text';
				if (attrs.subType) {
					scope.subtype = attrs.subType;
				}
				var templates = {
					input: '<input name="name" type="{{ subtype }}" class="form-control" ng-model="value" ng-required="required" />',
					select: '<select name="name" class="form-control" ng-model="value" ng-required="required" ng-options="i.id as i.label for i in items"></select>',
					textArea: '<textarea name="name" cols="{{ cols }}" rows="{{ rows }}" ng-required="required" class="form-control" ng-model="value"></textarea>'
				};
				if(attrs.labelClass) {
					scope.labelClass = attrs.labelClass;
				}
				if(attrs.controlClass) {
					scope.controlClass = attrs.controlClass;
				}
				
				var template = $compile(templates[scope.type]);
				var content = template(scope);
				
				ngModel.$parsers.push(checkValidity);
				ngModel.$formatters.push(checkValidity);
				
				function checkValidity(value) {
					scope.value = value;
					var valid = !!(!isEmpty(scope.value) && scope.required);
					ngModel.$setValidity('required', valid);
					ngModel.$render();
				}
				element.find('form-directive').append(content);
			}
		};
		
		function isEmpty(data) {
			if (data === '-') {
				return true;
			}
			for (var i in data) {
				if (data.hasOwnProperty(i)) {
					return false;
				}
			}
			var res = data >= 1;
			return !res;
		}
	}
}());
