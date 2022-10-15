import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import qs from 'qs'
import {
  CToaster,
  CToast,
  CToastBody,
  CToastClose,  
  CCallout,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilWarning } from '@coreui/icons';
import { getSession, removeSession } from '../../../webapi'
import { getUsername } from '../../../stateapi/auth'
import { parseTimestamp } from 'src/helpers';

const SessionsEdit = () => {

  let navigate = useNavigate();
  const loggedUser = useSelector(getUsername)
  const { mode, session_token, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })

  const [deleting, changeDeleting] = useState(false)
  const [deleteVisible, changeDeleteVisible] = useState(false)

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

  function setupForm() {

    changeFormMode('view')
    getData()
  }

  function getData() {

    getSession(username)
    .then(response => {
        const { data } = response
        const resultsLength = data.total
        if ( resultsLength > 0 ) {
            let found = false
            data.results.forEach(session => {
                if (session.session_token == session_token) {
                    changeRecord(session)
                    found = true                    
                }
              })
              if (!found) {
                changeRecord(null)
                changeRecordEmpty(true)
              }
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

  function deleteRecord() {

    changeDeleting(true)
    removeSession(record.session_token)
      .then(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("success","Session logged out succesfully!"))
        navigate("/sessions")
      })
      .catch(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("danger","Error logging out session!"))
        getData()
      })
  }


  useEffect(() => {setupForm()}, [])
  return (
    <CRow>
      { deleteVisible ? (
      <CModal alignment="center" visible={deleteVisible} onClose={() => changeDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Logout user</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning!</strong>&nbsp;You are about to logout user <strong>"{record.username}"</strong>.<br /><br />This action cannot be undone. Are you sure?
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
              <CButton style={{color: 'white'}} color="danger" onClick={() => {deleteRecord(false)}}>
                <CIcon icon={cilTrash}/>
                &nbsp;Logout user session
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
          <p>Welcome to the <strong>Session details</strong> page!</p>
          <p>From this page you can view a FIUBA CloudSync session:</p>
          <ul>
            <li>View a particular session's details</li>
            <li>Delete a session (logout the user)</li>
          </ul>
        </CCallout>
        <CCard className="mb-4">
          <CCardBody>
            {record ? (
              <CRow>            
                <CCol md="8">
                  <CForm
                    className="needs-validation align-items-center"
                    noValidate>
                        <div className="mb-3">
                          <CFormLabel>Username</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formEmail"
                              value={(formMode == "new" ? "" : record.username)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>                        
                        <div className="mb-3">
                          <CFormLabel>Role</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formEmail"
                              value={(formMode == "new" ? "" : record.user_role)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <div className="mb-3">
                          <CFormLabel>Session token</CFormLabel>
                          <CCol>
                            <CFormTextarea
                              type="text"
                              id="formSessionToken"
                              rows="6"
                              value={(formMode == "new" ? "" : record.session_token)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                            <CFormText>The session token, in JWT format. Do not share!</CFormText>
                          </CCol>
                        </div>
                        <div className="mb-3">
                            <CFormLabel>Valid session?</CFormLabel>
                            <CCol>
                            <CFormInput
                                type="text"
                                id="formExpired"
                                value={(formMode == "new" ? "" : (record.expired == true ? "Yes" : "No"))}
                                disabled={true}
                                required={false}
                                noValidate
                            />
                            </CCol>
                        </div>
                        <div className="mb-3">
                          <CFormLabel>Expires</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formExpires"
                              value={(formMode == "new" ? "" : parseTimestamp(record.expires))}                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <div className="mb-3">
                          <CFormLabel>Date Created</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formCreated"
                              value={(formMode == "new" ? "" : parseTimestamp(record.date_created))}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <div className="mb-3">
                          <CFormLabel>Database Id</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formId"
                              value={(formMode == "new" ? "" : record.id)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <CRow className="mb-3">
                          <CCol style={{ marginTop: "50px"}}>
                            <div className="d-grid gap-2 d-sm-flex">
                              <CButton style={{color: 'white'}}
                                ccolor="secondary"
                                onClick={() => {navigate("/sessions")}}>
                                Cancel
                              </CButton>
                              <CButton
                                color="danger"
                                style={{ color: 'white',
                                         display: ((record.username !== loggedUser) ? null : 'none' )}}
                                onClick={() => {changeDeleteVisible(true)}}>
                                <CIcon icon={cilTrash}/>
                                  &nbsp;Logout user session
                              </CButton>
                            </div>
                        </CCol>
                      </CRow>
                  </CForm>
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
                      Error fetching session data.
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

export default SessionsEdit;
