import string ,random
from hashlib import md5

class User:
    
    _user_id = 0
    _user_name = ""
    _user_password =""
    _phone_number =""
    _email_address= ""
    _first_name =""
    _last_name=""
    _active_account = False

    def __init__(self):
        pass


    def setFirstName(self,first_name=""):
        self._first_name = first_name
    
    def setLastName(self,last_name=""):
        self._last_name = last_name
    

    def setUserName(self,user_name=""):
        self._user_name = user_name

    def setUserPassword(self,user_password=""):
        self._user_password = user_password
    
    def setPhoneNumber(self,phone_number=""):
        self._phone_number = phone_number
    
    def setUserEmailAddress(self,email_address=""):
        self._email_address = email_address

    def setActiveAccount(self,account_state=False):
        self._active_account = account_state
    
  
 
        
    
    def setUserId(self):
        self.value = ""
        for i in range(0,50):
            self.value += random.choice(string.ascii_lowercase + string.ascii_uppercase)
            self.hashed = md5(self.value.encode())
        self._user_id = self.hashed.hexdigest()

    def getUserId(self):
        return self._user_id
    
    def getFirstName(self):
        return self._first_name
    
    def getLastName(self):
        return self._last_name
    
    def getUserName(self):
        return self._user_name
    def getUserPassword(self):
        return self._user_password
    
    def getUserPhoneNumber(self):
        return self._phone_number
    
    def getUserEmailAddress(self):
        return self._email_address

    def getActiveAccount(self):
        return self._active_account
        
    
