

from sklearn.tree import DecisionTreeRegressor, DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import numpy as np
import pandas as pd
import matplotlib.pyplot  as plt

class DecisionTree:



    def __init__(self,financialReport):
        
        if financialReport is None:
            return
        else:
            self.report = financialReport

            

            

    def analyzeData(self):

        self.data = pd.read_csv(self.report)
        self.d = pd.DataFrame(self.data)
        self.X = np.array(self.d.iloc[:,3:len(self.d.columns)-1]).reshape(-1,1)
        self.y = np.array(self.d.iloc[:,len(self.d.columns)-1]).reshape(-1,1)
        print(self.X)
        print(self.X.shape)
        print('\n')
        print(self.y)
        print(self.y.shape)
        dtr = DecisionTreeRegressor()
        x_train,x_test,y_train,y_test= train_test_split(self.X,self.y,test_size=.2)
        plt.scatter(x_train,y_train,color='blue')
        plt.scatter(x_test,y_test,color='red')
        dtr.fit(x_train,y_train)
        y_pred = dtr.predict(y_test)
        plt.scatter(y_test,y_pred,color='green')
        plt.show()





