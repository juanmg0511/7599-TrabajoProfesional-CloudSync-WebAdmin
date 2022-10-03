import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import qs from 'qs'
import {
  CAvatar,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,  
  CTooltip,
  CCallout,
  CButtonToolbar,
  CButtonGroup,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CFormText,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUserPlus, cilPenAlt, cilTrash, cilWarning, cilReload, cilFilter, cilFilterX } from '@coreui/icons';
import { getAdminUser, getAdminUsers, getUserAdminSessions, removeAdminUser } from '../../../webapi'
import { UNDELETABLE_ADMIN_NAME, PAGE_SIZES, usernameRegex } from '../../../config'
import { getUsername } from '../../../stateapi/auth'


const AdminEdit = () => {

  let navigate = useNavigate();
  const loggedUser = useSelector(getUsername)
  const { mode, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [formMode, changeFormMode] = useState(mode)
  const [deleteVisible, changeDeleteVisible] = useState(false)

  const [record, changeRecord] = useState(null)
  const [recordEmpty, changeRecordEmpty] = useState(false)

  const [formUsername, changeFormUsername] = useState("")
  const [formFirstName, changeFormFirstName] = useState("")
  const [formLastName, changeFormLastName] = useState("")
  const [formEmail, changeFormEmail] = useState("")

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


  const [validated, setValidated] = useState(false)
  const handleSubmit = (event) => {

    try {
      const form = event.currentTarget
      if (form.checkValidity() === false) {

        event.preventDefault()
        event.stopPropagation()
        addToast(generateToast("warning","Please review your input!"))
     } else {

        addToast(generateToast("success","Operation successful!"))
     }
      setValidated(true)
      //navigate("/admin-users")  
    } catch { }
  }

  function setupForm() {

    if (formMode=="new") {
      changeFormMode('new')
    } else {
      if (formMode == "edit") {
        changeFormMode('edit')
        getData()
      } else {
        changeFormMode('view')
        getData()
      }
    }
  }

  function getData() {

    getAdminUser(username)
    .then(response => {
        const { data } = response
        const resultsLength = data.username.length
        if ( resultsLength > 0 ) {
          changeRecord(data)
          changeFormUsername(data.username)
          changeFormFirstName(data.first_name)
          changeFormLastName(data.last_name)
          changeFormEmail(data.email)
        } else {
          changeRecord(null)
          changeRecordEmpty(true)
        }
    })
    .catch(_ => {
        changeRecord(null)
        changeRecordEmpty(true)
        addToast(generateToast("danger","Error fetching data!"))
    })
  }

  function closeAccount() {

    removeAdminUser(record.username)
      .then(_ => {

        changeDeleteVisible(false)
        addToast(generateToast("success","User account closed succesfully!"))
        getData()
      })
      .catch(_ => {

        changeDeleteVisible(false)
        addToast(generateToast("danger","Error closing user account!"))
        getData()
      })
  }

  function parseTimestamp(timestamp) {
    const date = new Date(timestamp)
    return date.toUTCString()
  }  

  useEffect(() => {setupForm()}, [])
  return (
    <CRow>
      <CModal alignment="center" visible={deleteVisible} onClose={() => changeDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Close account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning!</strong>&nbsp;You are about to close the administrative account for user <strong>"{formUsername}"</strong> ({formEmail}).<br /><br />This action cannot be undone. Are you sure?
        </CModalBody>
        <CModalFooter>
          <CButton style={{color: 'white'}} color="secondary" onClick={() => changeDeleteVisible(false)}>
            Cancel
          </CButton>
          <CButton style={{color: 'white'}} color="danger" onClick={() => {closeAccount(false)}}>
            <CIcon icon={cilTrash}/>
            &nbsp;Close account
          </CButton>
        </CModalFooter>
      </CModal>
      <CCol style={{marginLeft: 'auto', marginRight: 'auto'}} xs={10}>
        <CCallout color="info" className="bg-white">
          <p>Welcome to the <strong>Administrator details</strong> page!</p>
          <p>From this page you can create, view or edit a FIUBA CloudSync administrator:</p>
          <ul>
              <li>Create new admins</li>
              <li>View or Edit a particular admin's details</li>
              <li>Close an admin's account</li>
          </ul>
        </CCallout>
        <CCard className="mb-4">
          <CCardBody>
            {(record || (formMode == 'new')) ? (
              <CRow>            
                <CCol>
                  <CForm
                    className="needs-validation align-items-center"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}>
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="validationCustom01">Username</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom01"
                              placeholder="please enter a user name"
                              value={formUsername}
                              onChange={e => changeFormUsername(e.target.value)}
                              disabled={( formMode == "new" ? false : true )}
                              required={true} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="validationCustom02">First Name</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom02"
                              placeholder="your first name"
                              value={formFirstName}
                              onChange={e => changeFormFirstName(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="validationCustom03">Last Name</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom03"
                              placeholder="your last name"
                              value={formLastName}
                              onChange={e => changeFormLastName(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel htmlFor="validationCustom04">Email</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom04"
                              placeholder="enter a valid email address"
                              value={formEmail}
                              onChange={e => changeFormEmail(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </CRow>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? null : "none")}}>
                          <CFormLabel htmlFor="validationCustom05">Password</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="password"
                              placeholder="please choose a password"
                              id="validationCustom05"
                              disabled={( formMode == "new" ? false : true )}
                              required={( formMode == "new" ? true : false )} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                            <CFormText>Passwords must be 8 characters in lenght or greater, have 1 uppercase letter, 1 number and 1 symbol.</CFormText>
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? null : "none")}}>
                          <CFormLabel htmlFor="validationCustom06">Reenter Password</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="password"
                              placeholder="please re-type your password"
                              id="validationCustom06"
                              disabled={( formMode == "new" ? false : true )}
                              required={( formMode == "new" ? true : false )} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom07">Account Closed?</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom07"
                              value={(formMode == "new" ? "" : (record.account_closed == true ? "Yes" : "No"))}
                              disabled={true}
                              required={false} />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom08">Database Id</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom08"
                              value={(formMode == "new" ? "" : record.id)}
                              disabled={true}
                              required={false} />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom09">Date Created</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom09"
                              value={(formMode == "new" ? "" : parseTimestamp(record.date_created))}
                              disabled={true}
                              required={false} />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom10">Date Updated</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom10"
                              value={(formMode == "new" ? "" : (record.date_updated ? parseTimestamp(record.date_updated) : "None"))}
                              disabled={true}
                              required={false} />
                          </CCol>
                        </div>
                        <CRow className="mb-3">
                          <CCol style={{ marginTop: "50px"}}>
                            <div className="d-grid gap-2 d-sm-flex">
                              <CButton
                                color="secondary"
                                onClick={() => {navigate("/admin-users")}}>
                                Cancel
                              </CButton>
                              <CButton
                                    color="primary"
                                    type="submit"
                                    style={{ display: ( formMode != "view" ? null : 'none' )}}
                                    onClick={() => {handleSubmit()}}>
                                    Save
                              </CButton>
                              {formMode == "view" ? (
                                <>
                                <CButton
                                    color="primary"
                                    style={{ display: ( (!record.account_closed) ? null : 'none' )}}
                                    onClick={() => {changeFormMode("edit")}}>
                                    Edit
                                </CButton>
                                <CButton
                                    color="primary"
                                    style={{ display: ( (!record.account_closed) ? null : 'none' )}}
                                    onClick={() => {changePassword()}}>
                                    Change Password
                                </CButton>
                                <CButton
                                    color="danger"
                                    style={{ color: 'white',
                                            display: ( ((record.username !== UNDELETABLE_ADMIN_NAME) && (record.username !== loggedUser) && (!record.account_closed)) ? null : 'none' )}}
                                    onClick={() => {changeDeleteVisible(true)}}>
                                    <CIcon icon={cilTrash}/>
                                    &nbsp;Close account
                                </CButton>
                                </>
                              ) : (
                                null
                              )}
                            </div>
                        </CCol>
                      </CRow>
                  </CForm>
                </CCol>
                <CCol md="4"
                      style={{ textAlign: 'center' }}
                      className="d-none d-xl-block d-xxl-block">
                  { formMode != "new" ? (
                    <>
                    <CAvatar
                      color="primary"
                      textColor="white"
                      style={{ fontSize: '4.5rem',
                               width: '150px',
                               height: '150px',
                               marginTop: '25px' }}>
                        {record.username.charAt(0).toUpperCase()}
                        <CTooltip content={(record.online ? "User is online" : (record.account_closed ? "User account is marked as closed" : "User is offline"))}
                                  placement="bottom">
                          <span className={"avatar-status " + (record.online ? "bg-success" : (record.account_closed ? "bg-dark" : "bg-danger"))}
                                style = {{ width: '50px',
                                          height: '50px' }}>
                          </span>
                        </CTooltip>
                    </CAvatar>
                    <div style={{ fontWeight: 'bold',
                                  marginTop: '10px' }}>
                      {record.username}
                    </div>
                    </>
                  ) : (
                    null
                    )
                  }
                </CCol>
              </CRow> 
            ) : (
              recordEmpty ? (
                <CRow>
                  <CCol style={{ textAlign: 'center',
                                 padding: '20px',
                                 marginLeft: '20px',
                                 marginRight: '20px' }}>
                    <CIcon icon={cilWarning} size="lg"/>
                    <span style={{ marginLeft:"10px" }}>
                      Error fetching user data.
                    </span>
                  </CCol>
                </CRow>                 
              ) : (
                <CRow>
                  <CCol style={{ textAlign: 'center',
                                 padding: '20px',
                                 marginLeft: '20px',
                                 marginRight: '20px' }}>
                    <CSpinner color="dark" size="sm" />
                  </CCol>
                </CRow>
              )
            )
          }
          </CCardBody>
        </CCard>
      </CCol>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </CRow>
  )
};

export default AdminEdit;
