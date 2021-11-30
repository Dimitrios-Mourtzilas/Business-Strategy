

import random,json,string
from hashlib import md5
class File:

    
    _file_id = ""
    _file_name=""
    _file_size=0
    _date_added=""


    def __init__(self):
        pass
    
    def setFileId(self):
        self.nonce = ""
        for i in range(0,40):
            self.nonce+= random.choice(string.ascii_uppercase + string.digits)

        self.hashed = md5(self.nonce.encode()) 
        self._file_id = self.hashed.hexdigest()

    def setFileName(self,fileName=""):
        self._file_name = fileName
    
    def setFileSize(self,fileSize):
        self._file_size = fileSize
    
    def setDateAdded(self,dateAdded=""):
        self._date_added = dateAdded
    
    def getFileName(self):
        return self._file_name
    
    def getFileSize(self):
        return self._file_size
    

    def getDateAdded(self):
        return self._date_added
    
    def getFileId(self):
        return self._file_id
    
