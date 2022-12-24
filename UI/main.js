// Predefined Variables
var pageList = [];
var pageIdList = [];
var currentIndex = 0;
var eelState = true;
var dayTheme = true;
var resultJSON;
var open_state = true;
var rawJSON;

// Event Listeners

/**
 * Polyfill the form related elements' (including \<select\>, sliders) behaviour using vanilla JavaScript, and include generateOptions() function to create dropdown options.
 */
async function clickForm() {

  // For .dropdown class

  await generateOptions();                                                            // Generate options for dropdowns

  const dropList = document.querySelectorAll('.dropdown');                        // Find all <input> elements with .dropdown class, which are going to become <select>
  const dropOptionList = document.querySelectorAll('.list .list-option');         // Find all <li> elements with .list class, which are going to become <option>

  dropList.forEach(item => {                                                      // Add focusin and focusout event listeners to all <input> elements.

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

  dropOptionList.forEach(item => {

    item.addEventListener('click', e => {                                           // Add click event listeners to all <li> elements.

      var dropdown = document.querySelectorAll(`.input:has(#${CSS.escape(item.id)}) .dropdown`)[0];
      dropdown.value = ` ${item.innerHTML}`;                                            // Replace parent <input> element's value attribute to chosen option's text
      dropdown.setAttribute('title', dropdown.value);
      e.preventDefault();

    })

  })

  // For .slider class

  const sliderList = document.querySelectorAll('.slider');

  sliderList.forEach(item => {

    if (item.classList.contains('price')) {

      item.setAttribute('min','50');
      item.setAttribute('max','305');
      item.setAttribute('step','5');
      item.setAttribute('value','150');
      var preview = document.querySelectorAll(`div:has(#${CSS.escape(item.id)}) .preview`)[0];
      preview.innerHTML = item.value;
      updateBackground()

      item.addEventListener('input', e => {

        switch (parseInt(item.value)) {

          case 305:

            preview.classList.remove('no-translate');

            if (eelState) {

              localeUpdate([`${preview.id}`]);

            } else {

              preview.innerHTML = 'No price limit';

            }

            break;

          default:

            preview.classList.add('no-translate');
            preview.innerHTML = item.value;
            break;

        }

        updateBackground()

        e.preventDefault();

      })

    }

  });

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
  const completeList = document.querySelectorAll('.complete');              // Find all elements with .result class

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

  for (i = 0; i < completeList.length; i++) {                                 // DO NOT use async/await in Array.prototype.forEach()! (See comments in generateOptions() for more information)

    var button = completeList[i];
    if (button.id == 'page-setting-option-random') {

      button.addEventListener('click', async e => {

        if (eelState == true) {

          result = await eel.analyze('Random','Random', 99999, true, true)();
          await parseResult(result);

        } else {

          await parseResult();

        }

        move(5,'absolute');
        e.preventDefault();

      });

    } else {

      button.addEventListener('click', async e => {

        if (eelState == true) {

          var q1 = document.getElementById('page-q1-input').value.substring(1);
          var q2 = document.getElementById('page-q2-input').value.substring(1);

          if (isNaN(parseInt(document.getElementById('page-q3-preview').innerHTML))) {

            var q3 = 1000;

          } else {

            var q3 = parseInt(document.getElementById('page-q3-preview').innerHTML);

          }

          result = await eel.analyze(q1,q2,q3)();
          await parseResult(result);

        } else {

          await parseResult();

        }

        move(5,'absolute');
        e.preventDefault();

      });

    }

  }
  
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
      dayTheme = !dayTheme;

    } else {

      html.classList.toggle('day');

    }

  }

  button.addEventListener('click', e => {                         // Add an event listener to mode button; when button is clicked, do:

    html.classList.toggle('night');
    html.classList.toggle('day');
    dayTheme = !dayTheme;
    updateBackground();
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
async function generateOptions(quantity = 5, useDefault = true) {

  const insertList = document.querySelectorAll('.input:has(.dropdown)');

  if (eelState) {

    insertList.forEach(item => {

      item.classList.add('eel');

    })

  }


  /*

    DO NOT use Array.prototype.forEach for following case!

    Remember: NEVER use async/await in forEach, since it doesn't behaviour as what you might think!

    Reference document:

      https://zellwk.com/blog/async-await-in-loops/, by Zeel

  */
  for (n = 0; n < insertList.length; n++) {

    var item = insertList[n];
    var order = n;
    var initial;
    var dropdown = item.querySelectorAll(':scope .dropdown')[0];
    var autoMenu = document.createElement('ul');
    autoMenu.setAttribute('id',`page-q${order+1}-option-list`);
    autoMenu.setAttribute('class','list none');
        
    // For pre-defined dropdowns

    if (item.classList.contains('eel')) {

      if (dropdown.classList.contains('place') || dropdown.classList.contains('type')) {

        if (dropdown.classList.contains('place')) {

          Column = await requestColumnData('Place');

        } else if (dropdown.classList.contains('type')) {

          Column = await requestColumnData('Type');

        }

        for (i = 0; i < Column.length; i++) {

          var autoOption = document.createElement('li');
          autoOption.setAttribute('id',`page-q${order+1}-option-${i+1}`);
          autoOption.setAttribute('class','list-option');
          autoOption.setAttribute('title',Column[i]);
          autoOption.textContent = Column[i];
          autoMenu.appendChild(autoOption);
          (i == 0) ? (initial = Column[i]) : null;
    
        }

      } else {

        for (i = 0; i < quantity; i++) {

          var autoOption = document.createElement('li');
          autoOption.setAttribute('id',`page-q${order+1}-option-${i+1}`);
          autoOption.setAttribute('class','list-option');
          autoOption.setAttribute('title',`Option ${i+1}`);
          autoOption.textContent = `Option ${i+1}`;
          autoMenu.appendChild(autoOption);
          initial = 'Option 1';
    
        }

      }
    
    } else {

      for (i = 0; i < quantity; i++) {

        var autoOption = document.createElement('li');
        autoOption.setAttribute('id',`page-q${order+1}-option-${i+1}`);
        autoOption.setAttribute('class','list-option');
        autoOption.setAttribute('title',`Option ${i+1}`);
        autoOption.textContent = `Option ${i+1}`;
        autoMenu.appendChild(autoOption);
        initial = 'Option 1';
  
      }

    }

    var icon = document.createElement('span');
    item.append(icon, autoMenu);
    (useDefault) ? dropdown.setAttribute('value',` ${initial}`) : null;
    dropdown.setAttribute('title', dropdown.value);

  }

}

/**
 * Collect all page nodes except for navagation bar and footer.
 */
function setPageNodes () {

  pageList = document.querySelectorAll('#page > :not(:first-child):not(:last-child)');
  pageList.forEach(item => {pageIdList.push(item.id);});

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

async function parseResult(json = false) {

  const star = [];
  const title = [];
  const address = [];
  const mapLink = [];
  const starHTML = document.querySelectorAll('.result-star');
  const titleHTML = document.querySelectorAll('.result-title');
  const addressHTML = document.querySelectorAll('.result-link');

  if (json == false) {

    for (i = 0; i < 3; i ++) {

      star.push(randomStar());
      title.push(randomString(18));
      address.push(randomString(16));
      mapLink.push(`https://goo.gl/maps/${randomString(17)}`);

    }

  } else {

    rawJSON = json;

    if (rawJSON != '[]') {

      resultJSON = JSON.parse(json);
      open_state = true

      for (i = 0; i < 3; i ++) {

        star.push(randomStar(resultJSON[i].Review));
        title.push(resultJSON[i].Name);
        address.push(resultJSON[i].Address);
        mapLink.push(resultJSON[i].Google_Map);

      }

    } else {

      open_state = false;
      for (i = 0; i < 3; i ++) {

        star.push('X.X');
        title.push('No matched restaurants.');
        address.push('All recorded restaurants are not open now. Please come again later!');
        mapLink.push('#');

      }
      
    }

  }

  starHTML.forEach((item, i) => {

    document.getElementById(item.id).innerHTML = star[i];

    if (open_state) {

      document.getElementById(item.id).classList.add('no-translate');

    } else {

      document.getElementById(item.id).classList.remove('no-translate');

    }

  })

  titleHTML.forEach((item, i) => {

    if ((eelState == true) && (open_state == false)) {

      localeUpdate([item.id]);

    } else {

      document.getElementById(item.id).innerHTML = title[i];

    }

    if (open_state) {

      document.getElementById(item.id).classList.add('no-translate');

    } else {

      document.getElementById(item.id).classList.remove('no-translate');

    }

  })

  addressHTML.forEach((item, i) => {

    if ((eelState == true) && (open_state == false)) {
      
      localeUpdate([item.id]);

    } else {

      document.getElementById(item.id).innerHTML = address[i];

    }
    
    document.getElementById(item.id).href = mapLink[i];

    if (open_state) {

      document.getElementById(item.id).classList.add('no-translate');

    } else {

      document.getElementById(item.id).classList.remove('no-translate');

    }

  })

}

function randomStar(num = false) {

  if (num) {

    if (num % 10 == 0) {

      return `${num}.0`;
  
    } else {
  
      return num;
  
    }
    
  } else {

    result = Math.floor(Math.random() * 40)

    if (result % 10 == 0) {

      return `${result / 10 + 1}.0`;
  
    } else {
  
      return result / 10 + 1;
  
    }

  }

}

/*
  Reference source code & author:
    https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript, by @csharptest.net on StackOverflow 

*/
/**
 * Generate random strings.
 * @param {Number} length - The length you want to generate
 * @returns
 */
function randomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;

  for ( var i = 0; i < length; i++ ) {

    result += characters.charAt(Math.floor(Math.random() * charactersLength));

  }

  return result;

}

/*

  Reference source code & author:

    https://stackoverflow.com/questions/18389224/how-to-style-html5-range-input-to-have-different-color-before-and-after-slider, by @dargue3 on StackOverflow

*/
function updateBackground() {

  document.querySelectorAll('.slider').forEach(item => {

    var borderValue = (item.value - item.min) / (item.max - item.min) * 100;
    var dayNight = (dayTheme) ? 'day' : 'night';
    item.style.background = `linear-gradient(to right, var(--input-${dayNight}) 0%, var(--input-${dayNight}) ${borderValue}%, var(--list-${dayNight}) ${borderValue}%, var(--list-${dayNight}) 100%)`;
    item.style.border = `linear-gradient(to right, var(--input-${dayNight}) 0%, var(--input-${dayNight}) ${borderValue}%, var(--list-${dayNight}) ${borderValue}%, var(--list-${dayNight}) 100%)`;

  });

}