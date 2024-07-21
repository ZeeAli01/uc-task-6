import React, { useEffect } from "react";
import UpdateModal from "./UpdateModal";

function ItemData({
  items,
  masterCheckboxState,
  outerCheckbox,
  setAllChecked,
  handleRowDeleteBtn,
  handleRowUpdateButton,
}) {
  function updateMasterCheckbox() {
    let allChecked = true;
    const checkboxes = document.querySelectorAll(
      'input[type="checkbox"].checkbox-task1'
    );

    checkboxes.forEach((checkbox) => {
      if (!checkbox.checked) {
        allChecked = false;
      }
    });

    if (outerCheckbox.current) {
      outerCheckbox.current.checked = allChecked;
    }
    setAllChecked(allChecked);
  }

  useEffect(() => {
    const checkboxes = document.querySelectorAll(".checkbox-task1");
    checkboxes.forEach((checkbox) => {
      checkbox.checked = masterCheckboxState;
    });
  }, [masterCheckboxState]);

  useEffect(() => {
    updateMasterCheckbox();
  }, [items]);

  return (
    <>
      {items.map((item) => {
        const { id, topic, duration, link } = item;
        let newDuration = 0;
        if (duration < 60) {
          newDuration = `${duration} min`;
        } else if (duration === 60) {
          newDuration = `1 hr`;
        } else {
          newDuration = `${Math.floor(duration / 60)} hr ${duration % 60} min`;
        }
        return (
          <tr dataId={id} key={id}>
            <td>
              <input
                onChange={() => {
                  updateMasterCheckbox();
                }}
                type="checkbox"
                className="checkbox-task1"
                value={id}
              />
            </td>
            <td>{id}</td>
            <td>{topic}</td>
            <td>{newDuration}</td>
            <td>
              <a
                className="link-task1"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link}
              </a>
            </td>
            <td className="actions-td">
              <button
                className="row-delete-button btn btn-danger"
                onClick={() => handleRowDeleteBtn(id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-trash"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </button>
              <div className="text-center">
                <UpdateModal
                  id={id}
                  handleRowUpdateButton={handleRowUpdateButton}
                />
              </div>
            </td>
          </tr>
        );
      })}
    </>
  );
}

export default ItemData;
