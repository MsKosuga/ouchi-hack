module.exports = function(){
  var request = require('request');
  var fs = require('fs');

  function base64_encode(filename){
    var jpg = fs.readFileSync(filename);
    return Buffer(jpg).toString('base64');
  }

  var image = base64_encode('image.jpg');
  var option = {
    uri: 'https://vision.googleapis.com/v1/images:annotate?key=[APIKEY]',
    headers: {'Content-Type': 'application/json'},
    json:{
      "requests":[
        {
          "image":{"content": image},
          "features":[
            {"type": "FACE_DETECTION", "maxResults": 1}
          ]
        }
      ]
    }
  };

  request.post(option, function(error, response, body){
    console.log(response.statusCode);
//    console.log(JSON.stringify(body.responses));
    var res = body.responses[0]["faceAnnotations"][0]["joyLikelihood"];
    console.log(res);

    if(res == 'LIKELY' || res == 'VERY_LIKELY'){
      var msg = "楽しい";
    } else {
      var msg = "いつも通り";
    }
    var ifttt_opt = {
      uri: 'https://maker.ifttt.com/trigger/imhome/with/key/{secret key}',
      headers: {'Content-Type': 'application/json'},
      json:{
        "value1":msg
      }
    };
    request.post(ifttt_opt, function(error, response, body){
      console.log(response.statusCode);
    });
  });
};
