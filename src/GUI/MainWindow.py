# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'MainWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
from src.GUI.LoginWindow import *
from src.GUI.SettingsWindow import *
import time
from src.GUI.FileAnalysisWindow import *
from src.GUI.AboutWindow import Ui_About
from src.GUI.DataVisualisation import *
class MainWindow(object):
    def setupUi(self,MainWin):
        MainWin.setObjectName("Form")
        MainWin.resize(914, 591)
        MainWin.setStyleSheet('*{background-color:#6CB4EE}')
        MainWin.setFixedSize(MainWin.width(),MainWin.height())
        self.user_menu = QtWidgets.QFrame(MainWin)
        self.user_menu.setGeometry(QtCore.QRect(50, 210, 160, 281))
        self.user_menu.setStyleSheet("")
        self.user_menu.setObjectName("user_menu")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.user_menu)
        self.verticalLayout.setObjectName("verticalLayout")
        spacerItem = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem)
        self.account_button = QtWidgets.QPushButton(self.user_menu)
        self.account_button.setObjectName("account_button")
        self.verticalLayout.addWidget(self.account_button)
        spacerItem1 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem1)
        self.settings_button = QtWidgets.QPushButton(self.user_menu)
        self.settings_button.setObjectName("settings_button")
        self.verticalLayout.addWidget(self.settings_button)
        spacerItem2 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem2)
        self.log_out_button = QtWidgets.QPushButton(self.user_menu)
        self.log_out_button.setObjectName("log_out_button")
        self.verticalLayout.addWidget(self.log_out_button)
        spacerItem3 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem3)
        self.horizontalFrame = QtWidgets.QFrame(MainWin)
        self.horizontalFrame.setGeometry(QtCore.QRect(220, 100, 491, 81))
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.home_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.home_button.setStyleSheet("QPushButton:hover {\n"
        "background-color:red;\n"
        "}")
        self.home_button.setObjectName("home_button")
        self.horizontalLayout.addWidget(self.home_button)
        spacerItem4 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.horizontalLayout.addItem(spacerItem4)
        spacerItem5 = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.horizontalLayout.addItem(spacerItem5)
        self.file_analysis_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.file_analysis_button.setObjectName("file_analysis_button")
        self.data_vis_button = QtWidgets.QPushButton("Data visualisation")
        self.data_vis_button.setObjectName("data_vis_button")
        self.horizontalLayout.addWidget(self.file_analysis_button)
        self.horizontalLayout.addWidget(self.data_vis_button)
        self.about_button = QtWidgets.QPushButton(self.horizontalFrame)
        self.about_button.setObjectName("about_button")
        self.horizontalLayout.addWidget(self.about_button)
        self.timeEdit = QtWidgets.QTimeEdit(MainWin)
        self.timeEdit.setGeometry(QtCore.QRect(790, 10, 118, 26))
        self.timeEdit.setObjectName("timeEdit")
        self.logo_label = QtWidgets.QLabel(MainWin)
        self.logo_label.setGeometry(QtCore.QRect(240, 190, 521, 291))
        self.logo_label.setText("")
        self.logo_label.setObjectName("logo_label")
        self.logo_icon = QtGui.QPixmap('images/app_logo.png')
        self.logo_label.setPixmap(self.logo_icon)
        self.logo_label.move(350, 200)
        self.user_label = QtWidgets.QLabel(MainWin)
        self.user_label.setGeometry(QtCore.QRect(80, 100, 91, 81))
        self.user_label.setAutoFillBackground(False)
        self.user_label.setStyleSheet("")
        self.user_label.setText("")
        self.user_label.setObjectName("user_label")
        self.user_icon = QtGui.QPixmap('images/user_icon_logo.png')
        self.callableMainWindow = lambda:self.closeMainWindow(MainWin)
        self.log_out_button.clicked.connect(self.callableMainWindow)
        self.retranslateUi(MainWin)
        QtCore.QMetaObject.connectSlotsByName(MainWin)
        
    
        self.settings_button.clicked.connect(self.openSettings)
        self.time_label = QtWidgets.QLabel()
        self.time_label.setText("")
        self.file_analysis_button.clicked.connect(self.openFileAnalysisWindow)
        self.about_button.clicked.connect(self.openAboutWindow)
        self.data_vis_button.clicked.connect(self.openVisualisation)
    
    def openAboutWindow(self):
        self.window = QtWidgets.QMainWindow()
        self.about_window = Ui_About()
        self.about_window.setupUi(self.window)
        self.about_window.runUi(self.window)
        
    def openFileAnalysisWindow(self):
        self.window = QtWidgets.QMainWindow()
        self.file_analysis_win = Ui_FileAnalysis()
        self.file_analysis_win.setupUi(self.window)
        self.file_analysis_win.runUi(self.window)
    
    def openSettings(self,user):
        self.window = QtWidgets.QMainWindow()
        self.settingsWindow = Ui_Settings()
        self.settingsWindow.setupUi(self.window)
        self.settingsWindow.runUi(self.window)
    
    def openVisualisation(self):

        self.dataVis = QtWidgets.QWidget()
        self.ui_data = DataVisualisation()
        self.ui_data.setupUi(self.dataVis)
        self.ui_data.runUi(self.dataVis)

    def closeMainWindow(self,MainWin):
        with open("user_props.json","r") as self.json_file:
            self.data = json.load(self.json_file)
        self.json_file.close()

        with open("user_props.json","w") as self.json_file:
            for i in range(1,len(self.data)):
                if self.data[i]['active_account'] == True:
                    self.data[i]['active_account'] = False

                    json.dump(self.data[i],self.json_file)
                    break
        self.json_file.close()
        MainWin.close()
        
        
    def retranslateUi(self, MainWin):
        _translate = QtCore.QCoreApplication.translate
        MainWin.setWindowTitle(_translate("Form", "Form"))
        self.account_button.setText(_translate("Form", "Account"))
        self.settings_button.setText(_translate("Form", "Settings"))
        self.log_out_button.setText(_translate("Form", "Log out"))
        self.home_button.setText(_translate("Form", "Home"))
        self.file_analysis_button.setText(_translate("Form", "File analysis"))
        self.data_vis_button.setText(_translate("Form", "Data visualization"))
        self.about_button.setText(_translate("Form", "About"))
    
    def runUi(self,MainWin):
        MainWin.show()

if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    window = QtWidgets.QWidget()
    ui_main_win = MainWindow()
    ui_main_win.setupUi(window)
    ui_main_win.runUi(window)
    sys.exit(app.exec_())
