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
  CFormSwitch,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilWarning } from '@coreui/icons';
import { getUser, createUser, saveUser, removeUser, doChangeUserAvatar, doChangeUserPassword } from '../../../webapi'
import { usernameRegex, nameRegex, emailRegex, passwordRegex, urlRegex, defaultAvatarSize, defaultAvatarWidth, defaultAvatarHeight } from '../../../config'
import { getUsername } from '../../../stateapi/auth'
import { parseTimestamp, getDefaulAvatartUrl } from 'src/helpers';

const UsersEdit = () => {

  let navigate = useNavigate();
  const loggedUser = useSelector(getUsername)
  const { mode, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [formMode, changeFormMode] = useState(mode)
  const [submitting, changeSubmitting] = useState(false)
  const [deleting, changeDeleting] = useState(false)
  const [deleteVisible, changeDeleteVisible] = useState(false)
  const [changingPassword, changeChangingPassword] = useState(false)
  const [cPasswordVisible, changeCPasswordVisible] = useState(false)
  const [changingAvatar, changeChangingAvatar] = useState(false)
  const [cAvatarVisible, changeCAvatarVisible] = useState(false)

  const [record, changeRecord] = useState(null)
  const [recordEmpty, changeRecordEmpty] = useState(false)

  const [modalIsUrl, changeModalIsUrl] = useState(false)
  const [modalImg, changeModalImg] = useState("")
  const [modalImgPath, changeModalImgPath] = useState("")
  const [modalUrl, changeModalUrl] = useState("")

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

    const passwordMissMatch = (formPassword != formPasswordConfirm ? changeFormPasswordConfirmInvalid(true) : changeFormPasswordConfirmInvalid(false))
    if (form.checkValidity() === false || passwordMissMatch) {

      addToast(generateToast("warning","Please review your input!"))

    } else {

      changeSubmitting(true)
 
      const modifiedUser = {
        first_name: formFirstName,
        last_name: formLastName,
        contact: {
            email: formEmail,
            phone: "5555 5555",
        },
      }
      const newUser = {
        username: formUsername,
        password: formPassword,
        first_name: formFirstName,
        last_name: formLastName,
        avatar: {
          isUrl: true,
          data: getDefaulAvatartUrl(formFirstName,formLastName),
        },
        contact: {
            email: formEmail,
            phone: "5555 5555"
        },
      }  

      const operation = (formMode == "new" ? createUser(newUser) : saveUser(formUsername, modifiedUser))      
      operation                 
      .then(_ => {

        if (formMode == "new") {
          navigate('/users')
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

        if (formMode == "edit") {
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

    getUser(username)
    .then(response => {
        const { data } = response
        const resultsLength = data.username.length
        if ( resultsLength > 0 ) {
          changeRecord(data)
          changeFormUsername(data.username)
          changeFormFirstName(data.first_name)
          changeFormLastName(data.last_name)
          changeFormEmail(data.contact.email)

          changeModalIsUrl(data.avatar.isUrl)
          changeModalUrl("")
          changeModalImgPath("")
          changeModalImg("")
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
    removeUser(record.username)
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

  function handleModalIsUrlChange() {

    if (modalIsUrl) {
      changeModalUrl("")
    }
    else {
      changeModalImg("")
      changeModalImgPath("")
    }
    changeModalIsUrl(!modalIsUrl)
  }

  function changeAvatar() {

    changeChangingAvatar(true)
    if (modalIsUrl) {

      if (modalUrl.match(urlRegex)) {
        let newAvatar = {
          isUrl: true,
          data: modalUrl,
        }
        changeAvatarPatch(newAvatar)
      }
      else {
        addToast(generateToast("warning","Please verify your input!"))
        changeChangingAvatar(false)
      }
    }
    else {
      const reader = new FileReader()
      reader.addEventListener('load', (event) => {
        
        const result = event.target.result
        let validFile = false
        let validMessage = "Please verify your input!"

        if (modalImg.type && !modalImg.type.startsWith('image/')) {
          validMessage = "File is not an image!"
        } else {
          if (modalImg.size > (defaultAvatarSize * 1024)) {
            validMessage = "File size exceeds allowed maximum!"
          } else {
            validFile = true
            let image = new Image();
            image.src = result;
            image.onload = function() {
              if (image.width > defaultAvatarWidth || image.height > defaultAvatarHeight) {
                addToast(generateToast("warning","Image dimensions exceed allowd maximum!"))
                changeChangingAvatar(false)                
              }
              else {
                let newAvatar = {
                  isUrl: false,
                  data: result.split(',')[1],
                }
                changeAvatarPatch(newAvatar)
              }
            }
            image.onerror = function() {
              addToast(generateToast("warning","Image is corrupt or invalid!"))
              changeChangingAvatar(false)
            }
          }
        }
        if (!validFile) {
          addToast(generateToast("warning",validMessage))
          changeChangingAvatar(false)          
        }
      })
      reader.readAsDataURL(modalImg)
    }
  }

  function changeAvatarPatch(newAvatar) {

    doChangeUserAvatar(username, newAvatar)
      .then(_ => {
        changeChangingAvatar(false)
        changeCAvatarVisible(false)
        addToast(generateToast("success","Avatar change succesful!"))
        getData()
      })
      .catch(err => {
        let message = "Avatar change failure!"
        if (err.response.data.message)
          message = "Error: " + err.response.data.message  

        changeChangingAvatar(false)
        addToast(generateToast("danger", message))
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
        doChangeUserPassword(username, modalPassword)
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
  
  function handleBrokenAvatar(e) {

    e.currentTarget.src = getDefaulAvatartUrl(formFirstName, formLastName)
  }


  useEffect(() => {setupForm()}, [])
  return (
    <CRow>
      { cAvatarVisible ? (
      <CModal alignment="center" visible={cAvatarVisible} onClose={() => {getData(); changeCAvatarVisible(false) }}>
        <CModalHeader>
          <CModalTitle>Change user avatar</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow className="mb-3">
            <CCol>
              Use this window to change the avatar for user <strong>"{formUsername}"</strong> ({formEmail}). You have the choice of setting a URL or uploading an image file.
            </CCol>
          </CRow>
          <CRow className="mb-3">
            <CCol>
              <CFormLabel>Is URL</CFormLabel>
              <CFormSwitch
                id="formIsUrl"
                size="xl"
                color="primary"
                checked={modalIsUrl}
                onChange={() => handleModalIsUrlChange()}
              />
            </CCol>
          </CRow>
          { modalIsUrl ? (
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Avatar URL</CFormLabel>
                <CFormInput
                  type="text"
                  id="formUrl"
                  value={modalUrl}
                  onChange={(e) => changeModalUrl(e.target.value)}
                />
                <CFormText>Please enter a valid URL, pointing to an image file.</CFormText>
              </CCol>
            </CRow>
        ) : (
            <CRow className="mb-3">
              <CCol>
                <CFormLabel>Avatar file to upload</CFormLabel>
                <CFormInput
                  type="file"
                  id="formFile"
                  accept=".jpg, .jpeg, .png"
                  value={modalImgPath}
                  onChange={(e) => {changeModalImgPath(e.target.value); changeModalImg(e.target.files[0])}}
                />
              <CFormText>Please select a file to upload from your computer. Valid formats are JPG or PNG. The maximum allowed size is {defaultAvatarSize}KB. The maximum allowed resolution is {defaultAvatarWidth}x{defaultAvatarHeight} pixels.</CFormText>
              </CCol>
            </CRow>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton style={{color: 'white'}}
                   ccolor="secondary"
                   disabled={changingAvatar}
                   onClick={() => {getData(); changeCAvatarVisible(false)}}>
            Cancel
          </CButton>
          {changingAvatar ? (
            <CButton disabled>
              <CSpinner component="span" size="sm" aria-hidden="true"/>
            </CButton>
            ) : (
              <CButton onClick={() => {changeAvatar()}}>
                &nbsp;Change avatar
              </CButton>
            )
          }
        </CModalFooter>
      </CModal>
      ) : (
        null
      )}
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
          <strong>Warning!</strong>&nbsp;You are about to close the account for user <strong>"{formUsername}"</strong> ({formEmail}).<br /><br />This action cannot be undone. Are you sure?
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
      <CCol style={{marginLeft: 'auto', marginRight: 'auto'}} xs={10}>
        <CCallout color="info" className="bg-white">
          <p>Welcome to the <strong>User details</strong> page!</p>
          <p>From this page you can create, view or edit a FIUBA CloudSync user:</p>
          <ul>
              <li>Create new user</li>
              <li>View or Edit a particular user's details</li>
              <li>Close a user's account</li>
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
                            id="userFormUsername"
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
                            id="userFormLastName"
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
                            id="userFormFirstName"
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
                            id="userFormEmail"
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
                            id="userFormPassword"
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
                            id="userFormPasswordConfirmation"
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
                        <CFormLabel>Login Service?</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="userFormLoginService"
                            value={(formMode == "new" ? "" : (record.login_service == true ? "Yes" : "No"))}
                            disabled={true}
                            required={false}
                            noValidate
                          />
                        </CCol>
                      </div>
                      <div className="mb-3"
                            style={{display: (formMode == "new" ? "none" : null)}}>
                        <CFormLabel>Account Closed?</CFormLabel>
                        <CCol>
                          <CFormInput
                            type="text"
                            id="userFormAccountClosed"
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
                            id="userFormId"
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
                            id="userFormCreated"
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
                            id="userFormExpired"
                            value={(formMode == "new" ? "" : (record.date_updated ? parseTimestamp(record.date_updated) : "None"))}
                            disabled={true}
                            required={false}
                            noValidate
                          />
                        </CCol>
                      </div>
                    </CCol>
                    <CCol style={{ textAlign: 'center' }}
                          className="d-none d-xl-block d-xxl-block">
                      { formMode != "new" ? (
                        <>
                        <CAvatar
                          style={{ fontSize: '4.5rem',
                                    width: '150px',
                                    height: '150px',
                                    marginTop: '25px' }}>
                            <img className="avatar-img"
                                  onError={(e) => {handleBrokenAvatar(e)}}
                                  src={(record.avatar.isUrl ? record.avatar.data : "data:" + record.avatar.data)}
                            />
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
                  <CRow className="mb-3">
                    <CCol style={{ marginTop: "50px"}}>
                      <div className="d-grid gap-2 d-sm-flex">
                        <CButton style={{color: 'white'}}
                          ccolor="secondary"
                          disabled={submitting}
                          onClick={(formMode == "edit" ? () => {changeFormMode("view"); getData()} : () => {navigate("/users")} )}>
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
                              style={{ display: ((!record.account_closed) ? null : 'none' )}}
                              onClick={() => {changeFormMode("edit")}}>
                              Edit
                          </CButton>
                          <CButton
                              color="primary"
                              style={{ display: ((!record.account_closed) ? null : 'none' )}}
                              onClick={() => {changeCAvatarVisible(true)}}>
                              Change Avatar
                          </CButton>
                          <CButton
                              color="primary"
                              style={{ display: (((!record.login_service) && (!record.account_closed)) ? null : 'none' )}}
                              onClick={() => {changeCPasswordVisible(true)}}>
                              Change Password
                          </CButton>
                          <CButton
                              color="danger"
                              style={{ color: 'white',
                                        display: ((!record.account_closed) ? null : 'none' )}}
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

export default UsersEdit;
