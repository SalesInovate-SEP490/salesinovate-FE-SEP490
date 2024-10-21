import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { addProductToOpportunity, getProductList, patchListProduct, patchProdcut, searchProductToAdd } from "../../../services/opportunities";
import DatePicker from 'react-datepicker';
import { toast } from "react-toastify";

const EditProductModal: React.FC<{
    id?: any, getList?: any, product?: any, priceBook?: any,
    opportunity?: any; getProductDetail?: any;
}> = ({ id, getList, product, priceBook, opportunity, getProductDetail }) => {
    const [data, setData] = useState<any>({
        opportunity,
        product,
        priceBook
    })
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    const handleDateChange = (date: any) => {
        setData({
            ...data,
            product: {
                ...data.product,
                date
            }
        });
    };

    useEffect(() => {
        setData({
            opportunity,
            product,
            priceBook
        });
    }, [product, priceBook, opportunity]);

    const handleChange = (e: any) => {
        setData({
            ...data,
            product: {
                ...data.product,
                [e.target.name]: e.target.value
            }
        });
    };

    const validateEditedProducts = () => {
        let tempErrors: any = {};
        if (!data.product.date) tempErrors.closeDate = t("MESSAGE.ERROR.REQUIRED");
        if (!data.product.sales_price) tempErrors.sales_price = t("MESSAGE.ERROR.REQUIRED");
        if (!data.product.quantity) tempErrors.quantity = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0 ? null : tempErrors;
    }

    const handleSave = () => {
        if (validateEditedProducts()) return;
        const product = [
            {
                productId: data.product.product.productId,
                date: data.product.date,
                sales_price: data.product.sales_price,
                quantity: data.product.quantity,
                line_description: data.product.line_description
            }
        ]
        patchListProduct(product, id)
            .then(response => {
                if (response.code === 1) {
                    toast.success("Edit product successfully!");
                    if (getList) getList();
                    if (getProductDetail) getProductDetail();
                    document.getElementById('close-btn-edit-product')?.click();
                } else {
                    toast.error("Edit product failed!");
                }
            })
            .catch(error => {
                console.log(error)
            })
    };

    return (
        <div className="modal custom-modal fade" id="edit_product" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="text-center mb-1">
                            <h3 className="modal-title">{t("LABEL.PRICE_BOOK.EDIT_PRODUCT")}</h3>
                        </div>
                        <>
                            <div className="col-md-12">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.OPPORTUNITIES.OPPORTUNITY")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{data?.opportunity?.opportunityName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.DATE")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <div className="icon-form">
                                                        <span className="form-icon">
                                                            <i className="ti ti-calendar-check" />
                                                        </span>
                                                        <DatePicker
                                                            className="form-control datetimepicker deals-details w-100"
                                                            selected={data?.product?.date}
                                                            onChange={handleDateChange}
                                                            dateFormat="dd-MM-yyyy"
                                                        />
                                                        {errors.date && <span className="text-danger">{errors.date}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.PRODUCT")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{data?.product?.product?.productName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.PRODUCT_CODE")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{data?.product?.product?.productCode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.SALES_PRICE")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <input
                                                        type="text"
                                                        value={data?.product?.sales_price || ''}
                                                        className="form-control"
                                                        name="sales_price"
                                                        onChange={handleChange}
                                                    />
                                                    {errors.sales_price && <span className="text-danger">{errors.sales_price}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.LIST_PRICE")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{data?.product?.sales_price}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.QUANTITY")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <input
                                                        type="text"
                                                        value={data?.product?.quantity || ''}
                                                        className="form-control"
                                                        name="quantity"
                                                        onChange={handleChange}
                                                    />
                                                    {errors.quantity && <span className="text-danger">{errors.quantity}</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.TOTAL_PRICE")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{(data?.product?.sales_price && data?.product?.quantity) ? (data?.product?.sales_price * data?.product?.quantity).toLocaleString() : '0'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.OPPORTUNITIES.CREATED_BY")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{'Ngô Quang Trung'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.OPPORTUNITIES.LAST_MODIFIED_BY")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{'Ngô Quang Trung'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.LINE_DESCRIPTION")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <input
                                                        type="text"
                                                        value={data?.product?.line_description || ''}
                                                        className="form-control" name="line_description"
                                                        onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <Link id="close-btn-edit-product" to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
                                        {t("ACTION.CANCEL")}
                                    </Link>
                                    <button onClick={handleSave} className="btn btn-success">
                                        {t("ACTION.SAVE")}
                                    </button>
                                </div>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EditProductModal;
