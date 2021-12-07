# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'AboutWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets


class Ui_About(QtWidgets.QWidget):

    def setupUi(self):
        
        self.setObjectName("AboutWindow")
        self.setFixedSize(400, 300)
        self.verticalFrame = QtWidgets.QFrame(self)
        self.verticalFrame.setGeometry(QtCore.QRect(10, 10, 381, 281))
        self.verticalFrame.setObjectName("verticalFrame")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.verticalFrame)
        self.verticalLayout.setObjectName("verticalLayout")
        self.horizontalFrame = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.frame = QtWidgets.QFrame(self.horizontalFrame)
        self.frame.setObjectName("frame")
        self.horizontalLayout_5 = QtWidgets.QHBoxLayout(self.frame)
        self.horizontalLayout_5.setObjectName("horizontalLayout_5")
        self.about_label = QtWidgets.QLabel(self.frame)
        font = QtGui.QFont()
        font.setPointSize(18)
        self.about_label.setFont(font)
        self.about_label.setObjectName("about_label")
        self.horizontalLayout_5.addWidget(self.about_label)
        self.smaller_icon = QtWidgets.QLabel(self.frame)
        self.smaller_icon.setText("")
        self.smaller_icon.setObjectName("smaller_icon")
        self.horizontalLayout_5.addWidget(self.smaller_icon)
        self.horizontalLayout.addWidget(self.frame)
        self.verticalLayout.addWidget(self.horizontalFrame)
        self.horizontalFrame_2 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_2.setObjectName("horizontalFrame_2")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.horizontalFrame_2)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.version_label = QtWidgets.QLabel(self.horizontalFrame_2)
        self.version_label.setObjectName("version_label")
        self.horizontalLayout_2.addWidget(self.version_label)
        self.version_text = QtWidgets.QLabel(self.horizontalFrame_2)
        self.version_text.setText("")
        self.version_text.setObjectName("version_text")
        self.horizontalLayout_2.addWidget(self.version_text)
        self.verticalLayout.addWidget(self.horizontalFrame_2)
        self.horizontalFrame_3 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_3.setObjectName("horizontalFrame_3")
        self.horizontalLayout_3 = QtWidgets.QHBoxLayout(self.horizontalFrame_3)
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        self.creator_label = QtWidgets.QLabel(self.horizontalFrame_3)
        self.creator_label.setObjectName("creator_label")
        self.horizontalLayout_3.addWidget(self.creator_label)
        self.creator_text = QtWidgets.QLabel(self.horizontalFrame_3)
        self.creator_text.setText("")
        self.creator_text.setObjectName("creator_text")
        self.horizontalLayout_3.addWidget(self.creator_text)
        self.verticalLayout.addWidget(self.horizontalFrame_3)
        self.horizontalFrame_4 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_4.setObjectName("horizontalFrame_4")
        self.horizontalLayout_4 = QtWidgets.QHBoxLayout(self.horizontalFrame_4)
        self.horizontalLayout_4.setObjectName("horizontalLayout_4")
        self.year_created = QtWidgets.QLabel(self.horizontalFrame_4)
        self.year_created.setObjectName("year_created")
        self.horizontalLayout_4.addWidget(self.year_created)
        self.year_created_text = QtWidgets.QLabel(self.horizontalFrame_4)
        self.year_created_text.setText("")
        self.year_created_text.setObjectName("year_created_text")
        self.horizontalLayout_4.addWidget(self.year_created_text)
        self.verticalLayout.addWidget(self.horizontalFrame_4)
        self.about_window_icon = QtGui.QPixmap('images/app_smaller_logo.png')
        self.smaller_icon.setPixmap(self.about_window_icon)
        self.version_text.setText('1.0')
        self.creator_text.setText('Dimitrios Mourtzilas')
        self.year_created_text.setText('2021')
        self.smaller_icon_logo = QtGui.QPixmap('images/app_smaller_logo.png')
        self.smaller_icon.setPixmap(self.smaller_icon_logo)
        self.retranslateUi()
        QtCore.QMetaObject.connectSlotsByName(self)
        self.setStyleSheet(
        
        'QWidget{'+
        'background-color: #8a2be2;}'+
        ''+

        'QLabel{'+
        'color:#d8bfd8;'+
        'font-family:verdana;'+
        'font-size:15px;}'+
        ''
        
        )

    def retranslateUi(self):
        _translate = QtCore.QCoreApplication.translate
        self.setWindowTitle(_translate("AboutWindow", "About Window"))
        self.about_label.setText(_translate("AboutWindow", "About"))
        self.version_label.setText(_translate("AboutWindow", "Version"))
        self.creator_label.setText(_translate("AboutWindow", "Creator"))
        self.year_created.setText(_translate("AboutWindow", "Year created"))
    
    def runUi(self):
        self.show()


