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

@app.route("/api/add-reporties", methods=["POST"])
def add_reporties():
    data = request.get_json()
    sub_ids = data.get("sub_ids")       # List of employee IDs
    sup_id = data.get("sup_id")         # Manager's Emp_ID
    method_name = data.get("method")    # Method name string

    if not (sub_ids and sup_id and method_name):
        return jsonify({"error": "Missing data"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Get Method_ID from method name
        cursor.execute("SELECT ID FROM method WHERE Method = %s", (method_name,))
        method_result = cursor.fetchone()
        if not method_result:
            return jsonify({"error": "Invalid method"}), 400
        method_id = method_result[0]

        # Insert each Sub_ID
        for sub_id in sub_ids:
            cursor.execute(
                "INSERT INTO report_to (Sub_ID, Sup_ID, Method_ID) VALUES (%s, %s, %s)",
                (sub_id, sup_id, method_id)
            )

        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "Data inserted successfully"}), 200

    except Exception as e:
        print("DB Error:", e)
        return jsonify({"error": "Database error"}), 500




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

@app.route("/api/distinct-supervisors")
def get_distinct_supervisors():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT DISTINCT e.Emp_ID, e.First_Name, e.Last_Name
        FROM report_to r
        JOIN employee e ON r.Sup_ID = e.Emp_ID
        ORDER BY e.Emp_ID ASC
    """)
    supervisors = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(supervisors)


@app.route("/api/subordinates/<int:sup_id>")
def get_subordinates_for_supervisor(sup_id):
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT Sub_ID FROM report_to WHERE Sup_ID = %s", (sup_id,))
    subordinates = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify([row["Sub_ID"] for row in subordinates])

 


if __name__ == "__main__":
    app.run(debug=True, port=8080)