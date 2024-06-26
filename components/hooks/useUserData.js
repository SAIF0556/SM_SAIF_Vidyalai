import { useState, useEffect } from 'react';
import axios from 'axios';

// Define column fields for user data table
const columnFields = [
  { value: 'id', label: 'Id' },
  { value: 'name', label: 'Name', enableSearch: true },
  { value: 'email', label: 'Email', enableSearch: true },
  { value: 'username', label: 'Username' },
  { value: 'phone', label: 'Phone' },
  { value: 'website', label: 'Website' },
];

/**
 * Custom hook to manage user data fetching, filtering, searching, and sorting.
 *
 * This hook initializes user data from an API, filters users based on search inputs,
 * and sorts users based on selected column and direction.
 *
 * @returns {object} -
 *
 */
const useUserData = () => {
  // State variables for user data, filtered users, search inputs, and sorting
  const [users, setUsers] = useState([]); // All users fetched from API
  const [filteredUsers, setFilteredUsers] = useState([]); // Users filtered based on search criteria
  const [searchName, setSearchName] = useState(''); // Search input for user name
  const [searchEmail, setSearchEmail] = useState(''); // Search input for user email
  const [sortColumn, setSortColumn] = useState(columnFields[0].value); // Column used for sorting
  const [sortDirection, setSortDirection] = useState('asc'); // Sort direction ('asc' or 'desc')

  // Effect to fetch users from API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: usersData } = await axios.get('/api/v1/users');
        setUsers(usersData);
        setFilteredUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Effect to filter and sort users based on search inputs, sort column, and direction
  useEffect(() => {
    let filteredUsers = users.filter(
      user =>
        user.name.toLowerCase().includes(searchName.toLowerCase()) &&
        user.email.toLowerCase().includes(searchEmail.toLowerCase()),
    );

    if (sortColumn) {
      filteredUsers.sort((a, b) => {
        const x = a[sortColumn];
        const y = b[sortColumn];
        return sortDirection === 'asc' ? (x < y ? -1 : 1) : x > y ? -1 : 1;
      });
    }

    setFilteredUsers(filteredUsers);
  }, [users, searchName, searchEmail, sortColumn, sortDirection]);

  // Function to handle search input changes
  const handleOnSearch = event => {
    const { name, value } = event.target;
    if (name === 'name') {
      setSearchName(value);
    } else if (name === 'email') {
      setSearchEmail(value);
    } else {
      throw new Error('Unknown search element');
    }
  };

  // Function to handle column sorting
  const handleSort = column => {
    if (sortColumn === column) {
      setSortDirection(prevSortDirection =>
        prevSortDirection === 'asc' ? 'desc' : 'asc',
      );
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Return object with user data and functions for components to use
  return {
    users: filteredUsers,
    columnFields,
    handleOnSearch,
    handleSort,
    sortColumn,
    sortDirection,
  };
};

export default useUserData;
