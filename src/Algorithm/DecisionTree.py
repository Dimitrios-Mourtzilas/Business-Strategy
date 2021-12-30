from PyQt5 import QtWidgets
from sklearn.tree import DecisionTreeRegressor
import pandas
from sklearn.metrics import r2_score
from sklearn.model_selection import train_test_split
import numpy,os
from sklearn.tree import export_graphviz
from matplotlib import pyplot as plt


class Tree:

    def __init__(self):
        pass

    _completed = False
    _tree = None

    def setprops(self,file):
        self.file = file
        self.data = pandas.read_excel(self.file)

        self.X = numpy.array(self.data.iloc[3:23,1]).reshape(-1,1)
        self.y  = numpy.array(self.data.iloc[3:23,2]).reshape(-1,1)
        self._tree = DecisionTreeRegressor(splitter="best")
        self.x_train,self.x_test,self.y_train,self.y_test = train_test_split(self.X,self.y)
        self._tree.fit(self.x_train,self.y_train)
        self.y_pred = self._tree.predict(self.x_test)
        self.setCompleted(True)

    
    
    def getData(self):
        return [self.x_train,self.y_train,self.x_test,self.y_test]


    def exportData(self):
         self.dot_file = open("dot_tree.dot","w")
         self.dot_file = export_graphviz(self._tree,out_file=self.dot_file)


         import subprocess
       
         self.bash_script = "dot -Tpng dot_tree.dot -o dot_tree.png"
         self.proc = subprocess.Popen(['bash', '-c', self.bash_script],stdout=subprocess.PIPE, stderr=subprocess.PIPE,
         stdin=subprocess.PIPE)
         stdout, stderr = self.proc.communicate()
         if self.proc.returncode:

             raise Exception(self.proc.returncode, stdout, stderr, self.bash_script)
         else:
                try:
                    os.system('cmd /c "magick.exe mogrify -resize 800x700 dot_tree.png"')

                except Exception:

                    self.dialog = QtWidgets.QDialog()
                    self.btns = QtWidgets.QDialogButtonBox.Cancel
                    self.dialog.setLayout(QtWidgets.QVBoxLayout())
                    self.dialog_label = QtWidgets.QLabel("Tree could not be exported")
                    self.btnbx = QtWidgets.QDialogButtonBox(self.btns)
                    self.btnbx.rejected.connect(self.dialog.close)
                    self.dialog.layout().addWidget(self.dialog_label)
                    self.dialog.layout().addWidget(self.btnbx)
                    self.dialog.show()
        
                
          
    def setCompleted(self,completed):
        self._completed = completed
    
    def isCompleted(self):
        return self._completed