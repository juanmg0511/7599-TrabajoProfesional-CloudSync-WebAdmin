import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { CSpinner } from '@coreui/react'
import { CAlert } from '@coreui/react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { sygnetCs } from 'src/assets/brand/sygnet-cs'
import { cilLockLocked, cilUser, cilWarning } from '@coreui/icons'
/* Import WebApi */
import { doAuth } from '../../../webapi'
/* Import Constants */
import {
  AUTH_REQUEST,
  AUTH_SUCCESS
} from '../../../config.js'

const Login = () => {

  const [username, changeUsername] = useState('')
  const [password, changePassword] = useState('')
  const [authed, changeAuthed] = useState(false)
  const [authing, changeAuthing] = useState(false)
  const [authError, changeAuthError] = useState(false)

  const dispatch = useDispatch()

  function onSubmit (e) {
    e.preventDefault()
    dispatch({ type: AUTH_REQUEST })
    changeAuthing(true)
    doAuth({ username: username, password: password })
      .then(response => {
        const { data } = response
        dispatch({
          type: AUTH_SUCCESS,
          payload: {
            token: data.session_token,
            username: data.username
          }
        })
        changeAuthing(false)
        changeAuthed(true)
        console.log("Authentication succesful. Logged in as: \"" + data.username + "\".")
      })
      .catch(_ => {
        changeAuthing(false)
        changeAuthError(true)
        console.log("Authentication failure.")
      })
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      { authed ? (
        <Navigate to="/"/>) : null }
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <div>
                      <CIcon className="sidebar-brand-narrow" icon={sygnetCs} height={50} />
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
                        Admin site
                      </p>
                    </div>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    { authError ? (
                      <CAlert color="danger">
                        <CIcon icon={cilWarning} className="flex-shrink-0 me-2" width={24} height={24} />
                          <span>Invalid login credentials!</span>
                        </CAlert> ) : null
                    }
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        name='username'
                        placeholder="Username"
                        autoComplete="username"
                        onChange={e => changeUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        name='password'
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        onChange={e => changePassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                      {authing ? (
                        <CButton disabled>
                          <CSpinner component="span" size="sm" aria-hidden="true"/>
                        </CButton>
                        ) : (
                        <CButton color="primary" className="px-4" onClick={onSubmit}>
                          Login
                        </CButton>)
                      }
                      </CCol>
                      <CCol xs={6} className="text-right">
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
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
    </div>
  )
}

export default Login
