import json
class User:

    _user_id = 0
    _user_name = ""
    _user_password =""
    _phone_number =""
    _email_address= ""
    _first_name =""
    _last_name=""
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

    def getJson(self):
        self.json_file = open("user_props.json","r")
        return self.json_file
    
    
    def setJson(self):
        self.json_file = open("user_props.json","w+")
        if self.json_file is None:
            print("Could not open the file")
            return
        self.data = {'user_id':self.getUserId(),
        'first_name':self.getFirstName(),
        'last_name':self.getLastName(),
        'user_name':self.getUserName(),
        'user_password':self.getUserPassword(),
        'phone_number':self.getUserPhoneNumber(),
        'email_address':self.getUserEmailAddress()
        }
        json.dump(self.data, self.json_file)
        self.json_file.close()
        
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
    
