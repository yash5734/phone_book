import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Table({ deleteUser, updateUser }) {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // Number of items to display per page

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("http://localhost:3000/api/getusers");
        setData(response.data); // Assuming response.data is an array of users
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
  }, []);

  const handleDelete = (userId) => {
    deleteUser(userId); // Call the deleteUser function passed as prop
  };

  const handleUpdate = (userId) => {
    updateUser(userId); // Call the updateUser function passed as prop
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update searchQuery state
    setCurrentPage(1); // Reset currentPage when search query changes
  };

  // Filter data based on searchQuery
  const filteredData = data.filter((elem) =>
    Object.values(elem).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Sort filteredData by full name
  filteredData.sort((a, b) => {
    const fullNameA = [a.first_name, a.middle_name, a.last_name]
      .filter(Boolean)
      .join(" ");
    const fullNameB = [b.first_name, b.middle_name, b.last_name]
      .filter(Boolean)
      .join(" ");
    return fullNameA.localeCompare(fullNameB);
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>
                <b>Contacts</b>
                </h2>
              </div>
              <div className="col-sm-6">
                <button
                  className="btn btn-success"
                  data-bs-toggle="modal"
                  data-bs-target="#addEmployeeModal"
                >
                  <i className="material-icons">&#xE147;</i>{" "}
                  <span>Add New Contact</span>
                </button>
              </div>
            </div>
          </div>
          {/* Search input */}
          <div>
            <input
              type="text"
              className="btn border"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone 1</th>
                <th>Phone 2</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((elem, index) => (
                <tr key={index}>
                  <td style={{paddingRight :"100px"}}>
                    {[elem.first_name, elem.middle_name, elem.last_name]
                      .filter(Boolean)
                      .join(" ")}
                  </td>
                  <td >{elem.email}</td>
                  <td>{elem.phone_1}</td>
                  <td>{elem.phone_2}</td>
                  <td>{elem.address}</td>
                  <td>
                    <a
                      href="#"
                      className="edit"
                      data-bs-toggle="modal"
                      data-bs-target="#editEmployeeModal"
                      onClick={() => handleUpdate(elem.id)}
                    >
                      <i className="material-icons" title="Edit">
                        &#xE254;
                      </i>
                    </a>
                    <a
                      href="#"
                      className="delete"
                      data-bs-toggle="modal"
                      data-bs-target="#deleteEmployeeModal"
                      onClick={() => handleDelete(elem.id)}
                    >
                      <i className="material-icons" title="Delete">
                        &#xE872;
                      </i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <nav>
            <ul className="pagination">
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <a href="#!" className="page-link" onClick={() => paginate(index + 1)}>
                    {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
