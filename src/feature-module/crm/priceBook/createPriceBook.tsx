import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { createPriceBook, getPriceBookById, patchPriceBook } from "../../../services/priceBook";
import "./priceBook.scss"

export const CreatePriceBook: React.FC<{
    showPopup?: boolean;
    setShowPopup?: any;
    getList?: any;
    isEdit?: boolean;
    id?: any;
    getDetail?: any;
}> = ({ showPopup, setShowPopup, getList, isEdit, id, getDetail }) => {
    const [priceBook, setPriceBook] = useState<any>({});
    const [errors, setErrors] = useState<{ priceBookName?: string; isActive?: string }>({});
    const { t } = useTranslation();

    useEffect(() => {
        if (isEdit) {
            getPriceBookById(id)
                .then((res: any) => {
                    setPriceBook(res.data);
                })
                .catch(err => {
                    toast.error("Failed to get price book.");
                });
        }
    }, [id])

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setPriceBook({
                ...priceBook,
                [name]: value,
            });
        } else {
            if (nameChild) {
                setPriceBook({
                    ...priceBook,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value,
                });
            } else {
                setPriceBook({
                    ...priceBook,
                    [name]: e.value,
                });
            }
        }
    };

    const validate = () => {
        let tempErrors: { priceBookName?: string; isActive?: string } = {};
        // Check required fields
        if (!priceBook.priceBookName?.trim()) tempErrors.priceBookName = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleCreate = () => {
        if (validate()) {
            const newPriceBook = {
                ...priceBook,
                isActive: priceBook.isActive ? 1 : 0,
                isStandardPriceBook: priceBook.isStandardPriceBook ? 1 : 0
            };
            if (isEdit) {
                // update
                patchPriceBook(newPriceBook, id)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Update price book successfully!");
                            setShowPopup(false);
                            getDetail(id);
                        }
                    })
                    .catch(err => {
                        toast.error("Failed to update price book.");
                    });
            } else {
                createPriceBook(newPriceBook)
                    .then(response => {
                        if (response.code === 1) {
                            toast.success("Create price book successfully!");
                            setPriceBook({});
                            setShowPopup(false);
                            getList(1, 10);
                        }
                    })
                    .catch(err => {
                        toast.error("Failed to create price book.");
                    });
            }
        }
    };

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout" style={{ maxWidth: '800px' }}>
                    <div className="sidebar-header">
                        <h4>{isEdit ? t("LABEL.PRICE_BOOK.UPDATE_PRICE_BOOK") : t("LABEL.PRICE_BOOK.CREATE_PRICE_BOOK")}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={togglePopup}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="form-wrap row">
                                            <div className="col-md-4 middle-align">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.PRICE_BOOK_NAME")} <span className="text-danger">*</span>
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="priceBookName"
                                                    onChange={handleChange}
                                                    value={priceBook?.priceBookName || ''}
                                                />
                                            </div>
                                            {errors.priceBookName && <div className="text-danger">{errors.priceBookName}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap row">
                                            <div className="col-md-8 middle-align">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.ACTIVE")}
                                                </label>
                                            </div>
                                            <div className="col-md-4">
                                                <input
                                                    type="checkbox"
                                                    name="isActive"
                                                    className="form-check-input"
                                                    onChange={() => handleChange({ target: { name: "isActive", value: !priceBook?.isActive } })}
                                                    checked={priceBook?.isActive || false}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div className="form-wrap row">
                                            <div className="col-md-4 middle-align">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.DESCRIPTION")}
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <textarea className="form-control" onChange={handleChange} name="priceBookDescription" value={priceBook?.priceBookDescription || ''} >
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="form-wrap row">
                                            <div className="col-md-8 middle-align">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.IS_STANDARD_PRICE_BOOK")}
                                                </label>
                                            </div>
                                            <div className="col-md-4">
                                                <input
                                                    type="checkbox"
                                                    name="isStandardPriceBook"
                                                    className="form-check-input"
                                                    onChange={() => handleChange({ target: { name: "isStandardPriceBook", value: !priceBook?.isStandardPriceBook } })}
                                                    checked={priceBook?.isStandardPriceBook || false} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleCreate}
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