import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getPriceBookById, patchPriceBook, patchProduct } from "../../../services/priceBook";
import { updateQuoteProduct } from "../../../services/quote";

export const UpdateProducts: React.FC<{
    showPopup?: boolean;
    setShowPopup?: any;
    getList?: any;
    id?: any;
    getDetail?: any;
    initProduct?: any;
}> = ({ showPopup, setShowPopup, getList, id, getDetail, initProduct }) => {
    const [product, setProduct] = useState<any>(initProduct);
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    useEffect(() => {
        setProduct({
            ...initProduct?.product,
            listPrice: initProduct?.sales_price,
            quantity: initProduct?.quantity,
            lineDescription: initProduct?.line_description,
            opportunityProductId: initProduct?.opportunityProductId,
        });
    }, [initProduct])

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setProduct({
                ...product,
                [name]: value,
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

    const validate = () => {
        let tempErrors: any = {};
        if (!product.listPrice) tempErrors.listPrice = t("MESSAGE.ERROR.REQUIRED");
        if (!product.quantity) tempErrors.quantity = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const handleCreate = () => {
        if (validate()) {
            const newProduct = {
                opportunityProductId: product.opportunityProductId,
                quantity: product.quantity,
                sales_price: product.listPrice,
                line_description: product.lineDescription,
            };

            updateQuoteProduct(id, [newProduct])
                .then(response => {
                    if (response.code === 1) {
                        toast.success(t("MESSAGE.SUCCESS"));
                        getDetail();
                        setShowPopup(false);
                    }
                })
                .catch(error => {
                    toast.error("Have error! Please try again!");
                });
        }
    }

    return (
        <>
            <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout" style={{ maxWidth: '800px' }}>
                    <div className="sidebar-header">
                        <h4>{t("LABEL.PRICE_BOOK.UPDATE_PRODUCT")}</h4>
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
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-4 middle-align">
                                                <label className="col-form-label">
                                                    {t("LABEL.PRODUCT.PRODUCT")}
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <span>{product?.productName}</span>
                                            </div>
                                            {errors.listPrice && <div className="text-danger">{errors.listPrice}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-8 middle-align">
                                                <label className="col-form-label">
                                                    {t("LABEL.PRICE_BOOK.PRODUCT_CODE")}
                                                </label>
                                            </div>
                                            <div className="col-md-4">
                                                <span>{product?.productCode}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-4 middle-align">
                                                <label className="col-form-label">
                                                    {t("LABEL.PRICE_BOOK.LIST_PRICE")}
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input
                                                    type="input"
                                                    name="listPrice"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={product?.listPrice} />
                                                {errors.listPrice && <div className="text-danger">{errors.listPrice}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Quantity and line_description */}
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-4 middle-align">
                                                <label className="col-form-label">
                                                    {t("LABEL.PRODUCT.QUANTITY")}
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input type="input" className="form-control" value={product?.quantity} />
                                                {errors.quantity && <div className="text-danger">{errors.quantity}</div>}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Line Description */}
                                    <div className="col-md-6">
                                        <div className="form-wrap row">
                                            <div className="col-md-4 middle-align">
                                                <label className="col-form-label">
                                                    {t("LABEL.PRODUCT.LINE_DESCRIPTION")}
                                                </label>
                                            </div>
                                            <div className="col-md-8">
                                                <input type="input" className="form-control" value={product?.lineDescription} />
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
                                        {t("ACTION.UPDATE")}
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