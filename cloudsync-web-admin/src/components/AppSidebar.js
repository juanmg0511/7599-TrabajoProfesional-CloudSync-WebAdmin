import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { logoNegativeCsDev } from 'src/assets/brand/logo-negative-cs-dev'
import { logoNegativeCsQa } from 'src/assets/brand/logo-negative-cs-qa'
import { logoNegativeCsProd } from 'src/assets/brand/logo-negative-cs-prod'
import { sygnetCsDev } from 'src/assets/brand/sygnet-cs-dev'
import { sygnetCsQa } from 'src/assets/brand/sygnet-cs-qa'
import { sygnetCsProd } from 'src/assets/brand/sygnet-cs-prod'
import { REACT_APP_ENV, REACT_APP_DEV_COLOR, REACT_APP_QA_COLOR } from '../config.js'
import { AppSidebarNav } from './AppSidebarNav'

import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'

import { getSidebarShow, getSidebarUnfoldable } from '../stateapi/ui'
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
        {(REACT_APP_ENV == 'PROD' ? (<CIcon className="sidebar-brand-full" icon={logoNegativeCsProd} height={35} />) : (REACT_APP_ENV == 'QA' ? (<CIcon className="sidebar-brand-full" icon={logoNegativeCsQa} height={35} />) : (<CIcon className="sidebar-brand-full" icon={logoNegativeCsDev} height={35} />)))}
        {(REACT_APP_ENV == 'PROD' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsProd} height={35} />) : (REACT_APP_ENV == 'QA' ? (<CIcon className="sidebar-brand-narrow" icon={sygnetCsQa} height={35} />) : (<CIcon className="sidebar-brand-narrow" icon={sygnetCsDev} height={35} />)))}
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
