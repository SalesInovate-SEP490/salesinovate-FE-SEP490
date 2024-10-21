import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { addProductToOpportunity, getProductList, patchListProduct, searchProductToAdd } from "../../../services/opportunities";
import DatePicker from 'react-datepicker';

const EditProductsModal: React.FC<{ id?: any, getList?: any; getProductDetail?: any }> = ({ id, getList, getProductDetail }) => {
    const [editableProduct, setEditableProduct] = useState<any[]>([]);
    const [errors, setErrors] = useState<any>({});
    const { t } = useTranslation();

    const handleDateChange = (date: any, productId: any) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, date: date } : product
        ));
    };
    useEffect(() => {
        searchProducts();
        getListEditProducts();
    }, [id]);

    const searchProducts = () => {
        const param = {
            opportunityId: id,
            search: ''
        }
        searchProductToAdd(param)
            .then(response => {
                
            })
            .catch(error => {
                console.log("error: ", error);
            })
    }

    const getListEditProducts = () => {
        const param = {
            opportunityId: id,
        }
        getProductList(param)
            .then(response => {
                if (response.code === 1) {
                    setEditableProduct(response.data.products.map((item: any) => {
                        return {
                            ...item,
                            key: item.productId,
                            date: item.date ? new Date(item.date) : null,
                            productName: item?.product.productName,
                            productId: item?.product.productId
                        }
                    }))
                }
            })
            .catch(error => {
                console.log("Error: ", error);
            });
    }

    const editableColumns = [
        {
            title: t("LABEL.PRODUCT.PRODUCT_NAME"),
            dataIndex: 'productName',
            key: "productName",
        },
        {
            title: t("LABEL.PRODUCT.QUANTITY"),
            dataIndex: "quantity",
            key: "quantity",
            render: (value: any, record: Partial<any>) => (
                record.productName !== null ? (
                    <>
                        <input
                            type="text"
                            value={record.quantity || ''}
                            className="form-control"
                            onChange={(e) => handleChangeEdited(record.productId, 'quantity', e.target.value)}
                        />
                        {errors[record.productId]?.quantity && <span className="text-danger">{errors[record.productId]?.quantity}</span>}
                    </>
                ) : (
                    <div className="empty-cell" />
                )
            )
        },
        {
            title: t("LABEL.PRODUCT.SALES_PRICE"),
            dataIndex: "sales_price",
            key: "sales_price",
            render: (value: any, record: Partial<any>) => (
                record.productName !== null ? (
                    <>
                        <input
                            type="text"
                            value={record.sales_price || ''}
                            className="form-control"
                            name="sales_price"
                            onChange={(e) => handleChangeEdited(record.productId, 'sales_price', e.target.value)}
                        />
                        {errors[record.productId]?.sales_price && <span className="text-danger">{errors[record.productId]?.sales_price}</span>}
                    </>
                ) : (
                    <div className="empty-cell" />
                )
            )
        },
        {
            title: t("LABEL.PRODUCT.DATE"),
            dataIndex: "date",
            key: "date",
            render: (value: any, record: Partial<any>) => (
                record.productName !== null ? (
                    <div className="icon-form">
                        <span className="form-icon">
                            <i className="ti ti-calendar-check" />
                        </span>
                        <DatePicker
                            className="form-control datetimepicker deals-details w-100 custom-datepicker"
                            selected={record.date}
                            onChange={(date) => handleDateChange(date, record.productId)}
                            dateFormat="dd-MM-yyyy"
                        />
                    </div>
                ) : (
                    <div className="empty-cell" />
                )
            )
        },
        {
            title: t("LABEL.PRODUCT.LINE_DESCRIPTION"),
            dataIndex: "line_description",
            key: "line_description",
            render: (value: any, record: Partial<any>) => (
                record.productName !== null ? (
                    <input
                        type="text"
                        value={record.line_description || ''}
                        className="form-control"
                        onChange={(e) => handleChangeEdited(record.productId, 'line_description', e.target.value)}
                    />
                ) : (
                    <div className="empty-cell" />
                )
            )
        },
    ];


    const handleChangeEdited = (productId: any, label: string, listPrice: string) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, [label]: listPrice } : product
        ));
    };

    const validateEditedProducts = () => {
        let tempErrors: any = {};
        editableProduct.forEach(product => {
            if (!product.productId) return;
            if (!product.quantity) {
                tempErrors[product.productId] = { ...tempErrors[product.productId], quantity: t("MESSAGE.ERROR.REQUIRED") };
            }
            if (!product.sales_price) {
                tempErrors[product.productId] = { ...tempErrors[product.productId], sales_price: t("MESSAGE.ERROR.REQUIRED") };
            }
        });
        setErrors(tempErrors); 
        return Object.keys(tempErrors).length === 0 ? null : tempErrors;
    }

    const handleSave = () => {
        if (validateEditedProducts()) return;
        const listProducts = editableProduct.map(product => {
            return {
                productId: product.productId,
                quantity: product.quantity,
                sales_price: product.sales_price,
                date: product?.date?.toISOString(),
                line_description: product.line_description
            }
        });
        patchListProduct(listProducts, id)
            .then(response => {
                if (response.code === 1) {
                    if(getList) getList();
                    if(getProductDetail) getProductDetail();
                    document.getElementById("close-btn-add-products")?.click();
                }
            })
            .catch(error => {
                console.log("Error: ", error);
            })
    };

    return (
        <div className="modal custom-modal fade" id="edit_products" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        <>
                            <h4 className="modal-title">{t("LABEL.PRICE_BOOK.EDIT_SELECTED_PRODUCT")}</h4>
                            <div className="col-md-12">
                                <div className="table-responsive custom-table col-md-12">
                                    <Table
                                        dataSource={editableProduct}
                                        columns={editableColumns}
                                        pagination={false}
                                        rowSelection={undefined} // Remove rowSelection to remove checkboxes
                                    />
                                </div>
                                <div className="space-between">
                                    <Link id="close-btn-add-products" to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
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
        </div>
    );
};

export default EditProductsModal;
