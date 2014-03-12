# What do?
Gets contact from the cordova contact API and writes vcard of that contact via NFC to a tag

# How to run..
Ensure cordova et al is installed
```
git clone https://github.com/JohnMcLear/phonegap-nfc-vcard.git
cd phonegap-nfc-vcard/
git checkout find-and-write
cordova platform add android
cordova plugin add https://github.com/chariotsolutions/phonegap-nfc.git
cordova plugin add https://github.com/apache/cordova-plugin-contacts.git
cordova platform run android
```
