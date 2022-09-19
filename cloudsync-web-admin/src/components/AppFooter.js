import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter /*position="sticky"*/>
      <div>
        <span className="ms-1">FIUBA - 75.99 - 1C2022</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="https://coreui.io/react" target="_blank" rel="noopener noreferrer">
          CoreUI React
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
