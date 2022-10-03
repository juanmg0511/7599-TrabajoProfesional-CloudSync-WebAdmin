import React, { useState, useRef } from 'react';
import {
    CToaster,
    CToast,
    CToastBody,
    CToastClose,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CInputGroup,
    CFormInput,
    CFormText,
    CButton,
    CCallout,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CSpinner,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilWarning, cilFilter, cilFilterX } from '@coreui/icons';
  import SyntaxHighlighter from 'react-syntax-highlighter';
  import { a11yLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
  import { getAppReqLog } from '../../webapi'
  import { guidRegex } from '../../config'


const RequestLog = () => {

    const now = new Date()
    const today = now.toISOString().substring(0,10)
    const lastWeekDate = new Date(now.setDate(now.getDate() - 7))
    const lastWeek = lastWeekDate.toISOString().substring(0,10)

    const [record, changeRecord] = useState(null)
    const [recordEmpty, changeRecordEmpty] = useState(true)

    const [filterActive, changeFilterActive] = useState(false)
    const [filterText, changeFilterText] = useState("")
    const [server, changeServer] = useState ("AppServer")

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

    function hadleServerChangeApp() {

        if (server == "AuthServer") {
            changeServer("AppServer")
            if (filterText != "") {
                handleFilterActive()
            }
        }
    }

    function hadleServerChangeAuth() {

        if (server == "AppServer") {
            changeServer("AuthServer")
            if (filterText != "") {
                handleFilterActive()
            }
        }
    }

    function handleFilterActive() {

        if (guidRegex.test(filterText)) {
    
          if (filterActive) {
    
            changeFilterText("")
            changeRecord(null)
            changeRecordEmpty(true)
          }
          else {
            changeRecordEmpty(false)
            getData()
          }
          changeFilterActive(!filterActive)
        } else {
    
          addToast(generateToast("warning","Invalid filter value!"))
        }
    }

    function getData() {

        getAppReqLog(server, lastWeek, today, filterText)
        .then(response => {
            const { data } = response
            const r = {}
            const resultsLength = data.records_retrieved
            //console.log(resultsLength)
            if ( resultsLength > 0 ) {
            data.request_log.forEach(record => {
                r[record.request_id] = record
            })
            changeRecord(r)
            } else {
            changeRecord(null)
            changeRecordEmpty(true)
            }
        })
        .catch(_ => {
            changeRecord(null)
            changeRecordEmpty(true)
            addToast(generateToast("danger","Error fetching data!"))
        })
    }

    return (
      <CRow>
        <CCol xs={12}>
          <CCallout color="info" className="bg-white">
            <p>Welcome to the <strong>Request Log</strong> listing!</p>
            <p>From this page you can view in detail the requests made during the last 7 days to the FIUBA CloudSync platform:</p>
            <ul>
                <li>View requests to the Authorization Server (AuthServer)</li>
                <li>View requests to the Application Server (AppServer)</li>
            </ul>
          </CCallout>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>Server Request Log</strong>
                  <CFormText>Please enter a Request GUID to search</CFormText>
                </CCol>
                <CCol>                    
                <CInputGroup style={{ marginTop: '7px'}}>
                  <CDropdown variant="btn-group"
                             style={{ marginRight: '15px'}}>
                    <CDropdownToggle color='primary'>
                        {server}
                    </CDropdownToggle>
                    <CDropdownMenu>
                      <CDropdownItem onClick={() => {hadleServerChangeApp()}}>AppServer</CDropdownItem>
                      <CDropdownItem onClick={() => {hadleServerChangeAuth()}}>AuthServer</CDropdownItem>
                    </CDropdownMenu>
                  </CDropdown>
                  <CFormInput
                    style={{ borderTopLeftRadius: '0.375rem', borderBottomLeftRadius: '0.375rem'}}
                    value={filterText}
                    onKeyPress={(e) => {(e.key === 'Enter' ? (handleFilterActive()) : null )}}
                    onChange={e => changeFilterText(e.target.value)}
                    disabled={filterActive ? true : false}
                    type="text"
                    placeholder="Search by 'Request GUID'..."
                  />
                    <CButton color={(filterActive ? "secondary" : "primary")} onClick={() => {handleFilterActive()}}>
                      <CIcon icon={(filterActive ? cilFilterX : cilFilter)} style={{color: 'white'}} size="lg"/>
                    </CButton>
                </CInputGroup>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              {record ? (
                <SyntaxHighlighter language="json"
                                   style={a11yLight}
                                   showLineNumbers>
                  {JSON.stringify(record, null, 2)}
                </SyntaxHighlighter>
                ) : (
                  recordEmpty ? (
                    <CRow>
                      <CCol style={{ textAlign: 'center',
                                     padding: '20px',
                                     marginLeft: '20px',
                                     marginRight: '20px' }}>
                        <CIcon icon={cilWarning} size="lg"/>
                        <span style={{ marginLeft:"10px" }}>No records found.</span>
                      </CCol>
                    </CRow>
                  ) : (
                    <CRow>
                      <CCol style={{ textAlign: 'center',
                                     padding: '20px',
                                     marginLeft: '20px',
                                     marginRight: '20px' }}>
                        <CSpinner color="dark" size="sm" />
                      </CCol>
                    </CRow>
                  )
                )
              }
            </CCardBody>
          </CCard> 
        </CCol>
        <CToaster ref={toaster} push={toast} placement="top-end" />
      </CRow>
    )
};

export default RequestLog;
