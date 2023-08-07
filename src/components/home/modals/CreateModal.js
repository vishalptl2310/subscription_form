import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Modal.css";
import deletIcon from "./../../../assets/images/delete_icon.svg";
import moment from "moment/moment";

const CreateModal = ({ addUser, userList }) => {
  const emptySlotObject = { date: "", startTime: "", endTime: "", error: "" };
  const emptyNameObject = { name: "", error: "" };
  const [slotList, setSlotList] = useState([emptySlotObject]);
  const [name, setName] = useState(emptyNameObject);

  const deleteSlot = (slotIndex) => {
    setSlotList(slotList.filter((_, i) => i != slotIndex));
  };

  const validateSlotTimings = () => {
    let isValid = true;

    const timeRanges = slotList.map((slot) => {
      return {
        startTime: moment(`${slot.date} ${slot.startTime}`, "YYYY-MM-DD HH:mm"),
        endTime: moment(`${slot.date} ${slot.endTime}`, "YYYY-MM-DD HH:mm"),
      };
    });

    for (let i = 0; i < timeRanges.length; i++) {
      const slotA = timeRanges[i];
      if (!slotA.endTime.isAfter(slotA.startTime)) {
        setSlotList((prevSlotList) => {
          const currentObject = prevSlotList[i];
          const updatedSlotList = [...prevSlotList];
          updatedSlotList[i] = {
            ...currentObject,
            error: `End time should be greater then Start time`,
          };
          return updatedSlotList;
        });
        isValid = false;
        break;
      }

      for (let j = 0; j < i; j++) {
        const slotB = timeRanges[j];
        if (
          (slotA.startTime.isSameOrAfter(slotB.startTime) &&
            slotA.startTime.isBefore(slotB.endTime)) ||
          (slotA.endTime.isAfter(slotB.startTime) &&
            slotA.endTime.isSameOrBefore(slotB.endTime)) ||
          (slotB.startTime.isSameOrAfter(slotA.startTime) &&
            slotB.startTime.isBefore(slotA.endTime)) ||
          (slotB.endTime.isAfter(slotA.startTime) &&
            slotB.endTime.isSameOrBefore(slotA.endTime))
        ) {
          setSlotList((prevSlotList) => {
            const currentObject = prevSlotList[i];
            const updatedSlotList = [...prevSlotList];
            updatedSlotList[i] = {
              ...currentObject,
              error: `Slot time conflicts with slot ${j + 1}`,
            };
            return updatedSlotList;
          });
          isValid = false;
          break;
        }
      }

      if (!isValid) {
        break;
      }
    }

    return isValid;
  };
  const handleOnChange = (e, index) => {
    setSlotList((prevSlotList) => {
      const currentObject = prevSlotList[index];
      const updatedSlotList = [...prevSlotList];
      updatedSlotList[index] = {
        ...currentObject,
        [e.target.name]: e.target.value,
      };
      return updatedSlotList;
    });
  };

  const validateSlotFields = () => {
    let status = true;
    for (let i = 0; i < slotList.length; i++) {
      const currentObject = slotList[i];
      let errorMsg = "";
      if (!currentObject.date) errorMsg = "Enter a date";
      else if (!currentObject.startTime) errorMsg = "Enter a start time";
      else if (!currentObject.endTime) errorMsg = "Enter a end time";

      if (errorMsg) {
        setSlotList((prevSlotList) => {
          const updatedSlotList = [...prevSlotList];
          updatedSlotList[i] = {
            ...prevSlotList[i],
            error: errorMsg,
          };
          return updatedSlotList;
        });
        status = false;
        break;
      }
    }
    return status;
  };
  const resetErrorMessages = () => {
    setName({ ...name, error: "" });
    setSlotList(
      slotList.map((slot) => {
        return { ...slot, error: "" };
      })
    );
  };
  const handleSubmit = () => {
    resetErrorMessages();
    if (name.name.trim().length === 0) {
      setName({ ...name, error: "Please enter a name" });
      return;
    } else if (userList.some((u) => u.userName === name.name)) {
      setName({ ...name, error: "User already exist with this user name" });
      return;
    }
    if (!validateSlotFields() || !validateSlotTimings()) return;
    addUser({ userName: name.name, timeSlot: slotList });
    setName(emptyNameObject);
    setSlotList([emptySlotObject]);
  };
  return (
    <div
      className="modal fade"
      id="create-modal"
      tabIndex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog cstm-modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Subscription form
            </h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <div className="field-container">
              <label className="input-label">User Name*</label>
              <input
                type="text"
                value={name.name}
                onChange={(e) => setName({ ...name, name: e.target.value })}
              />
              <span className="field-error">{name.error}</span>
            </div>
            {slotList.map((slot, i) => {
              return (
                <div className="slot-block" key={i}>
                  <div className="slot-title">{`Slot ${i + 1}`}</div>
                  <div className="field-container">
                    <label className="input-label">Date*</label>
                    <input
                      type="date"
                      name="date"
                      value={slot.date}
                      onChange={(e) => {
                        handleOnChange(e, i);
                      }}
                    />
                  </div>
                  <div className="field-container">
                    <label className="input-label">Start Time*</label>
                    <input
                      type="time"
                      name="startTime"
                      value={slot.startTime}
                      onChange={(e) => {
                        handleOnChange(e, i);
                      }}
                    />
                  </div>
                  <div className="field-container">
                    <label className="input-label">End Time*</label>
                    <input
                      type="time"
                      name="endTime"
                      min={slot.startTime}
                      value={slot.endTime}
                      onChange={(e) => {
                        handleOnChange(e, i);
                      }}
                    />
                  </div>
                  <span className="field-error">{slot.error}</span>
                  {i !== 0 && (
                    <button
                      className="delete-slot-btn"
                      onClick={() => deleteSlot(i)}
                    >
                      <img src={deletIcon} alt="delete-icon" width={15} />
                    </button>
                  )}
                </div>
              );
            })}

            <button
              className="cstm-btn"
              onClick={() => {
                setSlotList([...slotList, emptySlotObject]);
              }}
            >
              Add more slot
            </button>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-dismiss="modal"
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;
