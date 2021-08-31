

from PyQt5.QtWidgets import *

import src.GUI.FIleDialog as File
class MainWindow(QMainWindow):

    def __init__(self):
        super().__init__()
    
    def setupUi(self):
        self.setWindowTitle("Main window")
        self.setGeometry(200,100,100,200)
        self.label = QLabel("Label")
        self.button = QPushButton("Open dialog")
        self.button.clicked.connect(self.openDialog)
        self.layout().addWidget(self.button)
        self.layout().addWidget(self.label)
            
    
    def runUi(self):
        self.show()

    def openDialog(self):
        self.dialog= File()
        self.dialog.show()