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
        // Fetch current employees to calculate the next ID
        const employeesResponse = await fetch('http://localhost:3000/employees');
        const employees = await employeesResponse.json();

        // Determine the highest ID and increment it
        const nextId = employees.length ? Math.max(...employees.map((emp) => emp.id)) + 1 : 1;

        // Create the user object
        const newUser = {
            id: nextId.toString(), // Add the custom ID
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
            // Redirect to the employee list page
            window.location.href = './Employee_Payroll_Form.HTML';
        } else {
            alert('Failed to add employee. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error connecting to the server. Please try again.');
    }
});
