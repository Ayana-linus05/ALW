from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

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
