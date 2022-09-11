import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";

const API_URL =
  "https://fiuba-qa-7599-cs-app-server.herokuapp.com/api/v1/users?start=0&limit=0&show_closed=true";

//This header parameter should be obtained previously from the session Token
const config = {
  headers: {
    "X-Auth-Token":
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjI5MzkwMTUsIm5iZiI6MTY2MjkzOTAxNSwianRpIjoiZGJhMTkyZDctOWFlMS00MTlmLTk3ODMtMGI4YTAwODhhMDNmIiwiaWRlbnRpdHkiOiJjbG91ZHN5bmNnb2QiLCJmcmVzaCI6ZmFsc2UsInR5cGUiOiJhY2Nlc3MifQ.t_K_CbL6HtSgNvegzMbgnrTcVEvfWYR2kNt9hF7NXCg",
  },
};

function UsersTable(props) {
  const [usersData, setUsersData] = useState({
    results: [],
  });

  useEffect(() => {
    axios
      .get(API_URL, config)
      .then((response) => {
        setUsersData(response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <CTable
      align="middle"
      className="mb-0 border"
      hover
      responsive
      striped
      bordered
      borderColor="dark"
    >
      <CTableHead color="dark">
        <CTableRow>
          <CTableHeaderCell className="text-center">Username</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Online?</CTableHeaderCell>
          <CTableHeaderCell className="text-center">Last Name</CTableHeaderCell>
          <CTableHeaderCell className="text-center">
            First Name
          </CTableHeaderCell>
          <CTableHeaderCell className="text-center">Email</CTableHeaderCell>
          <CTableHeaderCell className="text-center">
            Login Service?
          </CTableHeaderCell>
          <CTableHeaderCell className="text-center">
            Account Closed?
          </CTableHeaderCell>
          <CTableHeaderCell className="text-center">Actions?</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        {usersData.results.map((item, index) => (
          <CTableRow v-for="item in tableItems" key={index}>
            <CTableDataCell className="text-center">
              {item.username}
            </CTableDataCell>
            <CTableDataCell className="text-center">ADD LOGIC</CTableDataCell>
            <CTableDataCell className="text-center">
              {item.last_name}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              {item.first_name}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              {item.contact.email}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              {item.login_service ? "Yes" : "No"}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              {item.account_closed ? "Yes" : "No"}
            </CTableDataCell>
            <CTableDataCell className="text-center">
              EDIT or DELETE
            </CTableDataCell>
          </CTableRow>
        ))}
      </CTableBody>
    </CTable>
  );
}

export default UsersTable;
