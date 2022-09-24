import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import {
    CToaster,
    CToast,
    CToastBody,
    CToastClose,
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
  import { cilUserPlus, cilPenAlt, cilTrash, cilWarning, cilReload } from '@coreui/icons';
  import { getAdminUsers, getUserAdminSessions, removeAdminUser } from '../../webapi'
  import { UNDELETABLE_ADMIN_NAME } from '../../config'
  import { getUsername } from '../../stateapi/auth'

const AdminUsers = () => {

  const loggedUser = useSelector(getUsername)

  const [users, changeUsers] = useState()
  const [usersEmpty, changeEmptyUsers] = useState()

  const [showClosed, changeShowClosed] = useState(true)
  const [start, changeStart] = useState(0)
  const [pageSize, changePageSize] = useState(1)
  const [resultsSize, changeResultsSize] = useState(0)

  const [total, changeTotal] = useState(0)

  function generateToast(toastColor, toastMessage) {
    return (
      <CToast color={toastColor}
              className="text-white align-items-center"
      >
        <div className="d-flex">
          <CToastBody>{toastMessage}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    )
  }
  const toaster = useRef()
  const [toast, addToast] = useState(0)

  function buildPageSizeControl() {

    return (
      <CFormText className='text-secondary' component="span">
        Table size:&nbsp;
        {(pageSize === 25 ? (<strong>25</strong>) : (<CLink style={{cursor: 'pointer'}} onClick={() => {changePageSize(25)}}>25</CLink>))},&nbsp;
        {(pageSize === 50 ? (<strong>50</strong>) : (<CLink style={{cursor: 'pointer'}} onClick={() => {changePageSize(50)}}>50</CLink>))},&nbsp;
        {(pageSize === 100 ? (<strong>100</strong>) : (<CLink style={{cursor: 'pointer'}} onClick={() => {changePageSize(100)}}>100</CLink>))}&nbsp;
        records per page.
      </CFormText>
    )
  }

  function buildPagingControl() {

    const totalPages = Math.ceil(total/pageSize)
    const activePage = (start/pageSize) + 1

    return (
      <CPagination style={{float: 'right'}} aria-label="Table navigation">
        <CPaginationItem aria-label="Previous" onClick={() => {changeStart(start - pageSize)}} disabled={(start <= 0 ? true : false)}>
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {
          Array.apply(0, Array(totalPages)).map(function (x, i) {
            return (
              <CPaginationItem key={i+1} onClick={() => {changeStart((i) * pageSize)}} active={(activePage == (i + 1) ? true : false)}>{i + 1}</CPaginationItem>
            )
          })
        }
        <CPaginationItem aria-label="Next" onClick={() => {changeStart(start + pageSize)}} disabled={(start >= ((totalPages - 1) * pageSize) ? true : false)}>
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>

    )
  }

  function addUser() {

    console.log('do something!')
  }

  function reloadTable() {
    changeEmptyUsers(false)
    changeUsers(null)
    changeStart(0)

    refresh()
  }

  function changePage() {
    changeEmptyUsers(false)
    changeUsers(null)

    refresh()
  }

  function refresh () {

    const usersPromise = new Promise((resolve, reject) => {
      getAdminUsers(showClosed, start, pageSize)
        .then(response => {
          const { data } = response
          const u = {}
          const resultsLength = data.results.length
          if ( resultsLength > 0 ) {
            data.results.forEach(user => {
              u[user.username] = user
            })
            changeUsers(u)
            changeEmptyUsers(false)
            changeResultsSize(resultsLength)
            changeTotal(data.total)
          } else {
            changeUsers(null)
            changeEmptyUsers(true)
          }
          resolve(u)
        })
        .catch(err => {
          changeUsers(null)
          changeEmptyUsers(true)
          addToast(generateToast("danger","Error fetching data!"))
          reject(err)
        })
    })
    usersPromise
    .then(users => {
      Object.keys(users).forEach(username => {
        if (!users[username].account_closed) {
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
          .catch(_ => {
            const activeState =
              <CAvatar color="dark" size="sm" style={{width: "1rem", height:"1rem", marginTop: "-4px"}} />
            users = {
              ...users,
              [username]: {
                ...users[username],
                activeState
              }
            }
            changeUsers(users)
            addToast(generateToast("warning","Error fetching online status data!"))
          })
        } else {
          const activeState =
            <CTooltip content="User account is marked as closed">
              <CAvatar color="dark" size="sm" style={{width: "1rem", height:"1rem", marginTop: "-4px"}} />
            </CTooltip>
          users = {
            ...users,
            [username]: {
              ...users[username],
              activeState
            }
        }
        changeUsers(users)
        }
      })
    })
    .catch(_ => {})
  } 
  
  //useEffect(() => {refresh()}, [])
  useEffect(() => {reloadTable()}, [showClosed, pageSize])
  useEffect(() => {changePage()}, [start])
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
                  <CFormCheck id="flexCheckChecked" label="Show closed accounts" defaultChecked onChange={(e) => {changeShowClosed(e.target.checked)}}/>
                </small>
              </CCol>
              <CCol>
              <CButton style={{float: 'right', marginTop: '7px'}} onClick={addUser}>
                <CIcon icon={cilUserPlus} style={{color: 'white'}} size="lg"/>&nbsp;New Admin
              </CButton>
              <CButton style={{float: 'right', marginTop: '7px', marginRight: '10px'}} onClick={reloadTable}>
                <CIcon icon={cilReload} style={{color: 'white'}} size="lg"/>
              </CButton>
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
                        {((user.username !== UNDELETABLE_ADMIN_NAME) && (user.username !== loggedUser) && (!user.account_closed) ? (
                          <CButton color="danger">
                            <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                          </CButton>
                        ) : (null))}
                      </CButtonGroup>    
                      </CTableDataCell>
                    </CTableRow>
                  )}
                )) : (
                    usersEmpty ? (
                      <CTableRow style={{ lineHeight:"40px" }}>
                        <CTableDataCell colSpan="7" scope="row">
                          <CIcon icon={cilWarning} size="lg"/>
                          <span style={{ marginLeft:"10px" }}>No records found.</span>
                        </CTableDataCell >
                      </CTableRow>)
                    : (
                      <CTableRow style={{ lineHeight:"40px" }}>
                        <CTableDataCell colSpan="7" scope="row">
                          <CSpinner color="dark" size="sm" />
                        </CTableDataCell >
                      </CTableRow>)
                    )
              }
              </CTableBody>
            </CTable>
            {users ? (
              <CRow>
                  <CCol>
                    {buildPageSizeControl()}
                    <p className='text-dark'>
                      Showing records {start + 1} to {start + resultsSize} out of a total of {total} entries.
                    </p>
                  </CCol>
                  <CCol>
                    {buildPagingControl()}
                  </CCol>
                </CRow>)           
              : (
                null
              )}
          </CCardBody>
        </CCard>
      </CCol>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </CRow>
  )
};

export default AdminUsers;
