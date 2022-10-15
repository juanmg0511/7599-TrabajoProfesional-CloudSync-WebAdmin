import React, { useState, useEffect, useRef } from 'react';
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
  CFormFeedback,
  CFormLabel,
  CFormText,
  CSpinner,
  CRow,
  CFormTextarea,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilWarning } from '@coreui/icons';
import { getRecovery, createRecovery } from '../../../webapi'
import { usernameRegex } from '../../../config'
import { parseTimestamp } from 'src/helpers';

const RecoveryEdit = () => {

  let navigate = useNavigate();
  const { mode, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [formMode, changeFormMode] = useState(mode)
  const [submitting, changeSubmitting] = useState(false)

  const [record, changeRecord] = useState(null)
  const [recordEmpty, changeRecordEmpty] = useState(false)

  const [formUsername, changeFormUsername] = useState("")

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

    if (form.checkValidity() === false) {

      addToast(generateToast("warning","Please review your input!"))
    } else {

      changeSubmitting(true) 
      const newRecovery = {
        username: formUsername,
      }  

      createRecovery(newRecovery)                 
      .then(_ => {

        if (formMode == "new") {
          navigate('/recovery')
        } else {
          changeSubmitting(false)
          changeFormMode("view")
          getData()
        }
        addToast(generateToast("success","Recovery operation successful!"))
      })
      .catch(err => {

        let message = "Error during recovery operation!"
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

    getRecovery(username)
    .then(response => {
        const { data } = response
        const resultsLength = data.id.length
        if ( resultsLength > 0 ) {
          changeRecord(data)
          changeFormUsername(data.username)
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
          <p>Welcome to the <strong>Recovery details</strong> page!</p>
          <p>From this page you can create or view a FIUBA CloudSync password recovery request:</p>
          <ul>
            <li>Send a new request to a user</li>
            <li>View a particular request's details</li>
          </ul>
        </CCallout>
        { formMode == "new" ? (
          <CCallout color="warning" className="bg-white">
            <p><strong>Notice</strong></p>
            <p>This will create a password recovery request for the specified user. The user will receive an email with instructions, as if requested in-game.</p>
          </CCallout>
        ) : (
          null
        )
        }
        <CCard className="mb-4">
          <CCardBody>
            {(record || (formMode == 'new')) ? (
              <CRow>            
                <CCol md="8">
                  <CForm
                    className="needs-validation align-items-center"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}>
                        <CRow className="mb-3">
                          <CFormLabel>Username</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formUsername"
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
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel>Email</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formEmail"
                              value={(formMode == "new" ? "" : record.email)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel>Recovery Key</CFormLabel>
                          <CCol>
                            <CFormTextarea
                              type="text"
                              id="formRecoveryKey"
                              rows="6"
                              value={(formMode == "new" ? "" : record.recovery_key)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                            <CFormText>The key to be used to recover the password. Will only be valid once, for this user, and until the expiry date. Do not share!</CFormText>
                          </CCol>
                        </div>
                        <div className="mb-3"
                                style={{display: (formMode == "new" ? "none" : null)}}>
                            <CFormLabel>Expired?</CFormLabel>
                            <CCol>
                            <CFormInput
                                type="text"
                                id="adminFormAccountClosed"
                                value={(formMode == "new" ? "" : (record.expired == true ? "Yes" : "No"))}
                                disabled={true}
                                required={false}
                                noValidate
                            />
                            </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
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
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
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
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
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
                        <CRow className="mb-3">
                          <CCol style={{ marginTop: "50px"}}>
                            <div className="d-grid gap-2 d-sm-flex">
                              <CButton style={{color: 'white'}}
                                ccolor="secondary"
                                disabled={submitting}
                                onClick={(formMode == "edit" ? () => {changeFormMode("view"); getData()} : () => {navigate("/recovery")} )}>
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
                                    style={{ display: ( formMode == "new" ? null : 'none' )}}
                                    >
                                  Save
                                  </CButton>
                                )
                              }
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
                      Error fetching recovery data.
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

export default RecoveryEdit;
