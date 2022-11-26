// Predefined Variables
var language = 'en';


// Functions

// Requesting locale file

// Intercept users' click event to trigger change language function.
function clickLanguage() {

    var button = document.getElementById('page-main-navbar-language');
  
    button.addEventListener("click", function (e) {
  
      if (button) {
  
        ( (language == 'en') ? (language = 'zh') : (language = 'en'));
        localeUpdate();
  
      }
  
      e.preventDefault();
  
    }, false);
  
}
  
// Parse .json data to translate.
function localeUpdate() {

    document.getElementById('html').classList.toggle("zh");

    for ( var i = 0; i < locale.length; i++ ) {
  
      switch (language) {

        case 'en':

            document.getElementById(locale[i].id).innerHTML = locale[i].en
            break;

        case 'zh':

            document.getElementById(locale[i].id).innerHTML = locale[i].zh
            break;

      }
  
    }

}

/*
  Reference source code & author:

    https://stackoverflow.com/questions/17267329/converting-unicode-character-to-string-format, by Bryan Rayner on StackOverflow


*/
function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, 
           function (match) {
                return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
           });
 }