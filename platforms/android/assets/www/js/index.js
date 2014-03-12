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
        $('body').on("click", ".contact", function(e){
            console.log("ID", e.target.id);
            var contactObj = contact.cache[e.target.id];
            var vcard = contact.buildVCard(contactObj);
            if(vcard){
              contact.vcard = vcard;
              alert("ready to write Vcard");
            }else{
              alert("Failed to create VCard");
            }
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
        if(!contact.vcard) alert("no vcard to write yet");
        var record = ndef.mimeMediaRecord('text/x-vCard', nfc.stringToBytes(contact.vcard));
        nfc.write([record], function () {
            console.log("Writing VCard", record);
            alert("Vcard written");
        });
    }
};

contact = {};
contact.cache = {}
contact.vcard = "";

contact.error = function(e){
    console.error(e);
}

/* Droped example data for now
    'ORG:Chariot Solutions;\n' +
    'URL:http://chariotsolutions.com\n' +
    'TEL;WORK:215-358-1780\n' +
*/
// takes in contact card from cordova and builds vcard format
contact.buildVCard = function(contact){
    console.log("Contact", contact);
    var vcard = 'BEGIN:VCARD\n' +
        'VERSION:2.1\n' +
        'N:'+contact.name.familyName+';'+contact.name.givenName+';;;\n' +
        'FN:'+contact.name.formatted+'\n' +
        'EMAIL;WORK:'+contact.emails[0].value+'\n' +
        'TEL;'+contact.phoneNumbers[0].value+'\n' +
        'END:VCARD';
    console.log("vcard", vcard);
    return vcard;
}

contact.found = function(contacts){
    console.log(contacts);
    var i = 0;
    $.each(contacts, function(k,person){
        if(person.displayName && person.id){
            if(i < 5){
                $('.results').html("");
                $('.results').append("<div class='contact' id='"+person.id+"'>"+person.displayName+"</div>");
                contact.cache[person.id] = person; 
                i++;
            }
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

