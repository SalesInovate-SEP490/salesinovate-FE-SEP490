import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { addProductToOpportunity, getProductList, patchListProduct, patchProdcut, searchProductToAdd } from "../../../services/opportunities";
import DatePicker from 'react-datepicker';
import { toast } from "react-toastify";
import { updateQuoteProduct } from "../../../services/quote";

const EditProductModal: React.FC<{
    id?: any, getList?: any, product?: any, priceBook?: any,
    opportunity?: any; getProductDetail?: any; quoteId?: any;
}> = ({ id, getList, product, priceBook, opportunity, getProductDetail, quoteId }) => {
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
        console.log("data", data);
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
        if (!data.product.quantity) tempErrors.quantity = t("MESSAGE.ERROR.REQUIRED");
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0 ? null : tempErrors;
    }

    const handleSave = () => {
        if (validateEditedProducts()) return;
        const product = {
            quoteOpportunityId: quoteId,
            quoteId: quoteId,
            productId: data.productId,
            productName: data.productName,
            quantity: data.quantity,
            unitPrice: data.unitPrice,
            listPrice: data.listPrice,
            description: data.lineDescription,
        }
        updateQuoteProduct(quoteId, product)
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
        <div className="modal custom-modal fade" id="edit_product_quote" role="dialog">
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
                                                        {t("LABEL.PRODUCT.PRODUCT")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <span>{data?.product?.productName}</span>
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
                                                    <span>{data?.product?.productCode}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="row">
                                                <div className="col-md-3">
                                                    <label className="col-form-label">
                                                        {t("LABEL.PRODUCT.UNIT_PRICE")}
                                                    </label>
                                                </div>
                                                <div className="col-md-9">
                                                    <input
                                                        type="text"
                                                        value={data?.product?.unitPrice || ''}
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
