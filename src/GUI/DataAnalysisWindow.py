# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'DataAnalysisWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
from src.GUI.Dialog import *

class DataAnalysisForm(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(789, 536)
        self.frame = QtWidgets.QFrame(Form)
        self.frame.setGeometry(QtCore.QRect(10, 10, 761, 511))
        self.frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame.setObjectName("frame")
        self.progressBar = QtWidgets.QProgressBar(self.frame)
        self.progressBar.setGeometry(QtCore.QRect(230, 450, 321, 31))
        self.progressBar.setProperty("value", 24)
        self.progressBar.setObjectName("progressBar")
        self.horizontalScrollBar = QtWidgets.QScrollBar(self.frame)
        self.horizontalScrollBar.setGeometry(QtCore.QRect(239, 370, 301, 20))
        self.horizontalScrollBar.setOrientation(QtCore.Qt.Horizontal)
        self.horizontalScrollBar.setObjectName("horizontalScrollBar")
        self.start_analysis_button = QtWidgets.QPushButton(self.frame)
        self.start_analysis_button.setGeometry(QtCore.QRect(310, 60, 151, 25))
        self.start_analysis_button.setObjectName("pushButton")
        self.verticalScrollBar = QtWidgets.QScrollBar(self.frame)
        self.verticalScrollBar.setGeometry(QtCore.QRect(550, 90, 16, 271))
        self.verticalScrollBar.setOrientation(QtCore.Qt.Vertical)
        self.verticalScrollBar.setObjectName("verticalScrollBar")
        self.tableWidget = QtWidgets.QTableWidget(self.frame)
        self.tableWidget.setGeometry(QtCore.QRect(240, 90, 311, 281))
        self.tableWidget.setObjectName("tableWidget")
        self.tableWidget.setColumnCount(0)
        self.tableWidget.setRowCount(0)
        self.retranslateUi(Form)
        QtCore.QMetaObject.connectSlotsByName(Form)
        self.start_analysis_button.clicked.connect(self.checkForNone)
    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.start_analysis_button.setText(_translate("Form", "Start analysis"))
    
    def runUi(self,Form):
        Form.show()
    
    def checkForNone(self):
        if self.tableWidget.columnCount() == 0:
            self.dialog = Dialog()
            self.dialog.setupUi(labelText="File not detected. Please import a file and try again",windowTitle="File detection error")
            self.dialog.runUi()
