import React from 'react';
import {
    CLink,
    CFormText,
    CFormCheck,
    CButton,
    CButtonGroup,
    CCallout,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CPagination,
    CPaginationItem,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilUserPlus, cilPenAlt, cilTrash } from '@coreui/icons';

/*

A nice comment

*/

const AdminUsers = (props) => {

    return (
      <CRow>
        <CCol xs={12}>
          <CCallout color="info" className="bg-white">
            <p>Welcome to the <strong>Administrators</strong> listing!</p>
            <p>From this page you can manage all FIUBA CloudSync administrators:</p>
            <ul>
                <li>Create new admins</li>
                <li>View or Edit a particular admin's details</li>
                <li>Close an admin's account</li>
            </ul>
          </CCallout>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <strong>Administrators list</strong>
                  <small>
                    <CFormCheck id="flexCheckChecked" label="Show closed accounts" defaultChecked />
                  </small>
                </CCol>
                <CCol>
                <CButton style={{float: 'right', marginTop: '7px'}}>
                  <CIcon icon={cilUserPlus} style={{color: 'white'}} size="lg"/>New Admin</CButton>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CTable striped style={{textAlign: 'center'}}>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                    <CTableHeaderCell scope="col">First name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Last name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Closed account?</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                <CTableRow>
                    <CTableHeaderCell scope="row">cloudsyncgod</CTableHeaderCell>
                    <CTableDataCell>CloudSync</CTableDataCell>
                    <CTableDataCell>God</CTableDataCell>
                    <CTableDataCell>cloudsyncgod@fiuba-cloudsync.com</CTableDataCell>
                    <CTableDataCell>No</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary">
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                      </CButtonGroup>    
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">pichiders</CTableHeaderCell>
                    <CTableDataCell>Pichi</CTableDataCell>
                    <CTableDataCell>Smithers</CTableDataCell>
                    <CTableDataCell>pichi.smithers@fiuba-cloudsync.com</CTableDataCell>
                    <CTableDataCell>No</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary">
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                        <CButton color="danger">
                          <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                        </CButton>
                      </CButtonGroup>    
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">mark.otto</CTableHeaderCell>
                    <CTableDataCell>Mark</CTableDataCell>
                    <CTableDataCell>Otto</CTableDataCell>
                    <CTableDataCell>mark.otto@fiuba-cloudsync.com</CTableDataCell>
                    <CTableDataCell>No</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary">
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                        <CButton color="danger">
                          <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                        </CButton>
                      </CButtonGroup>    
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">jabob.thornton</CTableHeaderCell>
                    <CTableDataCell>Jacob</CTableDataCell>
                    <CTableDataCell>Thornton</CTableDataCell>
                    <CTableDataCell>jabob.thornton@fiuba-cloudsync.com</CTableDataCell>
                    <CTableDataCell>No</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary">
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                        <CButton color="danger">
                          <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                        </CButton>
                      </CButtonGroup>    
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableHeaderCell scope="row">larry.thebird</CTableHeaderCell>
                    <CTableDataCell>Larry</CTableDataCell>
                    <CTableDataCell>The Bird</CTableDataCell>
                    <CTableDataCell>larry.thebird@fiuba-cloudsync.com</CTableDataCell>
                    <CTableDataCell>No</CTableDataCell>
                    <CTableDataCell>
                      <CButtonGroup>
                        <CButton color="secondary">
                          <CIcon icon={cilPenAlt} style={{color: 'white'}} size="sm"/>
                        </CButton>
                        <CButton color="danger">
                          <CIcon icon={cilTrash} style={{color: 'white'}} size="sm"/>
                        </CButton>
                      </CButtonGroup>    
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <CRow>
                <CCol>
                  <CFormText className='text-secondary' component="span">
                    Table size:&nbsp;
                    <CLink href="#">25</CLink>,&nbsp; 
                    <CLink href="#">50</CLink>,&nbsp;
                    <CLink href="#">100</CLink>&nbsp;
                    records per page.
                  </CFormText>
                  <p className='text-dark'>
                    Showing records 1 to 5 out of a total of 5 entries.
                  </p>
                </CCol>
                <CCol>
                  <CPagination style={{float: 'right'}} aria-label="Table navigation">
                    <CPaginationItem aria-label="Previous" disabled>
                      <span aria-hidden="true">&laquo;</span>
                    </CPaginationItem>
                    <CPaginationItem active>1</CPaginationItem>
                    <CPaginationItem>2</CPaginationItem>
                    <CPaginationItem>3</CPaginationItem>
                    <CPaginationItem aria-label="Next">
                      <span aria-hidden="true">&raquo;</span>
                    </CPaginationItem>
                  </CPagination>
                </CCol> 
              </CRow>             
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
};

export default AdminUsers;
