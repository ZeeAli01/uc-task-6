import React, { useEffect, useState, useRef } from "react";
import ItemData from "./ItemData";
function Table({ tableData, handleRowDeleteButton, handleRowUpdateButton }) {
  const [masterCheckboxState, setMasterCheckboxState] = useState(false);
  const [allChecked, setAllChecked] = useState(false); //if all checked then update mastercheckboxState.
  const rowsTable = useRef(null); //TABLE
  const outerCheckbox = useRef(null); //MASTER-CHECKBOX
  function handleRowDeleteBtn(id) {
    handleRowDeleteButton(id);
  }

  //toggle:
  function handleMasterCheckbox(checked) {
    setMasterCheckboxState(checked);
  }
  function handleAllChecked(status) {
    setAllChecked(status);
  }

  {
    if (!tableData.length) {
      return (
        <tr id="no-data-row">
          <td>
            <strong>No data found...</strong>
          </td>
        </tr>
      );
    }
  }
  return (
    <>
      <div className="container-task1">
        <table ref={rowsTable} id="table-task1">
          <thead id="column-name-task1">
            <th>
              <input
                ref={outerCheckbox}
                type="checkbox"
                id="outer-checkbox-task1"
                onClick={(event) => {
                  handleMasterCheckbox(event.target.checked);
                }}
              />
            </th>
            <th>Id</th>
            <th>Title</th>
            <th>Duration</th>
            <th>Link</th>
            <th>Actions</th>
          </thead>
          <tbody>
            <ItemData
              items={tableData}
              masterCheckboxState={masterCheckboxState}
              outerCheckbox={outerCheckbox}
              setAllChecked={handleAllChecked}
              handleRowDeleteBtn={handleRowDeleteBtn}
              handleRowUpdateButton={handleRowUpdateButton}
            />
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Table;
