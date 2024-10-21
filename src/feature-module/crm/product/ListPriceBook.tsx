import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { deleteProductFromPriceBook, getPriceBookById, getProductsByPriceBook } from "../../../services/priceBook";
import { getPriceBookByProduct, getProductById } from "../../../services/Product";

import { PriceBook } from "../priceBook/type"
import type { TableProps } from 'antd';
import { useTranslation } from "react-i18next";
import { toast, ToastContainer } from "react-toastify";
import DeleteModal from "../../support/deleteModal";
import AdPriceBookModal from "./addPriceBookModal";
import { UpdatePriceBook } from './updatePriceBook';
import Swal from "sweetalert2";
import './product.scss'
import AddPriceBookModal from './addPriceBookModal';

export default function ListPriceBook() {

    const [priceBook, setPriceBook] = useState<any>({});
    const [viewList, setViewList] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPriceBook, setTotalPriceBook] = useState(0);
    const [product, setProduct] = useState<any>({});
    const { id } = useParams();
    const { t } = useTranslation();
    const [showUpdate, setShowUpdate] = useState(false);
    const route = all_routes;
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        getPriceBook();
        getPriceBookDetail();
        getProductDetail();
    }, [pageNo, pageSize, id]);

    const getPriceBookDetail = () => {
        getPriceBookById(id)
            .then(response => {
                if (response.code === 1) {
                    setPriceBook(response.data);
                }
            })
            .catch(error => { })
    }

    const getProductDetail = () => {
        getProductById(id)
            .then(response => {
                if (response.code === 1) {
                    setProduct(response.data);
                }
            })
            .catch(error => { })
    }


    const handleTableChange: TableProps<PriceBook>['onChange'] = (pagination) => {
        setPageNo(pagination.current || 1);
        setPageSize(pagination.pageSize || 15);
    };

    const openEditModal = (priceBookId: any) => {
        setShowUpdate(true);
        setPriceBook(viewList.find((item: any) => item.priceBook.priceBookId === priceBookId));
    }

    const openEditCurrencyPB = () => {
        setShowAddModal(true);
    }

    const getPriceBook = () => {
        Swal.showLoading();
        const param = {
            pageNo: pageNo - 1,
            pageSize: pageSize,
            productId: id,
        };
        getPriceBookByProduct(param)
            .then(response => {
                Swal.close();
                if (response.code === 1) {
                    setViewList(response.data.items);
                    setTotalPriceBook(response.data.items);
                }
            })
            .catch(error => {
                console.error("Error getting Price Book by Product: ", error);
            });
    };

    const columns = [
        {
            title: t("PRODUCT.PRICE_BOOK_NAME"),
            dataIndex: `priceBookName`,
            key: "priceBookName",
            render: (value: undefined, record: Partial<any>) => {
                return <Link to={`/price-book-details/${record?.priceBook?.priceBookId}`}>{record?.priceBook?.priceBookName}</Link>
            }
        },
        {
            title: t("PRODUCT.LIST_PRICE"),
            dataIndex: "listPrice",
            key: "listPrice",
            render: (value: undefined, record: Partial<any>) =>
                <span >
                    {record?.listPrice} đ
                </span>
        },
        {
            title: t("PRODUCT.USE_STANDARD_PRICE"),
            dataIndex: "useStandardPrice",
            key: "useStandardPrice",
            render: (value: any, record: Partial<any>) => (
                <input type='checkbox' className='custom-checkbox' checked={record?.useStandardPrice} readOnly />
            )
        },
        {
            title: t("PRODUCT.ACTIVE"),
            dataIndex: "active",
            key: "active",
            render: (value: any, record: Partial<any>) => (
                <input type='checkbox' className='custom-checkbox' checked={record?.priceBook?.isActive} readOnly />
            )
        },
        {
            title: "Action",
            dataIndex: "action",
            render: (value: any, record: Partial<any>) => (
                <div className="dropdown table-action">
                    <Link
                        to="#"
                        className="action-icon"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <i className="fa fa-ellipsis-v" />
                    </Link>
                    <div className="dropdown-menu dropdown-menu-right">
                        <Link className="dropdown-item edit-btn-permission" to="#"
                            onClick={() => openEditModal(record.priceBook.priceBookId)}
                        >
                            <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
                        </Link>

                        <Link
                            className="dropdown-item delete-btn-permission"
                            to="#"
                            data-bs-toggle="modal"
                            data-bs-target="#delete_product_from_pb"
                            onClick={() => setProduct(viewList.find((item: any) => item.product.productId === record.product.productId))}
                        >
                            <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
                        </Link>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <>
            <>
                {/* Page Wrapper */}
                <div className="page-wrapper">
                    <div className="content">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="card main-card">
                                    <div className="card-body">
                                        {/* Add */}
                                        <div className="search-section">
                                            <div className="row">
                                                <div className="col-md-5 col-sm-4">
                                                </div>
                                                <div className="col-md-7 col-sm-8">
                                                    <div className="export-list text-sm-end">
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    to="#"
                                                                    className='btn custom-btn-blue-black'
                                                                    onClick={() => openEditCurrencyPB()}
                                                                >
                                                                    <i className="ti ti-square-rounded-plus" />
                                                                    {t("ACTION.ADD")}
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /Add */}
                                        {/* Filter */}
                                        <div className="filter-section filter-flex">
                                            <div className="sortby-list">
                                                <ul className="contact-breadcrumb" style={{ padding: 0, margin: 0, height: '20px' }}>
                                                    <li>
                                                        <Link to={route.product}>
                                                            {t("PRODUCT.PRODUCTS")}
                                                            <span>&nbsp;{">"}</span>
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link to={`/product-details/${id}`}>
                                                            {product?.productName}
                                                        </Link>
                                                    </li>
                                                </ul>
                                                <h5>{t("PRODUCT.PRICE_BOOKS")}</h5>
                                            </div>
                                            <div className="filter-list">
                                                <ul>
                                                    <li>
                                                        <div className="view-icons">
                                                            <Link to="#" className="active">
                                                                <i className="ti ti-list-tree" />
                                                            </Link>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        {/* /Filter */}
                                        {/* Manage Users List */}
                                        <div className="table-responsive custom-table">
                                            <Table dataSource={viewList} columns={columns} pagination={{
                                                current: pageNo,
                                                pageSize,
                                                total: totalPriceBook,
                                                onChange: (page, pageSize) => {
                                                    setPageNo(page);
                                                    setPageSize(pageSize);
                                                },
                                            }}
                                            // onChange={handleTableChange} 
                                            />
                                        </div>
                                        <div className="row align-items-center">
                                            <div className="col-md-6">
                                                <div className="datatable-length" />
                                            </div>
                                            <div className="col-md-6">
                                                <div className="datatable-paginate" />
                                            </div>
                                        </div>
                                        {/* /Manage Users List */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Page Wrapper */}
                <ToastContainer />
                <AddPriceBookModal visible={showAddModal} onClose={() => setShowAddModal(false)} data={product} isStandard={totalPriceBook == 0} />
                <UpdatePriceBook showPopup={showUpdate} setShowPopup={setShowUpdate} getDetail={getPriceBook} id={id} initPriceBook={priceBook} />
            </>
        </>
    )
}
