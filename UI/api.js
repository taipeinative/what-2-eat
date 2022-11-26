var locale;

/*
  Reference source code & author:

    https://ithelp.ithome.com.tw/articles/10285301, by DiuDiu on itHelp
    https://neutron0916.medium.com/python-eel-創造個人網頁gui桌面應用程式-入門篇-2500b38ed070, by Neutron on Medium


*/
async function requestLocale(testMode = false){                         // Using `async` because we have to wait for python to excute the command.
    
    var rawLocale = await eel.getLocaleFile()()                                // Using `await`, same reason as above.
    testMode ? console.log(rawLocale) : console.log(null);                 // Log locale in console while `testMode` is true.
    locale= JSON.parse(rawLocale);

}

window.onload = function () {

  document.getElementById("page-main-navbar-mode").setAttribute('onclick','document.getElementById("html").classList.toggle("day");');
  requestLocale();
  clickLanguage();
  clickMode();

};