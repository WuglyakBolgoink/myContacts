/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);

        if (navigator.contacts !== undefined) {
                    var search_fields = ['*'];
                    var options = new ContactFindOptions();
                    options.filter = '';
                    options.multiple = true;
                    options.desiredFields = [navigator.contacts.fieldType.name, navigator.contacts.fieldType.phoneNumbers, navigator.contacts.fieldType.emails];

                    navigator.contacts.find(search_fields,
                        function(contacts) {
                            var result = {
                                email: [],
                                phone: []
                            };
                            angular.forEach(contacts, function(contact) {
                                // Email
                                angular.forEach(contact.emails, function(email) {
                                    var to = _build_names(contact);
                                    var to_email = _prepare_email(email.value);

                                    if (to && to_email) {
                                        to.toEmail = to_email;
                                        to.selected = false;
                                        result.email.push(to);
                                    }
                                });

                                // Phone
                                angular.forEach(contact.phoneNumbers, function(phone) {
                                    var to = _build_names(contact);
                                    var to_phone = _prepare_phone(phone.value);

                                    if (to && to_phone) {
                                        to.toPhone = to_phone;
                                        to.selected = false;
                                        result.phone.push(to);
                                    }
                                });
                            });

                            console.warn(result);
                        },
                        function(error) {
                            console.error(error);
                        },
                        options);
                }
    }
};

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

app.initialize();