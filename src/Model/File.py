

import random,json 

class File:

    _file_id = 0
    _file_name=""
    _file_size=0
    _date_added=""
    def __init__(self):
        pass
    
    def setFileId(self):
        self._file_id = random.random()

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
    
    def setJson(self):
        with open("file_props.json","r") as self.json_file:
            self.file_data = json.load(self.json_file)
        self.json_file.close()
        
        self.data = {
            'file_id':self.getFileId(),
            "file_name":self.getFileName(),
            "file_size":self.getFileSize(),
            "date_added":self.getDateAdded()
        }
        self.file_data.append(self.data)
        
        with open("file_props.json","w") as self.json_file:
            json.dump(self.file_data,self.json_file)
        self.json_file.close()
    
    def getJson(self):
        self.json_file = open("file_props.json","r")
        return self.json_file