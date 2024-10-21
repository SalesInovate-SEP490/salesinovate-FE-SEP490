import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { checkPermissionRole } from "../../utils/authen";
import { all_routes } from "../router/all_routes";
import Swal from 'sweetalert2'
import { getMyProfileForUser, patchUser } from "../../services/user";

const route = all_routes;
const MyProfileDetail: React.FC<{ profile: any; getProfileDetail?: any }> = ({ profile, getProfileDetail }) => {
    const [data, setData] = useState<any>(profile);
    const [listOpen, setListOpen] = useState<any>({
        edit: false,
        about: true,
        address: true
    });
    const [errors, setErrors] = useState<any>({})
    const { t } = useTranslation();

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

    useEffect(() => {
        checkPermissionRole(route.myProfile);
    }, [listOpen])

    useEffect(() => {
        getMyProfile();
    }, [])

    const getMyProfile = () => {
        Swal.showLoading();
        getMyProfileForUser()
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    setData(response.data);
                    console.log("data:", response);
                }
            })
            .catch(error => {
                Swal.close();
                console.error("Error getting profile detail: ", error)
            })
    }

    const handleEditClick = () => {
        setListOpen({ ...listOpen, edit: true });
    };

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value, type, checked } = e.target;
            const inputValue = type === 'checkbox' ? checked : value;
            setData({
                ...data,
                [name]: inputValue
            });
        } else {
            if (nameChild) {
                setData({
                    ...data,
                    [name]: {
                        [nameChild]: e.value
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setData({
                    ...data,
                    [name]: e.value
                });
            }
        }
    };

    const validate = () => {
        let tempErrors: {
            email?: string;
            phone?: string;
            lastName?: string;
        } = {};

        if (!data.lastName) tempErrors.lastName = t("MESSAGE.ERROR.REQUIRED");
        // check email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email) {
            tempErrors.email = t("MESSAGE.ERROR.REQUIRED");
        } else if (!emailPattern.test(data.email)) {
            tempErrors.email = t("MESSAGE.ERROR.INVALID_EMAIL");
        }
        // check phone number
        const phonePattern = /^0[35789][0-9]{8}$/;
        if (!data.phone) {
            tempErrors.phone = t("MESSAGE.ERROR.REQUIRED");
        } else if (!phonePattern.test(data.phone)) {
            tempErrors.phone = t("MESSAGE.ERROR.INVALID_PHONE");
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }

    const handleUpdate = () => {
        if (validate()) {
            const ProfileUpdate = {
                userId: data?.userId,
                firstName: data?.firstName,
                lastName: data?.lastName,
                email: data?.email,
                phone: data?.phone,
                background: data?.background,
                addressInformation: {
                    addressInformationId: data?.addressInformationId,
                    street: data?.street,
                    city: data?.city,
                    province: data?.province,
                    postalCode: data?.postalCode,
                    country: data?.country
                }
            }
            console.log("Update Profile: ", ProfileUpdate)
            patchUser(ProfileUpdate)
                .then(response => {
                    if (response.code === 1) {
                        toast.success("Update success");
                        setListOpen({ ...listOpen, edit: false, about: true, address: true })
                        getProfileDetail();
                    } else {
                        toast.error(response.message);
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }


    return (
        <>
            {listOpen.edit ?
                <>
                    <div className='col-ms-12 label-detail mb-3'>
                        <span onClick={() => setListOpen({ ...listOpen, about: !listOpen.about })}>
                            <i className={!listOpen.about ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                            {t('USER_MANAGE.ABOUT')}
                        </span>
                    </div>
                    {listOpen.about && (
                        <>
                            <div className='row'>
                                <div className='col-md-6'>
                                    <div className='form-wrap'>
                                        <label className='col-form-label'>{t('USER_MANAGE.FIRST_NAME')}</label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            name='firstName'
                                            onChange={(e) => handleChange(e)}
                                            value={data?.firstName}
                                        />
                                    </div>
                                    <div className='form-wrap'>
                                        <label className='col-form-label'>
                                            {t('USER_MANAGE.LAST_NAME')} <span className='text-danger'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            className='form-control'
                                            name='lastName'
                                            onChange={(e) => handleChange(e)}
                                            value={data?.lastName}
                                        />
                                        {errors.lastName && <p className='text-danger'>{errors.lastName}</p>}
                                    </div>
                                    <div className='form-wrap'>
                                        <label className='col-form-label'>
                                            {t('USER_MANAGE.EMAIL')} <span className='text-danger'>*</span>
                                        </label>
                                        <input
                                            type='email'
                                            className='form-control'
                                            name='email'
                                            onChange={(e) => handleChange(e)}
                                            value={data?.email}
                                        />
                                        {errors.email && <p className='text-danger'>{errors.email}</p>}
                                    </div>
                                </div>
                                <div className='col-md-6'>
                                    <div className='form-wrap mb-5'>
                                        <label className='col-form-label'>{t("USER_MANAGE.ROLE_NAME")}</label>
                                        <div className='text-black input-detail ml-2'>
                                            <div>
                                                {data?.roles?.map((role: any, index: number) => (
                                                    <span key={index}>
                                                        {role.name}
                                                        {index < data.roles.length - 1 && ', '}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-wrap'>
                                        <label className='col-form-label'>
                                            {t('USER_MANAGE.PHONE')} <span className='text-danger'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            className='form-control'
                                            name='phone'
                                            onChange={(e) => handleChange(e)}
                                            value={data?.phone}
                                        />
                                        {errors.phone && <p className='text-danger'>{errors.phone}</p>}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className='col-ms-12 label-detail mb-3'>
                        <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                            <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                            {t("USER_MANAGE.ADDRESS_INFORMATION")}
                        </span>
                    </div>
                    {listOpen.address && <>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        {t("USER_MANAGE.STREET")}
                                    </label>
                                    <input type="text" className="form-control" name="street"
                                        onChange={(e) => handleChange(e)} value={data?.addressInformation?.street} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        {t("USER_MANAGE.CITY")}
                                    </label>
                                    <input type="text" className="form-control" name="city"
                                        onChange={(e) => handleChange(e)} value={data?.addressInformation?.city} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        {t("USER_MANAGE.PROVINCE")}
                                    </label>
                                    <input type="text" className="form-control" name="province"
                                        onChange={(e) => handleChange(e)} value={data?.addressInformation?.province} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        {t("USER_MANAGE.POSTAL_CODE")}
                                    </label>
                                    <input type="text" className="form-control" name="postalCode"
                                        onChange={(e) => handleChange(e)} value={data?.addressInformation?.postalCode} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-wrap">
                                    <label className="col-form-label">
                                        {t("USER_MANAGE.COUNTRY")}
                                    </label>
                                    <input type="text" className="form-control" name="country"
                                        onChange={(e) => handleChange(e)} value={data?.addressInformation?.country} />
                                </div>
                            </div>
                        </div>
                    </>}
                    <div className="submit-button text-end mt-4">
                        <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false, about: true, address: true })} className="btn btn-light sidebar-close">
                            {t("USER_MANAGE.CANCEL")}
                        </Link>
                        <Link
                            to="#"
                            className="btn btn-primary"
                            onClick={() => handleUpdate()}
                        >
                            {t("USER_MANAGE.UPDATE")}
                        </Link>
                    </div>
                </>
                :
                <>
                    <div className='col-ms-12 label-detail'>
                        <span onClick={() => setListOpen({ ...listOpen, about: !listOpen.about })}>
                            <i className={!listOpen.about ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                            {t("USER_MANAGE.ABOUT")}
                        </span>
                    </div>
                    {listOpen.about && <>
                        <div className='row'>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.NAME")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.firstName || ''} ${data?.lastName || ''}`}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.ROLE_NAME")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <div>
                                            {data?.roles?.map((role: any, index: number) => (
                                                <span key={index}>
                                                    {role.name}
                                                    {index < data.roles.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.EMAIL")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.email || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.PHONE")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.phone || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>}
                    {/* <div className='col-ms-12 label-detail'>
                        <span onClick={() => setListOpen({ ...listOpen, address: !listOpen.address })}>
                            <i className={!listOpen.address ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                            {t("USER_MANAGE.ADDRESS_INFORMATION")}
                        </span>
                    </div>
                    {listOpen.address && <>
                        <div className="row">
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.STREET")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.addressInformation?.street || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.CITY")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.addressInformation?.city || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.PROVINCE")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.addressInformation?.province || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.POSTAL_CODE")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.addressInformation?.postalCode || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-6'>
                                <div className="row detail-row">
                                    <label className='col-md-4'>{t("USER_MANAGE.COUNTRY")}</label>
                                    <div className='col-md-8 text-black input-detail'>
                                        <span>{`${data?.addressInformation?.country || ' '} `}</span>
                                        <i
                                            className="fa fa-pencil edit-btn-permission ml-2"
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleEditClick}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>} */}
                </>
            }

        </>
    )
}

export default MyProfileDetail;
