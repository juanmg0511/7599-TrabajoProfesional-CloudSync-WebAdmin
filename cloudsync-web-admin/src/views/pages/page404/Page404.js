import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import {
  CLink,
  CCol,
  CContainer,
  CRow,
} from '@coreui/react'

const Page404 = () => {

  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'FIUBA CloudSync - Admin Site (Not found)';
  });

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404</h1>
              <h4 className="pt-3">Oops! You{"'"}re lost.</h4>
              <p className="text-medium-emphasis float-start">
                The page you are looking for was not found.&nbsp;
                <CLink
                  style={{
                    display: 'block',
                    cursor: 'pointer'
                  }}
                  onClick={() => {navigate("/")}}
                >
                  Back to safety.
                </CLink>
              </p>
            </div>
          </CCol>
        </CRow>
      </CContainer>
      <div className="d-none d-sm-block"
        style={{
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

export default Page404
