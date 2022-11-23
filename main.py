import readfile as rf                                   # Import readfile module; require $ pip install pandas, openpyxl
import restaurants as rs                                # Import restaurants module
import pandas as pd

def main():                                             # Main workflow
    sheet = rf.Sheet()
    sheet.set_df(pd.DataFrame({
            'Type': ['Rice','Noodle','Rice'],
            'Name': ['TR Bento Taipei Branch', 'Toscanini Pasta', 'Hi Sushi']
        }))
    print(sheet.query(['s'],False,['Name']))

if __name__ == '__main__': main()
