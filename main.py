import eel                                      # Import eel module to manage interfaces
import json                                     # Import json module to handle .json files
from os import path as p                        # Import os.path module to build relative paths
import readfile as rf                           # Import readfile module to retrieve data from Excel.


### Main workflow ###

def main():
    launch()                                    # Launch the interface


### Methods ###

# Following are methods used in main().


def launch():                                   # The method launch the interface.
    '''
    Launch the UI interface through eel.
    '''
    eel.init('UI')                              # Initialize the UI folder (where front-end file places)
    eel.start('main.html', size = (1920, 1080)) # Launch the interface


### Expose methods ###

# Following are methods which will be exposed to JavaScript through eel.


#  Reference source code & author:
#
#    https://ithelp.ithome.com.tw/articles/10285301, by DiuDiu on itHelp
#    https://neutron0916.medium.com/python-eel-創造個人網頁gui桌面應用程式-入門篇-2500b38ed070, by Neutron on Medium
#
@eel.expose                                     # Decorator exposing the method
def getLocaleFile():                            # The method helping JavaScript get locale file.
    '''
    [For JavaScript] Request locale file `locale.json` placed in `UI` folder.

    Parameters
    ---------
    None : None
        No arguments required nor accepted.

    Returns
    --------
    Locale : Str
        The json string of the file.

    Examples
    --------
    In `locale.json`:
    >>> [{"n": "Alex", "g": "M"}, {"n": "Anne", "g": "F"}]

    In `api.js`, assume already in an async function:
    >>> a = await eel.getLocaleFile()();
    >>> locale = JSON.parse(a);
    >>> console.log(locale[0].n);
    Alex
    '''
    current_path = p.dirname(__file__)          # Require current file path (Expected output: C:\your\file\path\main.py)
    new_path = p.relpath( 'UI\\locale.json' , current_path) # Generate file path to locale file based on relative file path 
                                                            # (Expected output: C:\your\file\path\UI\locale.json)
    f = open(new_path, encoding = 'utf-8')      # Read locale file with utf-8 encoding
    locale = json.load(f)                       # Parse JSON from the file
    return json.dumps(locale, ensure_ascii = False) # Dump JSON into string with unicodes

@eel.expose
def getSheetData(column: str):                  # The method helping JavaScript get sheet data.
    '''
    [For JavaScript] Request all avalable sheet data from file `Restaurants.xlsx`.

    Parameters
    ---------
    column : str
        The columns searching for; for example, `Type` or `Name`.

    Returns
    --------
    values : list
        All non-repeat value in the given column.

    Examples
    --------
    In `Restaurants.xlsx`:
    >>> [{"n": "Alex", "g": "M"}, {"n": "Anne", "g": "F"}, {"n": "Bill", "g": "M"}, {"n": "Beck", "g": "M"}]

    In `api.js`, assume already in an async function:
    >>> a = await eel.getSheetData('g')();
    >>> console.log(a);
    ['M','F']
    '''
    values = rf.Sheet().unique(column)
    return values

if __name__ == '__main__': main()               # Run the file since __name__ default to be __main__ outside a class