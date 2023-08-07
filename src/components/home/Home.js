import React, { useState } from "react";
import UserList from "../usermanagement/UserList";
import CreateModal from "./modals/CreateModal";
import EditUserModal from "./modals/EditUserModal";
import "./Home.css";

export const Home = () => {
  const [userList, setUserList] = useState([]);
  const [editUserData, setEditUserData] = useState({
    id: -1,
    userName: "",
    timeSlot: [],
  });

  const addUser = (user) => setUserList([...userList, user]);
  const editUser = (user, id) => {
    setUserList(() => {
      const currentUserList = [...userList];
      currentUserList[id] = user;
      return currentUserList;
    });
  };
  const deleteUser = (id) => {
    setUserList(userList.filter((_, index) => index !== id));
  };

  return (
    <div className="container main-section">
      <h1 className="text-center" style={{fontVariant: "small-caps"}}>User Information</h1>
      <CreateModal addUser={addUser} userList={userList} />
      <EditUserModal
        editUserData={editUserData}
        editUser={editUser}
        userList={userList}
      />
      <button
        type="button"
        className="btn btn-primary create-btn"
        data-toggle="modal"
        data-target="#create-modal"
      >
        Create User
      </button>
      <div className="">
        <UserList
          userList={userList}
          setEditUserData={setEditUserData}
          deleteUser={deleteUser}
        />
      </div>
    </div>
  );
};
