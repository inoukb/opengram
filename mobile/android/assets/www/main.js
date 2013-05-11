
function initialize() {
    $('#picture').hide();
    $('#save_picture').hide();
    $('#cancel').hide();
    $('#take_picture').show();
}   
function captureImage() {
    navigator.device.capture.captureImage(
            function(files){
            $('#picture').attr('src', files[0].fullPath);
            $('#picture').show();
            $('#save_picture').show();
            $('#cancel').show();
            $('#take_picture').hide();
            $('#debug').append("Image : " + files[0].fullPath + "<br />");
            },
            function(){
            console.log('Error');
            }, {limit: 1});
}
function affichePosition(pos) {
    $('#debug').append('AFFICHE POS : ' + pos.coords.latitude + ' / ' + pos.coords.longitude + '<br />');
    console.log('AFFICHE POS<br />');
}
function errorPosition(error) {
    $('#debug').append('ERROR POS<br />');
    console.log('ERROR POS<br />');
}
function save_picture() {
    console.log('Image : ' + $('#picture').attr('src'));
    if (navigator.geolocation) {
        $('#debug').append('YESSS<br />');
        navigator.geolocation.getCurrentPosition(affichePosition,errorPosition);
        //setTimeout(function() {
        //    navigator.geolocation.getCurrentPosition(affichePosition,errorPosition);
        //}, 1500);
    }
    else
        $('#debug').append('NOOOO<br />');
}
