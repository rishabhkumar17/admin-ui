import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header';
import UserData from './UserData';
import Pagination from './Pagination';
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
  const [searchText, setSearchText] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(0);
  const [AllChecked, setAllChecked] = useState(false);

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
    setSearchText('');
    setEdit(false);
  };

  //Restore data
  const handleRestore = () => {
    fetchAPI();
    setAllChecked(false);
    setSearchText('');
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

  // set current page number on click
  const handlePageNumber = (pageNumber) => {
    if (editUser.isEdited) {
      handleEditCancel(editUser.id);
    }
    setCurrentPage(pageNumber);
    localStorage.setItem('currentPage', JSON.stringify(pageNumber));
  };

  // search text
  const searchInputText = (text) => {
    if (text.length) {
      const searchedUserData = userData.filter((user) => {
        return (
          user.name.toLowerCase() === text.toLowerCase() ||
          user.name.split(' ')[0].toLowerCase() === text.toLowerCase() ||
          user.name.split(' ')[1].toLowerCase() === text.toLowerCase() ||
          user.email.toLowerCase() === text.toLowerCase() ||
          user.email.split('@')[0].toLowerCase() === text.toLowerCase() ||
          user.role.toLowerCase() === text.toLowerCase()
        );
      });

      if (searchedUserData.length) {
        setCurrentPage(1);
        setUserData(searchedUserData);
      } else {
        alert('User not found');
        setSearchText('');
        setUserData(JSON.parse(localStorage.getItem('userData')));
      }
    } else {
      setUserData(JSON.parse(localStorage.getItem('userData')));
    }
  };

  // debounce for search optimization
  const debounceSearch = (event, debounceTimeout) => {
    if (debounceTimer !== 0) {
      clearTimeout(debounceTimer);
    }
    const timerId = setTimeout(() => searchInputText(event), debounceTimeout);
    setDebounceTimer(timerId);
  };

  //handle search using debouncing
  const handleSearch = (text) => {
    if (editUser.isEdited === true) {
      alert('Can not search while editing');
    } else {
      setSearchText(text);
      debounceSearch(text, 1000);
    }
  };

  //single checkbox selection to select and unselect the user
  const handleCheckedSingle = (userId) => {
    const updateChecked = userData.map((user) => {
      if (user.id === userId) {
        return { ...user, isChecked: !user.isChecked };
      }
      return user;
    });

    let checkStatus = true;
    for (let check = indexOfFirstUser; check < indexOfLastUser; check++) {
      if (updateChecked[check].isChecked !== true) {
        checkStatus = false;
        break;
      }
    }

    setUserData(updateChecked);
    setAllChecked(checkStatus);
  };

  //handle selection of all checkboxes
  const handleAllChecked = () => {
    setAllChecked(!AllChecked);
    let updateAllChecked;
    if (!AllChecked) {
      updateAllChecked = userData.map((user, idx) => {
        if (indexOfFirstUser <= idx && indexOfLastUser > idx) {
          return { ...user, isChecked: true };
        }
        return { ...user, isChecked: false };
      });
    } else {
      updateAllChecked = userData.map((user, idx) => {
        if (indexOfFirstUser <= idx && indexOfLastUser > idx) {
          return { ...user, isChecked: false };
        }
        return user;
      });
    }
    setUserData(updateAllChecked);
  };

  //delete the all selected checkbox on the current page only
  const handleDeleteSelected = () => {
    if (editUser.isEdited === true) {
      alert('Please save or cancel the edited changes');
    } else {
      const afterDeletedUser = userData.filter((user) => {
        return user.isChecked === false;
      });

      setUserData(afterDeletedUser);
      localStorage.setItem('userData', JSON.stringify(afterDeletedUser));
      setAllChecked(false);
    }
  };

  return (
    <div>
      <Header
        handleRestore={handleRestore}
        searchText={searchText}
        handleSearch={handleSearch}
      />
      <div className="user-container">
        <table className="user-list">
          <thead className="table-head">
            <tr>
              <th>
                <div className="checkbox-container">
                  <input
                    type="checkbox"
                    id="checkboxAll"
                    style={{ width: '16px', height: '16px' }}
                    value={AllChecked}
                    checked={AllChecked}
                    onChange={handleAllChecked}
                  />
                  <label htmlFor="checkboxAll"></label>
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
              handleCheckedSingle={handleCheckedSingle}
            />
          </tbody>
        </table>
      </div>
      <div className="delete-selection-row">
        <button
          type="button"
          className="delete-selected-button"
          onClick={handleDeleteSelected}
        >
          Delete Selected
        </button>
        <Pagination
          userPerPage={userPerPage}
          totalUsers={userData.length}
          handlePageNumber={handlePageNumber}
        />
        <div style={{ color: 'white', width: '12%' }}>{}</div>
      </div>
    </div>
  );
};

export default Users;
