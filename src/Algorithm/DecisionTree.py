

from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np


class DecisionTree:

    x_data = np.array([])
    y_data = np.array([])

    def __init__(self,financialReport):
        if financialReport is None:
            return
        else:
            self.col = 0
            for value in financialReport.getToJson():
                self.x_data.put(self.col,value['year'])
                self.y_data.put(self.col,value['comp_revenue'])
                self.col+=1


    def analyzeData(self):
        self.dtr = DecisionTreeRegressor()
        self.x_train,self.x_test,self.y_train,self.y_test = train_test_split(self.x_data,self.y_data)
        self.dtr.fit(self.x_train,self.y_train)
        self.y_pred = self.dtr.predict(self.y_test)
        print("Accuray: {}".format(accuracy_score(self.y_test,self.y_pred)))


