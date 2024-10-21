import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createProduct, getProductById, patchProduct, getListProductFamily } from "../../../services/Product";
import { Product } from "./type";
import Select, { StylesConfig } from "react-select";
    
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./product.scss"

export const CreateProduct: React.FC<{
    setShowPopup?: any, id?: any, getProductDetail?: any,
    showPopup?: any, getProduct?: any, isEdit?: any
}> = ({ getProduct, setShowPopup, showPopup, isEdit, id, getProductDetail }) => {
    const [title, setTitle] = useState<any>("");
    const [product, setProduct] = useState<any>({});
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();
    const [listOpen, setListOpen] = useState<any>({
        system: true
    });
    const [productFamily, setProductFamily] = useState<any>(null);

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

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        console.log("E: ", e, name);
        if (e?.target) {
            const { name, value, type, checked } = e.target;
            setProduct({
                ...product,
                [name]: type === "checkbox" ? checked : value
            });
        } else {
            if (nameChild) {
                setProduct({
                    ...product,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value,
                });
            } else {
                setProduct({
                    ...product,
                    [name]: e.value,
                });
            }
        }
    };

    useEffect(() => {
        getListProductFamily()
            .then((res) => {
                const data = res.data.map((item: any) => {
                    return {
                        value: item.productFamilyId,
                        label: item.productFamilyName
                    };
                });
                setProductFamily(data);
            })
            .catch((err) => {
                console.log(err);
            });
        if (isEdit) {
            setTitle(t("PRODUCT.EDIT_PRODUCT"));
            getProductById(id)
                .then((res: any) => {
                    const data = res.data;
                    setProduct({
                        ...data,
                        productFamily: data.productFamily
                    });
                    console.log("data check: ", data);
                })
                .catch((err: any) => {
                    console.log(err);
                });
        } else {
            setTitle(t("PRODUCT.CREATE_PRODUCT"));
        }
    }, [id, isEdit, t]);

    const validate = () => {
        let tempErrors: { productName?: string; } = {};
        // Check required fields
        if (!product.productName?.trim()) tempErrors.productName = t("MESSAGE.ERROR.REQUIRED");

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(showPopup);
    };

    const handleChangeProductFamily = (selectedOption: any) => {
        setProduct({
            ...product,
            productFamily: {
                productFamilyId: selectedOption.value,
                productFamilyName: selectedOption.label
            },
            productFamilyId: selectedOption.value
        });
    };

    const handleUpdate = () => {
        if (validate()) {
            const productData = {
                productName: product?.productName,
                productCode: product?.productCode,
                productDescription: product?.productDescription,
                isActive: product?.isActive ? 1 : 0,
                productFamily: product?.productFamily?.productFamilyId
            }
            if (isEdit) {
                patchProduct(productData, id)
                    .then(response => {
                        console.log("Response:", response);
                        if (response.code === 1) {
                            toast.success("Update Product successfully!");
                            setShowPopup(false);
                            getProductDetail();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                createProduct(productData)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Create Product successfully!");
                            setProduct({
                                productName: "",
                                productCode: "",
                                productDescription: "",
                                isActive: 0,
                                productFamily: ""
                            })
                            setShowPopup(false);
                            getProduct(1, 10);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{title}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => setShowPopup(false)}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("PRODUCT.PRODUCT_NAME")} <span className="text-danger">*</span>
                                            </label>
                                            <input type="text" className="form-control" name="productName"
                                                onChange={(e) => handleChange(e)} value={product?.productName} />
                                            {errors.productName && <p className="text-danger">{errors.productName}</p>}
                                        </div>
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("PRODUCT.PRODUCT_CODE")}
                                            </label>
                                            <input type="text" className="form-control" name="productCode"
                                                onChange={(e) => handleChange(e)} value={product?.productCode} />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("PRODUCT.PRODUCT_FAMILY")}
                                            </label>
                                            <Select
                                                className="select"
                                                options={productFamily || []}
                                                styles={customStyles}
                                                value={productFamily?.find((item: any) => item.value === product?.productFamily?.productFamilyId) || null}
                                                name="productFamilyName"
                                                onChange={handleChangeProductFamily}
                                            />
                                        </div>
                                        <div className="form-wrap d-flex align-items-center mt-5">
                                            <label className="col-form-label mr-2">
                                                {t("PRODUCT.ACTIVE")}
                                            </label>
                                            <div className="custom-checkbox">
                                                <input
                                                    type="checkbox"
                                                    name="isActive"
                                                    id="isActive"
                                                    onChange={(e) => handleChange(e)}
                                                    checked={product?.isActive}
                                                />
                                                <label htmlFor="isActive" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("PRODUCT.PRODUCT_DESCRIPTION")}
                                            </label>
                                            <textarea
                                                name="productDescription"
                                                className="form-control"
                                                onChange={(e) => handleChange(e)}
                                                value={product?.productDescription || ''}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='col-ms-12 label-detail'>
                                    <span onClick={() => setListOpen({ ...listOpen, system: !listOpen.system })}>
                                        <i className={!listOpen.system ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                                        {t("PRODUCT.SYSTEM_INFORMATION")}
                                    </span>
                                </div>
                                {listOpen.system && <>
                                    <div className="row">
                                        <div className='col-md-6'>
                                            <div className="row detail-row">
                                                <label className='col-md-4'>{t("PRODUCT.CREATE_BY")}</label>
                                                <div className='col-md-8 d-flex align-items-center'>
                                                    {/* <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} /> */}
                                                    <div>
                                                        <span style={{ display: 'block', fontWeight: 'bold' }}>
                                                            {'khanh Linh'}
                                                        </span>
                                                        <span style={{ display: 'block', fontSize: '14px', color: '#555' }}>05/07/2024</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='col-md-6'>
                                            <div className="row detail-row">
                                                <label className='col-md-4'>{t("PRODUCT.EDIT_BY")}</label>
                                                <div className='col-md-8 d-flex align-items-center'>
                                                    {/* <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} /> */}
                                                    <div>
                                                        <span style={{ display: 'block', fontWeight: 'bold' }}>
                                                            {'khanh Linh'}
                                                        </span>
                                                        <span style={{ display: 'block', fontSize: '14px', color: '#555' }}>05/07/2024</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                <div className="submit-button text-end mt-5">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        {t("PRODUCT.CANCEL")}
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        {isEdit ? t("ACTION.UPDATE") : t("ACTION.CREATE")}
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}