import cgi
import os
import sys
import json
import urllib2
import csv
import matplotlib.pyplot as plt
import flask
from flask import request, Response
from pylab import plot,show
from numpy import vstack,array
from numpy.random import rand
from scipy.cluster.vq import kmeans,vq
from Tkinter import *
import time
from boto.s3.key import Key
from boto.s3.connection import S3Connection


FLASK_DEBUG = 'true'
THEME = 'default'

# Default config vals
THEME = 'default' if os.environ.get(THEME) is None else os.environ.get(THEME)
FLASK_DEBUG = 'true' if os.environ.get(FLASK_DEBUG) is None else os.environ.get(FLASK_DEBUG)


# Create the Flask app
application = flask.Flask(__name__)

# Load config values specified above
application.config.from_object(__name__)


AWS_ACCESS_KEY_ID='AKIAJ6TXQJKXPEC3PG5A'
AWS_SECRET_ACCESS_KEY='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'

@application.route('/')
def welcome():
    clusterNo = [1,2,3,4,5,6]
    return flask.render_template('main.html', clusterNo = clusterNo)

#For Plotting Scatter plots
@application.route('/scatter', methods=['POST'])
def scatter():
    print "Generating Scatter points...."
    return flask.render_template('scatterplot.html')

#For Bar graph
@application.route('/bargraph', methods=['POST'])
def bargraph():
    print "Generating Bar Graphs...."
    return flask.render_template('bargraph.html')

#For Bar graph
@application.route('/bargraph1', methods=['POST'])
def bargraph1():
    print "Generating Bar Graphs...."
    return flask.render_template('bargraph1.html')

#For K-means Clustering: This method generates K-means clusters for the given data set
@application.route('/cluster', methods=['POST'])
def cluster():
    print "Signing in...."
    clusterNo = int(request.form['cluster'])
    
    dataURL = "https://s3.amazonaws.com/iclouddb/Iris.csv"
    completeDataURL =  urllib2.urlopen(dataURL)
    fileDesc = csv.reader(completeDataURL)
    

    clusterData=[]
    XData = []
    YData = []
    for row in fileDesc:
        clusterData.append([float(x) for x in row[0:2]])
        XData.append(float(row[0]))
        YData.append(float(row[1]))

    data = vstack(clusterData)

    # computing K-Means with K = number of clusters given by user
    centroids,_ = kmeans(data,clusterNo)
    
    # assign each data set to a cluster
    idx,_ = vq(data,centroids)
    
    print "Plotting K-means graph....."
    
    # This will generate k-means output CSV for plotting graph- Dataset contains - Each cluster and the Co-ordinates in that CSV
    csvName = 'kmeans.csv'
    with open("static/{}".format(csvName), 'w') as csvfile:
        fieldnames = ['Cluster','Xaxis','Yaxis']
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for i in range(0,len(idx)):
            clusterName = str('Cluster ')+str(idx[i])
            writer.writerow({'Cluster': clusterName, 'Xaxis':XData[i], 'Yaxis':YData[i]})

    
    return flask.render_template('kmeans.html', centroids = centroids)

if __name__ == '__main__':
    application.debug = True
    application.run(host='0.0.0.0')
    
    
    
    
    