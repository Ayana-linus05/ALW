document.addEventListener("DOMContentLoaded", function () {
    // ====== Basic Setup: Cache DOM elements & initialize variables ======
    const searchInput = document.getElementById("searchInput");
    const tableBody = document.querySelector("#employeeTable tbody");
    const recordCount = document.getElementById("record-count");
    const noRecords = document.getElementById("no-records");

    // Method Inputs Setup (Add New Report & Copy Report)
    const methodInputs = [
        {
            input: document.getElementById("methodInput"),
            box: document.getElementById("methodSuggestions"),
            icon: document.querySelector("#add-report-form .dropdown-icon")
        },
        {
            input: document.getElementById("copyMethodInput"),
            box: document.getElementById("copyMethodSuggestions"),
            icon: document.querySelector("#copy-report-form .dropdown-icon")
        }
    ];

    let methodList = [];
    let isSuggestionVisible = [false, false];
    // Transfer To Setup (Copy Report section)
    const transferInput = document.getElementById("transferInput");
    const transferBox = document.getElementById("transferSuggestions");
    const transferIcon = transferInput.parentElement.querySelector(".dropdown-icon");
    let transferList = [];
    let isTransferVisible = false;

    const reportInput = document.getElementById("reportInput");
    const reportBox = document.getElementById("reportSuggestions");
    const reportIcon = reportInput.parentElement.querySelector(".dropdown-icon");
    let reportList = [];
    let isReportVisible = false;

    // ====== Fetch Data from APIs ======
    // Fetch available methods for dropdowns
    fetch('/api/methods')
        .then(res => res.json())
        .then(data => {
            if (Array.isArray(data)) {
                methodList = data.map(item => item.Method);
            }
        })
        .catch(err => console.error("Error fetching methods:", err));

    // Fetch employee list for Transfer To dropdown and table
    fetch("/api/employee-names")
        .then(response => response.json())
        .then(data => {
            transferList = data.map(emp => ({
                id: emp.Emp_ID,
                name: `${emp.Emp_ID} ${emp.First_Name} ${emp.Last_Name}`
            }));
        })
        .then(data => {
            reportList = data.map(emp => ({
                id: emp.Emp_ID,
                name: `${emp.Emp_ID} ${emp.First_Name} ${emp.Last_Name}`
            }));
        })
        .catch(err => {
            console.error("Error fetching employee names:", err);
        });

        // Fetch employee list for Report To dropdown and table
    fetch("/api/employee-names")
        .then(response => response.json())
        .then(data => {
            reportList = data.map(emp => ({
                id: emp.Emp_ID,
                name: `${emp.Emp_ID} ${emp.First_Name} ${emp.Last_Name}`
            }));
        })
        .then(data => {
            reportList = data.map(emp => ({
                id: emp.Emp_ID,
                name: `${emp.Emp_ID} ${emp.First_Name} ${emp.Last_Name}`
            }));
        })
        .catch(err => {
            console.error("Error fetching employee names:", err);
        });


    fetch('/api/employees')
        .then(response => response.json())
        .then(data => {
            // Populate employee table with data
            data.forEach((emp, index) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td><input type="checkbox"></td>
                    <td>${index + 1}</td>
                    <td class="employee-id">${emp.Emp_ID}</td>
                    <td>${emp.First_Name}</td>
                    <td>${emp.Last_Name}</td>
                    <td>${emp.Name}</td>
                `;
                tableBody.appendChild(row);
            });
            attachRowClickEvents();
            updateSearch();
            searchInput.addEventListener("input", updateSearch);
        })
        .catch(err => {
            console.error("Error loading employee data:", err);
            noRecords.style.display = "block";
            noRecords.textContent = "Error fetching data from backend.";
        });

    // ====== Suggestion Dropdown Logic for Method Inputs ======
    function showSuggestions(index, filter = "") {
        const suggestionBox = methodInputs[index].box;
        const methodInput = methodInputs[index].input;
        suggestionBox.innerHTML = "";

        const matches = methodList.filter(method =>
            method.toLowerCase().includes(filter.toLowerCase())
        );

        if (matches.length === 0) {
            suggestionBox.style.display = "none";
            isSuggestionVisible[index] = false;
            return;
        }

        matches.forEach(method => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.textContent = method;

            item.addEventListener("click", () => {
                methodInput.value = method;
                methodInput.style.backgroundColor = "#45a049";
                methodInput.style.color = "white";
                suggestionBox.style.display = "none";
                isSuggestionVisible[index] = false;

                // Change dropdown icon color to white on selection
                if (methodInputs[index].icon) {
                    methodInputs[index].icon.style.color = "white";
                }
            });

            suggestionBox.appendChild(item);
        });

        suggestionBox.style.display = "block";
        isSuggestionVisible[index] = true;
    }

    // ====== Suggestion Dropdown Logic for Transfer To Input ======
    function showTransferSuggestions(filter = "") {
        transferBox.innerHTML = "";
        const matches = transferList.filter(emp =>
            emp.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (matches.length === 0) {
            transferBox.style.display = "none";
            isTransferVisible = false;
            return;
        }

        matches.forEach(emp => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.textContent = emp.name;

            item.addEventListener("click", () => {
                transferInput.value = emp.name;
                transferInput.setAttribute("data-emp-id", emp.id);
                transferInput.style.backgroundColor = "#45a049";
                transferInput.style.color = "white";
                transferBox.style.display = "none";
                isTransferVisible = false;

                // Change transfer dropdown icon color to white on selection
                if (transferIcon) {
                    transferIcon.style.color = "white";
                }
            });

            transferBox.appendChild(item);
        });

        transferBox.style.display = "block";
        isTransferVisible = true;
    }

    // ====== Suggestion Dropdown Logic for Report To Input ======
    function showReportSuggestions(filter = "") {
        reportBox.innerHTML = "";
        const matches = reportList.filter(emp =>
            emp.name.toLowerCase().includes(filter.toLowerCase())
        );

        if (matches.length === 0) {
            reportBox.style.display = "none";
            isReportVisible = false;
            return;
        }

        matches.forEach(emp => {
            const item = document.createElement("div");
            item.className = "suggestion-item";
            item.textContent = emp.name;

            item.addEventListener("click", () => {
                reportInput.value = emp.name;
                reportInput.setAttribute("data-emp-id", emp.id);
                reportInput.style.backgroundColor = "#45a049";
                reportInput.style.color = "white";
                reportBox.style.display = "none";
                isReportVisible = false;

                // Change report dropdown icon color to white on selection
                if (reportIcon) {
                    reportIcon.style.color = "white";
                }
            });

            reportBox.appendChild(item);
        });

        reportBox.style.display = "block";
        isReportVisible = true;
    }

    // ====== Event Listeners for Method Inputs (Add & Copy Report) ======
    methodInputs.forEach(({ input, box, icon }, index) => {
        // Typing triggers live suggestions
        input.addEventListener("input", () => {
            showSuggestions(index, input.value.trim());

            // Reset icon color on typing
            if (icon) {
                icon.style.color = "";
            }
            // Reset input style to default on typing
            input.style.backgroundColor = "";
            input.style.color = "";
        });

        // Clicking input toggles dropdown visibility
        input.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isSuggestionVisible[index]) {
                box.style.display = "none";
                isSuggestionVisible[index] = false;
            } else {
                showSuggestions(index, "");
                input.focus();
            }
        });

        // Clicking dropdown icon toggles dropdown visibility
        icon.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isSuggestionVisible[index]) {
                box.style.display = "none";
                isSuggestionVisible[index] = false;
            } else {
                showSuggestions(index, "");
                input.focus();
            }
        });
    });

    // ====== Event Listeners for Transfer To Input (Copy Report) ======
    transferInput.addEventListener("input", () => {
        showTransferSuggestions(transferInput.value.trim());

        // Reset icon color on typing
        if (transferIcon) {
            transferIcon.style.color = "";
        }
        // Reset input style to default on typing
        transferInput.style.backgroundColor = "";
        transferInput.style.color = "";
    });

    transferInput.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isTransferVisible) {
            transferBox.style.display = "none";
            isTransferVisible = false;
        } else {
            showTransferSuggestions("");
            transferInput.focus();
        }
    });

    transferIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isTransferVisible) {
            transferBox.style.display = "none";
            isTransferVisible = false;
        } else {
            showTransferSuggestions("");
            transferInput.focus();
        }
    });

    // ====== Event Listeners for Report To Input (Report) ======
    reportInput.addEventListener("input", () => {
        showReportSuggestions(reportInput.value.trim());

        // Reset icon color on typing
        if (reportIcon) {
            reportIcon.style.color = "";
        }
        // Reset input style to default on typing
        reportInput.style.backgroundColor = "";
        reportInput.style.color = "";
    });

    reportInput.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isReportVisible) {
            reportBox.style.display = "none";
            isReportVisible = false;
        } else {
            showReportSuggestions("");
            reportInput.focus();
        }
    });

    reportIcon.addEventListener("click", (e) => {
        e.stopPropagation();
        if (isReportVisible) {
            reportBox.style.display = "none";
            isReportVisible = false;
        } else {
            showReportSuggestions("");
            reportInput.focus();
        }
    });

    // ====== Hide dropdown suggestion boxes if clicking outside ======
    document.addEventListener("click", (e) => {
        methodInputs.forEach(({ box }, index) => {
            if (!box.contains(e.target)) {
                box.style.display = "none";
                isSuggestionVisible[index] = false;
            }
        });
        if (!transferBox.contains(e.target)) {
            transferBox.style.display = "none";
            isTransferVisible = false;
        }
        if (!reportBox.contains(e.target)) {
            reportBox.style.display = "none";
            isReportVisible = false;
        }
    });

    // ====== Employee Table Row Selection Logic ======
    function attachRowClickEvents() {
        const rows = document.querySelectorAll(".employee-table tbody tr");
        const selectAll = document.getElementById("selectAll");

        function updateRowHighlight(checkbox) {
            const row = checkbox.closest("tr");
            row.classList.toggle("selected", checkbox.checked);
        }

        rows.forEach(row => {
            const checkbox = row.querySelector("input[type='checkbox']");
            row.addEventListener("click", function (e) {
                if (e.target.type !== "checkbox") {
                    checkbox.checked = !checkbox.checked;
                    updateRowHighlight(checkbox);
                }
            });

            checkbox.addEventListener("click", function (e) {
                e.stopPropagation();
                updateRowHighlight(checkbox);
            });
        });

        if (selectAll) {
            selectAll.addEventListener("change", function () {
                const checkboxes = document.querySelectorAll(".employee-table tbody input[type='checkbox']");
                checkboxes.forEach(cb => {
                    cb.checked = this.checked;
                    updateRowHighlight(cb);
                });
            });
        }
    }

    // ====== Employee Table Search Filter Logic ======
    function updateSearch() {
        const searchValue = searchInput.value.toLowerCase();
        let visibleCount = 0;
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            const match = text.includes(searchValue);
            row.style.display = match ? "" : "none";
            if (match) visibleCount++;
        });

        recordCount.textContent = `Records found: ${visibleCount}`;
        noRecords.style.display = visibleCount === 0 ? "block" : "none";
    }

    // ====== Section Collapse/Expand Functionality ======
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', function () {
            const icon = this.querySelector('.collapse-icon');
            const divider = this.nextElementSibling;
            const content = divider.nextElementSibling;

            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'block' : 'none';
            divider.style.display = isHidden ? 'block' : 'none';
            icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
    });

    // ====== Sidebar Menu Highlighting ======
    document.querySelectorAll('.menu-item:not(.active)').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelector('.menu-item.active').classList.remove('active');
            this.classList.add('active');
        });
    });

    // ====== Form Submission: Gather data and show confirmation modal ======
    function getSelectedEmployeeDetails() {
        const selected = [];
        document.querySelectorAll('.employee-table tbody input[type="checkbox"]:checked').forEach(cb => {
            const row = cb.closest('tr');
            const name = row.children[3].textContent.trim();
            const dept = row.children[5].textContent.trim();
            const id = row.querySelector('.employee-id').textContent.trim();
            selected.push(`${id}|${name} (${dept})`);
        });
        return selected;
    }

    function showModal(type, data) {
    const modal = document.getElementById("confirmationModal");
    const body = document.getElementById("modal-body");
    const title = document.getElementById("modal-title");
    const submitBtn = document.getElementById("modal-submit");

    title.textContent = type === "add" ? "Confirm Add Reporties" : "Confirm Copy Report";

    const tableRows = data.employees.map(emp => {
        const [idPart, rest] = emp.split('|');
        const [name, dept] = rest.split('(');
        return `<tr>
            <td style="text-align: center;">${idPart}</td>
            <td style="text-align: center;">${name.trim()}</td>
            <td style="text-align: center;">${dept.replace(')', '').trim()}</td>
        </tr>`;
    }).join("");

    const tableHTML = `<table style="width: 100%; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #f2f2f2;">
                <th style="padding: 8px; text-align: center;">ID</th>
                <th style="padding: 8px; text-align: center;">Employee Name</th>
                <th style="padding: 8px; text-align: center;">Department</th>
            </tr>
        </thead>
        <tbody>${tableRows}</tbody>
    </table>`;

    body.innerHTML = `
        <p><strong>Report To (Sup_ID):</strong> ${data.manager}</p>
        ${type === "copy" ? `<p><strong>Transfer To (New Sup_ID):</strong> ${data.newmanager}</p>` : ""}
        <p><strong>Method:</strong> ${data.method}</p>
        <p><strong>Selected Employees:</strong></p>
        ${tableHTML}`;

    modal.style.display = "flex";

    submitBtn.onclick = async function () {
        modal.style.display = "none";

        const methodName = data.method;

        // Send correct format to backend
        if (type === "add") {
            const payload = {
                sup_id: data.manager,
                method: methodName,
                sub_ids: data.employees.map(emp => emp.split("|")[0].trim())  // extract Emp_ID
            };
            await sendPostRequest('/api/add-reporties', payload);
        } else if (type === "copy") {
            const payload = {
                oldmanager: data.manager,
                newmanager: data.newmanager,
                method: methodName,
                employees: data.employees.map(emp => emp.split("|")[0].trim())  // extract Emp_ID
            };
            await sendPostRequest('/api/copy-report', payload);
        }
    };
}
   

    // ====== Helper: Send POST request ======
    async function sendPostRequest(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error("Error during POST request:", error);
        }
    }

    // ====== Add New Report Form Submission Handler ======
    document.getElementById("add-report-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const manager = document.getElementById("reportInput").getAttribute("data-emp-id");
        const method = this.querySelector("input[name='method']").value;
        const employees = getSelectedEmployeeDetails();

        if (!manager || method === "" || employees.length === 0) {
    alert("Please select Report To, Method, and at least one employee.");
    return;
}

        showModal("add", { manager, method, employees });
    });

    // ====== Copy Report Form Submission Handler ======
    document.getElementById("copy-report-form").addEventListener("submit", function (e) {
        e.preventDefault();
        const manager = this.querySelector("select[name='manager']").value;
        const newmanager = transferInput.value.trim();
        const method = this.querySelector("input[name='method']").value;
        const employees = getSelectedEmployeeDetails();

        if (manager === "--Select Manager--" || newmanager === "" || method === "" || employees.length === 0) {
            alert("Please select Manager, Transfer To, Method and at least one employee.");
            return;
        }

        showModal("copy", { manager, newmanager, method, employees });
    });
    // ====== Modal Cancel Button Handler ======
    document.getElementById("modal-cancel").addEventListener("click", () => {
        document.getElementById("confirmationModal").style.display = "none";
    });

});