# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'LoginWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.
import sys

from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtWidgets import QLabel
from MainWindow import Ui_Form
from src.Model.Database import *
from time import sleep
from src.Model.User import *
from sqlite3 import Error
from PyQt5.QtWidgets import QMainWindow
<<<<<<< HEAD

=======
>>>>>>> f2c5153ea0a41e0753cae6e547105c0cdd8f1f55

class LoginWindow(QMainWindow):

    _count = 0
    _LoginWindow = None

<<<<<<< HEAD
    def __init__(self, parent=None):
        super(LoginWindow, self).__init__(parent)

=======
>>>>>>> f2c5153ea0a41e0753cae6e547105c0cdd8f1f55
    def setupUi(self):
        self.setObjectName("MainWindow")
        self.resize(800, 600)
        self.centralwidget = QtWidgets.QWidget(self)
        self.centralwidget.setObjectName("centralwidget")
        self.verticalLayoutWidget = QtWidgets.QWidget(self.centralwidget)
        self.verticalLayoutWidget.setGeometry(QtCore.QRect(250, 90, 261, 211))
        self.verticalLayoutWidget.setObjectName("verticalLayoutWidget")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.verticalLayoutWidget)
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)
        self.verticalLayout.setObjectName("verticalLayout")
        self.label_2 = QtWidgets.QLabel(self.verticalLayoutWidget)
        self.label_2.setObjectName("label_2")
        self.verticalLayout.addWidget(self.label_2)
        self.lineEdit = QtWidgets.QLineEdit(self.verticalLayoutWidget)
        self.lineEdit.setMaxLength(255)
        self.lineEdit.setObjectName("lineEdit")
        self.verticalLayout.addWidget(self.lineEdit)
        spacerItem = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem)
        self.label = QtWidgets.QLabel(self.verticalLayoutWidget)
        self.label.setObjectName("label")
        self.verticalLayout.addWidget(self.label)
        self.lineEdit_2 = QtWidgets.QLineEdit(self.verticalLayoutWidget)
        self.lineEdit_2.setMaxLength(255)
        self.lineEdit_2.setObjectName("lineEdit_2")
        self.verticalLayout.addWidget(self.lineEdit_2)
        spacerItem1 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem1)
        self.pushButton = QtWidgets.QPushButton(self.verticalLayoutWidget)
        self.pushButton.setObjectName("pushButton")
        self.pushButton.setText("Login Window")
        self.pushButton.clicked.connect(self.connectToDB)
        self.verticalLayout.addWidget(self.pushButton)
        self.setCentralWidget(self.centralwidget)
        self.menubar = QtWidgets.QMenuBar(self)
        self.menubar.setGeometry(QtCore.QRect(0, 0, 800, 22))
        self.menubar.setObjectName("menubar")
        self.setMenuBar(self.menubar)
        self.statusbar = QtWidgets.QStatusBar(self)
        self.statusbar.setObjectName("statusbar")
        self.setStatusBar(self.statusbar)
        self.retranslateUi()
        QtCore.QMetaObject.connectSlotsByName(self)

    def retranslateUi(self):
        _translate = QtCore.QCoreApplication.translate
        self.setWindowTitle(_translate("MainWindow", "MainWindow"))
        self.label_2.setText(_translate("MainWindow", "user name"))
        self.label.setText(_translate("MainWindow", "user password"))
        self.pushButton.setText(_translate("MainWindow", "Log in"))

  

    def connectToDB(self):
        try:
            self.user = User()
            self.user.setUserName(self.lineEdit.text())
            self.user.setUserPassword(self.lineEdit_2.text())
            self.database = Database()
            if not self.database.establishConnection(self.user):
                raise Error

            self.window = QMainWindow()
            self.mainWindow = Ui_Form()
            self.mainWindow.setupUi(self.window)
            self.mainWindow.runUi(self.window)
            self.close()


        except Error:
            if self.clicked(self._count):
                self._count+=1
                self.error_label = QLabel("Bad connection due to invalid credentials")
                self.error_label.setStyleSheet("color:red")
                self.verticalLayout.layout().addWidget(self.error_label)
                  
  

    def clicked(self, count):
        return count == 0
    def runUi(self):
        self.show()

