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
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilWarning, cilArrowCircleTop } from '@coreui/icons';
import { getAdminUser, createAdminUser, saveAdminUser, removeAdminUser, removeAllAdminuserSessions, doChangeAdminPassword } from '../../../webapi'
import { UNDELETABLE_ADMIN_NAME, usernameRegex, nameRegex, emailRegex, passwordRegex } from '../../../config'
import { getUsername } from '../../../stateapi/auth'
import { parseTimestamp } from 'src/helpers';

const AdminEdit = () => {

  let navigate = useNavigate();
  const loggedUser = useSelector(getUsername)
  const { mode, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [formMode, changeFormMode] = useState(mode)
  const [submitting, changeSubmitting] = useState(false)
  const [deleting, changeDeleting] = useState(false)
  const [deleteVisible, changeDeleteVisible] = useState(false)
  const [loggingout, changeLoggingout] = useState(false)
  const [logoutUserVisible, changeLogoutUserVisible] = useState(false)
  const [changingPassword, changeChangingPassword] = useState(false)
  const [cPasswordVisible, changeCPasswordVisible] = useState(false)

  const [record, changeRecord] = useState(null)
  const [recordEmpty, changeRecordEmpty] = useState(false)

  const [modalPassword, changeModalPassword] = useState("")
  const [modalPasswordConfirm, changeModalPasswordConfirm] = useState("")

  const [formUsername, changeFormUsername] = useState("")
  const [formFirstName, changeFormFirstName] = useState("")
  const [formLastName, changeFormLastName] = useState("")
  const [formEmail, changeFormEmail] = useState("")
  const [formPassword, changeFormPassword] = useState("")
  const [formPasswordConfirm, changeFormPasswordConfirm] = useState("")
  const [formPasswordConfirmInvalid, changeFormPasswordConfirmInvalid] = useState(false)

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

    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    const passwordMismatch = formPassword != formPasswordConfirm
    if (form.checkValidity() === false || passwordMismatch) {

      changeFormPasswordConfirmInvalid(true)
      addToast(generateToast("warning","Please review your input!"))

    } else {

      changeSubmitting(true)
 
      const modifiedUser = {
        first_name: formFirstName,
        last_name: formLastName,
        email: formEmail
      }
      const newUser = {
        username: formUsername,
        password: formPassword,
        first_name: formFirstName,
        last_name: formLastName,
        email: formEmail,
      }  

      const operation = (formMode == "new" ? createAdminUser(newUser) : saveAdminUser(formUsername, modifiedUser))      
      operation                 
      .then(_ => {

        if (formMode == "new") {
          navigate('/admin-users')
        } else {
          changeSubmitting(false)
          changeFormMode("view")
          getData()
        }
        addToast(generateToast("success","User operation successful!"))
      })
      .catch(err => {

        let message = "Error during user operation!"
        if (err.response.data.message)
          message = "Error: " + err.response.data.message

        if ((formMode == "edit") && (!((err.response.status == 400) && (err.response.data.code == -4)))) {
          changeFormMode("view")
          getData()
        }

        changeSubmitting(false)
        addToast(generateToast("danger",message))
      })
    }
    setValidated(true)
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

    changeDeleting(true)
    removeAdminUser(record.username)
      .then(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("success","User account closed succesfully!"))
        getData()
      })
      .catch(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("danger","Error closing user account!"))
        getData()
      })
  }

  function logOutUser() {

    changeLoggingout(true)
    removeAllAdminuserSessions(record.username)
      .then(_ => {

        changeLogoutUserVisible(false)
        changeLoggingout(false)
        addToast(generateToast("success","User logged out succesfully!"))
        getData()
      })
      .catch(_ => {

        changeLogoutUserVisible(false)
        changeLoggingout(false)
        addToast(generateToast("danger","Error logging out user!"))
        getData()
      })
  }

  function changePassword() {

    if (modalPassword != modalPasswordConfirm) {
      addToast(generateToast("warning","Passwords do not match!"))
    }
    else {
      if (!passwordRegex.test(modalPassword)) {
        addToast(generateToast("warning","Wrong password format!"))
      }
      else {

        changeChangingPassword(true)
        doChangeAdminPassword(username, modalPassword)
          .then(_ => {
            changeChangingPassword(false)
            changeCPasswordVisible(false)
            addToast(generateToast("success","Password change succesful!"))
          })
          .catch(err => {
            let message = "Password change failure!"
            if (err.response.data.message)
              message = "Error: " + err.response.data.message  

            changeChangingPassword(false)
            addToast(generateToast("danger", message))
          })
      }
    }
  }

  useEffect(() => {setupForm()}, [])
  return (
    <CRow>
      { cPasswordVisible ? (
      <CModal alignment="center" visible={cPasswordVisible} onClose={() => {changeModalPassword(""); changeModalPasswordConfirm(""); changeCPasswordVisible(false)}}>
        <CModalHeader>
          <CModalTitle>Change user password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol>
              <strong>Warning!</strong>&nbsp;You are about to change the password for user <strong>"{formUsername}"</strong> ({formEmail}).<br /><br />This action cannot be undone. Are you sure?
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="password"
                placeholder="Please choose a password"
                value={modalPassword}
                onChange={e => changeModalPassword(e.target.value)}
              />
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormInput
                type="password"
                value={modalPasswordConfirm}
                placeholder="Please re-type the password"
                onChange={e => changeModalPasswordConfirm(e.target.value)}
              />
              <CFormText>Passwords must be 8 characters in lenght or greater, have 1 uppercase letter, 1 number and 1 symbol.</CFormText>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton style={{color: 'white'}}
                   ccolor="secondary"
                   disabled={changingPassword}
                   onClick={() => {changeModalPassword(""); changeModalPasswordConfirm(""); changeCPasswordVisible(false)}}>
            Cancel
          </CButton>
          {changingPassword ? (
            <CButton disabled>
              <CSpinner component="span" size="sm" aria-hidden="true"/>
            </CButton>
            ) : (
              <CButton onClick={() => {changePassword()}}>
                &nbsp;Change password
              </CButton>
            )
          }
        </CModalFooter>
      </CModal>
      ) : (
        null
      )}
      { deleteVisible ? (
      <CModal alignment="center" visible={deleteVisible} onClose={() => changeDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Close account</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning!</strong>&nbsp;You are about to close the administrative account for user <strong>"{formUsername}"</strong> ({formEmail}).
          <br /><br />This will:
          <ul>
            <li>Mark the account as closed.</li>
            <li>Log out the user.</li>
          </ul>
          This action cannot be undone. Are you sure?
        </CModalBody>
        <CModalFooter>
          <CButton style={{color: 'white'}}
                   ccolor="secondary"
                   disabled={deleting}
                   onClick={() => changeDeleteVisible(false)}>
            Cancel
          </CButton>
          {deleting ? (
            <CButton style={{color: 'white'}} color="danger" disabled>
              <CSpinner component="span" size="sm" aria-hidden="true"/>
            </CButton>
            ) : (
              <CButton style={{color: 'white'}} color="danger" onClick={() => {closeAccount(false)}}>
                <CIcon icon={cilTrash}/>
                &nbsp;Close account
              </CButton>
            )
          }
        </CModalFooter>
      </CModal>
      ) : (
        null
      )}
      { logoutUserVisible ? (
      <CModal alignment="center" visible={logoutUserVisible} onClose={() => changeLogoutUserVisible(false)}>
        <CModalHeader>
          <CModalTitle>Logout admin user</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning!</strong>&nbsp;You are about to logout admin user <strong>"{formUsername}"</strong> ({formEmail}).
          <br /><br />This will:
          <ul>
            <li>Delete all of the admin user's sessions.</li>
            <li>Log out the admin user.</li>
          </ul>
          This action cannot be undone. Are you sure?
        </CModalBody>
        <CModalFooter>
          <CButton style={{color: 'white'}}
                   ccolor="secondary"
                   disabled={loggingout}
                   onClick={() => changeLogoutUserVisible(false)}>
            Cancel
          </CButton>
          {loggingout ? (
            <CButton style={{color: 'white'}} color="danger" disabled>
              <CSpinner component="span" size="sm" aria-hidden="true"/>
            </CButton>
            ) : (
              <CButton style={{color: 'white'}} color="danger" onClick={() => {logOutUser()}}>
                <CIcon icon={cilTrash}/>
                &nbsp;Logout user
              </CButton>
            )
          }
        </CModalFooter>
      </CModal>
      ) : (
        null
      )}
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
              <CForm
                className="needs-validation align-items-center"
                noValidate
                validated={validated}
                onSubmit={handleSubmit}>
                  <CRow className="mb-3">
                    <CCol md="8">
                      <CRow className="mb-3">
                        <CFormLabel>Username</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormUsername"
                            placeholder="please enter a user name"
                            value={formUsername}
                            onChange={e => changeFormUsername(e.target.value)}
                            disabled={( formMode == "new" ? false : true )}
                            required={true} 
                            pattern={usernameRegex.toString().slice(1, -1)}
                          />
                          <CFormFeedback invalid>Please enter a username</CFormFeedback>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel>Last Name</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormLastName"
                            placeholder="please enter your last name"
                            value={formLastName}
                            onChange={e => changeFormLastName(e.target.value)}
                            disabled={( formMode == "view" ? true : false )}
                            required={true}
                            pattern={nameRegex.toString().slice(1, -1)}
                          />
                          <CFormFeedback invalid>Please enter a last name</CFormFeedback>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel>First Name</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormFirstName"
                            placeholder="please enter your first name"
                            value={formFirstName}
                            onChange={e => changeFormFirstName(e.target.value)}
                            disabled={( formMode == "view" ? true : false )}
                            required={true}
                            pattern={nameRegex.toString().slice(1, -1)}
                          />
                          <CFormFeedback invalid>Please enter a first name</CFormFeedback>
                        </CCol>
                      </CRow>
                      <CRow className="mb-3">
                        <CFormLabel>Email</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormEmail"
                            placeholder="please enter a valid email address"
                            value={formEmail}
                            onChange={e => changeFormEmail(e.target.value)}
                            disabled={( formMode == "view" ? true : false )}
                            required={true}
                            pattern={emailRegex.toString().slice(1, -1)}
                          />
                          <CFormFeedback invalid>Please enter a valid email address</CFormFeedback>
                        </CCol>
                      </CRow>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? null : "none")}}>
                        <CFormLabel>Password</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="password"
                            placeholder="please choose a password"
                            id="adminFormPassword"
                            value={formPassword}
                            onChange={e => changeFormPassword(e.target.value)}
                            disabled={( formMode == "new" ? false : true )}
                            required={( formMode == "new" ? true : false )}
                            pattern={passwordRegex.toString().slice(1, -1)}
                          />
                          <CFormFeedback invalid>Please enter a valid password</CFormFeedback>
                          <CFormText>Passwords must be 8 characters in lenght or greater, have 1 uppercase letter, 1 number and 1 symbol.</CFormText>
                        </CCol>
                      </div>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? null : "none")}}>
                        <CFormLabel>Reenter Password</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="password"
                            placeholder="please re-type your password"
                            id="adminFormPasswordConfirmation"
                            value={formPasswordConfirm}
                            onChange={e => changeFormPasswordConfirm(e.target.value)}
                            disabled={( formMode == "new" ? false : true )}
                            required={( formMode == "new" ? true : false )}
                            pattern={passwordRegex.toString().slice(1, -1)}
                            invalid={formPasswordConfirmInvalid}
                            noValidate
                          />
                          <CFormFeedback invalid>Passwords do not match!</CFormFeedback>
                        </CCol>
                      </div>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? "none" : null)}}>
                        <CFormLabel>Account Closed?</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormAccountClosed"
                            value={(formMode == "new" ? "" : (record.account_closed == true ? "Yes" : "No"))}
                            disabled={true}
                            required={false}
                            noValidate
                          />
                        </CCol>
                      </div>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? "none" : null)}}>
                        <CFormLabel>Database Id</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormId"
                            value={(formMode == "new" ? "" : record.id)}
                            disabled={true}
                            required={false}
                            noValidate
                          />
                        </CCol>
                      </div>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? "none" : null)}}>
                        <CFormLabel>Date Created</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormCreated"
                            value={(formMode == "new" ? "" : parseTimestamp(record.date_created))}
                            disabled={true}
                            required={false}
                            noValidate
                          />
                        </CCol>
                      </div>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? "none" : null)}}>
                        <CFormLabel>Date Updated</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="adminFormExpired"
                            value={(formMode == "new" ? "" : (record.date_updated ? parseTimestamp(record.date_updated) : "None"))}
                            disabled={true}
                            required={false}
                            noValidate
                          />
                        </CCol>
                      </div>
                      </CCol>
                    <CCol style={{ textAlign: 'center' }}>
                      { formMode != "new" ? (
                        <>
                        <CAvatar
                          color="primary"
                          textColor="white"
                          style={{ fontSize: '4.5rem',
                                    width: '150px',
                                    height: '150px',
                                    marginTop: '25px' }}>
                            {record.first_name.charAt(0).toUpperCase() + record.last_name.charAt(0).toUpperCase()}
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
                          {record.last_name + ", " + record.first_name}
                        </div>
                        </>
                      ) : (
                        null
                        )
                      }
                    </CCol>
                    </CRow>
                    {formMode == "view" && !record.account_closed && record.online ? (
                      <CRow className="mb-3">
                        <CCol style={{ marginTop: "50px"}}>
                          <div className="d-grid gap-2 d-sm-flex">
                            <CButton
                                color="success"
                                style={{ color: 'white' }}
                                onClick={() => {navigate("/sessions?user_filter=" + record.username)}}>  
                                <CIcon icon={cilArrowCircleTop}/>
                                &nbsp;User Sessions
                            </CButton>
                          </div>
                        </CCol>
                      </CRow>
                    ) : (
                      null
                    )}
                    <CRow className="mb-3">
                      <CCol style={(formMode == "view" && !record.account_closed && record.online ? null : { marginTop: "50px" } )}>
                        <div className="d-grid gap-2 d-sm-flex">
                          <CButton style={{color: 'white'}}
                            ccolor="secondary"
                            disabled={submitting}
                            onClick={(formMode == "edit" ? () => {changeFormMode("view"); getData()} : () => {navigate("/admin-users")} )}>
                            Cancel
                          </CButton>
                          {submitting ? (
                            <CButton disabled>
                              <CSpinner component="span" size="sm" aria-hidden="true"/>
                            </CButton>
                            ) : (
                              <CButton
                                color="primary"
                                type="submit"
                                style={{ display: ( formMode != "view" ? null : 'none' )}}
                                >
                              Save
                              </CButton>
                            )
                          }
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
                                onClick={() => {changeCPasswordVisible(true)}}>
                                Change Password
                            </CButton>
                            <CButton
                              color="danger"
                              style={{ color: 'white',
                                       display: ((record.account_closed || record.username == loggedUser || !record.online) ? 'none' : null )}}
                              onClick={() => {changeLogoutUserVisible(true)}}>
                              <CIcon icon={cilTrash}/>
                              &nbsp;Logout user
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
