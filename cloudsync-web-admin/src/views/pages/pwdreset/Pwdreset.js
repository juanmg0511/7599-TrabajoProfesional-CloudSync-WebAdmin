import React, { useState, useRef, useEffect } from 'react'
import qs from 'qs'
import {
  CToaster,
  CToast,
  CToastBody,
  CToastClose,
  CAlert,
  CSpinner,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilWarning } from '@coreui/icons'
import { sygnetCsDev } from 'src/assets/brand/sygnet-cs-dev'
import { sygnetCsQa } from 'src/assets/brand/sygnet-cs-qa'
import { sygnetCsProd } from 'src/assets/brand/sygnet-cs-prod'
import { APP_ENV, APP_DEV_COLOR, APP_QA_COLOR } from '../../../config.js'
/* Import WebApi */
import { doRecoveryPassword } from '../../../webapi'

const PwdReset = () => {

  const [oldPassword, changeOldPassword] = useState('')
  const [newPassword, changeNewPassword] = useState('')
  const [validPage, changeValidPage] = useState(false)
  const [resetting, changeResetting] = useState(false)

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

  const { key, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  
  function onSubmit (e) {
    e.preventDefault()
    if (oldPassword != newPassword) {
      addToast(generateToast("warning","Passwords do not match!"))
      console.log("Passwords do not match.")
    }
    else {
      changeResetting(true)
      doRecoveryPassword(key, username, newPassword)
        .then(_ => {
          changeResetting(false)
          addToast(generateToast("success","Password reset succesful!"))
          console.log("Password reset succesful.")
        })
        .catch(_ => {
          changeResetting(false)
          addToast(generateToast("danger","Password reset failure!"))
          console.log("Password reset failure.")
        })
    }
  }
  
  useEffect(() => {
    document.title = 'FIUBA CloudSync - Admin Site (Password reset)';
    if (key && username) {
      changeValidPage(true)
    }
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm>
                <div>
                  {(APP_ENV == 'PROD' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsProd} height={50} />) : (APP_ENV == 'QA' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsQa} height={50} />) : (<CIcon className="sidebar-brand-narrow" icon={sygnetCsDev} height={50} />)))}
                  <span style={{fontSize: '2.5rem',
                                fontWeight: '500',
                                lineHeight: '50px',
                                position: 'absolute',
                                marginLeft: '15px'}}>
                    FIUBA CloudSync
                  </span>
                  <p style={{
                        marginLeft: '65px',
                        marginTop: '-5px'}}>
                    {(APP_ENV == 'PROD' ? (null) : (APP_ENV == 'QA' ? (<span style={{color: APP_QA_COLOR, fontWeight: '500'}}>[QA]</span>) : (<span style={{color: APP_DEV_COLOR, fontWeight: '500'}}>[DEV]</span>)))} Admin site
                  </p>
                </div>
                  <p className="text-medium-emphasis">Password reset</p>
                  { (!validPage ? (
                      <CAlert color="warning">
                        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                          <span>Please open this page using your recovery link</span>
                      </CAlert> ) : null)
                  }
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      disabled={(!validPage ? true : false)}
                      type="password"
                      placeholder="New password"
                      autoComplete="new-password"
                      onChange={e => changeOldPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      disabled={(!validPage ? true : false)}
                      type="password"
                      placeholder="Repeat your new password"
                      autoComplete="new-password"
                      onChange={e => changeNewPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <div className="d-grid">
                    {resetting ? (
                      <CButton color="primary" disabled>
                        <CSpinner component="span" size="sm" aria-hidden="true"/>
                      </CButton>
                      ) : (
                        !validPage ? (
                          <CButton disabled color="primary" onClick={onSubmit}>
                            Reset password
                          </CButton>
                        ) : (
                          <CButton color="primary" onClick={onSubmit}>
                            Reset password
                          </CButton>
                        )
                      )
                    }
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>     
      <div style={{
        position: 'fixed',
        left: '50%',
        bottom: '20px',
        transform: 'translate(-50%, -50%)',
        margin: '0 auto'
      }}>
        FIUBA - 75.99 - 1C2022
      </div>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </div>
  )
}

export default PwdReset
