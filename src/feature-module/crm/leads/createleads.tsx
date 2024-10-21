import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Select from 'react-select'

const CreateLeads = (prop: any) => {
  const [formState, setFormState] = useState({
    subject: '',
    comment: '',
  });
  const closeRef = useRef(null);
  const options = [
    { value: 'Call', label: 'Call' },
    { value: 'Send Letter ', label: 'Send Letter' },
    { value: 'Send Quote', label: 'Send Quote' },
    { value: 'Other', label: 'Other' },
  ];

  const handleChange = (e: any) => {
    console.log(e);
    if (e?.target) {
      const { name, value } = e.target;
      setFormState({
        ...formState,
        [name]: value
      });
    } else {
      setFormState({
        ...formState,
        subject: e.value
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    prop.addLogCall(formState);
    if (closeRef != null && closeRef.current != null) {
      (closeRef.current as HTMLElement).click();
      setFormState({
        subject: '',
        comment: '',
      })
    }
  };

  useEffect(() => {

  })

  return (
    <>
      {/* Create Leads */}
      <div className="modal custom-modal fade" id="create_contact" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0 m-0 justify-content-end">
              <button
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <i className="ti ti-x" />
              </button>
            </div>
            <div className="modal-body">
              <div className="success-message text-center">
                <div className="success-popup-icon bg-light-blue">
                  <i className="ti ti-user-plus" />
                </div>
                <h3>Contact Created Successfully!!!</h3>
                <p>View the details of contact, created</p>
                <div className="col-lg-12 text-center modal-btn">
                  <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <Link to="/leads-details" className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Leads */}
      {/* Add Note */}
      <div
        className="modal custom-modal fade modal-padding"
        id="add_notes"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add New Notes</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <form>
                <div className="form-wrap">
                  <label className="col-form-label">
                    Title <span className="text-danger"> *</span>
                  </label>
                  <input className="form-control" type="text" />
                </div>
                <div className="form-wrap">
                  <label className="col-form-label">
                    Note <span className="text-danger"> *</span>
                  </label>
                  <textarea className="form-control" rows={4} defaultValue={""} />
                </div>
                <div className="form-wrap">
                  <label className="col-form-label">
                    Attachment <span className="text-danger"> *</span>
                  </label>
                  <div className="drag-attach">
                    <input type="file" />
                    <div className="img-upload">
                      <i className="ti ti-file-broken" />
                      Upload File
                    </div>
                  </div>
                </div>
                <div className="form-wrap">
                  <label className="col-form-label">Uploaded Files</label>
                  <div className="upload-file">
                    <h6>Projectneonals teyys.xls</h6>
                    <p>4.25 MB</p>
                    <div className="progress">
                      <div
                        className="progress-bar bg-success"
                        role="progressbar"
                        style={{ width: "25%" }}
                        aria-valuenow={25}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      />
                    </div>
                    <p className="black-text">45%</p>
                  </div>
                  <div className="upload-file upload-list">
                    <div>
                      <h6>tes.txt</h6>
                      <p>4.25 MB</p>
                    </div>
                    <Link to="#" className="text-danger">
                      <i className="ti ti-trash-x" />
                    </Link>
                  </div>
                </div>
                <div className="col-lg-12 text-end modal-btn">
                  <Link to="" className="btn btn-light" data-bs-dismiss="modal">
                    Cancel
                  </Link>
                  <button className="btn btn-primary" type="submit">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* /Add Note */}
      {/* Create Call Log */}
      <div
        className="modal custom-modal fade modal-padding"
        id="create_call"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create Call Log</h5>
              <button
                type="button"
                className="btn-close position-static"
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="modal-body p-0">
              <div className="row">
                <div className="col-md-12">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Subject <span className="text-danger"> *</span>
                    </label>
                    <Select className="select" name='subject' options={options} onChange={handleChange} />
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      Comments <span className="text-danger"> *</span>
                    </label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Add text"
                      defaultValue={""}
                      name='comment'
                      value={formState.comment}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="text-end modal-btn" >
                    <button ref={closeRef} className="btn btn-light" data-bs-dismiss="modal" >
                      Cancel
                    </button>
                    <button onClick={(e) => handleSubmit(e)} className="btn btn-primary" type="submit">
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* /Create Call Log */}
    </>

  )
}

export default CreateLeads
