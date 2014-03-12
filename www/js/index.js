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
        $('.autocomplete').on("keyup", function(){
            var searchTerm = $('.autocomplete').val();
            if(searchTerm.length < 3) return;
            console.log("Searching for ", searchTerm);
            app.searchContacts();
        });
        $('.contact').on("click", function(e){
            console.log("ID", e.target.id);
            var contactObj = contact.cache[e.target.id];
            contact.buildVCard(contactObj);
            alert("Need to set this guys stuff to write on VCARD");
        });
        console.log("keyup bound");

        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.startNFC();
    },
    // Start listening for NFC Events
    startNFC: function(){
        try{
            nfc.addNdefListener(function (nfcEvent) {
                app.nfcFound(nfcEvent, "ndef");
                console.log("Attempting to bind to NFC NDEF");
            }, function () {
                console.log("Success. Listening for NDEF records..");
            }, function () {
               alert("Nope");
            });
        }catch(e){
            alert("NFC Failed");
        }
    },
    // On NFC Event
    nfcFound: function(nfcEvent){
        var payload = 'BEGIN:VCARD\n' +
            'VERSION:2.1\n' +
            'N:Coleman;Don;;;\n' +
            'FN:Don Coleman\n' +
            'ORG:Chariot Solutions;\n' +
            'URL:http://chariotsolutions.com\n' +
            'TEL;WORK:215-358-1780\n' +
            'EMAIL;WORK:info@chariotsolutions.com\n' +
            'END:VCARD';
        var record = ndef.mimeMediaRecord('text/x-vCard', nfc.stringToBytes(payload));
        nfc.write([record], function () {
            console.log("Writing VCard", record);
            alert("Vcard written");
        });
    }
};

contact = {};
contact.cache = {}

contact.error = function(e){
     console.error(e);
}
contact.buildVCard = function(contact){
    // takes in contact card from cordova and builds vcard format
}

contact.found = function(contacts){
    console.log(contacts);
    var i = 0;
    $.each(contacts, function(k,person){
        if(i < 5){
            if(!person.displayName) return;
            if(!person.id) return;
            console.log(person.displayName);
            $('.results').append("<div class='contact' id='"+person.id+"'>"+person.displayName+"</div>");
            contact.cache[person.id] = person; 
            i++;
        }
    });
}

contact.search = function(){
    var options = new ContactFindOptions();
    options.filter = $('.autocomplete').val();
    options.multiple = true;
    var fields = ["displayName", "name", "emails", "phoneNumbers"];
    navigator.contacts.find(fields, contact.found, contact.error, options);
}

