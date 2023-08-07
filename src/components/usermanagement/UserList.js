import React from "react";
import deletIcon from "./../../assets/images/delete_icon.svg";
import editIcon from "./../../assets/images/edit-icon.svg";
import "./UserList.css";

const UserList = ({ userList, setEditUserData, deleteUser }) => {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th scope="col" className="text-center">#</th>
          <th scope="col" className="text-center">User Name</th>
          <th scope="col" className="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {userList.map((user, i) => {
          return (
            <tr>
              <td scope="row" className="text-center">{i + 1}</td>
              <td className="text-center" >{user.userName}</td>
              <td className="action-block text-center">
                <button className="delete-icon" onClick={() => deleteUser(i)}>
                  <img src={deletIcon} alt="delete-icon" width={20} />
                </button>
                <button>
                  <img
                    src={editIcon}
                    alt="edit-icon"
                    width={20}
                    data-toggle="modal"
                    data-target="#edit-user-modal"
                    onClick={() => {
                      setEditUserData({ ...user, id: i });
                    }}
                  />
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default UserList;
