var rolApp = angular.module('rolApp', [
    'ngRoute',
    'mediaControllers',
    'uiAccordion'
]);
//  Force AngularJS to call our JSON Web Service with a 'GET' rather than an 'OPTION'
rolApp.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);

rolApp.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
                when('/list/:mainCategoryId', {
                    templateUrl: 'fragments/mediaList.html',
                    controller: 'MediaListController'
                }).
                when('/list', {
                    templateUrl: 'fragments/mediaList.html',
                    controller: 'MediaListController'
                }).
                when('/menu', {
                    templateUrl: 'fragments/mediaMenu.html',
                    controller: 'MenuController'
                }).
                otherwise({
                    redirectTo: '/menu'
                });
    }]);



'use strict';

(function () {
    function fetchFromObject(obj, prop) {
        if (typeof obj === 'undefined' || typeof prop === 'undefined') {
            return;
        }
        var _index = prop.indexOf('.');
        if (_index > -1) {
            return fetchFromObject(obj[prop.substring(0, _index)], prop.substr(_index + 1));
        }
        return obj[prop];
    }

    function getService(name) {
        return angular.injector(['ng']).invoke([name, function (service) {
                return service;
            }]);
    }

    function noopPromise() {
        var def = getService('$q').defer();
        def.resolve();
        return def.promise;
    }

    function AccordionGroup() {
    }

    function defaultAccordionGroupOptions() {
        return {
            open: false,
            disabled: false,
            beforeOpen: noopPromise,
            beforeHide: noopPromise,
            animateOpen: angular.noop,
            animateClose: angular.noop
        }
    }

    function Accordion() {
        this.groups = [];
        this.options = {
            closeOthers: true
        }
    }

    AccordionGroup.prototype.show = function (animationFn) {
        var _self = this;
        getService('$q').when(_self.options.beforeOpen()).then(function () {
            if (_self.options.animateOpen == angular.noop) {
                _self.body[animationFn]('slow');//slideDown
            } else {
                _self.options.animateOpen.call(_self);
            }
        }, function (error) {
            getService('$log').error(error);
        })
    };
    AccordionGroup.prototype.hide = function (animationFn) {
        var _self = this;
        getService('$q').when(_self.options.beforeHide()).then(function () {
            if (_self.options.animateClose == angular.noop) {
                _self.body[animationFn]();//slideUp
            } else {
                _self.options.animateClose.call(_self);
            }
        }, function (error) {
            getService('$log').error(error);
        })
    };

    Accordion.prototype.addGroup = function (group) {
        this.groups.push(group);
    };
    Accordion.prototype.getGroups = function (group) {
        return this.groups;
    };
    Accordion.prototype.applyState = function (group) {
        if (group) {

            var body = $(group.body), header = $(group.header);
            if (group.options.open) {
                header.find('a').addClass('is-collapsed');
                header.find('a').addClass('is-expanded');
                body.removeClass('is-collapsed');
                body.addClass('is-expanded');
                body.addClass('animateIn');
                group.show('slideDown');
                this.closeOthers(group);
            } else {
                header.find('a').removeClass('is-collapsed');
                header.find('a').removeClass('is-expanded');
                body.addClass('is-collapsed');
                body.removeClass('is-expanded');
                body.removeClass('animateIn');
                group.hide('slideUp');
            }
        }

    };

    Accordion.prototype.applyState2 = function (group) {
        if (group) {

            var body = $(group.body), header = $(group.header);
            if (group.options.open) {
                header.find('a').addClass('is-collapsed');
                header.find('a').addClass('is-expanded');
                body.removeClass('is-collapsed');
                body.addClass('is-expanded');
                body.addClass('animateIn');
                group.show('slideDown');
                this.closeOthers(group);
            } else {
                header.find('a').removeClass('is-collapsed');
                header.find('a').removeClass('is-expanded');
                body.addClass('is-collapsed');
                body.removeClass('is-expanded');
                body.removeClass('animateIn');
                group.hide('slideUp');

            }

        }

    };
    Accordion.prototype.closeOthers = function (group) {
        if (this.options.closeOthers) {
            angular.forEach(this.groups, function (otherGroup) {
                if (otherGroup !== group) {
                    var body = $(otherGroup.body), header = $(otherGroup.header);
                    header.find('a').removeClass('is-collapsed');
                    header.find('a').removeClass('is-expanded');
                    body.addClass('is-collapsed');
                    body.removeClass('is-expanded');
                    body.removeClass('animateIn');
                    otherGroup.options.open = false;
                    otherGroup.hide('slideUp');
                }
            });
        }
    };
    function getDefaultAccordion() {
        return new Accordion();
    }

    var _ngAccordion = function ($q, $log) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs, controller) {
                var options = fetchFromObject(scope, attrs.options);
                if (options) {
                    angular.extend(controller.accordion.options, options);
                }
                scope.$watchCollection(attrs.options, function (n, o) {
                    if (n && n !== o) {
                        angular.extend(controller.accordion.options, n);
                    }
                })
            },
            controller: function () {
                this.accordion = getDefaultAccordion();
            }
        };
    };
    var _ngAccordionGroup = function ($q, $timeout) {
        return {
            require: ['^ngAccordion', 'ngAccordionGroup'],
            restrict: 'EA',
            controller: function () {
                var headerDef, bodyDef;
                headerDef = $q.defer();
                bodyDef = $q.defer();
                this.setHeaderElement = function (element) {
                    headerDef.resolve(element);
                };
                this.getHeaderElement = function () {
                    return headerDef.promise;
                };
                this.setBodyElement = function (element) {
                    bodyDef.resolve(element);
                };
                this.getBodyElement = function () {
                    return bodyDef.promise;
                }
            },
            scope: {
                options: '=?'
            },
            link: function (scope, element, attrs, controllers) {
                var accordionCtrl, controller, accordion, accordionGroup, options;
                controller = controllers[1];
                accordionCtrl = controllers[0];
                accordion = accordionCtrl.accordion;
                accordionGroup = new AccordionGroup();
                if (!scope.options) {
                    scope.options = defaultAccordionGroupOptions();
                }
                accordionGroup.options = angular.extend(defaultAccordionGroupOptions(), scope.options);

//                scope.$watchCollection('options', function (n, o) {
//                    accordionGroup.options = angular.extend(defaultAccordionGroupOptions(), n);
//                    if (n && !n.disabled) {
//                        accordion.applyState(accordionGroup);
//                    }
//                }, true);

                $q.all([controller.getHeaderElement(), controller.getBodyElement()]).then(function (results) {
                    accordionGroup.header = results[0];
                    accordionGroup.body = results[1];
                    if (scope.options.open) {
                        accordionGroup.show('show');
                    } else {
                        accordionGroup.hide('hide');
                    }
                    accordionGroup.header.on('click', function () {
                        if (!scope.options.disabled) {
                            accordionGroup.options.open = !accordionGroup.options.open;
                            accordion.applyState2(accordionGroup);
                        }
                        $timeout(function () {
                            scope.$apply();
                        });
                    });
                    accordion.addGroup(accordionGroup);
                })

            }
        };
    };
    var _ngAccordionBody = function () {
        return {
            require: '^ngAccordionGroup',
            restrict: 'EA',
            link: function (scope, element, attrs, accordionCtrl) {
                accordionCtrl.setBodyElement(element);
            }
        };
    };
    var _ngAccordionHeading = function () {
        return {
            require: '^ngAccordionGroup',
            restrict: 'EA',
            link: function (scope, element, attrs, accordionCtrl) {
                accordionCtrl.setHeaderElement(element);
            }
        };
    };

    angular.module('uiAccordion', []);
    angular.module('uiAccordion').directive('ngAccordion', _ngAccordion);
    angular.module('uiAccordion').directive('ngAccordionGroup', _ngAccordionGroup);
    angular.module('uiAccordion').directive('ngAccordionBody', _ngAccordionBody);
    angular.module('uiAccordion').directive('ngAccordionHeading', _ngAccordionHeading);

})();
