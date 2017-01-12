(function() {
    'use strict';

    angular
        .module('MyContacts', [])
        .controller('DemoController', ['$scope', DemoController]);

    function DemoController($scope) {
        var vm = this;
        vm.contacts = {};

        console.log('navigator.contacts', navigator.contacts);

        if (navigator.contacts !== undefined) {
            var search_fields = ['*'];
            var options = new ContactFindOptions();
            options.filter = '';
            options.multiple = true;
            options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails];

            console.log('search_fields', search_fields);
            console.log('options', options);

            navigator
                .contacts
                .find(
                    search_fields,
                    successCBcontacts,
                    errorCBcontacts,
                    options
                );
        } else {
            vm.contacts = "Contacts not found"
        }

        function successCBcontacts(contacts) {
            var result = {
                email: [],
                phone: []
            };
            try {
                console.log('contacts:', contacts);

                contacts.forEach(function(contact) {
                    console.log('contact', contact);
                    // Email
                    if (contact.emails) {
                        contact.emails.forEach(function(email) {
                            var to = _build_names(contact);
                            var to_email = _prepare_email(email.value);

                            if (to && to_email) {
                                to.toEmail = to_email;
                                to.selected = false;
                                result.email.push(to);
                            }
                        });
                    }

                    // Phone
                    if (contact.phoneNumbers) {
                        contact.phoneNumbers.forEach(function(phone) {
                            var to = _build_names(contact);
                            var to_phone = _prepare_phone(phone.value);

                            if (to && to_phone) {
                                to.toPhone = to_phone;
                                to.selected = false;
                                result.phone.push(to);
                            }
                        });
                    }
                });
            } catch (e) {
                console.error('something wrong');
            }

            vm.contacts = {
                email: _.uniqBy(result.email, 'toEmail'),
                phone: _.uniqBy(result.phone, 'toPhone')
            };
            $scope.$apply();
        }

        function errorCBcontacts(_e) {
            console.error(_e);
            vm.contacts = null;
        }

        function _build_names(contact) {
            var firstname = contact.name.givenName;
            var lastname = contact.name.familyName;
            if (firstname && lastname) {
                return {
                    toName: firstname + ' ' + lastname,
                    sortName: lastname + ', ' + firstname
                };
            }
            if (!firstname && lastname) {
                return {
                    toName: lastname,
                    sortName: lastname
                };
            }
            if (firstname && !lastname) {
                return {
                    toName: firstname,
                    sortName: firstname
                };
            }
            return null;
        }

        function _prepare_email(email) {
            if (!email) {
                return null;
            }
            // Trim
            email = email.trim();
            // Validate
            // if (!_validate('ValidEmail', email)) {
            //     return null;
            // }
            return email;
        }

        function _prepare_phone(phone) {
            if (!phone) {
                return null;
            }
            // Remove non numeric characters
            phone = phone.replace(/[^0-9]/g, '');
            // Remove double leading zeroes
            phone = phone.replace(/^00/, '');
            // Remove singe leading zero by 49
            phone = phone.replace(/^0/, '49');
            // Validate
            // if (!_validate('ValidPhone', phone)) {
            //     return null;
            // }
            return phone;
        }
    }

})();

