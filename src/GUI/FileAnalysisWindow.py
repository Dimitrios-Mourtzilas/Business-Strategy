# -*- coding: utf-8 -*-

# Form implementation generated from reading ui file 'FileAnalysisWindow.ui'
#
# Created by: PyQt5 UI code generator 5.15.4
#
# WARNING: Any manual changes made to this file will be lost when pyuic5 is
# run again.  Do not edit this file unless you know what you are doing.


from PyQt5 import QtCore, QtGui, QtWidgets
import os
import time
from datetime import date
from src.GUI.FIleProps import *
class Ui_Form(object):

    _flag = 0
    def setupUi(self, Form):
        Form.setObjectName("Form")
        Form.resize(789, 536)
        self.frame = QtWidgets.QFrame(Form)
        self.frame.setGeometry(QtCore.QRect(10, 10, 761, 511))
        self.frame.setFrameShape(QtWidgets.QFrame.StyledPanel)
        self.frame.setFrameShadow(QtWidgets.QFrame.Raised)
        self.frame.setObjectName("frame")
        self.verticalFrame = QtWidgets.QFrame(self.frame)
        self.verticalFrame.setGeometry(QtCore.QRect(135, 80, 501, 251))
        self.verticalFrame.setObjectName("verticalFrame")
        self.verticalLayout = QtWidgets.QVBoxLayout(self.verticalFrame)
        self.verticalLayout.setObjectName("verticalLayout")
        self.horizontalFrame = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame.setObjectName("horizontalFrame")
        self.horizontalLayout = QtWidgets.QHBoxLayout(self.horizontalFrame)
        self.horizontalLayout.setObjectName("horizontalLayout")
        self.file_name_label = QtWidgets.QLabel(self.horizontalFrame)
        self.file_name_label.setObjectName("file_name_label")
        self.horizontalLayout.addWidget(self.file_name_label)
        self.file_size_label = QtWidgets.QLabel(self.horizontalFrame)
        self.file_size_label.setObjectName("file_size_label")
        self.horizontalLayout.addWidget(self.file_size_label)
        self.date_added_label = QtWidgets.QLabel(self.horizontalFrame)
        self.date_added_label.setObjectName("date_added_label")
        self.horizontalLayout.addWidget(self.date_added_label)
        self.verticalLayout.addWidget(self.horizontalFrame)
        self.horizontalFrame_2 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame_2.setObjectName("horizontalFrame_2")
        self.horizontalLayout_2 = QtWidgets.QHBoxLayout(self.horizontalFrame_2)
        self.horizontalLayout_2.setObjectName("horizontalLayout_2")
        self.file_name_text = QtWidgets.QLineEdit(self.horizontalFrame_2)
        self.file_name_text.setObjectName("file_name_text")
        self.horizontalLayout_2.addWidget(self.file_name_text)
        self.file_size_text = QtWidgets.QLineEdit(self.horizontalFrame_2)
        self.file_size_text.setObjectName("file_size_text")
        self.horizontalLayout_2.addWidget(self.file_size_text)
        self.date_added_text = QtWidgets.QLineEdit(self.horizontalFrame_2)
        self.date_added_text.setObjectName("date_added_text")
        self.horizontalLayout_2.addWidget(self.date_added_text)
        self.verticalLayout.addWidget(self.horizontalFrame_2)
        self.horizontalFrame1 = QtWidgets.QFrame(self.verticalFrame)
        self.horizontalFrame1.setObjectName("horizontalFrame1")
        self.horizontalLayout_3 = QtWidgets.QHBoxLayout(self.horizontalFrame1)
        self.horizontalLayout_3.setObjectName("horizontalLayout_3")
        self.open_file_button = QtWidgets.QPushButton(self.horizontalFrame1)
        self.open_file_button.setObjectName("open_file_button")
        self.horizontalLayout_3.addWidget(self.open_file_button)
        self.cancel_button = QtWidgets.QPushButton(self.horizontalFrame1)
        self.cancel_button.setObjectName("cancel_button")
        self.horizontalLayout_3.addWidget(self.cancel_button)
        self.verticalLayout.addWidget(self.horizontalFrame1)
        self.start_analysis_button = QtWidgets.QPushButton(self.verticalFrame)
        self.start_analysis_button.setObjectName("start_analysis_button")
        self.verticalLayout.addWidget(self.start_analysis_button)
        spacerItem = QtWidgets.QSpacerItem(40, 20, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Minimum)
        self.verticalLayout.addItem(spacerItem)
        self.progressBar = QtWidgets.QProgressBar(self.verticalFrame)
        self.progressBar.setProperty("value", 24)
        self.progressBar.setObjectName("progressBar")
        self.verticalLayout.addWidget(self.progressBar)
        self.progressBar.setVisible(False)
        self.file_name_text.setEnabled(False)
        self.file_size_text.setEnabled(False)
        self.date_added_text.setEnabled(False)
        self.import_file_button = QtWidgets.QPushButton("Import file")
        self.horizontalLayout_3.layout().addWidget(self.import_file_button)
        self.import_file_button.clicked.connect(self.buildInfoDialog)
        self.open_file_button.clicked.connect(self.openFileDialog)
        self.cancel_button.clicked.connect(self.cancelFile)
        self.start_analysis_button.clicked.connect(self.fileAnalysis)
        

        self.retranslateUi(Form)
        QtCore.QMetaObject.connectSlotsByName(Form)

    def buildInfoDialog(self):
        self._flag = 1
        if not self.checkFileProps():
            self.openWrongFileFormatWindow()
        elif not self.checkForEmptyFile():
            self.info_window = QtWidgets.QDialog()
            self.info_label = QtWidgets.QLabel('Your file was imported')
            self.standard_btns = QtWidgets.QDialogButtonBox.Ok
            self.info_window.setLayout(QtWidgets.QVBoxLayout())
            self.btn_box = QtWidgets.QDialogButtonBox(self.standard_btns)
            self.btn_box.accepted.connect(self.importFileProps)
            self.info_window.layout().addWidget(self.info_label)
            self.info_window.layout().addWidget(self.btn_box)
            self.info_window.show()
        else:
            self.noFileSelectedWindow()


    def importFileProps(self):
        if not self.checkForEmptyFile():
            self.info_window.hide()
            self.info_window.layout().addWidget(self.info_label)

        else:
            self.noFileSelectedWindow()

        self.win = QtWidgets.QWidget()
        self.filePropsWin = Ui_FileProps()
        self.filePropsWin.setupUi(self.win)
        self.filePropsWin.runUi(self.win)

    def checkForEmptyFile(self):
        return self.file_name_text.text().__eq__("") or self.file_name_text.text().__eq__("") or self.date_added_text.text().__eq__("")


    def checkFileProps(self):
        return self.file_name_text.text().__contains__('.xlsx') or self.file_name_text.text().__eq__("")
       
    
    def openWrongFileFormatWindow(self):
        if self.checkForEmptyFile():
            self.noFileSelectedWindow()
        else:
            self.error_file_dialog = QtWidgets.QDialog()
            self.error_file_label = QtWidgets.QLabel('The format of selected file is not supported by the system')
            self.standard_btns = QtWidgets.QDialogButtonBox.Ok | QtWidgets.QDialogButtonBox.Cancel
            self.button_box = QtWidgets.QDialogButtonBox(self.standard_btns)
            self.verti_layout = QtWidgets.QVBoxLayout()
            self.error_file_dialog.setLayout(self.verti_layout)
            self.error_file_dialog.layout().addWidget(self.error_file_label)
            self.button_box.accepted.connect(self.error_file_dialog.accept)
            self.error_file_dialog.layout().addWidget(self.button_box)
            self.error_file_dialog.show()
            
    


    def openFileDialog(self):
        self.fileDialog = QtWidgets.QFileDialog()
        self.file_name = self.fileDialog.getOpenFileName(None,'Open file')
        self.file_name_text.setText(self.file_name[0])
        self.file_size_text.setText(str(os.path.getsize(self.file_name[0]))+"bytes")
        self.date_added_text.setText(str(date.today()))
    

    def cancelFile(self):
        if self.checkForEmptyFile():
            self.noFileSelectedWindow()
        else:
            self.file_name_text.setText("")
            self.file_size_text.setText("")
            self.date_added_text.setText("")

    
    def fileAnalysis(self):

        if self.file_name_text.text().__eq__("") or self.file_name_text.text().__eq__("") or self.date_added_text.text().__eq__(""):
            print("No file selected")
            return
        elif self._flag == 0:
            print("Please first import your file")
        else:
            self.count =0 
            while self.count <100:
                    self.progressBar.show()
                    self.progressBar.setValue(self.count+25)
                    self.count+=25
                    time.sleep(1)
                    
        if self.progressBar.value() == 100:
                self.analysisCompletionWindow()
            
    
    def noFileSelectedWindow(self):
        self.file_error_window = QtWidgets.QDialog()
        self.file_error_window.setWindowTitle("File error window")
        self.file_error_label = QtWidgets.QLabel('No file was selected.')
        self.standard_btns = QtWidgets.QDialogButtonBox.Ok | QtWidgets.QDialogButtonBox.Cancel
        self.btn_box = QtWidgets.QDialogButtonBox(self.standard_btns)
        self.ver_layout = QtWidgets.QVBoxLayout()
        self.file_error_window.setLayout(self.ver_layout)
        self.btn_box.accepted.connect(self.file_error_window.accept)
        self.file_error_window.layout().addWidget(self.btn_box)
        self.file_error_window.layout().addWidget(self.file_error_label)
        self.file_error_window.show()    

        
    def analysisCompletionWindow(self):
        self.warning_window = QtWidgets.QWidget()
        self.warning_label = QtWidgets.QLabel("Analysis successfully completed",None)
        self.warning_window.move(self.verticalFrame.width(),self.verticalFrame.height())
        self.verticallyout = QtWidgets.QVBoxLayout()
        self.warning_label.setStyleSheet('color:green')
        self.warning_window.setLayout(self.verticallyout)
        self.warning_window.layout().addWidget(self.warning_label)
        self.warning_label.setStyleSheet('color:red')
        self.warning_window.setFixedSize(260, 100)
        self.warning_window.show()
    
    def runUi(sefl,FileAnalysis):
        FileAnalysis.show()
        

    def retranslateUi(self, Form):
        _translate = QtCore.QCoreApplication.translate
        Form.setWindowTitle(_translate("Form", "Form"))
        self.file_name_label.setText(_translate("Form", "File name"))
        self.file_size_label.setText(_translate("Form", "File size"))
        self.date_added_label.setText(_translate("Form", "Date added"))
        self.open_file_button.setText(_translate("Form", "Open file"))
        self.cancel_button.setText(_translate("Form", "Cancel"))
        self.start_analysis_button.setText(_translate("Form", "Start analysis"))


if __name__ == "__main__":
    import sys
    app = QtWidgets.QApplication(sys.argv)
    Form = QtWidgets.QWidget()
    ui = Ui_Form()
    ui.setupUi(Form)
    Form.show()
    sys.exit(app.exec_())
