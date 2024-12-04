document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "http://localhost:3000/employees"; // JSON server endpoint

    // Fetch and display employees
    async function fetchEmployees() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error("Failed to fetch employees");
            const employees = await response.json();
            displayEmployees(employees);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    }

    // Display employees in the table
    function displayEmployees(employees) {
        const tableBody = document.querySelector(".table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        employees.forEach((employee) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>
                    <img src="${employee.image}" alt="Profile Image" style="width:40px; height:40px; border-radius:50%;">
                    ${employee.name}
                </td>
                <td>${employee.gender}</td>
                <td>${Array.isArray(employee.Department) ? employee.Department.join(", ") : employee.Department}</td>
                <td>${employee.Salary}</td>
                <td>${employee.StartDate}</td>
                <td class="actions">
                    <i class="material-icons icon edit" data-id="${employee.id}">edit</i>
                    <i class="material-icons icon delete" data-id="${employee.id}">delete</i>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Edit employee
    document.querySelector(".table").addEventListener("click", function (event) {
        if (event.target.classList.contains("material-icons") && event.target.textContent === "edit") {
            const userId = event.target.dataset.id;
            // Store the employee ID in localStorage or pass it via URL
            localStorage.setItem('editEmployeeId', userId);
            // Redirect to the edit form
            window.location.href = './Employee_Profile.HTML';
        }
    });

    // Handle delete functionality
    document.querySelector(".table").addEventListener("click", async function (event) {
        if (event.target.classList.contains("delete")) {
            const userId = event.target.dataset.id;
            try {
                const response = await fetch(`${API_URL}/${userId}`, {
                    method: "DELETE",
                });
                if (response.ok) {
                    alert("Employee deleted successfully!");
                    fetchEmployees(); // Refresh the table
                } else {
                    alert("Failed to delete employee.");
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
        }
    });

    // Initial fetch on page load
    fetchEmployees();
});
