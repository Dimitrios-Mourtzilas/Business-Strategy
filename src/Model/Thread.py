

from PyQt5.QtCore import QThread

class Thread(QThread):

    _cnt =0 
    def __init__(self):
        super().__init__()
    
    def runThread(self,thread,time):
        while self._cnt < time:
            