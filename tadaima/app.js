'use strict'

const msg = require('./message.js');

const Gpio = require('onoff').Gpio;
var button = new Gpio(18, 'on','both');

button.watch(function(err, value){
  if(value == 1){
    console.log("Take a picture");
    const proc = require('child_process').execSync;
    var result = proc('raspistill -w 480 -h 320 -o image.jpg');
    console.log("Done");
    
    result = proc('dropbox_uploader.sh upload image.jpg image.jpg');

    msg();
  }
});
