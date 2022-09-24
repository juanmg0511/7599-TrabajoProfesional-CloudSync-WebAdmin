import React, { useState, useEffect } from 'react';
import {
    CAvatar,
    CLink,
    CFormText,
    CFormCheck,
    CButton,
    CButtonGroup,
    CCallout,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
    CSpinner,
    CTooltip,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilUserPlus, cilPenAlt, cilTrash } from '@coreui/icons';
  import { getAdminUsers, getUserAdminSessions, removeAdminUser } from '../../webapi'
  import { UNDELETABLE_ADMIN_NAME } from '../../config'
/*

A nice comment

*/

const AdminUsers = (props) => {

  const [users, changeUsers] = useState()

  function refresh () {
      const usersPromise = new Promise((resolve, reject) => {
        getAdminUsers()
          .then(response => {
            const { data } = response
            const u = {}
            data.results.forEach(user => {
              u[user.username] = user
            })
            changeUsers(u)
            resolve(u)
          })
          .catch(err => {
            reject(err)
          })
      })
      usersPromise
      .then(users => {
        Object.keys(users).forEach(username => {
          getUserAdminSessions(username).then(response => {
            const { data } = response
            const activeState =
              data.results.length > 0 ? (
                <CTooltip content="User is online">
                  <CAvatar color="success" size="sm" style={{width: "1rem", height:"1rem", marginTop: "-4px"}} />
                </CTooltip>
              ) : (
                <CTooltip content="User is offline">
                  <CAvatar color="danger" size="sm" style={{width: "1rem", height:"1rem", marginTop: "-4px"}} />
                </CTooltip>
              )
            users = {
              ...users,
              [username]: {
                ...users[username],
                activeState
              }
            }
            changeUsers(users)
          })
        })
      })
      .catch(_ => {})
  } 
  
  useEffect(
    () => {
      refresh()
    },
    []
  )

  return (
    <CRow>
      <CCol xs={12}>
        <CCallout color="info" className="bg-white">
          <p>Welcome to the <strong>Administrators</strong> listing!</p>
          <p>From this page you can manage all FIUBA CloudSync administrators:</p>
          <ul>
              <li>Create new admins</li>
              <li>View or Edit a particular admin's details</li>
              <li>Close an admin's account</li>
          </ul>
        </CCallout>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol>
                <strong>Administrators list</strong>
                <small>
                  <CFormCheck id="flexCheckChecked" label="Show closed accounts" defaultChecked />
                </small>
              </CCol>
              <CCol>
              <CButton style={{float: 'right', marginTop: '7px'}}>
                <CIcon icon={cilUserPlus} style={{color: 'white'}} size="lg"/>New Admin</CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CTable striped align="middle" style={{textAlign: 'center'}}>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col">First name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Last name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Online?</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Closed account?</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {users ? (
                (Object.values(users) || []).map(user => {
                  return (
                    <CTableRow key={user.id}>
                      <CTableHeaderCell scope="row">{user.username}</CTableHeaderCell>
                      <CTableDataCell>{user.first_name}</CTableDataCell>
                      <CTableDataCell>{user.last_name}</CTableDataCell>
                      <CTableDataCell>{user.email}</CTableDataCell>
                      <CTableDataCell>{user.activeState || <CSpinner color="dark" variant="grow" size="sm" />}</CTableDataCell>
                      <CTableDataCell>{(user.account_closed ? 'Yes' : 'No')}</CTableDataCell>
                      <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary">
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                        {(user.username !== UNDELETABLE_ADMIN_NAME ? (
                          <CButton color="danger">
                            <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                          </CButton>
                        ) : (null))}
                      </CButtonGroup>    
                      </CTableDataCell>
                    </CTableRow>
                  )}
                )) : (
                    <CTableRow>
                      <CTableHeaderCell colSpan="7" scope="row">
                        Loading...
                      </CTableHeaderCell>
                    </CTableRow>
                )}
              </CTableBody>
            </CTable>
            {users ? (
              <CRow>
                  <CCol>
                    <CFormText className='text-secondary' component="span">
                      Table size:&nbsp;
                      <strong>25</strong>,&nbsp; 
                      <CLink href="#">50</CLink>,&nbsp;
                      <CLink href="#">100</CLink>&nbsp;
                      records per page.
                    </CFormText>
                    <p className='text-dark'>
                      Showing records 1 to 5 out of a total of 5 entries.
                    </p>
                  </CCol>
                  <CCol>
                    <CPagination style={{float: 'right'}} aria-label="Table navigation">
                      <CPaginationItem aria-label="Previous" disabled>
                        <span aria-hidden="true">&laquo;</span>
                      </CPaginationItem>
                      <CPaginationItem active>1</CPaginationItem>
                      <CPaginationItem>2</CPaginationItem>
                      <CPaginationItem>3</CPaginationItem>
                      <CPaginationItem aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                      </CPaginationItem>
                    </CPagination>
                  </CCol>
                </CRow>)           
              : (
                null
              )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
};

export default AdminUsers;
