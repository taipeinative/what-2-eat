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

  var button = document.getElementById('page-navbar-language');

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
 * Intercept users' click event to trigger change light / dark theme function.
 * @param {'set'} [init] - Whether initialize the light / dark theme.
 */
function clickTheme(init) {

    var button = document.getElementById('page-navbar-mode');
    var html = document.getElementById("html");

    if (init == 'set') {

      const currentTime = new Date().getHours();

      if ((currentTime < 7) || (currentTime > 17)) {

        html.classList.toggle("night");

      } else {

        html.classList.toggle("day");

      }

    }
  
    button.addEventListener("click", function (e) {                         // Add an event listener to mode button; when button is clicked, do:
  
      html.classList.toggle("night");
      html.classList.toggle("day");
      e.preventDefault();                                                   // Prevent default behavior (because we don't want <a> element actually triggered)
  
    }, false);
  
}

/**
 * Intercept users' click event to trigger the quiz.
 */
function clickExplore() {

    var button = document.getElementById('page-start-explore');
    
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

  pageList = document.querySelectorAll('#page > :not(:first-child):not(:last-child)');
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
          if (i == 0) {document.getElementById('page-footer').classList.add('fin');} // Make current page shifts up

          await delay(600);

          document.getElementById(pageIdList[i]).classList.add('none');
          if (i == 0) {document.getElementById('page-footer').classList.add('none');} // Clear the space up
          document.getElementById(pageIdList[i+1]).classList.remove('none'); 

          await delay(50);

          document.getElementById(pageIdList[i+1]).classList.remove('hold');

        }

        currentIndex = currentIndex + count;

      } else if (count < 0) {

        for (i = currentIndex ; i > ( currentIndex + count ) ; i--) {

          document.getElementById(pageIdList[i]).classList.add('hold');
          await delay(600);
          document.getElementById(pageIdList[i]).classList.add('none');
          if (i == 1) {document.getElementById('page-footer').classList.remove('none');}
          document.getElementById(pageIdList[i-1]).classList.remove('none');
          await delay(50);
          if (i == 1) {document.getElementById('page-footer').classList.remove('fin');}
          document.getElementById(pageIdList[i-1]).classList.remove('fin');

        }

        currentIndex = currentIndex + count;

      } else if (count == 0) {

        return;

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