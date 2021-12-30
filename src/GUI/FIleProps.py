# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'FIleProps.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
import json,os

class Ui_FileProps(QtWidgets.QWidget):

    def setupUi(self):
        self.setObjectName("FilePropsWindow")
        self.resize(597, 433)
        self.horizontalFrame = QtWidgets.QFrame(self)
        self.horizontalFrame.setGeometry(QtCore.QRect(10, 90, 571, 80))
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.file_prop_name_label = QtWidgets.QLabel(self.horizontalFrame)
        self.file_prop_name_label.setObjectName("file_prop_name_label")
        self.horizontalLayout.addWidget(self.file_prop_name_label)
        self.file_prop_name_text = QtWidgets.QLabel(self.horizontalFrame)
        self.file_prop_name_text.setText("")
        self.file_prop_name_text.setObjectName("file_prop_name_text")
        self.horizontalLayout.addWidget(self.file_prop_name_text)
        self.horizontalFrame_2 = QtWidgets.QFrame(self)
        self.horizontalFrame_2.setGeometry(QtCore.QRect(10, 210, 571, 80))
        self.horizontalFrame_2.setObjectName("horizontalFrame_2")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.horizontalFrame_2)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.file_prop_size_label = QtWidgets.QLabel(self.horizontalFrame_2)
        self.file_prop_size_label.setObjectName("file_prop_size_label")
        self.horizontalLayout_2.addWidget(self.file_prop_size_label)
        self.file_prop_size_text = QtWidgets.QLabel(self.horizontalFrame_2)
        self.file_prop_size_text.setText("")
        self.file_prop_size_text.setObjectName("file_prop_size_text")
        self.horizontalLayout_2.addWidget(self.file_prop_size_text)
        self.horizontalFrame_3 = QtWidgets.QFrame(self)
        self.horizontalFrame_3.setGeometry(QtCore.QRect(10, 310, 571, 80))
        self.horizontalFrame_3.setObjectName("horizontalFrame_3")
        self.horizontalLayout_3 = QtWidgets.QHBoxLayout(self.horizontalFrame_3)
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        self.file_prop_date_added_label = QtWidgets.QLabel(self.horizontalFrame_3)
        self.file_prop_date_added_label.setObjectName("file_prop_date_added_label")
        self.horizontalLayout_3.addWidget(self.file_prop_date_added_label)
        self.file_prop_date_added_text = QtWidgets.QLabel(self.horizontalFrame_3)
        self.file_prop_date_added_text.setText("")
        self.file_prop_date_added_text.setObjectName("file_prop_date_added_text")
        self.horizontalLayout_3.addWidget(self.file_prop_date_added_text)
        self.line = QtWidgets.QFrame()
        self.line.setGeometry(QtCore.QRect(160, 60, 281, 20))
        self.line.setFrameShape(QtWidgets.QFrame.HLine)
        self.line.setFrameShadow(QtWidgets.QFrame.Sunken)
        self.line.setObjectName("line")
        self.file_details_label = QtWidgets.QLabel()
        self.file_details_label.setGeometry(QtCore.QRect(230, 30, 118, 28))
        font = QtGui.QFont()
        font.setPointSize(18)
        self.file_details_label.setFont(font)
        self.file_details_label.setObjectName("file_details_label")

        self.retranslateUi()
        QtCore.QMetaObject.connectSlotsByName(self)
        self.setStyleSheet(
        
        'QWidget{'+
        'background-color: #8a2be2;}'+
        ''+
    

        'QLabel{'+
        'color: #d8bfd8;'+
        'font-family:verdana;'+
        'font-size:15px;}'+
        ''
        
        )

    def setFileProps(self,file):
        self.file = file
        self.file_prop_name_text.setText(os.path.basename(self.file.getFileName()))
        self.file_prop_size_text.setText(str(self.file.getFileSize()))
        self.file_prop_date_added_text.setText(self.file.getDateAdded())


    def retranslateUi(self):
        _translate = QtCore.QCoreApplication.translate
        self.setWindowTitle(_translate("FilePropsWindow", "File Properties Window"))
        self.file_prop_name_label.setText(_translate("FilePropsWindow", "File name:"))
        self.file_prop_size_label.setText(_translate("FilePropsWindow", "File size:"))
        self.file_prop_date_added_label.setText(_translate("FilePropsWindow", "Date added:"))
        self.file_details_label.setText(_translate("FilePropsWindow", "File details"))
    
    def runUi(self):
        self.show()

