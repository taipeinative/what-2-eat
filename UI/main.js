// Predefined Variables
var pageList = [];
var pageIdList = [];
var currentIndex = 0;

// Event Listeners

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
 * Intercept users' click event to trigger change light / dark mode function.
 */
function clickMode() {

    var button = document.getElementById('page-main-navbar-mode');
    var html = document.getElementById("html");
    button.setAttribute('onclick','document.getElementById("html").classList.toggle("day");');
  
    button.addEventListener("click", function (e) {                         // Add an event listener to mode button; when button is clicked, do:
  
        if (html.classList.contains("day")) {                               // Toggle classes: if day, change into night;

            html.classList.remove("night");
            html.classList.add("day");

        } else {                                                            // ...if night, change into day.

            html.classList.remove("day");
            html.classList.add("night");

        }
  
      e.preventDefault();                                                   // Prevent default behavior (because we don't want <a> element actually triggered)
  
    }, false);
  
}

/**
 * Intercept users' click event to trigger the quiz.
 */
function clickExplore() {

    var button = document.getElementById('page-main-start-explore');
    
      button.addEventListener("click", function (e) {                       // Add an event listener to explore button; when button is clicked, do:
    
        move();                                                             // Move to next page.
        e.preventDefault();                                                 // Prevent default behavior
    
      }, false);
  
}


// Functions

/**
 * Collect all page nodes except for navagation bar and footer.
 */
function setPageNodes () {

  pageList = document.querySelectorAll('#page-main > :not(:first-child):not(:last-child)');
  pageList.forEach(function(item){pageIdList.push(item.id)});

}

/**
 * Move to the page according to the parameters. 
 * @param {Number} [steps = 1] - Steps move from current step or the given step if mode = 'absolute'; default to be 1.
 * @param {'absolute'|'relative'} [mode = 'relative'] - Whether use absolute mode; default to be 'relative'.
 */
async function move(steps = 1, mode = 'relative') {

  if ((mode == 'relative' || mode == 'absolute') && (Number.isInteger(steps))) {

    var count = (mode == 'relative') ? (steps) : (steps - currentIndex);

    if ( currentIndex + count >= 0 && currentIndex + count + 1 <= pageIdList.length ) {

      if (count > 0) {

        for (i = currentIndex ; i < ( currentIndex + count ) ; i++) {

          document.getElementById(pageIdList[i]).classList.add('fin');
          if (i == 0) {document.getElementById('page-main-footer').classList.add('transparent');}
          await delay(1200);
          document.getElementById(pageIdList[i]).classList.add('none');
          document.getElementById(pageIdList[i+1]).classList.remove('hold');

        }

        currentIndex = currentIndex + count;

      } else if (count < 0) {

        for (i = currentIndex ; i > ( currentIndex + count ) ; i--) {

          document.getElementById(pageIdList[i]).classList.add('hold');
          if (i == 1) {document.getElementById('page-main-footer').classList.remove('transparent');}
          document.getElementById(pageIdList[i-1]).classList.remove('none');
          await delay(1200);
          document.getElementById(pageIdList[i-1]).classList.remove('fin');

        }

        currentIndex = currentIndex + count;

      } else {

        throw (new Error(`Syntax Error: steps must not be 0 or self`));

      }

    } else {

      throw (new Error(`Index Error: the page requested not exist`));

    }


  } else if ((mode != 'relative' && mode != 'absolute')) {

    throw (new Error(`Syntax Error: mode must be either 'relative' or 'absolute'`));

  } else if (Number.isInteger(steps) == false) {

    throw (new Error(`Index Error: steps must be an integer`));

  }

}

/*
  Reference source code & author:

    https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line, by @Etienne Martin on StackOverflow

*/
/**
 * Set delays through a promise. You should use it with `await` keyword and under `async` function.
 * @param {*} ms - Delay how many miliseconds.
 * @example
 * // Wait for 3 seconds
 * async function wait() {
 *   await delay(3000);
 * }
 */
const delay = ms => new Promise(res => setTimeout(res, ms));