import React, { useEffect, useState, useRef } from "react";
function Dropdown({ dropdownFilter, handleItemUpdate }) {
  const showButton = useRef(null);
  const hideButton = useRef(null);
  const [filter, setFilter] = useState("none");
  const handleChange = (event) => {
    //change the filter ; show, hide or none
    const currentValue = event.target.value; //FILTER
    setFilter(currentValue);
    dropdownFilter(currentValue); //SEND FILTER BACK TO APP
  };

  useEffect(() => {
    if (filter === "none") {
      showButton.current.classList.remove("hidden-task1");
      hideButton.current.classList.remove("hidden-task1");
    } else if (filter === "show") {
      showButton.current.classList.add("hidden-task1");
      hideButton.current.classList.remove("hidden-task1");
    } else if (filter === "hide") {
      showButton.current.classList.remove("hidden-task1");
      hideButton.current.classList.add("hidden-task1");
    }
  }, [filter]);
  function hide() {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"].checkbox-task1'
    );
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const id = checkbox.parentElement.parentElement.getAttribute("dataId");

        checkbox.checked = false;
        handleItemUpdate(id, "hide");
      }
    });
  }
  function show() {
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"].checkbox-task1'
    );
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const id = checkbox.parentElement.parentElement.getAttribute("dataId");

        checkbox.checked = false;

        handleItemUpdate(id, "show");
      }
    });
  }

  return (
    <>
      <div className="dropdown-task1">
        <strong>Select Filter:</strong>
        <select id="select-task1" value={filter} onChange={handleChange}>
          <option value="none">ALL</option>
          <option value="show">SHOW</option>
          <option value="hide">HIDE</option>
        </select>
      </div>
      <div id="hide-show-parent-div">
        <button
          ref={hideButton}
          id="hide-btn-task1"
          className="button-1-task1"
          onClick={hide}
        >
          Hide
        </button>
        <button
          ref={showButton}
          id="show-btn-task1"
          className="button-1-task1"
          onClick={show}
        >
          Show
        </button>
      </div>
    </>
  );
}

export default Dropdown;
