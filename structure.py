import os

# Define project structure
folders = ['templates', 'static']
files = {
    'app.py': """from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)
""",
    'requirements.txt': "Flask==2.3.2",
    'templates/index.html': "<h1>Hello from Flask!</h1>"
}

# Create folders
for folder in folders:
    os.makedirs(folder, exist_ok=True)

# Create files
for path, content in files.items():
    with open(path, 'w') as f:
        f.write(content)

print("✅ Flask project structure created successfully.")
