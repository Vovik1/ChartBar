# ChartBar
Creating "Stacked Bar Chart" using D3.js and RESTful Web Services with Flask

## Getting Started
The data folder contains 1000 CSV files with the following format:
The first line indicates the encoding of the data in the file
The following rows contain data in three columns (columns are separated by a comma (byte 0x2c)):
- Entity name. One of the following: a, b, c, d, e, f
- Value. Type: float
- String

### Task
Write a code that processes all CSV files and writes the data to the data.sqlite3 database in the data table.
DB Encoding: UTF-8
Table Fields: id, entity, value, string

Create a web application (Flask) that will receive data from the data.sqlite3 database and generate a page with a graph created using D3.js. On the graph you need to display:
- X axis: value (time in seconds)
- Y axis: The number of occurrences of value in this period of time. (The number of values that occur at different time intervals. For example, in the interval 0sec (value = 0) - 5sec (value = 5), we met 100 values. That means we will have a value of 5 on the X axis and a value of 100 on the Y axis)

### Installing
Create database file 'data.sqlite' in root folder
```
$ touch data.sqlite
```
Install all necessary packages
```
(venv) $ pip install -r requirements.txt
```
Run db.py file to fill database
```
(venv) $ python db.py
```
Start the web server as follows
```
(venv) $ export FLASK_APP=flasky.py
(venv) $ flask run
```
Open index.html file in your browser
```
(venv) $ google-chrome frontend_part/index.html
```

## Authors

* **Volodymyr Hrytsiv** 

 
