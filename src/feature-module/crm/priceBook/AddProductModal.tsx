import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { addProducts, searchProductsToAdd } from "../../../services/priceBook";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";

const AddProductModal: React.FC<{ pricebookId?: any, getList?: any }> = ({ pricebookId, getList }) => {
    const [products, setProducts] = useState<any[]>([]);
    const [editableProduct, setEditableProduct] = useState<any[]>([]);
    const [selectedProductKeys, setSelectedProductKeys] = useState<any[]>([]);
    const [items, setItems] = useState<any>({
        initItems: [],
        items: []
    });
    const [step, setStep] = useState(1);
    const { t } = useTranslation();

    useEffect(() => {
        searchPriceBookToAdd();
    }, [pricebookId]);

    const searchPriceBookToAdd = () => {
        const param = {
            pricebookId,
            search: ''
        }
        searchProductsToAdd(param)
            .then(response => {
                console.log("response products to add: ", response);
                if (response.code === 1) {
                    setProducts(response.data.map((item: any) => {
                        return {
                            ...item,
                            key: item.productId
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
            title: t("LABEL.PRODUCT.ACTIVE"),
            dataIndex: "active",
            key: "active",
            render: (value: any, record: Partial<any>) => (
                <input type='checkbox' checked={record?.isActive} readOnly />
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
            title: t("LABEL.PRODUCT.LIST_PRICE"),
            dataIndex: "listPrice",
            key: "listPrice",
            render: (value: any, record: Partial<any>) => (
                <input
                    type="text"
                    value={record.listPrice}
                    className="form-control"
                    onChange={(e) => handlePriceChange(record.productId, e.target.value)}
                />
            )
        },
        {
            title: t("LABEL.PRODUCT.ACTIVE"),
            dataIndex: "isActive",
            key: "isActive",
            render: (value: any, record: Partial<any>) => (
                <input
                    type="checkbox"
                    checked={record.isActive}
                    onChange={(e) => handleActiveChange(record.productId, e.target.checked)}
                />
            )
        }
    ];

    const rowSelection = {
        selectedRowKeys: selectedProductKeys,
        onChange: (selectedRowKeys: any[]) => {
            setSelectedProductKeys(selectedRowKeys);
            // get all value from initItems
            const unSelectedItems = items?.initItems.filter((item: any) => !selectedRowKeys.includes(item.value));
            console.log("unSelectedItems: ", unSelectedItems);
            // set items with unselected items
            setItems({ ...items, items: unSelectedItems });
        }
    };

    const handleNext = () => {
        if (selectedProductKeys.length > 0) {
            setStep(2);
            const selectedProducts = products.filter(product => selectedProductKeys.includes(product.key));
            setEditableProduct(selectedProducts);
        }
    };

    const handleSave = () => {
        // new list, get productId, priceBookId, listPrice, useStandardPrice = 0
        const listProducts = editableProduct.map(product => {
            return {
                productId: product.productId,
                priceBookId: pricebookId,
                listPrice: product.listPrice,
                useStandardPrice: 0,
                currency: 1
            }
        });
        const param = {
            pricebookId
        }
        addProducts(listProducts, param)
            .then(response => {
                if (response.code === 1) {
                    getList();
                    searchPriceBookToAdd();
                    setStep(1);
                    setSelectedProductKeys([]);
                    document.getElementById("close-btn-add-products")?.click();
                }
            })
            .catch(error => {
                console.log("error: ", error);
            })
    };

    const handleActiveChange = (productId: any, isActive: boolean) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, isActive } : product
        ));
    };

    const handlePriceChange = (productId: any, listPrice: string) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, listPrice } : product
        ));
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
                                <h4 className="modal-title">{t("LABEL.PRICE_BOOK.EDIT_PRODUCT")}</h4>
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
