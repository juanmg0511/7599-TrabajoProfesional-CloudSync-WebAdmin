import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import qs from 'qs'
import {
  CAvatar,
  CToaster,
  CToast,
  CToastBody,
  CToastClose,    
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
  const { mode, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [formMode, changeFormMode] = useState(mode)

  const [record, changeRecord] = useState(null)
  const [recordEmpty, changeRecordEmpty] = useState(false)

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
  
    if (form.checkValidity() === false) {
    
      event.preventDefault()
      event.stopPropagation()
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

  useEffect(() => {setupForm()}, [])
  return (
    <CRow>
      <CCol style={{marginLeft: 'auto', marginRight: 'auto'}} xs={10}>
        <CCallout color="info" className="bg-white">
          <p>Welcome to the <strong>Administrators</strong> listing!</p>
          <p>From this page you can manage all FIUBA CloudSync administrators:</p>
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
                              value={(formMode == "new" ? "" : record.username)}
                              //onChange={e => changePassword(e.target.value)}
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
                              value={(formMode == "new" ? "" : record.first_name)}
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
                              value={(formMode == "new" ? "" : record.last_name)}
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
                              value={(formMode == "new" ? "" : record.email)}
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
                              id="validationCustom05"
                              disabled={( formMode == "new" ? false : true )}
                              required={( formMode == "new" ? true : false )} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? null : "none")}}>
                          <CFormLabel htmlFor="validationCustom06">Reenter Password</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="password"
                              id="validationCustom06"
                              disabled={( formMode == "new" ? false : true )}
                              required={( formMode == "new" ? true : false )} />
                            <CFormFeedback valid>Looks good!</CFormFeedback>
                            <CFormFeedback invalid>Looks bad!</CFormFeedback>
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom07">Database Id</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom07"
                              value={(formMode == "new" ? "" : record.id)}
                              disabled={true}
                              required={false} />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom08">Date Created</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom08"
                              value={(formMode == "new" ? "" : record.date_created)}
                              disabled={true}
                              required={false} />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel htmlFor="validationCustom09">Date Updated</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="validationCustom09"
                              value={(formMode == "new" ? "" : (record.date_updated ? record.date_updated : "None"))}
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
                                style={{ display: ( formMode == "view" ? null : 'none' ) }}
                                onClick={() => {changeFormMode("edit")}}>
                                Edit
                              </CButton>
                              <CButton
                                color="primary"
                                type="submit"
                                style={{ display: ( formMode != "view" ? null : 'none' )}}
                                onClick={() => {handleSubmit()}}>
                                Save
                              </CButton>
                              <CButton
                                color="primary"
                                style={{ display: ( formMode == "view" ? null : 'none' )}}
                                onClick={() => {handleChangePassword()}}>
                                Change Password
                              </CButton>
                              <CButton
                                color="danger"
                                style={{ color: 'white',
                                        display: ( formMode == "view" ? null : 'none' )}}
                                onClick={() => {handleCloseAccount()}}>
                                <CIcon icon={cilTrash}/>
                                &nbsp;Close account
                              </CButton>
                            </div>
                        </CCol>
                      </CRow>
                  </CForm>
                </CCol>
                <CCol md="4"
                      style={{ textAlign: 'center' }}
                      className="d-none d-xl-block d-xxl-block">
                  <CAvatar
                    color="primary"
                    textColor="white"
                    style={{ display: ( formMode == "new" ? 'none' : null ),
                             fontSize: '4.5rem',
                             width: '150px',
                             height: '150px',
                             marginTop: '25px',
                             paddingLeft: '5px' }}>
                      {(formMode == "new" ? "" : record.username.charAt(0).toUpperCase())}
                  </CAvatar>
                  <div style={{ display: ( formMode == "new" ? 'none' : null ),
                                fontWeight: 'bold',
                                marginTop: '10px' }}>
                    {(formMode == "new" ? "" : record.username)}
                  </div>
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
