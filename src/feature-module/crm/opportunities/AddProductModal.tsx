import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { addProductToOpportunity, searchProductToAdd } from "../../../services/opportunities";
import DatePicker from 'react-datepicker';
import Swal from "sweetalert2";

const AddProductModal: React.FC<{
    id?: any, getList?: any, priceBookChange?: any, getProductDetail?: any
}> = ({ id, getList, priceBookChange, getProductDetail }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [editableProduct, setEditableProduct] = useState<any[]>([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
    const [items, setItems] = useState<any>({
        initItems: [],
        items: []
    });
    const [errors, setErrors] = useState<any>({});
    const [step, setStep] = useState(1);
    const { t } = useTranslation();

    const handleDateChange = (date: any, productId: any) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, date: date } : product
        ));
    };
    useEffect(() => {
        searchProducts();
    }, [id]);

    useEffect(() => {
        if (priceBookChange) {
            searchProducts();
        }
    }, [priceBookChange]);

    const searchProducts = () => {
        const param = {
            opportunityId: id,
            search: ''
        }
        searchProductToAdd(param)
            .then(response => {
                if (response.code === 1) {
                    setProducts(response.data.map((item: any) => {
                        return {
                            ...item,
                            key: item?.product?.productId,
                            productId: item?.product?.productId,
                            productName: item?.product?.productName,
                            productCode: item?.product?.productCode,
                            productDescription: item?.product?.productDescription,
                            productFamily: item?.product?.productFamily,
                            listPrice: item?.listPrice,

                        }
                    }));
                    setItems({
                        initItems: response.data.map((item: any) => { return { label: item.productName, value: item.productId } }),
                        items: response.data.map((item: any) => { return { label: item.productName, value: item.productId } })
                    });
                }
            })
            .catch(error => {
                console.log("error: ", error);
            })
    }

    const columns = [
        {
            title: t("LABEL.PRODUCT.PRODUCT_NAME"),
            dataIndex: 'productName',
            key: "productName",
            render: (value: undefined, record: Partial<any>) => {
                return <Link to={"/product-details/" + record?.productId}>{record?.productName}</Link>
            }
        },
        {
            title: t("LABEL.PRODUCT.PRODUCT_CODE"),
            dataIndex: "productCode",
            key: "productCode",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.productCode}
                </span>
        },
        {
            title: t("LABEL.PRODUCT.LIST_PRICE"),
            dataIndex: "listPrice",
            key: "listPrice",
            render: (value: any, record: Partial<any>) => (
                <div>{record?.listPrice}</div>
            )
        },
        {
            title: t("LABEL.PRODUCT.PRODUCT_DESCRIPTION"),
            dataIndex: "productDescription",
            key: "productDescription",
            render: (value: any, record: Partial<any>) => (
                <span>{record?.productDescription}</span>
            )
        },
        {
            title: t("LABEL.PRODUCT.PRODUCT_FAMILY"),
            dataIndex: "productFamily",
            key: "productFamily",
            render: (value: any, record: Partial<any>) => (
                <span>{record?.productFamily?.productFamilyName}</span>
            )
        }
    ];


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
            dataIndex: "listPrice",
            key: "listPrice",
            render: (value: any, record: Partial<any>) => (
                record.productName !== null ? (
                    <>
                        <input
                            type="text"
                            value={record.listPrice || ''}
                            className="form-control"
                            onChange={(e) => handleChangeEdited(record.productId, 'listPrice', e.target.value)}
                        />
                        {errors[record.productId]?.listPrice && <span className="text-danger">{errors[record.productId]?.listPrice}</span>}
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
            dataIndex: "lineDescription",
            key: "lineDescription",
            render: (value: any, record: Partial<any>) => (
                record.productName !== null ? (
                    <input
                        type="text"
                        value={record.lineDescription || ''}
                        className="form-control"
                        onChange={(e) => handleChangeEdited(record.productId, 'lineDescription', e.target.value)}
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

    const rowSelection = {
        selectedRowKeys: selectedProductKeys,
        onChange: (selectedRowKeys: any[]) => {
            setSelectedProductKeys(selectedRowKeys);
            const unSelectedItems = items?.initItems.filter((item: any) => !selectedRowKeys.includes(item.value));
            setItems({ ...items, items: unSelectedItems });
        }
    };

    const handleNext = () => {
        if (selectedProductKeys.length > 0) {
            setStep(2);
            const selectedProducts = products.filter(product => selectedProductKeys.includes(product.key));
            setEditableProduct(selectedProducts);
            if (selectedProducts.length < 5) {
                for (let i = 0; i < 5 - selectedProducts.length; i++) {
                    setEditableProduct(prevState => [...prevState, {
                        productId: null,
                        productName: null,
                        productCode: null,
                        listPrice: null,
                        date: null,
                        lineDescription: null,
                        quantity: null
                    }]);
                }
            }
        }
    };

    const validateEditedProducts = () => {
        let tempErrors: any = {};
        editableProduct.forEach(product => {
            if (!product.productId) return;
            if (!product.quantity) {
                tempErrors[product.productId] = { ...tempErrors[product.productId], quantity: t("MESSAGE.ERROR.REQUIRED") };
            }
            if (!product.listPrice) {
                tempErrors[product.productId] = { ...tempErrors[product.productId], listPrice: t("MESSAGE.ERROR.REQUIRED") };
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
                sales_price: product.listPrice,
                date: product?.date?.toISOString(),
                line_description: product.lineDescription
            }
        });
        const body = {
            opportunityId: id,
            opportunityProductDTOS: listProducts.filter(product => product.productId !== null)
        }
        Swal.showLoading(); 
        addProductToOpportunity(body)
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    if (getList) getList();
                    if (getProductDetail) getProductDetail();
                    searchProducts();
                    setStep(1);
                    setSelectedProductKeys([]);
                    document.getElementById("close-btn-add-products")?.click();
                }
            })
            .catch(error => {
                Swal.close();
                console.log("error: ", error);
            })
    };

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

    const selectSearch = (e: any) => {
        const isChecked = selectedProductKeys.includes(e.value);
        if (isChecked) return;
        setSelectedProductKeys(prev => { return [...prev, e.value] });
        setItems({ ...items, items: items.items.filter((item: any) => item.value !== e.value) });
    }

    return (
        <div className="modal custom-modal fade" id="add_products" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        {
                            step === 1 &&
                            <>
                                <h4 className="modal-title">{t("LABEL.PRICE_BOOK.ADD_PRODUCT")}</h4>
                                <div className="col-md-12">
                                    <Select
                                        className="select"
                                        options={items?.items}
                                        styles={customStyles}
                                        name="status"
                                        onChange={selectSearch}
                                        value={null}
                                    />
                                </div>
                                <div className="success-message text-center">
                                    <div className="col-lg-12 text-center modal-btn">
                                        <div className="table-responsive custom-table col-md-12">
                                            <Table
                                                dataSource={products}
                                                columns={columns}
                                                rowSelection={rowSelection}
                                            />
                                        </div>
                                        <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                                            {t("ACTION.CANCEL")}
                                        </Link>
                                        <button onClick={handleNext} className="btn btn-danger" disabled={selectedProductKeys.length <= 0}>
                                            {t("ACTION.NEXT")}
                                        </button>
                                    </div>
                                </div>
                            </>
                        }
                        {
                            step === 2 &&
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
                                        <div>
                                            <Link to="#" className="btn btn-light" onClick={() => setStep(1)}>
                                                {t("ACTION.BACK")}
                                            </Link>
                                        </div>
                                        <div>
                                            <Link id="close-btn-add-products" to="#" className="btn btn-light mr-1" data-bs-dismiss="modal">
                                                {t("ACTION.CANCEL")}
                                            </Link>
                                            <button onClick={handleSave} className="btn btn-success">
                                                {t("ACTION.SAVE")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddProductModal;
