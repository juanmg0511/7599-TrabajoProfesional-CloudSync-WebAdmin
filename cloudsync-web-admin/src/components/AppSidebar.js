import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logoNegativeCs } from 'src/assets/brand/logo-negative-cs'
import { sygnetCs } from 'src/assets/brand/sygnet-cs'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { getSidebarShow, getSidebarUnfoldable } from '../stateapi/auth'
import { UNFOLDABLE_ON, UNFOLDABLE_OFF } from 'src/config'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector(getSidebarUnfoldable)
  const sidebarShow = useSelector(getSidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegativeCs} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnetCs} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={(unfoldable ? (() => dispatch({ type: UNFOLDABLE_OFF })) : (() => dispatch({ type: UNFOLDABLE_ON })))}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
