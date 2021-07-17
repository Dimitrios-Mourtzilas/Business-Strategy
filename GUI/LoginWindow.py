
from PyQt5.QtWidgets import *
from PyQt5.QtCore import pyqtSlot

class LoginWindow(QWidget):

    def __init__(self):
        super().__init__()

    def setGUI(self):
        self.setWindowTitle("Title")
        self.user_name_label = QLabel("UserName")
        self.user_password_label = QLabel("Password")
        self.user_name_text = QLineEdit()
        self.user_name_text.setPlaceholderText("Username")
        self.submit_button = QPushButton("Submit")
        self.setLayout(QVBoxLayout())
        self.layout().addWidget(self.user_name_label)
        self.layout().addWidget(self.user_password_label)
        self.layout().addWidget(self.user_name_text)
        self.layout().addWidget(self.submit_button)
        self.submit_button.clicked().connect()
    def runGUI(self):
        self.show()