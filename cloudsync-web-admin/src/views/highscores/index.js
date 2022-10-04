import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import {
    CToaster,
    CToast,
    CToastBody,
    CToastClose,
    CLink,
    CInputGroup,
    CFormInput,
    CFormText,
    CButton,
    CButtonGroup,
    CCallout,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
    CSpinner,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilPenAlt, cilTrash, cilWarning, cilReload, cilFilter, cilFilterX, cilPlaylistAdd } from '@coreui/icons';
  import { getHighScores, removeHighScore } from '../../webapi'
  import { PAGE_SIZES, usernameRegex } from '../../config'
  import { getUsername } from '../../stateapi/auth'

const Highscores = () => {

  const loggedUser = useSelector(getUsername)

  const [selectedRecord, changeSelectedRecord] = useState({})
  const [records, changeRecords] = useState()
  const [recordsEmpty, changeEmptyRecords] = useState()

  const [deleting, changeDeleting] = useState(false)
  const [deleteVisible, changeDeleteVisible] = useState(false)
  const [filterActive, changeFilterActive] = useState(false)
  const [filterText, changeFilterText] = useState("")

  const [start, changeStart] = useState(0)
  const [pageSize, changePageSize] = useState(PAGE_SIZES[0])
  const [resultsSize, changeResultsSize] = useState(0)

  const [total, changeTotal] = useState(0)

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

  const [editUrl, changeEditUrl] = useState(null)
  let navigate = useNavigate();
  function navigateToEdit() {

    if (editUrl)
      navigate(editUrl)
  }

  function buildPageSizeControl() {

    return (
      <CFormText className='text-secondary' component="span">
        Table size:&nbsp;
        {
          PAGE_SIZES.map(function(size, i){
            return (
              <span key={'pageSizeOption' + i}>
                {
                  (pageSize === size ? (<strong>{size}</strong>) : (<CLink style={{cursor: 'pointer'}} onClick={() => {changeStart(0); changePageSize(size)}}>{size}</CLink>))
                }
                ,&nbsp;
              </span>
            )
          })
        }
        records per page.
      </CFormText>
    )
  }

  function buildPagingControl() {

    const totalPages = Math.ceil(total/pageSize)
    const activePage = (start/pageSize) + 1

    let placeHolderBefore = false
    let placeHolderAfter = false

    return (
      <CPagination style={{float: 'right', cursor: 'pointer'}}
                   aria-label="Table navigation">
        <CPaginationItem aria-label="Previous"
                         onClick={() => {changeStart(start - pageSize)}}
                         disabled={(start <= 0 ? true : false)}>
          <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>
        {
          Array.apply(0, Array(totalPages)).map(function (x, i) {

            if (i==0 ||
                i==(activePage - 2) ||
                i==(activePage - 1) ||
                i==(activePage) || 
                i==(totalPages - 1))
            {
              return (
                <CPaginationItem key={i+1}
                                 onClick={() => {changeStart((i) * pageSize)}}
                                 active={(activePage == (i + 1) ? true : false)}>
                  {i + 1}
                </CPaginationItem>
              )
            } else {
              if (i < activePage &&
                  placeHolderBefore == false)
              {
                placeHolderBefore = true
                return (
                  <CPaginationItem key={i+1}>
                    &#183;&#183;&#183;
                  </CPaginationItem>
                )
              } else {
                if (i > activePage &&
                    placeHolderAfter == false)
                {
                  placeHolderAfter = true
                  return (
                    <CPaginationItem key={i+1}>
                      &#183;&#183;&#183;
                    </CPaginationItem>
                  )
                } else {
                  return null
                }
              }
            }
          })
        }
        <CPaginationItem aria-label="Next"
                         onClick={() => {changeStart(parseInt(start) + parseInt(pageSize))}}
                         disabled={(start >= ((totalPages - 1) * pageSize) ? true : false)}>
          <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
      </CPagination>
    )
  }

  function handleFilterActive() {

    if (usernameRegex.test(filterText)) {

      changeStart(0)
      if (filterActive) {

        changeFilterText("")
      }
      changeFilterActive(!filterActive)
    } else {

      addToast(generateToast("warning","Invalid filter value!"))
    }
  }

  function deleteRecord() {

    changeDeleting(true)
    removeHighScore(selectedRecord.username)
      .then(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("success","Highscore record deleted succesfully!"))
        reloadTable()
      })
      .catch(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("danger","Error deleting highscore record!"))
        reloadTable()        
      })
  }

  function reloadTable() {
    changeEmptyRecords(false)
    changeRecords(null)

    refresh()
  }

  function refresh () {

    //console.log('showClosed: ' + showClosed + ', start: ' + start + ', pageSize: ' + pageSize + ', filterText: ' + filterText)
    getHighScores(start, pageSize, filterText)
      .then(response => {
        const { data } = response
        const r = {}
        const resultsLength = data.results.length
        if ( resultsLength > 0 ) {
          data.results.forEach(record => {
            r[record.id] = record
          })
          changeRecords(r)
          changeEmptyRecords(false)
          changeResultsSize(resultsLength)
          changeTotal(data.total)
        } else {
          changeRecords(null)
          changeEmptyRecords(true)
        }
      })
      .catch(err => {
        changeRecords(null)
        changeEmptyRecords(true)
        addToast(generateToast("danger","Error fetching data!"))
      })
  }

  function parseTimestamp(timestamp) {
    const date = new Date(timestamp)
    const utcDate = new Date(date.getTime() - (date.getTimezoneOffset()*60000))

    return utcDate.toUTCString()
  }

  useEffect(() => {reloadTable()}, [start, pageSize, filterActive])
  useEffect(() => {navigateToEdit()}, [editUrl])
  return (
    <CRow>
      { deleteVisible ? (
      <CModal alignment="center" visible={deleteVisible} onClose={() => changeDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete game progress</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning!</strong>&nbsp;You are about to delete this highscore record for user <strong>"{selectedRecord.username}"</strong>.<br /><br />This action cannot be undone. Are you sure?
        </CModalBody>
        <CModalFooter>
          <CButton style={{color: 'white'}}
                   ccolor="secondary"
                   disabled={deleting}
                   onClick={() => changeDeleteVisible(false)}>
            Cancel
          </CButton>
          {deleting ? (
            <CButton style={{color: 'white'}} color="danger" disabled>
              <CSpinner component="span" size="sm" aria-hidden="true"/>
            </CButton>
            ) : (
              <CButton style={{color: 'white'}} color="danger" onClick={() => {changeStart(0); deleteRecord(false)}}>
                <CIcon icon={cilTrash}/>
                &nbsp;Delete highscore
              </CButton>
            )
          }
        </CModalFooter>
      </CModal>
      ) : (
        null
      )}
      <CCol xs={12}>
        <CCallout color="info" className="bg-white">
          <p>Welcome to the <strong>Highscores</strong> listing!</p>
          <p>From this page you can manage all FIUBA CloudSync user's highscores:</p>
          <ul>
              <li>Create a highscore record for a user</li>
              <li>View or Edit a particular user's highscore record details</li>
              <li>Delete a user's highscore record</li>
          </ul>
        </CCallout>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <CRow>
              <CCol>
                <strong>Highscores list</strong>
                <CFormText>Please enter a username to search</CFormText>
              </CCol>
              <CCol>
              <CInputGroup style={{ marginTop: '7px'}}>
                <CFormInput
                  value={filterText}
                  onKeyPress={(e) => {(e.key === 'Enter' ? (handleFilterActive()) : null )}}
                  onChange={e => changeFilterText(e.target.value)}
                  disabled={filterActive ? true : false}
                  type="text"
                  placeholder="Filter by 'Username'..."
                />
                <CButton color={(filterActive ? "secondary" : "primary")} onClick={() => {handleFilterActive()}}>
                  <CIcon icon={(filterActive ? cilFilterX : cilFilter)} style={{color: 'white'}} size="lg"/>
                </CButton>
                </CInputGroup>
              </CCol>
              <CCol>
                  <CButton style={{float: 'right', marginTop: '7px'}} onClick={() => {changeEditUrl("/highscores/edit?mode=new")}}>
                    <CIcon icon={cilPlaylistAdd} style={{color: 'white', marginRight: '10px'}} size="lg"/>New highscore
                  </CButton>
                  <CButton style={{float: 'right', marginTop: '7px', marginRight: '10px'}} onClick={() => {changeStart(0); reloadTable()}}>
                    <CIcon icon={cilReload} style={{color: 'white'}} size="lg"/>
                  </CButton>
              </CCol>
            </CRow>
          </CCardHeader>
          <CCardBody>
            <CTable striped align="middle" style={{textAlign: 'center'}} responsive>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Achieved level</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Difficulty level</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Time elapsed</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Gold collected</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Highscore</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {records ? (
                (Object.values(records) || []).map(record => {
                  return (
                    <CTableRow key={record.id}>
                      <CTableHeaderCell scope="row">{record.username}</CTableHeaderCell>
                      <CTableDataCell>{record.achieved_level}</CTableDataCell>
                      <CTableDataCell>{record.difficulty_level}</CTableDataCell>
                      <CTableDataCell>{record.time_elapsed}</CTableDataCell>
                      <CTableDataCell>{record.gold_collected}</CTableDataCell>
                      <CTableDataCell>{record.high_score}</CTableDataCell>
                      <CTableDataCell>{parseTimestamp(record.date_created)}</CTableDataCell>
                      <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary" onClick={() => {changeSelectedRecord(record); changeEditUrl("/highscores/edit?username=" + record.username + "&mode=view")}}>
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                        {((record.username !== loggedUser) || (record.expired) ? (
                          <CButton color="danger" onClick={() => {changeSelectedRecord(record); changeDeleteVisible(true)}}>
                            <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                          </CButton>
                        ) : (null))}
                      </CButtonGroup>    
                      </CTableDataCell>
                    </CTableRow>
                  )}
                )) : (
                    recordsEmpty ? (
                      <CTableRow style={{ lineHeight:"40px" }}>
                        <CTableDataCell colSpan="8" scope="row">
                          <CIcon icon={cilWarning} size="lg"/>
                          <span style={{ marginLeft:"10px" }}>No records found.</span>
                        </CTableDataCell >
                      </CTableRow>)
                    : (
                      <CTableRow style={{ lineHeight:"40px" }}>
                        <CTableDataCell colSpan="8" scope="row">
                          <CSpinner color="dark" size="sm" />
                        </CTableDataCell >
                      </CTableRow>)
                    )
              }
              </CTableBody>
            </CTable>
            {records ? (
              <CRow>
                  <CCol>
                    {buildPageSizeControl()}
                    <p className='text-dark'>
                      Showing records {start + 1} to {start + resultsSize} out of a total of {total} entries.
                    </p>
                  </CCol>
                  <CCol>
                    {buildPagingControl()}
                  </CCol>
                </CRow>)           
              : (
                null
              )}
          </CCardBody>
        </CCard>
      </CCol>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </CRow>
  )
};

export default Highscores;
