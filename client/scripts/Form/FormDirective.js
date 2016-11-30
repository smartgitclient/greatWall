(function() {
  angular.module('app.ui.form.directives', []).directive('uiRangeSlider', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele) {
          return ele.slider();
        }
      };
    }
  ]).directive('uiFileUpload', [
    function() {
      return {
        restrict: 'A',
        link: function(scope, ele) {
          return ele.bootstrapFileInput();
        }
      };
    }
  ]).directive('uiSpinner', [
    function() {
      return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs,ngModel) {
          elem.addClass('ui-spinner');
          elem.spinner({changed: function( event, ui ) {
              ngModel.$setViewValue(ui);
              scope.$apply();
          }});
        }
      };
    }
  ]).directive('uiWizardForm', [
    function() {
      return {
        link: function(scope, ele) {
          return ele.steps();
        }
      };
    }
  ]).directive('bDatepicker', function () {
      return {
          restrict: 'A',
          require: "ngModel",
          link: function (scope, element, attr,ngModelCtrl) {
              element.datepicker({
                  dateFormat:'dd/MM/yyyy hh:mm:ss'
              }).on('changeDate', function(e) {;
                  ngModelCtrl.$setViewValue(e.date);
                  scope.$apply();
              });
              var component = element.siblings('[data-toggle="datepicker"]');
              if (component.length) {
                  component.on('click', function () {
                      element.trigger('focus');
                  });
              }
          }
      };
  });

}).call(this);
