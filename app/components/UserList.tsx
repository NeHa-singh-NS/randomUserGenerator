//@ts-nocheck
import axios from 'axios';
import { useEffect, useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const isDeleteDisabled = !selectedUsers.length;

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('https://randomuser.me/api/');
      const fetchedUser = data.results[0];
        
      // Save the fetched user to MongoDB
      try {
        const response = await axios.post('/api/create', fetchedUser);
        console.log('User saved to MongoDB:', response.data);
      } catch (error) {
        console.error('Failed to save user to MongoDB:', error);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };
  const fetchAllUser = async () => {
    try {
        const response = await axios.get('/api/users');
        const {data} = response;
        console.log(data,'fetched')
        setUsers(data)
      
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };
  const sortByName = () => {
    const sortedUsers = [...users].sort((user1, user2) => {
      const fullName1 = `${user1.firstName} ${user1.lastName}`;
      const fullName2 = `${user2.firstName} ${user2.lastName}`;

      if (sortOrder === 'asc') {
        return fullName1.localeCompare(fullName2); // Ascending sort
      } else {
        return fullName2.localeCompare(fullName1); // Descending sort
      }
    });
    setUsers(sortedUsers);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sort order
  };

  const filterYoungestTwo = () => {
    const youngestTwo = [...users]
      .sort((user1, user2) => user1.age - user2.age)
      .slice(0, 2); // Sort and get the first two users by age
    setUsers(youngestTwo);
  };
  const handleEdit = async () => {
    if (!selectedUsers.length) {
      alert('Please select at least one user to edit.');
      return;
    }

    console.log('Edit functionality triggered for selected users:', selectedUsers);
  };
  const handleSelectUser = (userId) => {
    const isSelected = selectedUsers.includes(userId);
    setSelectedUsers(isSelected ? selectedUsers.filter((id) => id !== userId) : [...selectedUsers, userId]);
  };

  const handleDeleteUsers = async () => {
    if (!selectedUsers.length) {
      alert('Please select at least one user to delete.');
      return;
    }

    try {
      const deletedUserIds = selectedUsers.slice(); // Clone selected users for deletion

      for (const userId of deletedUserIds) {
        // Send DELETE request for each selected user
        await axios.delete(`/api/users/${userId}`);
      }

      setSelectedUsers([]); // Clear selected users

      // Update UI to reflect deleted users immediately
      setUsers(users.filter((user) => !deletedUserIds.includes(user.id)));
    } catch (error) {
      console.error('Failed to delete users:', error);
      // Handle deletion errors (e.g., display error message)
    }
  };
  useEffect(() => {
    fetchUser();
    fetchAllUser();
  }, []);

  return (
    <div className="container mx-auto px-4 py-4">
    <div className="flex justify-between mb-4">
      <div className="flex space-x-2">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={sortByName}
        >
          Sort by Name {sortOrder === 'asc' ? '⬆️' : '⬇️'}
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
          onClick={filterYoungestTwo}
        >
          Show Youngest Two
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={handleEdit}
          disabled={!selectedUsers.length} // Disable edit button if no users selected
        >
          Edit Selected ({selectedUsers.length})
        </button>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 disabled:opacity-50" disabled={isDeleteDisabled} onClick={handleDeleteUsers}>
        Delete Selected Users
      </button>
      </div>
    </div>

    <ul className="list-none divide-y divide-gray-200">
      {users &&
        users.map((user) => (
          <li key={user.id} className="py-4 flex items-center space-x-4">
            <div className="flex items-center">
            <input
                  type="checkbox"
                  className="mr-2 focus:ring-0 focus:outline-none"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                />
              <img
                className="h-10 w-10 rounded-full object-cover mr-2"
                src={user.mediumPicture}
                alt="User avatar"
              />
              <span className="text-base font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-base font-medium">Age: {user.age}</span>
            </div>
          </li>
        ))}
    </ul>

    {users?.length === 0 && (
      <p className="text-center text-gray-500 mt-4">No users found.</p>
    )}
  </div>
  
  );
};

export default UserList;
