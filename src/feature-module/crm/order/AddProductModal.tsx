import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { addProducts, getPriceBook } from "../../../services/priceBook";
import Table from "../../../core/common/dataTable/index";
import Select, { StylesConfig } from "react-select";
import { addListProductToOrder, addPriceBookProduct, getListPriceBookOrder, getListProducts } from "../../../services/order";
import { toast } from "react-toastify";

const AddProductModal: React.FC<{ pbId?: any, getList?: any; orderId?: any }> = ({ pbId, getList, orderId }) => {
    const [priceBooks, setPriceBooks] = useState<any[]>([]);
    const [priceBookId, setPriceBookId] = useState<any>(pbId);
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
        if (pbId) {
            setStep(1);
            setPriceBookId(pbId);
            searchPriceBookToAdd();
        } else {
            setStep(0);
            getListPriceBooks();
        }
    }, [pbId]);

    const getListPriceBooks = () => {
        const param = {
            pageNo: 0,
            pageSize: 1000
        }
        getPriceBook(param)
            .then(response => {
                if (response.code === 1) {
                    setPriceBooks(response?.data?.items?.map((item: any) => {
                        return {
                            label: item.priceBookName,
                            value: item.priceBookId
                        }
                    }));
                    console.log("priceBooks: ", priceBooks);
                }
            })
            .catch(error => {
                console.log("error: ", error);
            });
    }

    const searchPriceBookToAdd = () => {
        const param = {
            OrderId: orderId
        }
        getListProducts(param)
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
            title: t("LABEL.PRODUCT.PRODUCT_DESCRIPTION"),
            dataIndex: "productDescription",
            key: "productDescription",
            render: (value: any, record: Partial<any>) => (
                <div>{record?.productDescription}</div>
            )
        },
        {
            title: t("LABEL.PRODUCT.PRODUCT_FAMILY"),
            dataIndex: "productFamily",
            key: "productFamily",
            render: (value: any, record: Partial<any>) => (
                <div>{record?.productFamily}</div>
            )
        }
    ];

    const editableColumns = [
        {
            title: t("LABEL.PRODUCT.PRODUCT_NAME"),
            dataIndex: 'productName',
            key: "productName",
        },
        // add quantity
        {
            title: t("LABEL.PRODUCT.QUANTITY"),
            dataIndex: "quantity",
            key: "quantity",
            render: (value: any, record: Partial<any>) => (
                <input
                    type="text"
                    value={record?.quantity}
                    className="form-control"
                    onChange={(e) => handleQuantityChange(record.productId, e.target.value)}
                />
            )
        },
        {
            title: t("LABEL.PRODUCT.UNIT_PRICE"),
            dataIndex: "unitPrice",
            key: "unitPrice",
            render: (value: any, record: Partial<any>) => (
                <input
                    type="text"
                    value={record?.unitPrice}
                    className="form-control"
                    onChange={(e) => handlePriceChange(record.productId, e.target.value)}
                />
            )
        },
        {
            // list price read only
            title: t("LABEL.PRODUCT.LIST_PRICE"),
            dataIndex: "listPrice",
            key: "listPrice",
            render: (value: any, record: Partial<any>) => (
                <div>{record?.listPrice}</div>
            )
        },
        // add line description
        {
            title: t("LABEL.PRODUCT.LINE_DESCRIPTION"),
            dataIndex: "lineDescription",
            key: "lineDescription",
            render: (value: any, record: Partial<any>) => (
                <input
                    type="text"
                    value={record?.lineDescription}
                    className="form-control"
                    onChange={(e) => handleLineDescriptionChange(record.productId, e.target.value)}
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
                orderId: orderId,
                productId: product.productId,
                productName: product.productName,
                quantity: product.quantity,
                unitPrice: product.unitPrice,
                listPrice: product.listPrice,
                description: product.lineDescription,
            }
        });
        addListProductToOrder(listProducts)
            .then(response => {
                if (response.code === 1) {
                    if (getList)
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

    const handlePriceChange = (productId: any, unitPrice: string) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, unitPrice } : product
        ));
    };

    const handleQuantityChange = (productId: any, quantity: string) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, quantity } : product
        ));
    }

    const handleLineDescriptionChange = (productId: any, lineDescription: string) => {
        setEditableProduct(prevState => prevState.map(product =>
            product.productId === productId ? { ...product, lineDescription } : product
        ));
    }

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

    const handleChoosePriceBook = () => {
        const param = {
            PriceBookId: priceBookId,
            orderId
        }
        addPriceBookProduct(param)
            .then(response => {
                if (response.code === 1) {
                    setStep(1);
                    toast.success("Choose price book successfully!");
                    searchPriceBookToAdd();
                } else {
                    toast.error(response.message);
                }
            })
            .catch(error => {
                console.log("error: ", error);
            })
    }

    return (
        <div className="modal custom-modal fade" id="add_products_order" role="dialog">
            <div className="modal-dialog modal-dialog-centered modal-xl">
                <div className="modal-content">
                    <div className="modal-header border-0 m-0 justify-content-end">
                        <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="ti ti-x" />
                        </button>
                    </div>
                    <div className="modal-body text-center">
                        {step === 0 &&
                            <>
                                <h4 className="modal-title">{t("LABEL.PRICE_BOOK.CHOOSE_PRICE_BOOK")}</h4>
                                <div className="col-md-12">
                                    <Select
                                        className="select"
                                        options={priceBooks}
                                        styles={customStyles}
                                        name="status"
                                        onChange={(e) => setPriceBookId(e.value)}
                                        value={priceBooks.find(item => item.priceBookId === priceBookId)}
                                    />
                                </div>
                                <Link id="close-btn" to="#" className="btn btn-light" data-bs-dismiss="modal">
                                    {t("ACTION.CANCEL")}
                                </Link>
                                <button onClick={handleChoosePriceBook} className="btn btn-danger">
                                    {t("ACTION.SAVE")}
                                </button>
                            </>
                        }
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
