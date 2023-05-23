function tip(options){
    var className = "fadetip";

    var text = options.text || "";
    var time = options.time || 1500;

    var cpTxt = '<div class=' + className + '>' + text + '</div>';
    $('body').append(cpTxt);
    $('.fadetip').fadeOut(time, function () {
        $(this).remove();
    });
}