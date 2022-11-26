// Intercept users' click event to trigger change interface function.
function clickMode() {

    var button = document.getElementById('page-main-navbar-mode');
    var html = document.getElementById("html");
  
    button.addEventListener("click", function (e) {
  
        if (html.classList.contains("day")) {

            html.classList.remove("night");
            html.classList.add("day");

        } else {

            html.classList.remove("day");
            html.classList.add("night");

        }
  
      e.preventDefault();
  
    }, false);
  
}