// client/src/components/Users/UserList.js

import React from 'react';

const UserList = ({ users }) => {
  return (
    <table className="table table-bordered table-hover mt-3">
      <thead className="table-light">
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {users.length === 0 ? (
          <tr>
            <td colSpan="3" className="text-center">No users found</td>
          </tr>
        ) : (
          users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default UserList;

