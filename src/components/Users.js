import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import UserData from './UserData';
import { config } from '../App';
import './Users.css';

const UserInputValid = (editUser) => {
  if (editUser.name !== '' && editUser.email !== '' && editUser.role !== '') {
    if (editUser.name.length < 3) {
      alert('Name must be at least 3 characters long');
    } else if (!editUser.email.match(/.+@+.+\.[com|in|org]+$/)) {
      alert("Enter a valid email id. Ex: 'example@xmail.com'");
    } else if (
      editUser.role.toLowerCase() === 'member' ||
      editUser.role.toLowerCase() === 'admin'
    ) {
      return true;
    } else {
      alert(`Role must be "Admin" or "Member"`);
    }
  } else {
    alert('Input fields must be filled out');
  }
  return false;
};

const Users = () => {
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userPerPage, setUserPerPage] = useState(10);
  const [edit, setEdit] = useState(false);
  const [editUser, setEditUser] = useState({});

  // fetch the api for user data
  const fetchAPI = async () => {
    try {
      let response = await axios.get(config.endpoint);

      // add isChecked and isEdited to perform action on Checkbox & Edit User
      const userDataRecieved = response.data.map((user) => {
        return { ...user, isChecked: false, isEdited: false };
      });

      setUserData(userDataRecieved);
      localStorage.setItem('userData', JSON.stringify(userDataRecieved));
      localStorage.setItem('currentPage', JSON.stringify(currentPage));
    } catch (error) {
      console.log(error);
    }
  };

  // Initial execution of fetchAPI()
  useEffect(() => {
    fetchAPI();
    // eslint-disable-next-line
  }, []);

  //logic to get 10 users/page
  const indexOfLastUser = currentPage * userPerPage;
  const indexOfFirstUser = indexOfLastUser - userPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  //delete a user
  const handleDelete = (userId) => {
    const localUserData = JSON.parse(localStorage.getItem('userData'));
    const updatedUserData = localUserData.filter((user) => userId !== user.id);
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setCurrentPage(JSON.parse(localStorage.getItem('currentPage')));
  };

  //Restore data
  const handleRestore = () => {
    fetchAPI();
  };

  // handle edit click for a single user
  const handleEdit = (userId) => {
    debugger;
    if (!edit) {
      const updatedUserData = userData.map((user) => {
        if (userId === user.id) {
          setEditUser({ ...user, isEdited: true });
          return { ...user, isEdited: true };
        }
        return user;
      });
      setEdit(true);
      setUserData(updatedUserData);
    }
  };

  // save edited user data
  const handleEditSave = (userId) => {
    if (UserInputValid(editUser)) {
      const localUserData = JSON.parse(localStorage.getItem('userData'));
      const editedUserData = localUserData.map((user) => {
        if (userId === user.id) {
          return { ...editUser, isEdited: false };
        }
        return user;
      });

      setCurrentPage(JSON.parse(localStorage.getItem('currentPage')));
      setUserData(editedUserData);
      localStorage.setItem('userData', JSON.stringify(editedUserData));
      setEditUser({});
      setEdit(false);
      alert('User data saved');
    }
  };

  const handleEditCancel = (userId) => {
    const unEditedUserData = userData.map((user) => {
      if (userId === user.id) {
        return { ...user, isEdited: false };
      }
      return user;
    });
    setUserData(unEditedUserData);
    setEditUser({});
    setEdit(false);
  };

  return (
    <div>
      <Header handleRestore={handleRestore} />
      <div className="user-container">
        <table className="user-list">
          <thead className="table-head">
            <tr>
              <th>
                <div className="checkbox-container">
                  <input type="checkbox" id="checkbox" />
                  <label htmlFor="checkbox"></label>
                </div>
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="table-body">
            <UserData
              userData={currentUsers}
              handleDelete={handleDelete}
              handleEdit={handleEdit}
              editUser={editUser}
              setEditUser={setEditUser}
              handleEditSave={handleEditSave}
              handleEditCancel={handleEditCancel}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
