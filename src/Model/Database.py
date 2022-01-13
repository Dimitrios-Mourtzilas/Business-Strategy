import sqlite3
from src.Model.File import *
from hashlib import md5
import json

class Database:
    _con = None
    _cursor = None
    _pos = 0

    def __init__(self):
        self._con = sqlite3.connect("business_model.db")
        self._cursor = self._con.cursor()

    
    def establishConnection(self,user_name="",user_password=""):
        self.user_name = user_name
        self.user_password = user_password
        self.user_data = self._cursor.execute("select user_name, user_password from user").fetchall()
        for values in self.user_data:
            if self.user_name.__eq__(values[0]) and self.user_password.__eq__(values[1]):
                return True
        return False

 
    def runRandomQuery(self,query,param=None):
        self.query = query
        try:
            if param == None:
                if not self._cursor.execute(self.query):
                    raise Exception('Could not execute query')

            else:
                if not self._cursor.execute(self.query,param):
                    raise Exception('Could not execute query')
            self._cursor.execute("commit;")
        except Exception as e:
            print(e)
        
    
        

  
    
    def saveFile(self,file):
        try:
            self.file = file
            self._cursor.execute("insert into files"+
                "(file_id,file_name,file_size,date_added)"+
                "values(?,?,?,?)",(self.file.getFileId(),self.file.getFileName(),self.file.getFileSize(),self.file.getDateAdded()))
            self._cursor.execute("commit;")
            return True
        except Exception as e:
            print(e)
            return False



    def saveUser(self,user):
        if user is None:
            return False
        self.user = user
        try:
            self.hashed_value  = md5(self.user.getUserPassword().encode())
            self.password_digest = self.hashed_value.hexdigest()
            self._cursor.execute('''
            insert into user
            (user_id,first_name,last_name,user_name,user_password,phone_number,email_address,active_account)
            values(?,?,?,?,?,?,?,?)
            ''',(self.user.getUserId(),self.user.getFirstName(),self.user.getLastName(),self.user.getUserName(),self.password_digest,
            self.user.getUserPhoneNumber(),self.user.getUserEmailAddress(),self.user.getActiveAccount()))
            self._cursor.execute("commit;")
            return True

        except Exception:
            return False

        
    def fetchAllFiles(self):
        return self._cursor.execute("select *from files").fetchall()
    
    def fetchFile(self,file_id):
        return self._cursor.execute("select *from files where file_id = ?",(file_id,))

    
    def fetchUser(self,user_id):
        return self._cursor.execute("select *from user where user_id = ?",(user_id,)).fetchone()
    
    def fetchAllUsers(self):
        return self._cursor.execute("select *from user").fetchall()
    
    def setPos(self,pos):
        self._pos +=pos
    
    def getPos(self):
        return self._pos
    
   

    def closeConnection(self):
        try:
             self._cursor.close()
             self._con.close()
        
        except Exception as e:
            print(e)