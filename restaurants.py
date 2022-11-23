class Restaurants(list):
    '''
    The data of the restaurants. If no argument is given, a default empty object will be created.

    Parameters
    ----------
    address : str
        The address of the restaurant; default to be ``'undefined'``.
    database : str
        The origin database of the restaurant; default to be ``'undefined'``.
    district : str
        The district restaurant situated, not confused with administrative divisions; default to be ``'undefined'``.
    name : str
        The name of the restaurant; default to be ``'undefined'``.
    open : list
        The opening hour of the restaurant; default to be ``[]``.
    price : set
        The min and max price of the main dish of the restaurant; default to be ``{}``.
    review : float
        The review markings from Google Map; default to be ``0``.
    tag : str
        The additional information of the restaurant; default to be ``None``.
    type : list
        The cuisine type of the restaurant; default to be ``'undefined'``.

    Methods
    ----------
    print_property()
        Print all properties of the object to the console.
    set_`<property>`()
        Set the given property of the object; for example, set_name().
    '''

    ### Initialization method ###

    def __init__(self, address: str = 'undefined', database: str = 'undefined',district: str = 'undefined', name: str = 'undefined', open: list = [] , price: set = {} , review: float = .0 , tag: str = '', type: str = 'undefined'):
        self.__restaurant_address = address                     # Initialize restaurant address property
        self.__restaurant_database = database                   # Initialize restaurant database property
        self.__restaurant_district = district                   # Initialize restaurant district property
        self.__restaurant_name = name                           # Initialize restaurant name property
        self.__restaurant_open = open                           # Initialize restaurant opening hour property
        self.__restaurant_price = price                         # Initialize restaurant price property
        self.__restaurant_review = review                       # Initialize restaurant review property
        self.__restaurant_tag = tag                             # Initialize restaurant tag property
        self.__restaurant_type = type                           # Initialize restaurant type property 


    ### Properties and set methods ###

    # Following are all properties defined in Restaurants and methods to set them. 


    @property
    def address(self):                                          # Property which returns address
        '''Return the address of the object.'''
        return self.__restaurant_address

    def set_address(self, place: str):                          # Method which modifies address
        '''Set the address of the object.'''
        self.__restaurant_address = place

    @property
    def database(self):                                          # Property which returns database
        '''Return the database of the object.'''
        return self.__restaurant_database

    def set_database(self, base: str):                          # Method which modifies database
        '''Set the database of the object.'''
        self.__restaurant_database = base

    @property
    def district(self):                                          # Property which returns district
        '''Return the district of the object.'''
        return self.__restaurant_district

    def set_district(self, place: str):                          # Method which modifies district
        '''Set the district of the object.'''
        self.__restaurant_district = place

    @property
    def name(self):                                             # Property which returns restaurant name
        '''Return the name of the object.'''
        return self.__restaurant_name

    def set_name(self, caption: str):
        '''Set the name of the object.'''                       # Method which modifies restaurant name
        self.__restaurant_name = caption

    @property
    def open(self):                                             # Property which returns restaurant opening hours
        '''Return the openning hour of the object.'''
        return self.__restaurant_open 

    def set_open(self, hour: list):
        '''Set the openning hour of the object.'''              # Method which modifies restaurant opening hours
        self.__restaurant_open = hour

    @property
    def price(self):                                            # Property which returns restaurant's main cuisine price
        '''Return the price of the object.'''
        return self.__restaurant_price 

    def set_price(self, price: set):
        '''Set the price of the object.'''                      # Method which modifies restaurant's main cuisine price
        self.__restaurant_price = price    

    @property
    def review(self):                                           # Property which returns restaurant's review
        '''Return the review of the object.'''
        return self.__restaurant_review 

    def set_review(self, point: float):
        '''Set the review of the object.'''                     # Method which modifies restaurant's review
        self.__restaurant_review = point

    @property
    def tag(self):                                              # Property which returns restaurant's tag
        '''Return the tag of the object.'''
        return self.__restaurant_tag 

    def set_tag(self, tag: str):
        '''Set the tag of the object.'''                        # Method which modifies restaurant's tag
        self.__restaurant_tag = tag

    @property
    def type(self):                                             # Property which returns restaurant's type
        '''Return the type of the object.'''
        return self.__restaurant_type 

    def set_type(self, cuisine: str):
        '''Set the type of the object.'''                       # Method which modifies restaurant's type
        self.__restaurant_type = cuisine     


    ### Methods ###

    # Following are other methods can be called in Restaurants.


    def print_property(self, alt_mode: bool = False):                                   # Method which prints all properties of the object to the console.
        '''
        Print all properties of the object to the console.

        Parameters
        --------
        alt_mode : bool
            Choose whether to use alternative property report or not.

        Examples
        --------
        >>> Obj = Restaurants()
        >>> Obj.print_property()
        Property Table
        ===============
        address:        undefined
        database:       undefined
        district:       undefined
        name:           undefined
        open:           []
        price:          {}
        review:         0.0
        tag:
        type:           undefined
        ===============

        To use alternative style:
        >>> Obj.print_property(True)
        {'address': 'undefined', 'database': 'undefined', 'district': 'undefined',
         'name': 'undefined', 'open': [], 'price': {}, 'review': 0.0,
         'tag': '', 'type': 'undefined'}
        '''
        if alt_mode != True:
            print('\nProperty Table')
            print('='*15)
            print('address:       ',self.address)
            print('database:      ',self.database)
            print('district:      ',self.district)
            print('name:          ',self.name)
            print('open:          ',self.open)
            print('price:         ',self.price)
            print('review:        ',self.review)
            print('tag:           ',self.tag)
            print('type:          ',self.type)
            print('='*15,'\n')
        else:
            print({'address': self.address,'database': self.database, 'district': self.district,
                   'name': self.name, 'open': self.open, 'price': self.price,
                   'review': self.review, 'tag': self.tag, 'type': self.type})

