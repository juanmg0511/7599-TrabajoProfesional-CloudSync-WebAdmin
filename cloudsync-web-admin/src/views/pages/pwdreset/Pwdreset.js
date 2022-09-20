import React, { useState, useEffect } from 'react'
import qs from 'qs'
import {
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
import { REACT_APP_ENV, REACT_APP_DEV_COLOR, REACT_APP_QA_COLOR } from '../../../config.js'
/* Import WebApi */
import { doRecoveryPassword } from '../../../webapi'

const PwdReset = () => {

  const [oldPassword, changeOldPassword] = useState('')
  const [newPassword, changeNewPassword] = useState('')
  const [toastMessage, changeToastMessage] = useState('')
  const [toastColor, changeToastColor] = useState('danger')
  const [showToast, changeShowToast] = useState(false)
  const [validPage, changeValidPage] = useState(false)
  const [resetting, changeResetting] = useState(false)

  const { key, username } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  
  function onSubmit (e) {
    e.preventDefault()
    if (oldPassword != newPassword) {
      changeToastMessage("Passwords do not match!")
      changeToastColor("warning")
      changeShowToast(true)
      console.log("Passwords do not match.")
    }
    else {
      changeResetting(true)
      doRecoveryPassword(key, username, newPassword)
        .then(response => {
          const { data } = response
          changeResetting(false)
          changeToastMessage("Password reset succesful!")
          changeToastColor("success")
          changeShowToast(true)
          console.log("Password reset succesful.")
        })
        .catch(_ => {
          changeResetting(false)
          changeToastMessage("Password reset failure!")
          changeToastColor("danger")
          changeShowToast(true)
          console.log("Password reset failure.")
        })
    }
  }
  
  useEffect(() => {
    document.title += ' (Password Reset)';
    if (key && username) {
      changeValidPage(true)
    }
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                <div>
                  {(REACT_APP_ENV == 'PROD' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsProd} height={50} />) : (REACT_APP_ENV == 'QA' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsQa} height={50} />) : (<CIcon className="sidebar-brand-narrow" icon={sygnetCsDev} height={50} />)))}
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
                    {(REACT_APP_ENV == 'PROD' ? (null) : (REACT_APP_ENV == 'QA' ? (<span style={{color: REACT_APP_QA_COLOR, fontWeight: '500'}}>[QA]</span>) : (<span style={{color: REACT_APP_DEV_COLOR, fontWeight: '500'}}>[DEV]</span>)))} Admin site
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
        <CToast autohide={true}
                visible={showToast}
                onClose={() => {changeShowToast(false)}}
                color={toastColor}
                className="text-white align-items-center"
                style={{position: 'absolute',
                        right: '20px',
                        top: '20px'}}
        >
          <div className="d-flex">
            <CToastBody>{toastMessage}</CToastBody>
            <CToastClose className="me-2 m-auto" white />
          </div>
        </CToast>
    </div>
  )
}

export default PwdReset
