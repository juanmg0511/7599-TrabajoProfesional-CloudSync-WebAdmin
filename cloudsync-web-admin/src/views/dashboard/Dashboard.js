import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CFormText,
  CLink,
  CRow,
  CCallout,
  CSpinner,
  CToast,
  CToastBody,
  CToastClose,
  CToaster,
  CWidgetStatsF,
} from '@coreui/react'
import { CChartBar, CChartPie, CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import { cilWarning, cilArrowRight, cilUser, cilClock, cilBarChart, cilGamepad } from '@coreui/icons';
import { getAppStats, getAuthStats } from '../../webapi'
import { DAYS_TO_KEEP_STATS } from '../../config'
import { selectProp } from 'src/helpers';


const Dashboard = () => {

  const [dataLoadedApp, changeDataLoadedApp] = useState(false)
  const [dataLoadedAuth, changeDataLoadedAuth] = useState(false)
  const [dataError, changeDataError] = useState(false)

  const [dataApp, changeDataApp] = useState(null)
  const [dataAuth, changeDataAuth] = useState(null)

  function generateToast(toastColor, toastMessage) {
    return (
      <CToast color={toastColor}
              className="text-white align-items-center"
      >
        <div className="d-flex">
          <CToastBody>{toastMessage}</CToastBody>
          <CToastClose className="me-2 m-auto" white />
        </div>
      </CToast>
    )
  }
  const toaster = useRef()
  const [toast, addToast] = useState(0)

  function getAppData () {
    getAppStats(true)
    .then(response => {
      const { data } = response
      changeDataApp(data)
      changeDataLoadedApp(true)
    })
    .catch(_ => {
      changeDataApp(null)
      changeDataLoadedApp(false)
      changeDataError(true)
      addToast(generateToast("danger","Error fetching data!"))
    })
  }

  function getAuthData () {
    getAuthStats(true)
    .then(response => {
      const { data } = response
      changeDataAuth(data)
      changeDataLoadedAuth(true)
    })
    .catch(_ => {
      changeDataAuth(null)
      changeDataError(true)
      changeDataLoadedAuth(false)
      addToast(generateToast("danger","Error fetching data!"))
    })
  }

  useEffect(() => {getAppData()}, [])
  useEffect(() => {getAuthData()}, [])
  return (
    <CRow>
      <CRow>
        <CCol xs={12}>
          <CCallout color="info" className="bg-white">
            <p>Welcome to the <strong>FIUBA CloudSync</strong> adminstrative website!</p>
            <p>From this page you can view at a glance all key parameters of the cloud platform:</p>
            <ul>
                <li>Key figures, users and admins</li>
                <li>Sessions, reponse times and hits per endpoint</li>
                <li>Actions related to Users, Game Progress and Highscores</li>
                <li>API calls indicating an unsuccessful response</li>
            </ul>
          </CCallout>
        </CCol>
      </CRow>
      { dataLoadedApp && dataLoadedAuth ? (
        <CRow>
          <CCol sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="/users"
                  rel="noopener norefferer"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
              icon={<CIcon icon={cilUser} height={24} />}
              title={"User account" + (dataAuth.registered_users > 1 ? "s" : "")}
              value={dataAuth.registered_users}/>
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="/sessions"
                  rel="noopener norefferer"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
              icon={<CIcon icon={cilClock} height={24} />}
              title={"Active session" + (dataAuth.active_sessions > 1 ? "s" : "")} 
              value={dataAuth.active_sessions}/>
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="/game-progress"
                  rel="noopener norefferer"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
              icon={<CIcon icon={cilGamepad} height={24} />}
              title="Game Progress"
              value={dataApp.registered_game_progress}/>
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsF
              className="mb-3"
              color="primary"
              footer={
                <CLink
                  className="font-weight-bold font-xs text-medium-emphasis"
                  href="/highscores"
                  rel="noopener norefferer"
                >
                  View more
                  <CIcon icon={cilArrowRight} className="float-end" width={16} />
                </CLink>
              }
              icon={<CIcon icon={cilBarChart} height={24} />}
              title={"Highscore" + (dataApp.registered_higshscores > 1 ? "s" : "")} 
              value={dataApp.registered_higshscores}/>
          </CCol>                                    
        </CRow>
      ) : (
        null
      )}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>User Stats</strong>
                  <CFormText>Key figures, users and admins</CFormText>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              { dataLoadedApp && dataLoadedAuth ? (
                <>
                  <CRow className="row-center">
                    <CCol sm={5}>
                      <CChartPie
                        style={{ height: '300px' }}
                        data={{
                          labels: ['User accounts active', 'Users using login service', 'User accounts closed'],
                          datasets: [
                            {
                              data: [dataAuth.registered_users_active,
                                    dataAuth.registered_users_login_service,
                                    dataAuth.registered_users_closed],
                            },],                        
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'bottom'
                            },
                            title: {
                              display: true,
                              text: 'User Accounts',
                              font: {
                                size: 18,
                                weight: 'bold'
                              },
                            },
                            subtitle: {
                              display: true,
                              text: 'User account composition',
                              font: {
                                size: 12,
                                style: 'italic'
                              },
                              padding: {
                                bottom: 20
                              },
                            },    
                          },
                        }}
                      />
                    </CCol>
                    <CCol sm={5}>
                      <CChartPie
                        style={{ height: '300px' }}
                        data={{
                          labels: ['Adminuser accounts active', 'Adminuser accounts closed'],
                          datasets: [
                            {
                              data: [dataAuth.registered_adminusers_active,
                                    dataAuth.registered_adminusers_closed],
                            },],
                        }}
                        options={{
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: true,
                              position: 'bottom'
                            },
                            title: {
                              display: true,
                              text: 'Admin User Accounts',
                              font: {
                                size: 18,
                                weight: 'bold'
                              },
                            },
                            subtitle: {
                              display: true,
                              text: 'Administrator user account composition',
                              font: {
                                size: 12,
                                style: 'italic'
                              },
                              padding: {
                                bottom: 20
                              },
                            },    
                          },
                        }}
                      />
                    </CCol>
                  </CRow>
                </>
              ) : (
                dataError ? (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CIcon icon={cilWarning} size="lg"/>
                      <span style={{ marginLeft:"10px" }}>Error fetching data!</span>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CSpinner color="dark" size="sm" />
                    </CCol>
                  </CRow>
                )
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>Traffic {'&'} Performance</strong>
                  <CFormText>Sessions, reponse times and hits per endpoint</CFormText>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              { dataLoadedApp && dataLoadedAuth ? (

                <>
                <CChartLine
                  style={{ height: '300px' }}
                  data={{
                    labels: dataAuth.daily_stats.map(selectProp("date")),
                    datasets: [
                      {
                        label: 'Sessions opened',
                        data: dataAuth.daily_stats.map(selectProp("sessions_opened")),
                      },
                      {
                        label: 'Sessions closed',
                        data: dataAuth.daily_stats.map(selectProp("sessions_closed")),
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom'
                      },
                      title: {
                        display: true,
                        text: 'Platform traffic',
                        font: {
                          size: 18,
                          weight: 'bold'
                        },
                      },
                      subtitle: {
                        display: true,
                        text: 'Sessions opened and closed, last ' + DAYS_TO_KEEP_STATS + ' days',
                        font: {
                          size: 12,
                          style: 'italic'
                        },
                        padding: {
                          bottom: 20
                        },
                      },
                    },
                  }}      
                />
                <CChartLine
                  style={{ height: '300px', marginTop: '40px' }}
                  data={{
                    labels: dataApp.daily_stats.map(selectProp("date")),
                    datasets: [
                      {
                        label: 'Maximum response time',
                        data: dataApp.daily_stats.map(selectProp("response_time_max")),
                      },
                      {
                        label: 'Average response time',
                        data: dataApp.daily_stats.map(selectProp("response_time_avg")),
                      },
                      {
                        label: 'Minimum response time',
                        data: dataApp.daily_stats.map(selectProp("response_time_min")),
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom'
                      },
                      title: {
                        display: true,
                        text: 'Average Response Times',
                        font: {
                          size: 18,
                          weight: 'bold'
                        },
                      },
                      subtitle: {
                        display: true,
                        text: 'Maximum, average and minimum, last ' + DAYS_TO_KEEP_STATS + ' days',
                        font: {
                          size: 12,
                          style: 'italic'
                        },
                        padding: {
                          bottom: 20
                        },
                      },
                    },
                  }}      
                />
                <CChartBar
                  style={{ height: '300px' }}
                  data={{
                    labels: dataAuth.daily_stats.map(selectProp("date")),
                    datasets: [
                      {
                        label: 'Adminusers',
                        data: dataAuth.daily_stats.map(selectProp("requests_adminusers")),
                      },
                      {
                        label: 'Users',
                        data: dataAuth.daily_stats.map(selectProp("requests_users")),
                      },
                      {
                        label: 'Sessions',
                        data: dataAuth.daily_stats.map(selectProp("requests_sessions")),
                      },
                      {
                        label: 'Recovery',
                        data: dataAuth.daily_stats.map(selectProp("requests_recovery")),
                      },
                      {
                        label: 'Gameprogress',
                        data: dataApp.daily_stats.map(selectProp("requests_game_progress")),
                      },
                      {
                        label: 'Highscores',
                        data: dataApp.daily_stats.map(selectProp("requests_highscores")),
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom'
                      },
                      title: {
                        display: true,
                        text: 'Requests Per Endpoint',
                        font: {
                          size: 18,
                          weight: 'bold'
                        },
                      },
                      subtitle: {
                        display: true,
                        text: 'Adminusers, Users, Sessions, Recovery, Gameprogress and Highscores, last ' + DAYS_TO_KEEP_STATS + ' days',
                        font: {
                          size: 12,
                          style: 'italic'
                        },
                        padding: {
                          bottom: 20
                        },
                      },
                    },
                  }}      
                />
                </>

                
              ) : (
                dataError ? (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CIcon icon={cilWarning} size="lg"/>
                      <span style={{ marginLeft:"10px" }}>Error fetching data!</span>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CSpinner color="dark" size="sm" />
                    </CCol>
                  </CRow>
                )
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>API Activities</strong>
                  <CFormText>Actions related to Users, Game Progress and Highscores</CFormText>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              { dataLoadedApp && dataLoadedAuth ? (
                <>
                  <CChartLine
                    style={{ height: '300px' }}
                    data={{
                      labels: dataAuth.daily_stats.map(selectProp("date")),
                      datasets: [
                        {
                          label: 'User accounts opened',
                          data: dataAuth.daily_stats.map(selectProp("users_new")),
                        },
                        {
                          label: 'User accounts closed',
                          data: dataAuth.daily_stats.map(selectProp("users_deleted")),
                        },
                        {
                          label: 'Password recovery requests',
                          data: dataAuth.daily_stats.map(selectProp("recovery_requests")),
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom'
                        },
                        title: {
                          display: true,
                          text: 'User accounts activity',
                          font: {
                            size: 18,
                            weight: 'bold'
                          },
                        },
                        subtitle: {
                          display: true,
                          text: 'Accounts opened, closed and password recovery requests, last ' + DAYS_TO_KEEP_STATS + ' days',
                          font: {
                            size: 12,
                            style: 'italic'
                          },
                          padding: {
                            bottom: 20
                          },
                        },

                      },
                    }}      
                  />
                  <CChartLine
                    style={{ height: '300px', marginTop: '40px' }}
                    data={{
                      labels: dataApp.daily_stats.map(selectProp("date")),
                      datasets: [
                        {
                          label: 'Game Progress records saved',
                          data: dataApp.daily_stats.map(selectProp("game_progress_saved")),
                        },
                        {
                          label: 'Game Progress records updated',
                          data: dataApp.daily_stats.map(selectProp("game_progress_updated")),
                        },
                        {
                          label: 'Game Progress records deleted',
                          data: dataApp.daily_stats.map(selectProp("game_progress_deleted")),
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom'
                        },
                        title: {
                          display: true,
                          text: 'Game progress activity',
                          font: {
                            size: 18,
                            weight: 'bold'
                          },
                        },
                        subtitle: {
                          display: true,
                          text: 'Game progress records saved, updated and deleted, last ' + DAYS_TO_KEEP_STATS + ' days',
                          font: {
                            size: 12,
                            style: 'italic'
                          },
                          padding: {
                            bottom: 20
                          },
                        },
                      },
                    }}      
                  />
                  <CChartLine
                    style={{ height: '300px' }}
                    data={{
                      labels: dataApp.daily_stats.map(selectProp("date")),
                      datasets: [
                        {
                          label: 'Highscore records posted',
                          data: dataApp.daily_stats.map(selectProp("highscores_new")),
                        },
                        {
                          label: 'Highscore records deleted',
                          data: dataApp.daily_stats.map(selectProp("highscores_deleted")),
                        },
                      ],
                    }}
                    options={{
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: true,
                          position: 'bottom'
                        },
                        title: {
                          display: true,
                          text: 'Highscores activity',
                          font: {
                            size: 18,
                            weight: 'bold'
                          },
                        },
                        subtitle: {
                          display: true,
                          text: 'Highscore records created and deleted, last ' + DAYS_TO_KEEP_STATS + ' days',
                          font: {
                            size: 12,
                            style: 'italic'
                          },
                          padding: {
                            bottom: 20
                          },
                        },
                      },
                    }}      
                  />
                </>
              ) : (
                dataError ? (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CIcon icon={cilWarning} size="lg"/>
                      <span style={{ marginLeft:"10px" }}>Error fetching data!</span>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CSpinner color="dark" size="sm" />
                    </CCol>
                  </CRow>
                )
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>Error Codes</strong>
                  <CFormText>API calls indicating an unsuccessful response</CFormText>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>

              { dataLoadedApp && dataLoadedAuth ? (
                <CChartLine
                  style={{ height: '300px' }}
                  data={{
                    labels: dataAuth.daily_stats.map(selectProp("date")),
                    datasets: [
                      {
                        label: '400 Errors',
                        data: dataAuth.daily_stats.map(selectProp("requests_error_400")),
                      },
                      {
                        label: '401 Errors',
                        data: dataAuth.daily_stats.map(selectProp("requests_error_401")),
                      },
                      {
                        label: '404 Errors',
                        data: dataAuth.daily_stats.map(selectProp("requests_error_404")),
                      },
                      {
                        label: '405 Errors',
                        data: dataAuth.daily_stats.map(selectProp("requests_error_405")),
                      },
                      {
                        label: '500 Errors',
                        data: dataAuth.daily_stats.map(selectProp("requests_error_500")),
                      },
                      {
                        label: '503 Errors',
                        data: dataAuth.daily_stats.map(selectProp("requests_error_503")),
                      },
                    ],
                  }}
                  options={{
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom'
                      },
                      title: {
                        display: true,
                        text: 'Response Error Codes',
                        font: {
                          size: 18,
                          weight: 'bold'
                        },
                      },
                      subtitle: {
                        display: true,
                        text: 'Response error code count, last ' + DAYS_TO_KEEP_STATS + ' days',
                        font: {
                          size: 12,
                          style: 'italic'
                        },
                        padding: {
                          bottom: 20
                        },
                      },
                    },
                  }}      
                />
              ) : (
                dataError ? (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CIcon icon={cilWarning} size="lg"/>
                      <span style={{ marginLeft:"10px" }}>Error fetching data!</span>
                    </CCol>
                  </CRow>
                ) : (
                  <CRow>
                    <CCol style={{ textAlign: 'center'}}>
                      <CSpinner color="dark" size="sm" />
                    </CCol>
                  </CRow>
                )
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </CRow>
  )
}

export default Dashboard
