
function initialize() {
    $('#save_picture').hide();
    $('#cancel').hide();
    $('#take_picture').show();
    $('#logo').show();
    $('#slogan').show();
    $('body').css('background-image', "url('img/background.jpg')");
}
  
function captureImage() {
    navigator.device.capture.captureImage(
        function(files){
            $('body').css('background-image', "url('" + files[0].fullPath + "')");
            $('#save_picture').show();
            $('#cancel').show();
            $('#take_picture').hide();
            $('#logo').hide();
            $('#slogan').hide();
            $('#debug').append("Image : " + files[0].fullPath + "<br />");
        },
        function(){
            console.log('Error');
        }, {limit: 1});
}

function affichePosition(pos) {
    $('#debug').append('AFFICHE POS : ' + pos.coords.latitude + ' / ' + pos.coords.longitude + '<br />');
    console.log('AFFICHE POS<br />');
    var options = new FileUploadOptions();
    var ft = new FileTransfer();
    var params = new Object();
    var server = "http://opengram.appspot.com/receive";
    var name = $('#picture').attr('src');
    var win = function(r) {
        alert("Success");
	    console.log("Code = " + r.responseCode);
	    console.log("Response = " + r.response);
	    console.log("Sent = " + r.bytesSent);
    }
    var fail = function(error) {
	    alert("Error");
	    switch (error.code) {
    	case FileTransferError.FILE_NOT_FOUND_ERR:
            alert("Photo file not found");
        break;
	    case FileTransferError.INVALID_URL_ERR:
	        alert("Bad Photo URL");
	    break;
	    case FileTransferError.CONNECTION_ERR:
	        alert("Connection error");
	    break;
	    }
	    console.log("upload error source " + error.source);
	    console.log("upload error target " + error.target);
    }
    options.fileKey = "file";
    options.fileName = name.substr(name.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    options.chunkedMode = false;
    params.location = pos.coords.latitude + "," + pos.coords.longitude;
    params.datetime = pos.timestamp;
    params.phone_id = device.uuid;
    params.comment = '';
    options.params = params;
    $('#debug').html('filekey = ' + options.fileKey + '<br />' + 
	'filename = ' + options.fileName + '<br />' + 
	'mimeType = ' + options.mimeType + '<br />' +
	'location = ' + params.location + '<br />' +
	'datetime = ' + params.datetime + '<br />' +
	'phone_id = ' + params.phone_id + '<br />' +
	'comment = ' + params.comment + '<br />');	
    ft.upload(name, server, win, fail, options);
}

function errorPosition(error) {
    $('#debug').append('ERROR POS<br />');
    console.log('ERROR POS<br />');
}

function save_picture() {
    console.log('Image : ' + $('#picture').attr('src'));
    if (navigator.geolocation) {
        $('#debug').append('YESSS<br />');
        navigator.geolocation.getCurrentPosition(affichePosition, errorPosition);
    }
    else
        $('#debug').append('NOOOO<br />');
}
