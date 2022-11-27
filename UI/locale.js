// Predefined Variables
var language = 'en';


// Functions

/**
 * Intercept users' click event to trigger localeUpdate function; if the parameter is `'Fail'`, hide the language button.
 * @param {boolean} [fail] - Whether enable translation function; default to be enable.
 */
function clickLanguage(fail) {

  var button = document.getElementById('page-main-navbar-language');

  switch (fail) {

    case 'Fail':                                                    // Case when requesting locale failed:

      button.classList.add('none');                                 // Add 'none' class to language button (make it hidden)
      break;

    default:                                                        // Case when requesting locale success:

      button.addEventListener("click", function (e) {               // Add an event listener to language button
  
        if (button) {                                               // When button is clicked, do:
      
          ( (language == 'en') ? (language = 'zh') : (language = 'en'));  // Toggle language between Chinese and English
          localeUpdate();                                           // Update the page
      
        }
      
        e.preventDefault();                                         // Prevent default behavior (because we don't want <a> element actually triggered)
      
      }, false);

      break;

  }
  
}
  
/**
 * Parse JSON data and translate the page.
 */
function localeUpdate() {

    document.getElementById('html').classList.toggle("zh");

    /*
      
      What does this do?

      First, let's look at first and second row of `locale.json`:

      {
        "id": "title",
        "attr": "innerHTML",
        "en": "What 2 Eat",
        "zh": "呷蝦米"
      },
      {
        "id": "meta-author",
        "attr": "innerHTML",
        "en": "@taipeinative on GitHub",
        "zh": "GitHub用戶 @taipeinative"
      },
      ......

      So we will go through every line and ensure every line of translation are applied.
      The code below use the technique to assign variable property names to the object.
      For instance, we have:

        var obj = {};
        var propety = 'name';
        
      In order to assign 'John' to obj's "name" property, you might want to do this:

        obj.property = 'John';
        // It literally sets 'John' to obj's "property" property.

      To fix that, we use this:

        obj[property] = 'John';
        // Sets 'John' to obj's "name" property.

      So go back into the code below, we have:

        document.getElementById(locale[i].id)[locale[i].attr] = locale[i][language];
      
      When `i` equals 0, `language` equals 'en', it is equivalent to:

        document.getElementById('title').innerHTML = 'What 2 Eat';

      When `i` equals 1, `language` equals 'zh', it is equivalent to:

        document.getElementById('meta-author').innerHTML = 'GitHub用戶 @taipeinative';
      
    */
    for ( var i = 0; i < locale.length; i++ ) {
  
      document.getElementById(locale[i].id)[locale[i].attr] = locale[i][language];
  
    }

}