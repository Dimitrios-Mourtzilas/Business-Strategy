from PyQt5.QtWidgets import QDialog
from PyQt5.QtWidgets import *
class Dialog(QDialog):
    
    def __init__(self):
        super().__init__()
    
    def setTitle(self,title=""):
        self.setWindowTitle(self.title)
    
    def setupUi(self,labelText="",windowTitle=""):
        self.horizontalLayout = QHBoxLayout(self)
        self.dialogButtons = QDialogButtonBox.Ok | QDialogButtonBox.Cancel
        self.buttonBox = QDialogButtonBox(self.dialogButtons)
        self.buttonBox.accepted.connect(self.accept)
        self.buttonBox.rejected.connect(self.reject)
        self.errorLabel = QLabel()
        self.errorLabel.setText(labelText)
        self.errorLabel.setStyleSheet('color:red')
        self.layout().addWidget(self.buttonBox)
        self.layout().addWidget(self.errorLabel)
    
    def runUi(self):
        self.show()