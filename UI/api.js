// Predefined variables
var locale;


// External module / function documantion

/**
 * The external class provided by Eel to request pyhon functions.
 * @external eel
 * @see {@link https://github.com/python-eel/Eel|GitHub}
 */

/**
 * Request locale file `locale.json` placed in `UI` folder.
 * @function external: eel.getLocaleFile
 * @returns {String} - The json string of the file. 
 * @see {@link .\main.py|main.py}
 */


/*
  Reference source code & author:

    https://ithelp.ithome.com.tw/articles/10285301, by DiuDiu on itHelp
    https://neutron0916.medium.com/python-eel-創造個人網頁gui桌面應用程式-入門篇-2500b38ed070, by Neutron on Medium


*/
/**
 * Request locale file through eel.js provided by Eel module from python.
 * @param {boolean} [testMode = flase] - Whether print locale content in console or not; default to be false.
 */
async function requestLocale(testMode = false) {                        // Using `async` because we have to wait for eel to excute the command.
    
  var rawLocale = await eel.getLocaleFile()()                           // Using `await`, same reason as above.
  testMode ? console.log(rawLocale) : null;                             // Log locale in console while `testMode` is true.
  locale= JSON.parse(rawLocale);                                        // Parse raw string back to JSON.

}

/**
 * Request all unique data from the required column.
 * @param {string} column - The required column.
 * @param {boolean} [testMode = false] - Whether print locale content in console or not; default to be false.
 */
async function requestColumnData(column,testMode = false) {             // Using `async` because we have to wait for eel to excute the command.
    
  var data = await eel.getSheetData(column)();                          // Using `await`, same reason as above.
  testMode ? console.log(data) : null;                                  // Log data in console while `testMode` is true.
  return data;                                                          // Return data

}

window.onload = function () {                                           // Fires immediately when the page loaded.

  try {

    var eelTest = typeof(eel.getLocaleFile);                            // Test whether the function exists; useful when you open .html directly

  } catch (e) {                                                         // If the function is not exist (throw error), do:

    clickLanguage('Fail');                                              // Hide the language button (prevent users from requesting locales)
    console.log('Fail to request local locale through eel; translate function disabled.');

  } finally {                                                           // If the function exists (run successfully), do:

    requestLocale();                                                    // Request locale file
    clickLanguage();                                                    // Add an event listener to language button

  }

  clickStep();                                                          // Set event listeners to step buttons
  clickTheme('set');                                                    // Add an event listener to theme button
  clickForm();                                                          // Set event listeners to form elements
  setPageNodes();

};