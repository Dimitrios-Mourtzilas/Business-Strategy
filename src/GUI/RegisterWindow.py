# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'RegisterWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
from src.Model.Database import *
from src.Model.User import *
from src.GUI.LoginWindow import*


class Ui_RegisterWindow(QtWidgets.QWidget):
    
    def setupUi(self):
        self.setObjectName("RegisterWindow")
        self.setFixedSize(687, 579)
        self.verticalFrame = QtWidgets.QFrame(self)
        self.verticalFrame.setGeometry(QtCore.QRect(40, 60, 611, 411))
        self.verticalFrame.setObjectName("verticalFrame")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.verticalFrame)
        self.verticalLayout.setObjectName("verticalLayout")
        self.horizontalFrame = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        spacerItem = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout.addItem(spacerItem)
        self.first_name_label = QtWidgets.QLabel(self.horizontalFrame)
        self.first_name_label.setObjectName("first_name_label")
        self.horizontalLayout.addWidget(self.first_name_label)
        spacerItem1 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout.addItem(spacerItem1)
        self.first_name_text = QtWidgets.QLineEdit(self.horizontalFrame)
        self.first_name_text.setObjectName("first_name_text")
        self.horizontalLayout.addWidget(self.first_name_text)
        self.verticalLayout.addWidget(self.horizontalFrame)
        self.horizontalFrame_2 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_2.setObjectName("horizontalFrame_2")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.horizontalFrame_2)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        spacerItem2 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_2.addItem(spacerItem2)
        self.last_name_label = QtWidgets.QLabel(self.horizontalFrame_2)
        self.last_name_label.setObjectName("last_name_label")
        self.horizontalLayout_2.addWidget(self.last_name_label)
        spacerItem3 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_2.addItem(spacerItem3)
        self.last_name_text = QtWidgets.QLineEdit(self.horizontalFrame_2)
        self.last_name_text.setObjectName("last_name_text")
        self.horizontalLayout_2.addWidget(self.last_name_text)
        self.verticalLayout.addWidget(self.horizontalFrame_2)
        self.horizontalFrame_3 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_3.setObjectName("horizontalFrame_3")
        self.horizontalLayout_3 = QtWidgets.QHBoxLayout(self.horizontalFrame_3)
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        spacerItem4 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_3.addItem(spacerItem4)
        self.user_name_label = QtWidgets.QLabel(self.horizontalFrame_3)
        self.user_name_label.setObjectName("user_name_label")
        self.horizontalLayout_3.addWidget(self.user_name_label)
        spacerItem5 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_3.addItem(spacerItem5)
        self.user_name_text = QtWidgets.QLineEdit(self.horizontalFrame_3)
        self.user_name_text.setObjectName("user_name_text")
        self.horizontalLayout_3.addWidget(self.user_name_text)
        self.verticalLayout.addWidget(self.horizontalFrame_3)
        self.horizontalFrame_4 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_4.setObjectName("horizontalFrame_4")
        self.horizontalLayout_4 = QtWidgets.QHBoxLayout(self.horizontalFrame_4)
        self.horizontalLayout_4.setObjectName("horizontalLayout_4")
        spacerItem6 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_4.addItem(spacerItem6)
        self.user_password_label = QtWidgets.QLabel(self.horizontalFrame_4)
        self.user_password_label.setObjectName("user_password_label")
        self.horizontalLayout_4.addWidget(self.user_password_label)
        spacerItem7 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_4.addItem(spacerItem7)
        self.user_password_text = QtWidgets.QLineEdit(self.horizontalFrame_4)
        self.user_password_text.setObjectName("user_password_text")
        self.horizontalLayout_4.addWidget(self.user_password_text)
        self.verticalLayout.addWidget(self.horizontalFrame_4)
        self.horizontalFrame_5 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_5.setObjectName("horizontalFrame_5")
        self.horizontalLayout_5 = QtWidgets.QHBoxLayout(self.horizontalFrame_5)
        self.horizontalLayout_5.setObjectName("horizontalLayout_5")
        spacerItem8 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_5.addItem(spacerItem8)
        self.phone_number_label = QtWidgets.QLabel(self.horizontalFrame_5)
        self.phone_number_label.setObjectName("phone_number_label")
        self.horizontalLayout_5.addWidget(self.phone_number_label)
        spacerItem9 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_5.addItem(spacerItem9)
        self.phone_number_text = QtWidgets.QLineEdit(self.horizontalFrame_5)
        self.phone_number_text.setObjectName("phone_number_text")
        self.horizontalLayout_5.addWidget(self.phone_number_text)
        self.verticalLayout.addWidget(self.horizontalFrame_5)
        self.horizontalFrame_6 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_6.setObjectName("horizontalFrame_6")
        self.horizontalLayout_8 = QtWidgets.QHBoxLayout(self.horizontalFrame_6)
        self.horizontalLayout_8.setObjectName("horizontalLayout_8")
        spacerItem10 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_8.addItem(spacerItem10)
        self.email_address_label = QtWidgets.QLabel(self.horizontalFrame_6)
        self.email_address_label.setObjectName("email_address_label")
        self.horizontalLayout_8.addWidget(self.email_address_label)
        spacerItem11 = QtWidgets.QSpacerItem(20, 40, QtWidgets.QSizePolicy.Minimum, QtWidgets.QSizePolicy.Expanding)
        self.horizontalLayout_8.addItem(spacerItem11)
        self.email_address_text = QtWidgets.QLineEdit(self.horizontalFrame_6)
        self.email_address_text.setObjectName("email_address_text")
        self.horizontalLayout_8.addWidget(self.email_address_text)
        self.verticalLayout.addWidget(self.horizontalFrame_6)
        spacerItem12 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem12)
        self.register_button = QtWidgets.QPushButton(self.verticalFrame)
        self.register_button.setObjectName("register_button")
        self.verticalLayout.addWidget(self.register_button)
        self.callableRegister = lambda:self.registerUser()
        self.register_button.clicked.connect(self.callableRegister)
        self.retranslateUi()
        QtCore.QMetaObject.connectSlotsByName(self)
        self.setStyleSheet(


  
        'QWidget{'+
        'background-color: #00ffff;}'+
        ''+
        
        'QLineEdit{'+
        'border:1px groove black;'+
        'border-radius:4px;'+
        '}'+
        ''+


        'QPushButton:hover{'+
        'background-color:black;'+
        'color:white;}'+
        ''+

        'QLabel{'+
        'font-family:verdana;'+
        'font-size:15px;}'+
        ''

        )

    def openWarningDialog(self):
        self.warning_dialog = QtWidgets.QDialog()
        self.btns = QtWidgets.QDialogButtonBox.Ok
        self.warning_dialog.setLayout(QtWidgets.QVBoxLayout())
        self.btn_bx = QtWidgets.QDialogButtonBox(self.btns)
        self.btn_bx.accepted.connect(self.warning_dialog.close)
        self.wanring_label = QtWidgets.QLabel("Password already exists")
        self.warning_dialog.layout().addWidget(self.wanring_label)
        self.warning_dialog.layout().addWidget(self.btn_bx)
        self.warning_dialog.show()
    
    def checkForUserCredentials(self):
        return self.first_name_text.text().__eq__("") or self.last_name_text.text().__eq__("") or self.user_name_text.text().__eq__("") or self.user_password_text.text().__eq__("") or self.phone_number_text.text().__eq__("") or self.email_address_text.text().__eq__("") 

    def registerUser(self):
        if not self.checkForUserCredentials():
            self.duplicate = False
            self.database = Database()
            self.hashed  = md5(self.user_password_text.text().encode())
            self.users = self.database.fetchAllUsers()
            for user in self.users:
                if user[4].__eq__(self.hashed.hexdigest()):
                    self.duplicate = True
                    break
            if  self.duplicate == True:
                self.openDuplicatePasswordWindow()
            else:

                self.user = User()

                self.user.setUserId()
                self.user.setFirstName(self.first_name_text.text())
                self.user.setLastName(self.last_name_text.text())
                self.user.setUserName(self.user_name_text.text())
                self.user.setUserPassword(self.user_password_text.text())
                self.user.setPhoneNumber(self.phone_number_text.text())
                self.user.setUserEmailAddress(self.email_address_text.text())
                self.user.setActiveAccount(False)

                try:
                    self.users = self.database.fetchAllUsers()
                    self.string = md5(self.user.getUserPassword().encode())
                    self.hashed = self.string.hexdigest()
                    self.correct=False
                    for user in self.users:
                        if user[4].__eq__(self.hashed):
                            self.correct = True
                            break
                    if self.correct == True:
                        self.openWarningDialog()
                    else:

                        self.database.saveUser(self.user)
                        self.success_registrationDialog = QtWidgets.QDialog()
                        self.btns = QtWidgets.QDialogButtonBox.Ok
                        self.v_layout = QtWidgets.QHBoxLayout()
                        self.success_registrationDialog.setLayout(self.v_layout)
                        self.success_label = QtWidgets.QLabel("User sucessfully registered")
                        self.button_box=  QtWidgets.QDialogButtonBox(self.btns)
                        self.button_box.accepted.connect(self.success_registrationDialog.accept)
                        self.success_registrationDialog.layout().addWidget(self.success_label)
                        self.success_registrationDialog.layout().addWidget(self.button_box)
                        self.success_registrationDialog.show()
                        self.database.closeConnection()
                        self.close()
                    
                except Exception as e:
                    print(e)
    
        else:

            self.unfilled_cred_window = QtWidgets.QDialog()
            self.unfilled_cred_label = QtWidgets.QLabel("One or multiple fields are unfilled")
            self.btns = QtWidgets.QDialogButtonBox.Cancel
            self.btn_bx = QtWidgets.QDialogButtonBox(self.btns)
            self.btn_bx.rejected.connect(self.unfilled_cred_window.close)
            self.unfilled_cred_window.setLayout(QtWidgets.QVBoxLayout())
            self.unfilled_cred_window.layout().addWidget(self.unfilled_cred_label)
            self.unfilled_cred_window.layout().addWidget(self.btn_bx)
            self.unfilled_cred_window.show()

    
    def openDuplicatePasswordWindow(self):
        
            self.dialog = QtWidgets.QDialog()
            self.dialog_label = QtWidgets.QLabel("Password is already taken. Try a new one")
            self.btns = QtWidgets.QDialogButtonBox.Cancel
            self.btn_bx = QtWidgets.QDialogButtonBox(self.btns)
            self.btn_bx.rejected.connect(self.dialog.close)
            self.dialog.setLayout(QtWidgets.QVBoxLayout())
            self.dialog.layout().addWidget(self.dialog_label)
            self.dialog.layout().addWidget(self.btn_bx)
            self.dialog.show()
        

    def runUi(self):
        self.show()

        
    def retranslateUi(self):
        _translate = QtCore.QCoreApplication.translate
        self.setWindowTitle(_translate("RegisterWindow", "Register Window"))
        self.first_name_label.setText(_translate("RegisterWindow", "First name"))
        self.last_name_label.setText(_translate("RegisterWindow", "Last name"))
        self.user_name_label.setText(_translate("RegisterWindow", "Username"))
        self.user_password_label.setText(_translate("RegisterWindow", "User password"))
        self.phone_number_label.setText(_translate("RegisterWindow", "Phone number"))
        self.email_address_label.setText(_translate("RegisterWindow", "Email address"))
        self.register_button.setText(_translate("RegisterWindow", "Register"))


