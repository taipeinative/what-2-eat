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
    filter_time()
        Filter dataframes by current time.
    query()
        Query objects by conditions.
    set_`<property>`()
        Set the given property of the object; for example, set_name().
    '''


    ### Initialization method ###


    def __init__(self , dataframe: pd.DataFrame = pd.read_excel('Restaurants.xlsx', sheet_name = 'Sheet1') ):
        self.__dataframe = dataframe                            # Initialize dataframe property.
    
    

    ### Properties and set methods ###

    # Following are all properties defined in Sheet and methods to set them.


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

    # Following are other methods can be called in Sheet.

    def filter_price(self, max_price: int):
        '''
        Filter restaurants based on maximum affordable price.

        Parameters
        ---------
        max_price : int
            The maximum affordable price of the meal.

        Returns
        --------
        result : pd.DataFrame
            Filtered dataframe with affordable price.

        Examples
        --------

        '''
        result_df = pd.DataFrame(columns = self.df.columns.values)              # Initialize the dataframe

        for i in range(len(self.df.index)):

             if (max_price >= int(self.df.iat[i, 2].split('~')[0])):

                result_df = pd.concat([result_df, self.df.iloc[[i]]])

        result = result_df.dropna(how = 'all').sort_index()  # Drop the first row (the initial `result_df`)

        return result


    def filter_time(self):
        '''
        Filter restaurants based on current time.

        Parameters
        --------
        None
            No parameters required.

        Returns
        --------
        result : pd.DataFrame
            Filtered dataframe with avalible opening hours.

        Examples
        --------
        Assuming current time is 04:20AM, Thursday, we have:
        >>> df = rf.Sheet()
        >>> df.set_df(pd.DataFrame({
                'Type': ['Japanese','Taiwanese','Hongkongnese'],
                'Name': ['CoCo Curry House', 'Yummy Food', 'Sei Dim Sum'],
                'Price': ['80~150','75~140','60~250'],
                'Place': ['Downtown','Middletown','Downtown'],
                'Open_Remark': ['* w1','*','*'],
                'Open_SUN': ['01:00-24:00','10:30-16:00','14:30-21:30']
            }))
        >>> df.filter_time()
               Type              Name   Price     Place Open_Remark     Open_SUN
        0  Japanese  CoCo Curry House  80~150  Downtown        * w1  01:00-24:00
        '''
        current_time = time.time()                                              # Get current time (Epoch format)
        weekday = time.strftime( "%w", time.localtime(current_time) )           # Get current weekday (SUN for '0', SAT for '6')
        time_str = time.strftime( "%H:%M", time.localtime(current_time) )       # Get current time (01:00AM for '01:00', 10:30PM for '22:30')

        result_df = pd.DataFrame(columns = self.df.columns.values)              # Initialize the dataframe

        common_df = pd.concat([self.query(['*'], False, ['Open_Remark']), self.query([f'\\* w\\d*{weekday}'],False)]).drop_duplicates(keep = False) # Get restaurants open almost everyday except for current day.
        for i in range(len(common_df.index)):

            hour_list = common_df.iat[i, 5].split('/')  # Retrieve all avalible opening hours from the column 'Open_SUN' (When '*' appears in 'Open_Remark', it means that there's no special opening hours for specific days)

            for j in range(len(hour_list)):

                if hour_list[j].split('-')[1] == '24:00':   # For cross-day specific

                    if is_between(time_str, hour_list[j].split('-')[0], hour_list[j].split('-')[1], True):  # Check whether the restaurant is open.

                        result_df = pd.concat([result_df, common_df.iloc[[i]]])  # If the restaurant opens, append it to the dataframe.

                else:

                    if is_between(time_str, hour_list[j].split('-')[0], hour_list[j].split('-')[1]):    # Normal

                        result_df = pd.concat([result_df, common_df.iloc[[i]]]) # If the restaurant opens, append it to the dataframe.

        specific_df = pd.concat([self.df, common_df]).drop_duplicates(keep = False) # Get restaurants which have odd opening hours, that is, without '*' remark.
        for i in range(len(specific_df.index)):

            hour_list = specific_df.iat[i, (5 + weekday)].split('/') # Retrieve all avalible opening hours from the column 'Open_XXX' (Where XXX is today's weekday)

            for j in range(len(hour_list)):

                if hour_list[j].split('-')[1] == '24:00':

                    if is_between(time_str, hour_list[j].split('-')[0], hour_list[j].split('-')[1], True):

                        result_df = pd.concat([result_df, specific_df.iloc[[i]]])

                else:

                    if is_between(time_str, hour_list[j].split('-')[0], hour_list[j].split('-')[1]):

                        result_df = pd.concat([result_df, specific_df.iloc[[i]]])

        result = result_df.dropna(how = 'all').sort_index()  # Drop the first row (the initial `result_df`)

        return result

    def query(self, kw: list , strict: bool = True , column: list = False , return_none: bool = False):
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
        return_none : bool
            Return None or an empty dataframe; default to be `False`, which means return empty dataframe.

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

                #
                #   Reference source code & author:
                #       https://kanoki.org/2022/02/04/pandas-search-a-string-in-dataframe-across-all-columns/, by kanoki
                #
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

            if return_none:

                return None     # Return `None` if the dataframe is empty

            else:

                return result


    def unique(self, place: str):
        '''
        Find unique data on given column.

        Parameters
        --------
        place : str
            The column to be search.

        Returns
        --------
        result : list
            All unique value in a list.

        Examples
        --------
        >>> df = rf.Sheet()
        >>> df.set_df(pd.DataFrame({
                'Type': ['Rice','Noodle','Rice'],
                'Name': ['TR Bento Taipei Branch', 'Toscanini Pasta', 'Hi Sushi']
            }))
        >>> df.unique('Type')
        ['Rice', 'Noodle']
        '''
        return self.df[place].unique().tolist()


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


def is_between(uncheck_time : str, start_time : str, end_time : str, cross_day : bool = False):
    '''
    Check whether the time is between two pre-given times.

    Parameters
    --------
    uncheck_time : str
        The time you want to check in 'xx:xx' format.

    start_time : str
        The beginning time in 'xx:xx' format.

    end_time : str
        The end time in 'xx:xx' format.

    cross_day : bool
        Whether the end time cross day; default to be false, and only support '24:00'. If an opening hour is '22:00-04:00', please write '00:00-04:00/22:00-24:00'.

    Returns
    --------
    result : bool
        The comparison result; returns true if uncheck_time is between start_time and end_time.

    Examples
    --------
    >>> is_between('08:00','07:00','09:00')
    True
    >>> is_between('22:00','11:00','12:00')
    False
    '''
    uncheck = time.strptime(f'1970-01-02 {uncheck_time}:00','%Y-%m-%d %H:%M:%S')    # Get the Epoch via time module 
    start = time.strptime(f'1970-01-02 {start_time}:00','%Y-%m-%d %H:%M:%S')

    if cross_day:

        end = time.strptime('1970-01-03 00:00:00','%Y-%m-%d %H:%M:%S')     # Directly use Jan 3rd 1970 for cross day's end_time

    else:

        end = time.strptime(f'1970-01-02 {end_time}:00','%Y-%m-%d %H:%M:%S')

    if (time.mktime(uncheck) - time.mktime(start) >= 0) & (time.mktime(end) - time.mktime(uncheck) > 0):  # If True, end > uncheck >= start

        return True

    else:

        return False