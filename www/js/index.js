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
        app.receivedEvent('deviceready');
        app.startNFC();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
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
          alert(html10n.get("writeRing.noNFC"));
          $('#createNew, #read, #scan').attr('disabled', 'disabled');
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
