let employeesData = [];
let employeeRows = [];

fetch("employee.json")
  .then((res) => res.json())
  .then((data) => {
    employeesData = data;
  });

function addEmployeeRow() {
  const tbody = document.querySelector("#employeeTable tbody");
  const row = document.createElement("tr");

  row.innerHTML = `
    <td><input type="text" class="empId"></td>
    <td><input type="text" class="empName" readonly></td>
    <td><input type="text" class="companyName" readonly></td>
    <td><input type="number" class="monetaryValue"></td>
    <td><button class="delete-btn">X</button></td>
  `;

  tbody.appendChild(row);

  const empIdInput = row.querySelector(".empId");
  empIdInput.addEventListener("change", function () {
    const emp = employeesData.find((e) => e.id === this.value);
    if (emp) {
      row.querySelector(".empName").value = emp.name;
      row.querySelector(".companyName").value = emp.company;
    } else {
      row.querySelector(".empName").value = "";
      row.querySelector(".companyName").value = "";
    }
  });

  const monetaryInput = row.querySelector(".monetaryValue");
  monetaryInput.addEventListener("input", updateTotal);

  const deleteBtn = row.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    row.remove();
    employeeRows = employeeRows.filter((r) => r !== row);
    updateTotal();
  });

  employeeRows.push(row);
}

function updateTotal() {
  const deliveryAmount = parseFloat(
    document.getElementById("deliveryAmount").value
  );
  let total = 0;

  employeeRows.forEach((row) => {
    const val = parseFloat(row.querySelector(".monetaryValue").value) || 0;
    total += val;
  });

  if (total > deliveryAmount) {
    alert("Total monetary value cannot exceed delivery amount!");
  }

  document.getElementById("totalValue").textContent = total;
}

function submitOrder() {
  for (const row of employeeRows) {
    const monetary = row.querySelector(".monetaryValue").value;
    if (!monetary || parseFloat(monetary) <= 0) {
      alert("Each employee must have a valid monetary value!");
      return;
    }
  }

  const order = {
    orderDate: document.getElementById("orderDate").value,
    orderStatus: document.getElementById("orderStatus").value,
    orderId: document.getElementById("orderId").value,
    assignName: document.getElementById("assignName").value,
    clientId: document.getElementById("clientId").value,
    orderLink: document.getElementById("orderLink").value,
    profileName: document.getElementById("profileName").value,
    instructions: document.getElementById("instructions").value,
    deliveryAmount: document.getElementById("deliveryAmount").value,
    remarks: document.getElementById("remarks").value,
    employees: employeeRows.map((row) => ({
      id: row.querySelector(".empId").value,
      name: row.querySelector(".empName").value,
      company: row.querySelector(".companyName").value,
      monetary: row.querySelector(".monetaryValue").value,
    })),
  };

  console.log("Saving Order:", JSON.stringify(order, null, 2));
  alert("Order submitted! Check console for output.");
}
