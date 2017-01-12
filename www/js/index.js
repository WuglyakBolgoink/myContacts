(function() {
    'use strict';

    var CordovaInit = function() {
        var onDeviceReady = function() {
            receivedEvent('deviceready');
        };

        function receivedEvent(eventName) {
            angular.bootstrap($('body'), ['MyContacts'], {
                // Set strictDi=TRUE for prod!!!
                strictDi: true
            });
        }

        this.bindEvents = function() {
            document.addEventListener('deviceready', onDeviceReady, false);
        };

        // If cordova is present, wait for it to initialize, otherwise just try to
        // bootstrap the application.
        if (window.cordova !== undefined) {
            this.bindEvents();
        } else {
            receivedEvent('manual');
        }
    };

    $(function() {
        new CordovaInit();
    });
})();


