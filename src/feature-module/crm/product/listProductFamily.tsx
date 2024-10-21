import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../core/common/dataTable/index";
import { Spin, Button } from "antd";
import "bootstrap-daterangepicker/daterangepicker.css";
import { all_routes } from "../../router/all_routes";
import { getListProductFamily, DeleteProductFamily, createProductFamily } from "../../../services/Product";
import { ProductFamily } from "./type";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AddProductFamilyModal from "./addProductFamilyModal";
import { checkPermissionRole } from "../../../utils/authen";

const route = all_routes;
export default function ListProductFamily() {
  const [viewList, setViewList] = useState<ProductFamily[]>([]);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const route = all_routes;
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const getListPrFamily = async () => {
    setLoading(true);
    try {
      const data = await getListProductFamily();
      if (data.code === 1) {
        setViewList(data.data);
        checkPermissionRole(route.productDetail)
      }
    } catch (error) {
      console.error("Error fetching product family:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getListPrFamily();
  }, [page]);

  const handleScroll = (e: any) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && !loading) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const table = document.querySelector('.ant-table-body');
    if (table) {
      table.addEventListener('scroll', handleScroll);
      return () => table.removeEventListener('scroll', handleScroll);
    }
  }, [loading]);

  const handleDelete = async (record: Partial<ProductFamily>) => {
    const result = await Swal.fire({
      title: t("PRODUCT.REMOVE_PRODUCT_FAMILY"),
      text: t("MESSAGE.CONFIRM.DELETE"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("ACTION.DELETE"),
      cancelButtonText: t("ACTION.CANCEL")
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        const response = await DeleteProductFamily(record.productFamilyId);
        if (response.code === 1) {
          toast.success(t("PRODUCT.DELETE_SUCCESS"));
          getListPrFamily();
        } else {
          toast.error(response.message);
        }
      } catch (error) {
        console.error("Error deleting product family:", error);
        toast.error(t("PRODUCT.DELETE_ERROR"));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateSuccess = () => {
    getListPrFamily();
  };

  const columns = [
    {
      title: t("PRODUCT.PRODUCT_FAMILY_NAME"),
      dataIndex: 'productFamilyName',
      key: "productFamilyName",
      render: (value: undefined, record: Partial<ProductFamily>) => {
        return <div>{record?.productFamilyName}</div>;
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (value: any, record: Partial<any>) => (
        <Link
          className="dropdown-item delete-btn-permission"
          to="#"
          onClick={() => handleDelete(record)}
        >
          <i className="ti ti-trash text-danger"></i> {t("ACTION.DELETE")}
        </Link>
      ),
    },
  ];

  return (
    <div className="row">
      <div className='col-md-12 space-between mb-4 mt-2'>
        <h4>{t("PRODUCT.LIST_PRODUCT_FAMILY")}</h4>
        <div className="d-flex justify-content-end">
          <button className='btn custom-btn-blue-black' onClick={() => setIsAddModalVisible(true)}>{t("ACTION.ADD")}</button>
        </div>
      </div>
      <div className="table-responsive custom-table">
        <Table
          dataSource={viewList}
          columns={columns}
          pagination={false}
          rowKey="productFamilyId"
          scroll={viewList.length >= 5 ? { y: 300 } : undefined}
        />
        {loading && <Spin style={{ display: 'block', marginTop: 16 }} />}

        <AddProductFamilyModal
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onCreateSuccess={handleCreateSuccess}
        />
      </div>
    </div>
  );
}
