import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { logoCsDev } from 'src/assets/brand/logo-cs-dev'
import { logoCsQa } from 'src/assets/brand/logo-cs-qa'
import { logoCsProd } from 'src/assets/brand/logo-cs-prod'
import { APP_ENV } from '../config.js'
/* Import StateApi */
import { getFirstName, getLastName, getEmail } from '../stateapi/auth'
import { getSidebarShow } from '../stateapi/ui'
import { SIDEBAR_ON, SIDEBAR_OFF } from 'src/config'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(getSidebarShow)
  const firstName = (useSelector(getFirstName) ? useSelector(getFirstName) : "X")
  const lastName = (useSelector(getLastName) ? useSelector(getLastName) : "X")
  const email = (useSelector(getEmail) ? useSelector(getEmail) : "X")


  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={(sidebarShow ? (() => dispatch({ type: SIDEBAR_OFF })) : (() => dispatch({ type: SIDEBAR_ON })))}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          {(APP_ENV == 'PROD' ? (<CIcon icon={logoCsProd} height={48} alt="Logo" />) : (APP_ENV == 'QA' ? (<CIcon icon={logoCsQa} height={48} alt="Logo" />) : (<CIcon icon={logoCsDev} height={48} alt="Logo" />)))}
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <div className="d-none d-md-block" style={{marginTop: '5px'}}>
          <div>Welcome <strong>{lastName + ", " + firstName}</strong>!</div>
          <div className="d-none d-md-block" style={{float: 'right', fontSize: '12px'}}>{email}</div>
          </div>
          <AppHeaderDropdown />
        </CHeaderNav>
       </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
