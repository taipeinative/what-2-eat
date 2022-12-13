// Predefined Variables
var pageList = [];
var pageIdList = [];
var currentIndex = 0;
var eelState = true;

// Event Listeners

/**
 * Polyfill the \<select\> element behaviour using vanilla JavaScript, and include generateOptions() function to create options.
 */
function clickForm() {

  generateOptions(10);

  const selectList = document.querySelectorAll('.select .menu');                    // Find all <input> elements with .menu class, which are going to become <select>
  const selectOptionList = document.querySelectorAll('.list .list-option');         // Find all <li> elements with .list class, which are going to become <option>

  selectList.forEach(item => {                                                      // Add focusin and focusout event listeners to all <input> elements.

    item.addEventListener('focusin', e => {

      document.querySelectorAll(`#${CSS.escape(item.id)} ~ ul`)[0].classList.remove('none');  // When clicked, show the menu (a <ul> will be the container of <li>)
      e.preventDefault();

    });

    item.addEventListener('focusout', async e => {

      await delay(150);                                                                       // Delay for 150 milliseconds (To let user 'click' the options)
      document.querySelectorAll(`#${CSS.escape(item.id)} ~ ul`)[0].classList.add('none');     // When unfocused/already clicked an option, close the menu
      e.preventDefault();

    });

  });

  selectOptionList.forEach(item => {

    item.addEventListener('click', e => {                                           // Add click event listeners to all <li> elements.

      var menu = document.querySelectorAll(`.select:has(#${CSS.escape(item.id)}) .menu`)[0];
      menu.value = ` ${item.innerHTML}`;                                            // Replace parent <input> element's value attribute to chosen option's text
      menu.setAttribute('title', menu.value);
      e.preventDefault();

    })

  })

}


/**
 * Intercept users' click event to trigger localeUpdate function; if the parameter is `'Fail'`, hide the language button.
 * @param {boolean} [fail] - Whether enable translation function; default to be enable.
 */
 function clickLanguage(fail) {

  var button = document.getElementById('page-navbar-language');

  switch (fail) {

    case 'Fail':                                                    // Case when requesting locale failed:

      button.classList.add('none');                                 // Add 'none' class to language button (make it hidden)
      eelState = false;
      break;

    default:                                                        // Case when requesting locale success:

      button.addEventListener('click', e => {                       // Add an event listener to language button
  
        if (button) {                                               // When button is clicked, do:
      
          ( (language == 'en') ? (language = 'zh') : (language = 'en'));  // Toggle language between Chinese and English
          localeUpdate();                                           // Update the page
      
        }
      
        e.preventDefault();                                         // Prevent default behavior (because we don't want <a> element actually triggered)
      
      });

      break;

  }
  
}

/**
 * Intercept users' click event to control steps.
 */
function clickStep() {

  const backList = document.querySelectorAll('.back');                      // Find all elements with .back class
  const homeList = document.querySelectorAll('.home');                      // Find all elements with .home class
  const nextList = document.querySelectorAll('.next');                      // Find all elements with .next class

  backList.forEach(button => {                                              // Add click event listners to items of backList

    button.addEventListener('click', e => {

      move(-1);                                                             // If an element with .back class is clicked, go to previous step
      e.preventDefault();                                                   // Always stop element's original behaviour

    });

  });

  homeList.forEach(button => {                                              // Add click event listners to items of homeList

    button.addEventListener('click', e => {

      move(0, 'absolute');                                                  // If an element with .home class is clicked, go to first step
      e.preventDefault();

    });

  });

  nextList.forEach(button => {                                              // Add click event listners to items of nextList

    button.addEventListener('click', e => {

      move();                                                               // If an element with .next class is clicked, go to next step
      e.preventDefault();

    });

  });
  
}

/**
 * Intercept users' click event to trigger change light / dark theme function.
 * @param {'set'} [init] - Whether initialize the light / dark theme.
 */
function clickTheme(init) {

  var button = document.getElementById('page-navbar-theme');
  var html = document.getElementById("html");

  if (init == 'set') {

    const currentTime = new Date().getHours();

    if ((currentTime < 7) || (currentTime > 17)) {

      html.classList.toggle('night');

    } else {

      html.classList.toggle('day');

    }

  }

  button.addEventListener('click', e => {                         // Add an event listener to mode button; when button is clicked, do:

    html.classList.toggle('night');
    html.classList.toggle('day');
    e.preventDefault();                                                   // Prevent default behaviour (because we don't want <a> element actually triggered)

  });

}


// Functions

/*
  Reference source code & author:

    https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line, by @Etienne Martin on StackOverflow

*/
/**
 * Set delays through a promise. You should use it with `await` keyword and under `async` function.
 * @param {Number} ms - Delay how many miliseconds.
 * @example
 * // Wait for 3 seconds
 * async function wait() {
 *   await delay(3000);
 * }
 */
const delay = ms => new Promise(res => setTimeout(res, ms));


/**
 * Generate dropdown menu options through sheet data or on default generate meaningless placeholders. 
 * @param {Number} [quantity = 5] - The quantity of auto generated options; default to be 5.
 * @param {Boolean} [useDefault = true] - Whether default to show option or not; when set to false, there won't be default options.
 */
function generateOptions(quantity = 5, useDefault = true) {

  switch (eelState) {

    case false:

      const insertList = document.querySelectorAll('.select');
      insertList.forEach((item,order) => {

        var autoMenu = document.createElement('ul');
        autoMenu.setAttribute('id',`page-q${order+1}-option-list`);
        autoMenu.setAttribute('class','list none');

        for (i = 0; i < quantity; i++) {

          var autoOption = document.createElement('li');
          autoOption.setAttribute('id',`page-q${order+1}-option-${i+1}`);
          autoOption.setAttribute('class','list-option');
          autoOption.setAttribute('title',`Option ${i+1}`);
          autoOption.textContent = `Option ${i+1}`;
          autoMenu.appendChild(autoOption);

        }

        var icon = document.createElement('span');
        item.append(icon, autoMenu);
        var menu = item.querySelectorAll(':scope .menu')[0];
        (useDefault) ? menu.setAttribute('value',` Option 1`) : null;
        menu.setAttribute('title', menu.value);

      });
      break;

  }

}


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