import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from "../../../core/common/dataTable/index";
import { all_routes } from '../../router/all_routes';
import { useTranslation } from 'react-i18next';
import { getFilesContract, deleteContractFile, uploadContractFile, getListOrderContractBy, downloadFile } from '../../../services/contract'; // Include your upload function
import './contract.scss';
import Swal from "sweetalert2";
import { toast } from 'react-toastify';
import { convertTextToDate } from '../../../utils/commonUtil';
import { CreateOrder } from '../order/createOrders';
import DeleteModal from '../../support/deleteModal';

const ContractRelated: React.FC<{ contractNumber: string }> = ({ contractNumber }) => {
  const [contracts, setContracts] = useState<any>([]);
  const [file, setFile] = useState<any>([]);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [pageSize, setPageSize] = useState<number>(3);

  const getListOrders = async (currentPage = 0, pageSize = 3): Promise<void> => {
    try {
      Swal.showLoading();
      const data = await getListOrderContractBy(contractNumber);
      Swal.close();
      if (data.code === 1) {
        setContracts(data.data);
      }
    } catch (error) {
      Swal.close();
      console.error("Error fetching Contract:", error);
    }
  };

  const getListFile = async (): Promise<void> => {
    try {
      const res = await getFilesContract(id);
      if (res.code === 1) {
        if (res?.data === null) {
          setFile([]);
          return;
        }
        setFile([res?.data]);
      }
    } catch (error) {
      console.error("Error fetching Contract:", error);
    }
  };

  useEffect(() => {
    getListOrders(0, pageSize);
    if (id)
      getListFile();
  }, [contractNumber]);

  const columns = [
    {
      title: t("ORDER.ORDER_NUMBER"),
      dataIndex: `date`,
      key: "date",
      render: (_: undefined, record: Partial<any>) => <span>{record?.orderContractNumber}</span>
    },
    {
      title: t("CONTRACT.STATUS"),
      dataIndex: "field",
      key: "field",
      render: (_: undefined, record: Partial<any>) => <span>{record?.orderStatus?.orderStatusName}</span>
    },
    {
      title: t("ORDER.ORDER_START_DATE"),
      dataIndex: "user",
      key: "user",
      render: (_: undefined, record: Partial<any>) => <span>{record?.orderStartDate ? convertTextToDate(record?.orderStartDate) : ''}</span>
    },
    {
      title: t("CONTRACT.CONTRACT_NUMBER"),
      dataIndex: "contractNumber",
      key: "contractNumber",
      render: (_: undefined, record: Partial<any>) => <span>{record?.contractNumber}</span>
    }
  ];

  const columnsFile = [
    {
      title: t("CONTRACT.FILE_NAME"),
      dataIndex: `fileName`,
      key: "fileName",
      render: (_: undefined, record: Partial<any>) =>
        <span onClick={() => downloadFileContract(record?.fileId, record?.fileName)} style={{ cursor: 'pointer' }}>
          {record?.fileName}
        </span>
    },
    {
      title: t("ACTION.ACTION"),
      dataIndex: "action",
      key: "action",
      render: (_: undefined, record: Partial<any>) => (
        <span>
          <Link to="#" onClick={() => deleteFile(record?.contractFileId)}>{t("ACTION.DELETE")}</Link>
        </span>
      )
    }
  ];

  const deleteFile = async (fileId: number | undefined): Promise<void> => {
    if (!fileId) return;
    Swal.fire({
      title: t("MESSAGE.DELETE_CONFIRM"),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t("ACTION.YES"),
      cancelButtonText: t("ACTION.NO"),
    })
      .then((result) => {
        if (result.isConfirmed) {
          handleDeleteFile(fileId);
        }
      });
  };

  const handleDeleteFile = async (fileId: number): Promise<void> => {
    try {
      const res = await deleteContractFile(fileId);
      if (res.code === 1) {
        getListFile();
        toast.success(t("MESSAGE.DELETE_SUCCESS"));
      }
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = event.target.files;
    if (files && files.length > 0) {
      try {
        // Replace with your actual upload function
        const response = await uploadContractFile(files[0], id);
        if (response.code === 1) {
          toast.success(t("MESSAGE.UPLOAD_SUCCESS"));
          getListFile();
        }
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error(t("MESSAGE.UPLOAD_FAILED"));
      }
    }
  };

  const downloadFileContract = async (fileId: number, fileName: any) => {
    downloadFile(fileId)
      .then((res: Blob) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement('a');
        link.href = url;
        // fileName have type: abc.pdf
        const name = fileName.split('.').slice(0, -1).join('.');
        const type = fileName.split('.').pop();
        link.setAttribute('download', `${name}.${type}`);
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  }

  return (
    <>
      <div className="view-header border-beautiful">
        <div className='space-between col-md-12'>
          <ul>
            <h4>{t("CONTRACT.ORDER")} {`(${contracts.length > 5 ? '5+' : contracts.length})`}</h4>
          </ul>
          <ul>
            <Link
              to="#"
              className="btn custom-btn-blue-black"
              onClick={() => setShowPopup(!showPopup)}
            >
              {t("ACTION.ADD")}
            </Link>
          </ul>
        </div>
        <div className="table-responsive custom-table col-md-12">
          <Table
            dataSource={contracts.slice(0, 5)}
            columns={columns}
            pagination={false}
          />
        </div>
        <div className='col-md-12 footer-border'>
          <Link to={`/contract-details/${id}/${contractNumber}/orders`}>{t("ACTION.VIEW_ALL")}</Link>
        </div>
      </div>

      <div className="view-header border-beautiful">
        <div className='space-between col-md-12'>
          <ul>
            <h4>{t("CONTRACT.FILE")}</h4>
          </ul>
          <ul>
            <label className="btn custom-btn-blue-black">
              {t("ACTION.ADD")}
              <input
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
            </label>
          </ul>
        </div>
        <div className="table-responsive custom-table col-md-12">
          <Table
            dataSource={file}
            columns={columnsFile}
            pagination={false}
          />
        </div>
      </div>
      <CreateOrder
        setShowPopup={setShowPopup}
        showPopup={showPopup}
        getList={getListOrders}
        isEdit={false}
        contractNumber={contractNumber}
      />
    </>
  );
};

export default ContractRelated;
