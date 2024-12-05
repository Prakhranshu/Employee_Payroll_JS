document.querySelector('.form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission reload

    // Gather data from the form
    const name = document.querySelector('.name').value;
    const image = document.querySelector('input[name="PI"]:checked')?.value;
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const departments = Array.from(document.querySelectorAll('input[name="dept"]:checked')).map(
        (checkbox) => checkbox.value
    );
    const Salary = document.querySelector('#Salary').value;
    const day = document.querySelector('#day').value;
    const month = document.querySelector('#month').value;
    const year = document.querySelector('#year').value;
    const StartDate = `${day}-${month}-${year}`;
    const notes = document.querySelector('textarea[name="notes"]').value;

    // Validate required fields
    if (!name || !image || !gender || !departments.length || !Salary || !day || !month || !year) {
        alert('Please fill in all required fields!');
        return;
    }

    try {
        // Check if we're editing an existing employee
        const employeeId = localStorage.getItem('editEmployeeId'); // Get the stored employee ID
        
        if (employeeId) {
            // Editing an existing employee
            const updatedEmployee = {
                id: employeeId,
                name,
                image,
                gender,
                Department: departments,
                Salary,
                StartDate,
                notes,
            };

            // Update employee details in the database
            const response = await fetch(`http://localhost:3000/employees/${employeeId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmployee),
            });

            if (!response.ok) throw new Error("Failed to update employee");
            alert("Employee updated successfully!");
            console.log("Redirecting to the Employee List Page...");
            window.location.replace("http://127.0.0.1:5500/Pages/Employee_Payroll_Form.HTML"); // Redirect to the employee list page

        } else {
            // Adding a new employee
            const employeesResponse = await fetch('http://localhost:3000/employees');
            const employees = await employeesResponse.json();

            const nextId = employees.length ? Math.max(...employees.map((emp) => emp.id)) + 1 : 1;

            const newUser = {
                id: nextId.toString(),
                name,
                image,
                gender,
                Department: departments,
                Salary,
                StartDate,
                notes,
            };

            // Send data to the JSON server
            const response = await fetch('http://localhost:3000/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });

            if (response.ok) {
                alert('Employee added successfully!');
                window.location.href = './Employee_Payroll_Form.HTML'; // Redirect to the employee list page
            } else {
                alert('Failed to add employee. Please try again.');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the server. Please try again.');
    }
});

// Function to populate form with employee data for editing
async function fetchEmployeeData() {
    const employeeId = localStorage.getItem('editEmployeeId');
    if (employeeId) {
        try {
            const response = await fetch(`http://localhost:3000/employees/${employeeId}`);
            if (!response.ok) throw new Error("Failed to fetch employee");
            const employee = await response.json();
            populateForm(employee);
        } catch (error) {
            console.error("Error fetching employee:", error);
        }
    }
}

function populateForm(employee) {
    // Name, Gender, Department (already populated)
    document.querySelector(".name").value = employee.name;
    document.querySelector("input[name='gender'][value='" + employee.gender + "']").checked = true;
    employee.Department.forEach(dep => {
        document.querySelector(`input[name="dept"][value="${dep}"]`).checked = true;
    });

    // Normalize image path and set the checked radio button
    const normalizedImage = employee.image.replace(/\\/g, "/"); // Convert backslashes to forward slashes
    const imageRadio = document.querySelector(`input[name="PI"][value="${normalizedImage}"]`);
    if (imageRadio) {
        imageRadio.checked = true;
    } else {
        console.error("Image radio not found for:", normalizedImage);
    }

    // Salary - Set the selected option
    const salarySelect = document.querySelector("#Salary");
    const salaryOption = Array.from(salarySelect.options).find(option => option.value === employee.Salary);
    if (salaryOption) {
        salaryOption.selected = true;
    }

    // Start Date - Split the date into day, month, year
    const [day, month, year] = employee.StartDate.split("-");
    document.querySelector("#day").value = day;
    document.querySelector("#month").value = month;
    document.querySelector("#year").value = year;

    // Notes (if any)
    document.querySelector('textarea[name="notes"]').value = employee.notes;
}

// Call this when the page loads for editing
fetchEmployeeData();
