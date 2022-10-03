import React from 'react';
import {
    CRow,
    CCol,
    CCard,
    CCardBody,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { logoCsDev } from 'src/assets/brand/logo-cs-dev'
  import { logoCsQa } from 'src/assets/brand/logo-cs-qa'
  import { logoCsProd } from 'src/assets/brand/logo-cs-prod'
  import { logoFiuba } from 'src/assets/brand/logo-fiuba.js';
  import { APP_ENV } from '../../config.js'  

/*

A nice comment

*/

const About = (props) => {

    return (
      <CRow>
        <CCol style={{marginLeft: 'auto', marginRight: 'auto'}} xs={10}>
          <CCard className="mb-4">
            <CCardBody>
              <div style={{marginTop:'20px', textAlign: 'center'}}>
                <a target="_blank"
                   href="https://github.com/juanmg0511/7599-TrabajoProfesional-CloudSync-WebAdmin">
                  {(APP_ENV == 'PROD' ?
                    (<CIcon icon={logoCsProd} height={60} alt="Logo CS" />) :
                    (APP_ENV == 'QA' ?
                      (<CIcon icon={logoCsQa} height={60} alt="Logo CS" />) :
                      (<CIcon icon={logoCsDev} height={60} alt="Logo CS" />)
                    )
                  )}
                </a>
                <a target="_blank"
                   href="http://fi.uba.ar"
                   className="d-none d-sm-none d-md-none d-lg-inline-block d-xl-inline-block d-xxl-inline-block">
                  <img src={"data:image/png;base64," + logoFiuba}
                       style={{verticalAlign: 'inherit', marginLeft: '50px'}}
                       height={60}
                       alt="Logo Fiuba" />
                </a>
                <a target="_blank"
                   href="http://fi.uba.ar"
                   className="d-sm-block d-md-block d-lg-none d-xl-none d-xxl-none">
                  <img src={"data:image/png;base64," + logoFiuba}
                       style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '20px'}}
                       height={60}
                       alt="Logo Fiuba" />
                </a>
              </div>
              <h3 style={{marginTop: '50px'}}>FIUBA CloudSync</h3>
              <p className="text-medium-emphasis small">
                FIUBA CloudSync is the cloud platform for the RPG-PCG game <strong>Escape From NODNOL</strong>.
                It allows players to sync their game progress and post their highscores. Developed as part of course
                75.99 - Trabajo Profesional en Ingeniería en Informática.
              </p>
              <p className="text-medium-emphasis small">
                <a target="_blank" href="http://fi.uba.ar">Facultad de Ingeniería</a>, Universidad de Buenos Aires.
              </p>
              <h5 style={{marginTop: '50px'}}>Developed by</h5>
              <ul className="text-medium-emphasis small">
                <li>
                  Juan Manuel Gonzalez (<a href="mailto:juagonzalez@fi.uba.ar">juagonzalez@fi.uba.ar</a>)
                </li>
                <li>
                  Diego Martins Forgan (<a href="mailto:dforgan@fi.uba.ar">dforgan@fi.uba.ar</a>)
                </li>
              </ul>
              <h5>Tutor</h5>
              <ul className="text-medium-emphasis small">
                <li>
                  Leandro Ferrigno (<a href="mailto:lferrigno@fi.uba.ar">lferrigno@fi.uba.ar</a>)
                </li>
              </ul>
              <p style={{marginTop: '50px'}} className="text-medium-emphasis small">
                v1.00
              </p>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
};

export default About;
