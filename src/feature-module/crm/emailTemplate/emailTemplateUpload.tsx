import React, { useEffect, useState } from 'react';
import { sendEmail, sendEmailToList } from '../../../services/emailTemplate';
import { toast } from 'react-toastify';
import { getLeads, getListLeads } from '../../../services/lead';
import Select, { StylesConfig } from "react-select";
import { getListFilter } from '../../../services/filter';
import { loadFromTextLeadFilter } from '../../../utils/commonUtil';
import Swal from 'sweetalert2';
const customStyles: StylesConfig = {
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? "#E41F07" : "#fff",
        color: state.isFocused ? "#fff" : "#000",
        "&:hover": {
            backgroundColor: "#E41F07",
        },
    }),
};

const options = [
    { value: 'lead', label: 'Lead' },
    { value: 'leadFilter', label: 'Lead Filter' },
]

const EmailTemplateUpload = (prop: any) => {
    const [file, setFile] = useState(null);
    const [emailTemplateId, setEmailTemplateId] = useState('');
    const [uploading, setUploading] = useState(false);
    const [leads, setLeads] = useState<any>([]);
    const [error, setError] = useState(null);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [type, setType] = useState('lead');
    const [listFilter, setListFilter] = useState<any>([]);
    const [listFilterOptions, setListFilterOptions] = useState<any>([]);
    const [filter, setFilter] = useState<any>(null);

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const getListFilters = () => {
        getListFilter(1)
            .then((res) => {
                if (res.code === 1) {
                    setListFilter(res?.data);
                    setListFilterOptions(res?.data?.map((item: any) => {
                        return {
                            value: item.filterStoreId,
                            label: item.filterName
                        }
                    }));
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        setEmailTemplateId(prop.id);
        getListLead();
        getListFilters();
    }, [prop.id])

    const getListLead = () => {
        const param = {
            currentPage: 0,
            perPage: 100,
        }
        getListLeads(param)
            .then(response => {
                if (response.code === 1) {
                    setLeads(response?.data?.items?.map((item: any) => {
                        return {
                            value: item?.leadId,
                            label: item?.firstName + " " + item?.lastName
                        }
                    }));
                }
            })
            .catch(error => {

            })
    }


    const handleFileUpload = async () => {

        const formData = new FormData();
        const id = emailTemplateId || prop.id;
        formData.append('emailtemplate', id);
        Swal.showLoading();
        if (type === 'leadFilter') {
            const search = listFilter?.find((item: any) => item?.filterStoreId === filter)?.filterSearch;
            const query = loadFromTextLeadFilter(search);
            getLeads(0, 10000, query)
                .then((res) => {
                    if (res.code === 1) {
                        const listLead = res?.data?.items?.map((item: any) => item?.leadId);
                        if (file)
                            formData.append('file', file);
                        formData.append('listIds', listLead.join(','));
                        setUploading(true);
                        setError(null);
                        sendEmailToList(formData)
                            .then((response: any) => {
                                Swal.close();
                                if (response.code === 1) {
                                    toast.success("Send email successfully!");
                                }
                            })
                            .catch(err => {
                                setUploading(false);
                            })
                    }
                })
                .catch((err) => {
                    Swal.close();
                    console.log(err);
                });
        } else {
            const listLeadId = selectedLead?.map((item: any) => item.value);
            if (file)
                formData.append('file', file);
            formData.append('listIds', listLeadId.join(','));
            setUploading(true);
            setError(null);
            sendEmailToList(formData)
                .then((response: any) => {
                    Swal.close();
                    if (response.code === 1) {
                        toast.success("Send email successfully!");
                    }
                })
                .catch(err => {
                    Swal.close();
                    setUploading(false);
                })
        }

    };

    return (
        <div>
            <div className='row mb-3'>
                <label className='col-form-label col-md-3'>Select Type</label>
                <div className='col-md-9'>
                    <Select
                        className="select"
                        options={options}
                        styles={customStyles}
                        name="type"
                        onChange={(selectedOption: any) => {
                            setType(selectedOption.value);
                        }}
                        value={options.find((option) => option.value === type)}
                    />
                </div>
            </div>
            {
                type === 'leadFilter' && (
                    <div className='row mb-3'>
                        <label className='col-form-label col-md-3'>Select Filter</label>
                        <div className='col-md-9'>
                            <Select
                                className="select"
                                options={listFilterOptions}
                                styles={customStyles}
                                name="filter"
                                onChange={(selectedOption: any) => {
                                    setFilter(selectedOption?.value);
                                }}
                                value={listFilterOptions.find((option: any) => option.value === filter)}
                            />
                        </div>
                    </div>
                )
            }
            {
                type === 'lead' && (
                    <div className='row mb-3'>
                        <label className='col-form-label col-md-3'>Select Lead</label>
                        <div className='col-md-9'>
                            <Select
                                className="select"
                                options={leads}
                                styles={customStyles}
                                name="lead"
                                isMulti={true}
                                onChange={(selectedOption: any) => {
                                    setSelectedLead(selectedOption);
                                }}
                                value={selectedLead}
                            />
                        </div>
                    </div>
                )
            }
            <div className="mb-3 row">
                <label className="col-form-label col-md-3">File Input</label>
                <div className="col-md-9">
                    <input className="form-control" type="file" onChange={handleFileChange} />
                </div>
            </div>
            <button className='btn btn-primary' onClick={handleFileUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload and Send Email'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default EmailTemplateUpload;
