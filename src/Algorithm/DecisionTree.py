from sklearn.tree import DecisionTreeRegressor
import pandas
from sklearn.metrics import accuracy_score
from sklearn.model_selection import train_test_split
import numpy
from sklearn import tree
from matplotlib import pyplot as plt
class Tree:

    def __init__(self):
        pass

    def setprops(self):
        self.file = "financial_folder/financial_statement_2019_2020.xlsx"
        self.data = pandas.read_excel(self.file)
        self.X = numpy.array(self.data.iloc[3:24,1]).reshape(-1,1)
        self.y  = numpy.array(self.data.iloc[3:24,2]).reshape(-1,1)
        print(self.X)
        print("\n")
        print(self.y)

        self.tree = DecisionTreeRegressor(splitter="best")
        self.x_train,self.x_test,self.y_train,self.y_test = train_test_split(self.X,self.y)
        self.tree.fit(self.x_train,self.y_train)
        self.y_pred = self.tree.predict(self.y_test)
        print(self.y_pred)
        print(self.tree.score(self.x_test,self.y_test))
        self.dot_file = open("dot_tree.dot","w")
        self.dot_file =tree.export_graphviz(self.tree,out_file=self.dot_file)
             
    def plotData(self):
        plt.scatter(self.x_train,self.y_train,color="blue")
        plt.scatter(self.x_test,self.y_test,color="red")
        plt.show()
