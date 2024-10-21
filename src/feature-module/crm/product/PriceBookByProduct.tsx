import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../router/all_routes'
import CollapseHeader from '../../../core/common/collapse-header'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useTranslation } from 'react-i18next'
import { deleteProduct, getPriceBookByProduct } from '../../../services/Product'
import { deleteProductFromPriceBook, patchProduct, getPriceBookById } from '../../../services/priceBook'
import './product.scss'
import Swal from "sweetalert2";
import { getProductsByPriceBook } from '../../../services/priceBook';
import addPriceBookModal from './addPriceBookModal';
import DeleteModal from '../../support/deleteModal';
import { UpdatePriceBook } from './updatePriceBook';
import AddPriceBookModal from './addPriceBookModal';

const route = all_routes;

export const PriceBookByProduct: React.FC<{ initProduct?: any }> = ({ initProduct }) => {

  const [priceBooks, setPriceBooks] = useState<any>([]);
  const [priceBook, setPriceBook] = useState<any>({});
  const [showPopup, setShowPopup] = useState(false);
  const [product, setProduct] = useState<any>(initProduct);
  const [showUpdate, setShowUpdate] = useState(false);
  const { t } = useTranslation();
  const { id } = useParams();
  const [pageSize, setPageSize] = useState(3);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isFirstBook, setIsFirstBook] = useState(false);


  useEffect(() => {
    if (initProduct)
      setProduct(initProduct);
  }, [initProduct])

  const getPriceBook = () => {
    Swal.showLoading();
    const param = {
      pageNo: 0,
      pageSize: pageSize,
      productId: id,
    };
    getPriceBookByProduct(param)
      .then(response => {
        Swal.close();
        console.log("Response price book: ", response);
        if (response.code === 1) {
          setPriceBooks(response.data.items);
          if (response.data.items.length === 0) {
            setIsFirstBook(true);
          } else {
            setIsFirstBook(false);
          }
        }
      })
      .catch(error => {
        console.error("Error getting Price Book by Product: ", error);
      });
  };

  const getPriceBookDetail = () => {
    getPriceBookById(id)
      .then(response => {
        if (response.code === 1) {
          setPriceBook(response.data);
        }
      })
      .catch(error => { })
  }

  useEffect(() => {
    getPriceBook();
    getPriceBookDetail();
  }, [pageSize, id]);

  const openEditModal = (priceBookId: any) => {
    if (priceBooks && Array.isArray(priceBooks)) {
      const selectedPriceBook = priceBooks.find((item: any) => item.priceBook.priceBookId === priceBookId);
      if (selectedPriceBook) {
        setShowUpdate(true);
        setPriceBook(selectedPriceBook);
      }
    }
  }

  const removeProducts = () => {
    const param = {
      pricebookId: id,
      productId: product?.product?.productId
    }
    console.log("ProducT: ", product);
    if(product?.priceBook?.isStandardPriceBook === 1){
      customToast("error", "Cannot delete Standard Price Book.");
      return;
    }
    deleteProductFromPriceBook(param)
      .then(response => {
        if (response.code === 1) {
          customToast("success", "Product removed successfully.");
          getPriceBook();
          document.getElementById('close-btn-pfpb')?.click();
        } else {
          customToast("error", response.message);
        }
      })
      .catch(error => {
        customToast("error", "System error, contact with admin to fix.");
        console.error("Error removing product from PriceBook: ", error)
      })
  }


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
              onClick={(e) => {
                e.preventDefault();
                openEditModal(record?.priceBook?.priceBookId)
              }}
            >
              <i className="ti ti-edit text-blue" /> {t("ACTION.EDIT")}
            </Link>

            <Link
              className="dropdown-item delete-btn-permission"
              to="#"
              data-bs-toggle="modal"
              data-bs-target="#delete_price_book_from_product"
              onClick={() => setProduct(priceBooks.find((item: any) => item.product.productId === record.product.productId))}
            >
              <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const customToast = (type: string, message: string) => {
    switch (type) {
      case 'success':
        toast.success(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      case 'error':
        toast.error(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
      default:
        toast.info(message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        break;
    }
  }

  return (
    <>
      <div className="view-header">
        <div className='col-md-12 space-between'>
          <h4>{t("PRODUCT.PRICE_BOOKS")}</h4>
          <Link to="#" className="btn custom-btn-blue-black" onClick={() => setShowAddModal(true)}>
            {priceBooks.length > 0 ? t("PRODUCT.ADD_TO_PRICE_BOOK") : t("PRODUCT.ADD_TO_STANDARD_BOOK")}
          </Link>
        </div>
        <div className="table-responsive custom-table col-md-12 mt-4">
          <div className="table-responsive custom-table col-md-12">
            <Table
              dataSource={priceBooks}
              columns={columns}
              pagination={false}
              footer={() => (
                <div style={{ textAlign: 'center' }}>
                  <Link to={`/product-details/${id}/price-book`}>{t("PRODUCT.VIEW_ALL")}</Link>
                </div>
              )}
            />
            <div className="text-center" style={{ minHeight: '50px' }}>
            </div>
          </div>
        </div>
      </div>
      <UpdatePriceBook
        showPopup={showUpdate}
        setShowPopup={setShowUpdate}
        getDetail={getPriceBook}
        id={id}
        initPriceBook={priceBook}
      />
      <AddPriceBookModal visible={showAddModal} onClose={() => setShowAddModal(false)} data={product} isStandard={isFirstBook} getList={getPriceBook} />
      <DeleteModal deleteId="delete_price_book_from_product" closeBtn="close-btn-pfpb" handleDelete={removeProducts} />
    </>
  )
}

export default PriceBookByProduct;