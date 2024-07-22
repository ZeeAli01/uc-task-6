import React, { useState, useEffect } from "react";
import "./App.css";
import CreateModal from "./assets/components/CreateModal";
import Dropdown from "./assets/components/Dropdown";
import Table from "./assets/components/Table";
const BACKEND_API_URL = "http://localhost:3000/items";
function App() {
  const [filter, setFilter] = useState("none");
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetchTableData(filter);
  }, [filter]);
  //fetch data acc to filter:
  const fetchTableData = (filter) => {
    let url = BACKEND_API_URL;
    if (filter === "show") {
      url += "?filter=show";
    } else if (filter === "hide") {
      url += "?filter=hide";
    }
    fetch(url)
      .then((response) => response.json())
      .then((data) => setTableData(data))
      .catch((error) => console.error("Error fetching items:", error));
  };
  const handleItemUpdate = (id, requiredStatus) => {
    fetch(`${BACKEND_API_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: requiredStatus }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Item update response:", data);
        if (data.error) {
          console.error("Error updating item:", data.error);
        } else if (data.message) {
          console.log("Message:", data.message);
        } else {
          // fetchTableData(filter); // Refresh table data
        }
      })
      .catch((error) => console.error("Error updating item:", error));
    fetchTableData(filter); // Refresh table data
  };
  function handleRowDeleteButton(id) {
    fetch(`${BACKEND_API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        fetchTableData(filter); // Refresh table data
      });
  }
  function handleRowUpdateButton(id, updatedData) {
    fetch(`${BACKEND_API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: updatedData.topic,
        duration: updatedData.duration,
        link: updatedData.link,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fetchTableData(filter);
      });
  }
  function handleRowAddButton(row) {
    fetch(BACKEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        fetchTableData(filter);
      })
      .catch((error) => {
        console.error("Error adding item:", error);
      });
  }
  return (
    <>
      <h1 className="h1-6">
        <strong>Topics Covered During Internship</strong>
      </h1>
      <Dropdown
        dropdownFilter={setFilter}
        handleItemUpdate={handleItemUpdate}
      />
      <CreateModal handleRowAddButton={handleRowAddButton} />
      <Table
        tableData={tableData}
        handleRowDeleteButton={handleRowDeleteButton}
        handleRowUpdateButton={handleRowUpdateButton}
      />
    </>
  );
}

export default App;
