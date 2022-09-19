import React from 'react'
import { useDispatch } from 'react-redux'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilAccountLogout,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/8.jpg'

/* Import Constants */
import { AUTH_LOGOUT } from '../../config'
/* Import WebApi */
import { doLogOut } from '../../webapi'

const AppHeaderDropdown = () => {

  const dispatch = useDispatch()
  function logOut () {
    doLogOut()
      .then(_ => {
        dispatch({
          type: AUTH_LOGOUT
        })
        console.log('Logout succesful.')
      })
      .catch(_ => {
        dispatch({
          type: AUTH_LOGOUT
        })
        // No importa si hay un error, de todas formas cambiamos el estado de la app
        console.log('Logout succesful.')
      })
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem href="/admin-profile">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
      <CDropdownDivider />
        <CDropdownItem onClick={() => logOut()}> 
          <CIcon icon={cilAccountLogout} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
