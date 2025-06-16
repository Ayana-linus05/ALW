from flask import Flask, render_template, jsonify,request
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # Default XAMPP MySQL password
        database="HRMS"
    )

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/employees")
def get_employees():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT employee.Emp_ID, employee.First_Name, employee.Last_Name, department.Name FROM `employee` Left JOIN department on department.ID = employee.Department_ID;")
    employees = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(employees)

@app.route("/api/methods")
def get_methods():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT Method FROM method;") 
    methods = cursor.fetchall()
    conn.close()
    return jsonify(methods)

@app.route("/api/employee-names")
def get_employee_names():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT Emp_ID, First_Name, Last_Name FROM employee;")
    employees = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(employees)



@app.route("/submit-report", methods=["POST"])
def submit_report():
    data = request.get_json()
    
    # Extract data
    report_type = data.get('type')
    manager = data.get('manager')
    method = data.get('method')
    employees = data.get('employees')
    newmanager = data.get('newmanager')  # Only exists if type == 'copy'

    # Here you can save to database, log, etc.
    print("Received Report Submission:")
    print("Type:", report_type)
    print("Manager:", manager)
    print("Method:", method)
    print("Employees:", employees)
    if report_type == "copy":
        print("New Manager:", newmanager)

    return jsonify({"message": "Report submitted successfully!"}), 200



if __name__ == "__main__":
    app.run(debug=True, port=8081)
