import CIcon from "@coreui/icons-react";
import { CButton } from "@coreui/react";
import React from "react";
import UsersTable from "./users-table";
//TODO: Add the user with plus symbol icon to the "Add new user" button
import { cilUserPlus } from "@coreui/icons";

/*

This is the users component which will eventually be rendered in the corresponding "Users"
section of the website.
This page will make all users information available to the administrator logged in the site.

*/
const Users = (props) => {
  return (
    <>
      <h1 align="middle">Users Information Table</h1>
      <CButton color="info" shape="rounded-pill">
        Add New User
      </CButton>
      <UsersTable />
    </>
  );
};

export default Users;
