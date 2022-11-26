import readfile as rf                                   # Import readfile module; require $ pip install pandas, openpyxl
import restaurants as rs                                # Import restaurants module

def main():                                             # Main workflow
    sheet = rf.Sheet()
    print(sheet.query(kw = ['*'], strict = True , column = ['Ok']))

if __name__ == '__main__': main()
