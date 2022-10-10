import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import qs from 'qs'
import {
  CToaster,
  CToast,
  CToastBody,
  CToastClose,  
  CCallout,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel,
  CFormText,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CSpinner,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilTrash, cilWarning } from '@coreui/icons';
import { getHighScore, createHighScore, saveHighScore, removeHighScore } from '../../../webapi'
import { usernameRegex, levelRegex, scoreRegex, timeElapsedRegex } from '../../../config'
import { getUsername } from '../../../stateapi/auth'
import { parseTimestamp } from 'src/helpers';

const HighscoresEdit = () => {

  let navigate = useNavigate();
  const { mode, id } = qs.parse(location.search, {
    ignoreQueryPrefix: true
  })
  const [formMode, changeFormMode] = useState(mode)
  const [submitting, changeSubmitting] = useState(false)
  const [deleting, changeDeleting] = useState(false)
  const [deleteVisible, changeDeleteVisible] = useState(false)

  const [record, changeRecord] = useState(null)
  const [recordEmpty, changeRecordEmpty] = useState(false)

  const [formUsername, changeFormUsername] = useState("")
  const [formAchievedLevel, changeFormAchievedLevel] = useState("")
  const [formDifficultyLevel, changeFormDifficultyLevel] = useState("")
  const [formTimeElapsed, changeFormTimeElapsed] = useState("")
  const [formGoldCollected, changeFormGoldCollected] = useState("")
  const [formHighScore, changeFormHighScore] = useState("")  

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


  const [validated, setValidated] = useState(false)
  const handleSubmit = (event) => {

    const form = event.currentTarget
    event.preventDefault()
    event.stopPropagation()

    if (form.checkValidity() === false) {

      addToast(generateToast("warning","Please review your input!"))
    } else {

      changeSubmitting(true) 
      const newHighScore = {
        username: formUsername,
        achieved_level: formAchievedLevel,
        difficulty_level: formDifficultyLevel,
        time_elapsed: formTimeElapsed,
        gold_collected: formGoldCollected,
        high_score: formHighScore,
      }  

      const operation = (formMode == "new" ? createHighScore(newHighScore) : saveHighScore(record.id, newHighScore))      
      operation                 
      .then(_ => {

        if (formMode == "new") {
          navigate('/highscores')
        } else {
          changeSubmitting(false)
          changeFormMode("view")
          getData()
        }
        addToast(generateToast("success","Highscore operation successful!"))
      })
      .catch(err => {

        let message = "Error during highscore operation!"
        if (err.response.data.message)
          message = "Error: " + err.response.data.message

        if (formMode == "edit") {
          changeFormMode("view")
          getData()
        }
        changeSubmitting(false)
        addToast(generateToast("danger",message))
      })
    }
    setValidated(true)
  }

  function setupForm() {

    if (formMode=="new") {
      changeFormMode('new')
    } else {
      if (formMode == "edit") {
        changeFormMode('edit')
        getData()
      } else {
        changeFormMode('view')
        getData()
      }
    }
  }

  function getData() {

    getHighScore(id)
    .then(response => {
        const { data } = response
        const resultsLength = data.id.length
        if ( resultsLength > 0 ) {
          changeRecord(data)
          changeFormUsername(data.username)
          changeFormAchievedLevel(data.achieved_level)
          changeFormDifficultyLevel(data.difficulty_level)
          changeFormTimeElapsed(data.time_elapsed)
          changeFormGoldCollected(data.gold_collected)
          changeFormHighScore(data.high_score)
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

  function deleteRecord() {

    changeDeleting(true)
    removeHighScore(record.id)
      .then(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("success","Highscore record deleted succesfully!"))
        navigate("/highscores")
      })
      .catch(_ => {

        changeDeleteVisible(false)
        changeDeleting(false)
        addToast(generateToast("danger","Error deleting highscore record!"))
        getData()
      })
  }

  useEffect(() => {setupForm()}, [])
  return (
    <CRow>
      { deleteVisible ? (
      <CModal alignment="center" visible={deleteVisible} onClose={() => changeDeleteVisible(false)}>
        <CModalHeader>
          <CModalTitle>Delete highscore</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <strong>Warning!</strong>&nbsp;You are about to delete the highscore record with id <strong>"{record.id}"</strong>, belonging to user <strong>"{record.username}"</strong>.<br /><br />This action cannot be undone. Are you sure?
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
              <CButton style={{color: 'white'}} color="danger" onClick={() => {deleteRecord(false)}}>
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
      <CCol style={{marginLeft: 'auto', marginRight: 'auto'}} xs={10}>
        <CCallout color="info" className="bg-white">
          <p>Welcome to the <strong>Highscore details</strong> page!</p>
          <p>From this page you can create, view or edit a FIUBA CloudSync highscore record:</p>
          <ul>
            <li>Create a highscore record for a user</li>
            <li>View or Edit a particular user's highscore record details</li>
            <li>Delete a user's highscore record</li>
          </ul>
        </CCallout>
        <CCard className="mb-4">
          <CCardBody>
            {(record || (formMode == 'new')) ? (
              <CRow>            
                <CCol md="8">
                  <CForm
                    className="needs-validation align-items-center"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}>
                        <CRow className="mb-3">
                          <CFormLabel>Username</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formUsername"
                              placeholder="please enter a user name"
                              value={formUsername}
                              onChange={e => changeFormUsername(e.target.value)}
                              disabled={( formMode == "new" ? false : true )}
                              required={true} 
                              pattern={usernameRegex.toString().slice(1, -1)}
                            />
                            <CFormFeedback invalid>Please enter a username</CFormFeedback>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel>Game Level</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formAchievedLevel"
                              placeholder="please enter a value"
                              value={formAchievedLevel}
                              onChange={e => changeFormAchievedLevel(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true}
                              pattern={levelRegex.toString().slice(1, -1)}
                            />
                            <CFormFeedback invalid>Please enter a valid game level value</CFormFeedback>
                            <CFormText>The highest geme level achieved, an integer from 1 to 10.</CFormText>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel>Difficulty Level</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formDifficultyLevel"
                              placeholder="please enter a value"
                              value={formDifficultyLevel}
                              onChange={e => changeFormDifficultyLevel(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true}
                              pattern={levelRegex.toString().slice(1, -1)}
                            />
                            <CFormFeedback invalid>Please enter a valid difficulty level</CFormFeedback>
                            <CFormText>The highest difficulty level achieved, an integer from 1 to 10.</CFormText>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel>Time Elapsed</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formTimeElapsed"
                              placeholder="please enter a value"
                              value={formTimeElapsed}
                              onChange={e => changeFormTimeElapsed(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true}
                              pattern={timeElapsedRegex.toString().slice(1, -1)}
                            />
                            <CFormFeedback invalid>Please enter a valid time elapsed value</CFormFeedback>
                            <CFormText>The time elepsed in game by the player, in format HH:mm:ss.sss.</CFormText>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel>Gold Collected</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formGoldCollected"
                              placeholder="please enter a value"
                              value={formGoldCollected}
                              onChange={e => changeFormGoldCollected(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true}
                              pattern={scoreRegex.toString().slice(1, -1)}
                            />
                            <CFormFeedback invalid>Please enter a valid gold collected value</CFormFeedback>
                            <CFormText>The amount of gold collected by the player, a positve integer.</CFormText>
                          </CCol>
                        </CRow>
                        <CRow className="mb-3">
                          <CFormLabel>High Score</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formHighScore"
                              placeholder="please enter a value"
                              value={formHighScore}
                              onChange={e => changeFormHighScore(e.target.value)}
                              disabled={( formMode == "view" ? true : false )}
                              required={true}
                              pattern={scoreRegex.toString().slice(1, -1)}
                            />
                            <CFormFeedback invalid>Please enter a valid score value</CFormFeedback>
                            <CFormText>The highscore obtained by the player, a positve integer.</CFormText>
                          </CCol>
                        </CRow>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel>Database Id</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formId"
                              value={(formMode == "new" ? "" : record.id)}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel>Date Created</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formCreated"
                              value={(formMode == "new" ? "" : parseTimestamp(record.date_created))}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <div className="mb-3"
                              style={{display: (formMode == "new" ? "none" : null)}}>
                          <CFormLabel>Date Updated</CFormLabel>
                          <CCol>
                            <CFormInput
                              type="text"
                              id="formExpired"
                              value={(formMode == "new" ? "" : (record.date_updated ? parseTimestamp(record.date_updated) : "None"))}
                              disabled={true}
                              required={false}
                              noValidate
                            />
                          </CCol>
                        </div>
                        <CRow className="mb-3">
                          <CCol style={{ marginTop: "50px"}}>
                            <div className="d-grid gap-2 d-sm-flex">
                              <CButton style={{color: 'white'}}
                                ccolor="secondary"
                                disabled={submitting}
                                onClick={(formMode == "edit" ? () => {changeFormMode("view"); getData()} : () => {navigate("/highscores")} )}>
                                Cancel
                              </CButton>
                              {submitting ? (
                                <CButton disabled>
                                  <CSpinner component="span" size="sm" aria-hidden="true"/>
                                </CButton>
                                ) : (
                                  <CButton
                                    color="primary"
                                    type="submit"
                                    style={{ display: ( formMode != "view" ? null : 'none' )}}
                                    >
                                  Save
                                  </CButton>
                                )
                              }
                              {formMode == "view" ? (
                                <>
                                <CButton
                                    color="primary"
                                    style={{ display: ( (!record.account_closed) ? null : 'none' )}}
                                    onClick={() => {changeFormMode("edit")}}>
                                    Edit
                                </CButton>
                                <CButton
                                    color="danger"
                                    style={{ color: 'white' }}
                                    onClick={() => {changeDeleteVisible(true)}}>
                                    <CIcon icon={cilTrash}/>
                                    &nbsp;Delete highscore
                                </CButton>
                                </>
                              ) : (
                                null
                              )}
                            </div>
                        </CCol>
                      </CRow>
                  </CForm>
                </CCol>
              </CRow> 
            ) : (
              recordEmpty ? (
                <CRow>
                  <CCol style={{ textAlign: 'center',
                                 padding: '20px',
                                 marginLeft: '20px',
                                 marginRight: '20px' }}>
                    <CIcon icon={cilWarning} size="lg"/>
                    <span style={{ marginLeft:"10px" }}>
                      Error fetching highscores data.
                    </span>
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

export default HighscoresEdit;
