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
    
        document.getElementById('page-main-start').classList.add('fin');    // Add 'fin' class to the page (make them shift and disappear)
        document.getElementById('page-main-footer-author').classList.add('transparent'); // Add 'transparent' class to the footer (make it disappear)
    
        e.preventDefault();                                                 // Prevent default behavior
    
      }, false);
  
  }