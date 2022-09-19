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
import { logoCs } from 'src/assets/brand/logo-cs'
/* Import StateApi */
import { getUsername, getSidebarShow } from '../stateapi/auth'
import { SIDEBAR_ON, SIDEBAR_OFF } from 'src/config'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(getSidebarShow)
  const username = useSelector(getUsername)
  if (!username)
  username = 'X'

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
          <CIcon icon={logoCs} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="ms-3">
          <span className="d-none d-md-block" style={{marginTop: '12px'}}>Welcome, {username.charAt(0).toUpperCase() + username.slice(1)}</span>
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
