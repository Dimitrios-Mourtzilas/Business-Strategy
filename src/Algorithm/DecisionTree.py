

from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
import pandas as pd

class DecisionTree:


    def __init__(self,financialReport):
        
        if financialReport is None:
            return
        else:
            self.report = financialReport
    def trainData(self):
        if self.report is None:
            return
        else:
            self.data = pd.read_csv(self.report)
            self.X = np.array(self.data.iloc[:,1:]).reshape(-1,1)
            self.y = np.array(self.data.loc['Total worth']).reshape(-1,1)
            self.x_train,self.x_test,self.y_train,self.y_test = train_test_split(self.X,self.y)
            self.dtr = DecisionTree()
            self.dtr.fit(self.x_train,self.y_train)
            self.y_pred = self.dtr.predict(self.y_test)
            

            




