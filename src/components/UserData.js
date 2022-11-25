import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteOutlineSharpIcon from '@mui/icons-material/DeleteOutlineSharp';
import './UserData.css';

const UserData = ({
  userData,
  handleDelete,
  handleEdit,
  editUser,
  setEditUser,
  handleEditSave,
  handleEditCancel,
  handleCheckedSingle,
}) => {
  return userData.map((user) => {
    return (
      <tr
        key={user.id}
        style={{
          height: '45px',
          backgroundColor: user.isChecked ? '#f0f0f5' : '',
        }}
      >
        {user.isEdited ? (
          <>
            <td>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id={`edited-checkbox${user.id}`}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor={`edited-checkbox${user.id}`}></label>
              </div>
            </td>
            <td>
              <input
                type="text"
                value={editUser.name}
                placeholder="Enter your name"
                className="edit-name"
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="email"
                value={editUser.email}
                placeholder="Enter your email"
                className="edit-email"
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
            </td>
            <td>
              <input
                type="text"
                value={editUser.role}
                placeholder="Enter your role"
                className="edit-role"
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              />
            </td>
            <td>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <button
                  type="button"
                  className="save-button"
                  onClick={() => handleEditSave(user.id)}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => handleEditCancel(user.id)}
                >
                  Cancel
                </button>
              </div>
            </td>
          </>
        ) : (
          <>
            <td>
              <div className="checkbox-container">
                <input
                  type="checkbox"
                  id={`checkbox${user.id}`}
                  style={{ width: '16px', height: '16px' }}
                  className="check-box"
                  value={user.isChecked}
                  checked={user.isChecked}
                  onChange={() => handleCheckedSingle(user.id)}
                />
                <label htmlFor={`checkbox${user.id}`}></label>
              </div>
            </td>
            <td style={{ textTransform: 'capitalize' }}>{user.name}</td>
            <td>{user.email}</td>
            <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
            <td className="mobile-action">
              <EditSharpIcon
                onClick={() => handleEdit(user.id)}
                sx={{ cursor: 'pointer' }}
              />
              <DeleteOutlineSharpIcon
                onClick={() => handleDelete(user.id)}
                sx={{ cursor: 'pointer', color: 'red' }}
              />
            </td>
          </>
        )}
      </tr>
    );
  });
};

export default UserData;
