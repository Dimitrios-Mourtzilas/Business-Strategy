# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'MainWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtGui import QPixmap


class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(981, 591)
        self.horizontalFrame = QtWidgets.QFrame(Form)
        self.horizontalFrame.setGeometry(QtCore.QRect(80, 30, 811, 80))
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.user_label = QtWidgets.QLabel(self.horizontalFrame)
        self.user_label.setText("")
        self.user_icon = QPixmap('images/favicon-user.jpg')
        self.user_label.setPixmap(self.user_icon)
        self.user_label.setObjectName("user_label")
        self.horizontalLayout.addWidget(self.user_label)
        self.horizontalLayout.addWidget(self.user_icon)
        self.home_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.home_button.setObjectName("home_button")
        self.horizontalLayout.addWidget(self.home_button)
        self.file_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.file_button.setObjectName("file_button")
        self.horizontalLayout.addWidget(self.file_button)
        self.data_analysis_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.data_analysis_button.setObjectName("data_analysis_button")
        self.horizontalLayout.addWidget(self.data_analysis_button)
        self.data_vis_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.data_vis_button.setObjectName("data_vis_button")
        self.horizontalLayout.addWidget(self.data_vis_button)
        self.about_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.about_button.setObjectName("about_button")
        self.horizontalLayout.addWidget(self.about_button)
        self.user_menu = QtWidgets.QFrame(Form)
        self.user_menu.setGeometry(QtCore.QRect(80, 110, 160, 361))
        self.user_menu.setStyleSheet("QFrame {\n"
"opacity:0px;\n"
"}\n"
"\n"
"")

  
        
        self.user_menu.setObjectName("user_menu")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.user_menu)
        self.verticalLayout.setObjectName("verticalLayout")
        self.account_button = QtWidgets.QPushButton(self.user_menu)
        self.account_button.setObjectName("account_button")
        self.verticalLayout.addWidget(self.account_button)
        self.settings_button = QtWidgets.QPushButton(self.user_menu)
        self.settings_button.setObjectName("settings_button")
        self.verticalLayout.addWidget(self.settings_button)
        self.log_out_button = QtWidgets.QPushButton(self.user_menu)
        self.log_out_button.setObjectName("log_out_button")
        self.verticalLayout.addWidget(self.log_out_button)
        self.widget = QtWidgets.QWidget(Form)
        self.widget.setGeometry(QtCore.QRect(240, 110, 651, 361))
        self.widget.setObjectName("widget")


        self.home_frame = QtWidgets.QFrame(self.widget)
        self.home_frame.setGeometry(QtCore.QRect(0, 0, 651, 361))
        self.home_frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.home_frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.home_frame.setObjectName("home_frame")
        self.home_button.clicked.connect(self.openFrame(self.home_frame))


        self.files_frame = QtWidgets.QFrame(self.home_frame)
        self.files_frame.setGeometry(QtCore.QRect(0, 0, 651, 361))
        self.files_frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.files_frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.files_frame.setObjectName("files_frame")



        self.horizontalLayoutWidget = QtWidgets.QWidget(self.files_frame)
        self.horizontalLayoutWidget.setGeometry(QtCore.QRect(150, 310, 371, 41))
        self.horizontalLayoutWidget.setObjectName("horizontalLayoutWidget")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.horizontalLayoutWidget)
        self.horizontalLayout_2.setContentsMargins(0, 0, 0, 0)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.lineEdit = QtWidgets.QLineEdit(self.horizontalLayoutWidget)
        self.lineEdit.setObjectName("lineEdit")
        self.horizontalLayout_2.addWidget(self.lineEdit)
        self.pushButton = QtWidgets.QPushButton(self.horizontalLayoutWidget)
        self.pushButton.setObjectName("pushButton")
        self.horizontalLayout_2.addWidget(self.pushButton)
        if self.home_button.clicked:
            self.gotoHomeFrame()

        elif self.file_button.clicked:
            self.gotoFileFrame()
        

        self.retranslateUi(Form)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.home_button.setText(_translate("Form", "Home"))
        self.file_button.setText(_translate("Form", "FIles"))
        self.data_analysis_button.setText(_translate("Form", "Data analysis"))
        self.data_vis_button.setText(_translate("Form", "Data visualization"))
        self.about_button.setText(_translate("Form", "About"))
        self.account_button.setText(_translate("Form", "Account"))
        self.settings_button.setText(_translate("Form", "Settings"))
        self.log_out_button.setText(_translate("Form", "Log out"))
        self.pushButton.setText(_translate("Form", "..."))
    
    def openFrame(self,parentFrame=None):
        parentFrame.show()


    def gotoFileFrame(self):
        self.files_frame.show()
    
    def gotoHomeFrame(self):
        self.home_frame.show()
    
    def runUi(self,Form):
        Form.show()

# if __name__ == "__main__":
#     import sys
#     app = QtWidgets.QApplication(sys.argv)
#     Form = QtWidgets.QWidget()
#     ui = Ui_Form()
#     ui.setupUi(Form)
#     Form.show()
#     sys.exit(app.exec_())
