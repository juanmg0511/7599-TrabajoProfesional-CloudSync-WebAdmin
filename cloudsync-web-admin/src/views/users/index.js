import CIcon from "@coreui/icons-react";
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from "@coreui/react";
import React from "react";

/*

This is the users component which will eventually be rendered in the corresponding "Users"
section of the website.
This page will make all users information available to the administrator logged in the site.

*/

const mockData = {
  total: 13,
  limit: 0,
  next: null,
  previous: null,
  results: [
    {
      id: "629b5f1d0450d9f174aab0f4",
      username: "juan0511",
      first_name: "Juan Manuel",
      last_name: "Gonzalez",
      contact: {
        email: "juan0511@yahoo.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-06-04T13:33:17.212345",
      date_updated: "2022-07-24T23:08:01.929147",
    },
    {
      id: "629fc28ef56c9b8635a1c604",
      username: "juan0512",
      first_name: "Juan Manuel",
      last_name: "Gonzalez",
      contact: {
        email: "juan0511@yahoo.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-06-07T21:26:38.576244",
      date_updated: null,
    },
    {
      id: "62a7afd595615fbc173f68bd",
      username: "dmf",
      first_name: "Damián",
      last_name: "Marquesín Fernandez",
      contact: {
        email: "dmforgan89@gmail.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: true,
      account_closed: false,
      date_created: "2022-06-13T21:44:53.099832",
      date_updated: null,
    },
    {
      id: "62a7bc8747a23f2278e3a3ec",
      username: "juan0514",
      first_name: "Damián",
      last_name: "Marquesín Fernandez",
      contact: {
        email: "juanmg0511@gmail.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: false,
      account_closed: true,
      date_created: "2022-06-13T22:39:03.397973",
      date_updated: "2022-06-23T20:53:47.647453",
    },
    {
      id: "62a7bca5359f2b7435e3a3ed",
      username: "dmf2",
      first_name: "Damián",
      last_name: "Marquesín Fernandez",
      contact: {
        email: "dmforgan89@gmail.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: true,
      account_closed: false,
      date_created: "2022-06-13T22:39:33.698435",
      date_updated: null,
    },
    {
      id: "62b4f0fd628f027441c8415c",
      username: "juan05145",
      first_name: "Damián",
      last_name: "Marquesín Fernandez",
      contact: {
        email: "juanmg0511@gmail.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-06-23T23:02:21.213904",
      date_updated: null,
    },
    {
      id: "62b4f114628f027441c8415e",
      username: "juan05146",
      first_name: "Damián",
      last_name: "Marquesín Fernandez",
      contact: {
        email: "juanmg0511@gmail.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-06-23T23:02:44.396990",
      date_updated: null,
    },
    {
      id: "62ca4e7273ca6dc465998663",
      username: "unityui",
      first_name: "Creado",
      last_name: "EnUnity",
      contact: {
        email: "desde@unity.com",
        phone: "1234 5678",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-07-10T03:58:42.367020",
      date_updated: null,
    },
    {
      id: "62ca512573ca6dc465998668",
      username: "registrodesdeunity",
      first_name: "nuevo",
      last_name: "user",
      contact: {
        email: "funciona@elregistro.com",
        phone: "1111 1111",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-07-10T04:10:13.287775",
      date_updated: null,
    },
    {
      id: "62cb44c5fe04b8aa008d4ed9",
      username: "pedro125",
      first_name: "Pedro",
      last_name: "De Mendoza",
      contact: {
        email: "pedro@pedro.com",
        phone: "1111 1111",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-07-10T21:29:41.149462",
      date_updated: null,
    },
    {
      id: "62cb4b8efe04b8aa008d4ee0",
      username: "pedro126",
      first_name: "Pedro",
      last_name: "Lopez",
      contact: {
        email: "pedro@pedro.com",
        phone: "-1",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-07-10T21:58:38.307092",
      date_updated: null,
    },
    {
      id: "62dc57d9dd78552a816f560c",
      username: "nuevo",
      first_name: "nu",
      last_name: "evo",
      contact: {
        email: "nuevo@gmail.com",
        phone: "-1",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-07-23T20:19:36.883667",
      date_updated: null,
    },
    {
      id: "62dea185aa3c066b91bb7fc3",
      username: "juan05140",
      first_name: "Damián",
      last_name: "Marquesín Fernandez",
      contact: {
        email: "juanmg0511@gmail.com",
        phone: "5555 5555",
      },
      avatar: "...",
      login_service: false,
      account_closed: false,
      date_created: "2022-07-25T13:58:28.698799",
      date_updated: null,
    },
  ],
};
//TODO: Make the online prop logic!
const Users = (props) => {
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
        {mockData.results.map((item, index) => (
          <CTableRow v-for="item in tableItems" key={index}>
            <CTableDataCell className="text-center">
              {item.username}
            </CTableDataCell>
            <CTableDataCell className="text-center">YES</CTableDataCell>
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
};

export default Users;
