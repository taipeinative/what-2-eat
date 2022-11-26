import eel
import os.path
import json


#
#  Reference source code & author:
#
#    https://ithelp.ithome.com.tw/articles/10285301, by DiuDiu on itHelp
#    https://neutron0916.medium.com/python-eel-創造個人網頁gui桌面應用程式-入門篇-2500b38ed070, by Neutron on Medium
#
#

@eel.expose
def getLocaleFile():

    current_path = os.path.dirname(__file__)
    new_path = os.path.relpath( 'UI\\locale.json' , current_path)
    f = open(new_path, encoding = 'utf-8')
    locale = json.load(f)
    return json.dumps(locale, ensure_ascii = False)


eel.init('UI')
eel.start('main.html', size=(1920, 1080))
