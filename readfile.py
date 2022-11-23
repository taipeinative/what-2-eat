import pandas as pd                                                                     # Import pandas module; require openpyxl module
import restaurants as rs                                                                # Import restaurants module.

class Sheet():
    '''
    The dataframe of the excel sheet. If no argument is given, a default empty object will be created.

    Parameters
    ----------
    df : pd.DataFrame
        The dataframe of the object; default to be the sheet in ``'Restaurant.xlsx'``.
    
    Methods
    ----------
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

    def at(self, row: int, column: int):
        '''
        Access data from an integer row/column pair.

        Parameters
        --------
        row : int
            The row index of the cell.
        column : int
            The column index of the cell.

        Returns
        --------
        df : pd.DataFrame
            The given cell's dataframe.
        '''
        df = self.df.iat[row,column]
        return df


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
            >>> 
            '''

            temporary_df_lenient = pd.DataFrame(columns = self.df.columns.values)

            if isinstance(column_names, list):

                for j in range(len(column_names)):
                    
                    temporary_df_lenient = pd.concat([temporary_df_lenient, self.df[self.df[column_names[j]].str.contains(item)]])

                result = temporary_df_lenient.dropna(subset=['Name']).sort_index()

                return result

            else:

                return self.df[self.df.apply(lambda row: row.astype(str).str.contains(item, case = False).any(), axis=1)]




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
            >>> 
            '''

            temporary_df_strict = pd.DataFrame(columns = self.df.columns.values)

            if isinstance(column_names,list):

                for j in range(len(column_names)):
                    
                    temporary_df_strict = pd.concat([temporary_df_strict, self.df[self.df[column_names[j]] == item]])

                result = temporary_df_strict.dropna(subset=['Name']).sort_index()

                return result

            else:

                return self.df[self.df.isin([item]).any(axis = 1)]




        result = []
        temporary_df = pd.DataFrame(columns = self.df.columns.values)

        for i in range(len(kw)):

            if strict == True:

                temporary_df = pd.concat([temporary_df, strict_query(kw[i],column)]).drop_duplicates()

            else:
                
                temporary_df = pd.concat([temporary_df, lenient_query(kw[i],column)]).drop_duplicates()
        
        result = temporary_df.dropna(subset=['Name']).sort_index()

        return result