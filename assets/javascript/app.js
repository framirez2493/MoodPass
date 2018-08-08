$(document).ready(function () {
    console.log("ready!");

    $("body").on("click","#uploadImg",function(event){
        event.preventDefault();
        $("#uploadImg").html("Processing Photo...");
        $("#uploadImg").attr("disabled","disabled");
        console.log("Did I make it in here?")
        processImage();
    })

});


function processImage() {
    //taken straight from their webPage 

    // Replace <Subscription Key> with your valid subscription key.
    var subscriptionKey = '164e073488bf42d2a0694495201728e1'

    // NOTE: You must use the same region in your REST call as you used to
    // obtain your subscription keys. For example, if you obtained your
    // subscription keys from westus, replace "westcentralus" in the URL
    // below with "westus".
    //
    // Free trial subscription keys are generated in the westcentralus region.
    // If you use a free trial subscription key, you shouldn't need to change
    // this region.
    var uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect'

    // Request parameters.
    var params = {
        returnFaceId: 'true',
        returnFaceLandmarks: 'false',
        /*
        returnFaceAttributes:
            'age,gender,headPose,smile,facialHair,glasses,emotion,' +
            'hair,makeup,occlusion,accessories,blur,exposure,noise'
        */
        returnFaceAttributes:
            'age,gender,smile,facialHair,glasses,emotion,hair,makeup,accessories',
    }

    var file = document.getElementById('fileToUpload').files[0];

    console.log("Just before the AJAX calll I hope?  ");

    // Perform the REST API call.
    $.ajax({
        url: uriBase + '?' + $.param(params),

        // Request headers.
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader('Content-Type', 'application/octet-stream')
            xhrObj.setRequestHeader('Ocp-Apim-Subscription-Key', subscriptionKey)
        },
        processData: false,
        type: 'POST',

        // Request body.
        data: file
    })

        .done(function (data) {
            // Show formatted JSON on webpage.
            $('#responseTextArea').val(JSON.stringify(data, null, 2));
            processResults(data);
        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString =
                errorThrown === ''
                    ? 'Error. '
                    : errorThrown + ' (' + jqXHR.status + '): '
            errorString +=
                jqXHR.responseText === ''
                    ? ''
                    : jQuery.parseJSON(jqXHR.responseText).message
                        ? jQuery.parseJSON(jqXHR.responseText).message
                        : jQuery.parseJSON(jqXHR.responseText).error.message
            alert(errorString)
        })
}


function processResults(dataObj) {
    console.log("Am i in processing DAta?");
    let data = dataObj[0]['faceAttributes'];
    console.log(data);
    
    // convert to clean object 
    var data2 = JSON.parse(JSON.stringify(dataObj, null, 2));

    // let's check to make sure there is only one face
    console.log(data2.length);

    if (data2.length > 1) {
        $("#imgResultsMsg").html("There are "+data2.length+" faces detected.   Need your help.  Can you upload a photo with just one image?");
    } else if (data2.length < 1) {
        $("#imgResultsMsg").html("Help!  Can't find any images.. ");
    }


    // replace data directly
    $("#imgSmile").html(data["smile"]);
    $("#imgGender").html(data["gender"]);
    $("#imgAge").html(data["age"]);
    $("#imgGlasses").html(data["glasses"]);

    // now handle the nested data
    // process facial hair
    let facialHairResults = [];
    let facialHairResultsString = "";

    // if odds are > 0.5, then facial hair is likely
    for (property in data["facialHair"]) {
        if (data['facialHair'][property] > 0.5) {
            facialHairResults.push(property);
            // push into string for display
            facialHairResultsString = facialHairResultsString + property + " ";
        }
    }
    console.log("facial hair results: ", facialHairResults);
    $("#imgFacialHair").html(facialHairResultsString);


    $("#imgEmotion1").html(data["emotion"]);
    $("#imgEmotion2").html(data["emotion"]);
    $("#imgMakeUp").html(data["makeup"]);
    $("#imgAccessories").html(data["accessories"]);
    $("#imgHair").html(data["hair"]);
   
    
}


/*  raw data example fro brian.jpg

[
  {
    "faceId": "63145c76-1273-45b9-af10-865e8d540290",
    "faceRectangle": {
      "top": 635,
      "left": 236,
      "width": 1151,
      "height": 1151
    },
    "faceAttributes": {
      "smile": 0.524,
      "gender": "male",
      "age": 65,
      "facialHair": {
        "moustache": 0.6,
        "beard": 0.6,
        "sideburns": 0.1
      },
      "glasses": "ReadingGlasses",
      "emotion": {
        "anger": 0,
        "contempt": 0.001,
        "disgust": 0,
        "fear": 0,
        "happiness": 0.524,
        "neutral": 0.475,
        "sadness": 0,
        "surprise": 0
      },
      "makeup": {
        "eyeMakeup": false,
        "lipMakeup": false
      },
      "accessories": [
        {
          "type": "glasses",
          "confidence": 0.94
        }
      ],
      "hair": {
        "bald": 0.08,
        "invisible": false,
        "hairColor": [
          {
            "color": "gray",
            "confidence": 0.98
          },
          {
            "color": "blond",
            "confidence": 0.72
          },
          {
            "color": "brown",
            "confidence": 0.46
          },
          {
            "color": "black",
            "confidence": 0.38
          },
          {
            "color": "other",
            "confidence": 0.32
          },
          {
            "color": "red",
            "confidence": 0.03
          }
        ]
      }
    }
  }
]

*/
//genre list
/*{
  "genres": [
    {
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }
]
}
*/