# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'MainWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
from images import *

class Ui_Form(object):
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(981, 591)
        self.horizontalFrame = QtWidgets.QFrame(Form)
        self.horizontalFrame.setGeometry(QtCore.QRect(80, 30, 811, 80))
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.label = QtWidgets.QLabel(self.horizontalFrame)
        self.label.setStyleSheet("\n"
"image: url(:/image-header/Downloads/icons8-user-30.png);\n"
"\n"
"QLabel hover user_menu{\n"
"background-color:red\n"
"\n"
"\n"
"}")
        self.label.setText("")
        self.label.setObjectName("label")
        self.horizontalLayout.addWidget(self.label)
        self.pushButton = QtWidgets.QPushButton(self.horizontalFrame)
        self.pushButton.setObjectName("pushButton")
        self.horizontalLayout.addWidget(self.pushButton)
        self.pushButton_2 = QtWidgets.QPushButton(self.horizontalFrame)
        self.pushButton_2.setObjectName("pushButton_2")
        self.horizontalLayout.addWidget(self.pushButton_2)
        self.pushButton_3 = QtWidgets.QPushButton(self.horizontalFrame)
        self.pushButton_3.setObjectName("pushButton_3")
        self.horizontalLayout.addWidget(self.pushButton_3)
        self.user_menu = QtWidgets.QFrame(Form)
        self.user_menu.setGeometry(QtCore.QRect(100, 110, 160, 291))
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
        self.log_out_button.clicked.connect(self.closeMainWindow)

        self.retranslateUi(Form)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def closeMainWindow(self,Form):
        Form.close()


    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.pushButton.setText(_translate("Form", "PushButton"))
        self.pushButton_2.setText(_translate("Form", "PushButton"))
        self.pushButton_3.setText(_translate("Form", "PushButton"))
        self.account_button.setText(_translate("Form", "Account"))
        self.settings_button.setText(_translate("Form", "Settings"))
        self.log_out_button.setText(_translate("Form", "Log out"))



if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    Form = QtWidgets.QWidget()
    ui = Ui_Form()
    ui.setupUi(Form)
    Form.show()
    sys.exit(app.exec_())
