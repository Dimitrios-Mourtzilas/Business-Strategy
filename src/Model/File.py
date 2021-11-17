

class File:

    _file_name=""
    _file_size=0
    _file_path=""
    _date_added=""
    def __init__(self):
        pass
    
    def setFileName(self,fileName=""):
        self._file_name = fileName
    
    def setFileSize(self,fileSize):
        self._file_size = fileSize
    
    def setFilePath(self,filePath=""):
        self._file_path = filePath
    
    def setDateAdded(self,dateAdded=""):
        self._date_added = dateAdded
    
    def getFileName(self):
        return self._file_name
    
    def getFileSize(self):
        return self._file_size
    
    def getFilePath(self):
        return self._file_path
    
    def getDateAdded(self):
        return self._date_added
    
    def getJson(self):
        return dict({
            'file_name':self.getFileName(),
            'file_size':self.getFileSize(),
            'file_path':self.getFilePath(),
            'date_added':self.getDateAdded()
        })
        