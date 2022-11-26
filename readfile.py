import pandas as pd                                                                     # Import pandas module; require openpyxl module
import time                                                                             # Import time module.
import re

class Sheet():
    '''
    The dataframe of the excel sheet. If no argument is given, a default empty object will be created.

    Parameters
    ----------
    df : pd.DataFrame
        The dataframe of the object; default to be the sheet in ``'Restaurant.xlsx'``.
    
    Methods
    ----------
    query()
        Query objects by conditions.
    set_`<property>`()
        Set the given property of the object; for example, set_name().
    '''


    ### Initialization method ###


    def __init__(self , dataframe: pd.DataFrame = pd.read_excel('Restaurants.xlsx', sheet_name = 'Sheet1') ):
        self.__dataframe = dataframe                            # Initialize dataframe property.
    
    

    ### Properties and set methods ###

    # Following are all properties defined in Restaurants and methods to set them.


    @property
    def df(self):                                               # Property which returns the dataframe of the object.
        '''Return the dataframe of the given excel file;
        default to be `'Restaurants.xlsx'`.
        '''
        return self.__dataframe

    def set_df(self, dataframe: pd.DataFrame):                  # Method which sets the dataframe of the object.
        '''Set the dataframe of the object.'''
        self.__dataframe = dataframe

    ### Methods ###

    # Following are other methods can be called in Sheets.

    def query(self, kw: list , strict: bool = True , column: list = False):
        '''
        Query data based on given conditions.

        Parameters
        --------
        kw : list
            The keywords of the query.
        strict : bool
            Toggle strict mode or not; default to be `True`.
        column : list or False
            The specific column to search; default to be `False`, which means search all sheet.

        Returns
        --------
        result : pd.DataFrame
            The query result.

        Examples
        --------
        >>> df = rf.Sheet()
        >>> df.set_df(pd.DataFrame({
            'Type': ['Rice','Noodle','Rice'],
            'Name': ['TR Bento Taipei Branch', 'Toscanini Pasta', 'Hi Sushi']
        }))
        >>> df.query(['Rice'])
           Type                    Name
        0  Rice  TR Bento Taipei Branch
        2  Rice                Hi Sushi

        Using lenient query:
        >>> df.query(['a'],False)
             Type                    Name
        0    Rice  TR Bento Taipei Branch
        1  Noodle         Toscanini Pasta

        Query only in specific columns:
        >>> df.query(['s'],False,['Name'])
             Type             Name
        1  Noodle  Toscanini Pasta
        2    Rice         Hi Sushi
        '''

        
        def lenient_query(item: str, column_names: list = False):
            '''
            Query data in lenient way, which search cells 'containing' the given string.

            Parameters
            -------
            item : str
                The given string to search.
            column_names : list or False
                The specific column to search; default to be `False`, which means search all sheet.

            Returns
            --------
            result : pd.DataFrame
                The query result.

            Examples
            --------
            (This function is a local function)
            >>> df = rf.Sheet()
            >>> df.set_df(pd.DataFrame({
                'Type': ['Rice','Noodle','Rice'],
                'Name': ['TR Bento Taipei Branch', 'Toscanini Pasta', 'Hi Sushi']
            }))
            >>> list_kw = ['a','b','c']
            >>> for i in range(len(list_kw)):
                    lenient_query(list_kw[i])
                 Type                    Name
            0    Rice  TR Bento Taipei Branch
            1  Noodle         Toscanini Pasta
               Type                    Name
            0  Rice  TR Bento Taipei Branch
                 Type                    Name
            0    Rice  TR Bento Taipei Branch
            1  Noodle         Toscanini Pasta
            2    Rice                Hi Sushi
            
            Query only in specific columns:
            >>> for i in range(len(list_kw)):
                    lenient_query(list_kw[i],['Name'])
                 Type                    Name
            0    Rice  TR Bento Taipei Branch
            1  Noodle         Toscanini Pasta
            (None)
                 Type                    Name
            0    Rice  TR Bento Taipei Branch
            1  Noodle         Toscanini Pasta
            '''

            temporary_df_lenient = pd.DataFrame(columns = self.df.columns.values) # Create an empty dataframe based on callee's columns

            if isinstance(column_names, list): # Test whether `column_name` is a list

                for j in range(len(column_names)): # Loop `len(column_name)` times

                    if column_names[j] in self.df.columns: # Test whether `column_names[j]` is a valid column name
                    
                        temporary_df_lenient = pd.concat([temporary_df_lenient, self.df.loc[self.df[column_names[j]].str.contains(re.escape(item))]]) # Concatenate the search result dataframes, based on lenient searching and `column_names`

                result = temporary_df_lenient.dropna(how = 'all').sort_index() # Drop the first row (the initial `temporary_df_lenient`)

                return result

            else:

                return self.df[self.df.apply(lambda row: row.astype(str).str.contains(item, case = False).any(), axis=1)] # Return the search result dataframes, based on lenient searching




        def strict_query(item: str, column_names: list = False):
            '''
            Query data in strict way, which search cells with exact value of the given string.

            Parameters
            -------
            item : str
                The given string to search.
            column_names : list or False
                The specific column to search; default to be `False`, which means search all sheet.

            Returns
            --------
            result : pd.DataFrame
                The query result.

            Examples
            --------
            (This function is a local function)
            >>> df = rf.Sheet()
            >>> df.set_df(pd.DataFrame({
                'Type': ['Rice','Noodle','Rice'],
                'Name': ['TR Bento Taipei Branch', 'Toscanini Pasta', 'Hi Sushi']
            }))
            >>> list_kw = ['Rice','Noodle']
            >>> for i in range(len(list_kw)):
                    strict_query(list_kw[i])
               Type                    Name
            0  Rice  TR Bento Taipei Branch
            2  Rice                Hi Sushi
                 Type             Name
            1  Noodle  Toscanini Pasta

            Query only in specific columns:
            >>> strict_query(['Hi Sushi'])
               Type      Name
            2  Rice  Hi Sushi
            '''

            temporary_df_strict = pd.DataFrame(columns = self.df.columns.values) # Create an empty dataframe based on callee's columns

            if isinstance(column_names,list): # Test whether `column_name` is a list

                for j in range(len(column_names)): # Loop `len(column_name)` times

                    if column_names[j] in self.df.columns: # Test whether `column_names[j]` is a valid column name

                        temporary_df_strict = pd.concat([temporary_df_strict, self.df[self.df[column_names[j]] == item]]) # Concatenate the search result dataframes, based on strict searching and `column_names`

                result = temporary_df_strict.dropna(how = 'all').sort_index() # Drop the first row (the initial `temporary_df_strict`)

                return result

            else:

                return self.df[self.df.isin([item]).any(axis = 1)] # Return the search result dataframes, based on strict searching




        result = []
        temporary_df = pd.DataFrame(columns = self.df.columns.values) # Create an empty dataframe based on callee's columns

        for i in range(len(kw)): # Loop `len(kw)` times

            if strict == True: # Test whether `strict` is a True (strict mode enabled?)

                temporary_df = pd.concat([temporary_df, strict_query(kw[i],column)]).drop_duplicates() # Concatenate the search result dataframes, using `strict_query()`

            else:
                
                temporary_df = pd.concat([temporary_df, lenient_query(kw[i],column)]).drop_duplicates() # Concatenate the search result dataframes, using `lenient_query()`
        
        result = temporary_df.dropna(how = 'all').sort_index() # Drop the first row (the initial `temporary_df`)

        if result.empty != True: # Test whether result is an empty dataframe

            return result

        else: 

            return None # Return `None` if the dataframe is empty


def timestamp(msg):
    '''
    Prints a message with current local time.

    Parameters
    --------
    msg : any
        The message to be print.

    Returns
    --------
    None
        Returns none; the function directly prints message in console.

    Examples
    --------
    >>> timestamp('Hello world')
    [00:00:00] Hello world

    (The time differs based on current time; it use HH:MM:SS)
    '''
    print (f'{time.strftime( "[%H:%M:%S]", time.localtime(time.time()))} {msg}') # Prints message.