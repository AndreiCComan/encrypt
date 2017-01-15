// Wait for the document to be ready
$(document).ready(function () {

    //After page loaded all content, remove preloader
    $(window).load(function () {
        showContentPage();
    });

    //Check scoll position in order to change navbar background color
    if ($('.navbar').length > 0) {
        $(window).on("scroll load resize", function () {
            checkScroll();
        });
    }

    //Navbar background switch
    function checkScroll() {
        var startY = $('.navbar').height() * 0.01;
        if ($(window).scrollTop() > startY) {
            $('.navbar').addClass("scrolled");
        } else {
            $('.navbar').removeClass("scrolled");
        }
    }
    //Activate navbar toggle and tooltip
    activateToggle();
    activateTooltip();

    //Load encryption listeners
    load_SHA1_listeners();
    load_AES_listeners();
    load_copyClipboar_listener();

    $("#en-sha1-link").on("click", function () {
        $(".alert-wrap").hide();
        $(".link-active").attr("class", "link");
        $(this).attr("class", "link-active");
        $("#sha1-text").val("");
        $("#result-section").hide();
        $("#sha1-section").show();
        $("#aes-section").hide();
    });

    $("#en-aes-link").on("click", function () {
        $(".alert-wrap").hide();
        $(".link-active").attr("class", "link");
        $(this).attr("class", "link-active");
        $("#aes-text").val("");
        $("#aes-passphrase").val("");
        $("#result-section").hide();
        $("#aes-section").show();
        $("#sha1-section").hide();
        $("#aes-section").attr("data-mode", "encrypt");
        $("#aes-mode").text("en");
    });

    $("#de-aes-link").on("click", function () {
        $(".alert-wrap").hide();
        $(".link-active").attr("class", "link");
        $(this).attr("class", "link-active");
        $("#aes-text").val("");
        $("#aes-passphrase").val("");
        $("#result-section").hide();
        $("#aes-section").show();
        $("#sha1-section").hide();
        $("#aes-section").attr("data-mode", "decrypt");
        $("#aes-mode").text("de");
    });

    //Hide navbar on link clicked
    $('.navbar a').on('click', function (event) {
        $("#theNavbar").collapse("hide");
        $('button[data-target="#theNavbar"]').removeClass("active");
    });

});

//FUNCTIONS FOR THE SCRIPT
function showContentPage() {
    $(".preloader").fadeOut("slow");
}
//Toggle activation
function activateToggle() {
    $(".navbar-toggle").on("click", function () {
        $(this).toggleClass("active");
    });
}

//Tooltip activation
function activateTooltip() {
    $('[data-toggle="tooltip"]').tooltip();
}

function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
}

function load_copyClipboar_listener() {
    var resultValue = $(".result-value");
    $(".copy-clipboard").on("click", function () {
        copyToClipboard(resultValue);
    });
}

function load_SHA1_listeners() {
    var text = $("#sha1-text");
    var alertWrap = $(".alert-wrap");
    var message = $(".message");
    var resultSection = $("#result-section");
    text.on("keyup", function () {
        if (text.val() != "") {
            encryptSHA1(text.val());
        } else {
            resultSection.hide();
            message.text("The textfield seems to be empty");
            alertWrap.show();
        }
    });
}

function encryptSHA1(text) {
    text = encodeURIComponent(text);
    var alertWrap = $(".alert-wrap");
    var message = $(".message");
    var resultSection = $("#result-section");
    var resultValue = $(".result-value");
    var loadingSpinner = $("#loading-spinner-section");
    loadingSpinner.show()
    $.ajax({
        url: '/encryptSHA1?',
        type: "POST",
        data: "text=" + text,
        dataType: "text",
        success: function (data) {
            loadingSpinner.hide();
            alertWrap.hide();
            resultSection.show();
            resultValue.text(data);
        },
        error: function (data) {
            loadingSpinner.hide();
            alertWrap.show();
            message.text("Something went wrong, please reload the page");
        }
    });
}

function load_AES_listeners() {
    var text = $("#aes-text");
    var passphrase = $("#aes-passphrase");
    var alertWrap = $(".alert-wrap");
    var message = $(".message");
    var resultSection = $("#result-section");
    $("#aes-text, #aes-passphrase").on("keyup", function () {
        if (text.val() != "" && passphrase.val() != "") {
            encryptAES(text.val(), passphrase.val());
        } else {
            resultSection.hide();
            message.text("Please fullfill everything.");
            alertWrap.show();
        }
    });

}

function encryptAES(text, passphrase) {
    text = encodeURIComponent(text);
    passphrase = encodeURIComponent(passphrase);
    var alertWrap = $(".alert-wrap");
    var message = $(".message");
    var resultSection = $("#result-section");
    var resultValue = $(".result-value");
    var mode = $("#aes-section").attr("data-mode");
    var loadingSpinner = $("#loading-spinner-section");
    var askToURL = "";
    switch (mode) {
        case "encrypt":
            askToURL = "/encryptAES?";
            break;
        case "decrypt":
            askToURL = "/decryptAES?";
            break;
        default:
            askToURL = "";
    }
    loadingSpinner.show();
    $.ajax({
        url: askToURL,
        type: "POST",
        data: "text=" + text + "&passphrase=" + passphrase,
        dataType: "text",
        success: function (data) {
            loadingSpinner.hide();
            alertWrap.hide();
            resultSection.show();
            resultValue.text(data);
        },
        error: function (data) {
            loadingSpinner.hide();
            alertWrap.show();
            message.text("Something went wrong, please reload the page");
        }
    });

}