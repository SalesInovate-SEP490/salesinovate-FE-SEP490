import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { getListProductFamily, getProductById, patchProduct } from "../../../services/Product";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import './product.scss';
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";

const route = all_routes;
const FixProductDetail: React.FC<{ product: any; getProductDetail?: any }> = ({ product, getProductDetail }) => {
  const [data, setData] = useState<any>(product);
  const [listOpen, setListOpen] = useState<any>({
    edit: false,
    system: true
  });
  const [errors, setErrors] = useState<any>({})
  const { t } = useTranslation();
  const [productFamily, setProductFamily] = useState<any>([]);

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

  useEffect(() => {
    checkPermissionRole(route.productDetail);
  }, [listOpen])

  useEffect(() => {
    setData(product);
  }, [product])

  useEffect(() => {
    getListProductFamily()
      .then((res) => {
        const data = res.data.map((item: any) => {
          return {
            value: item.productFamilyId,
            label: item.productFamilyName
          };
        });
        setProductFamily(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  console.log("data: ", data)

  const handleChange = (e: any, name?: any, nameChild?: any) => {
    console.log("E: ", e, name);
    if (e?.target) {
      const { name, value, type, checked } = e.target;
      const inputValue = type === 'checkbox' ? checked : value;
      setData({
        ...data,
        [name]: inputValue
      });
    } else {
      if (nameChild) {
        setData({
          ...data,
          [name]: {
            [nameChild]: e.value
          },
          [nameChild]: e.value
        });
      }
      else {
        setData({
          ...data,
          [name]: e.value
        });
      }
    }
  };

  const validate = () => {
    let tempErrors: { productName?: string } = {};
    if (!data.productName) tempErrors.productName = t("MESSAGE.ERROR.REQUIRED");
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;

  }

  const handleChangeProductFamily = (selectedOption: any) => {
    setData({
      ...data,
      productFamily: {
        productFamilyId: selectedOption.value,
        productFamilyName: selectedOption.label
      },
      productFamilyId: selectedOption.value
    });
  };

  const handleUpdate = () => {
    if (validate()) {
      const productUpdate = {
        productName: data?.productName,
        productCode: data?.productCode,
        productDescription: data?.productDescription,
        isActive: data?.isActive ? 1 : 0,
        productFamilyId: data?.productFamily?.productFamilyId
      }
      console.log("Update product: ", productUpdate)
      patchProduct(productUpdate, data?.productId)
        .then(response => {
          if (response.code === 1) {
            toast.success("Update success");
            setListOpen({ ...listOpen, edit: false })
            getProductDetail();
          } else {
            toast.error(response.message);
          }
        })
        .catch(err => {
          console.log(err);
        })
    }
  }


  return (
    <>
      {listOpen.edit ?
        <>
          <div className="row">
            <div className="col-md-6">
              <div className="form-wrap">
                <div className="row">
                  <div className="form-wrap">
                    <label className="col-form-label">
                      {t("PRODUCT.PRODUCT_NAME")} <span className="text-danger">*</span>
                    </label>
                    <input type="text" className="form-control" name="productName"
                      onChange={(e) => handleChange(e)} value={data?.productName} />
                    {errors.productName && <p className="text-danger">{errors.productName}</p>}
                  </div>
                  <div className="form-wrap">
                    <label className="col-form-label">
                      {t("PRODUCT.PRODUCT_CODE")}
                    </label>
                    <input type="text" className="form-control" name="productCode"
                      onChange={(e) => handleChange(e)} value={data?.productCode} />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("PRODUCT.PRODUCT_FAMILY")}
                </label>
                <Select
                  className="select"
                  options={productFamily}
                  styles={customStyles}
                  value={productFamily?.find((item: any) => item.value === data?.productFamily?.productFamilyId)}
                  name="productFamilyName"
                  onChange={handleChangeProductFamily}
                />
              </div>
              <div className="form-wrap d-flex align-items-center mt-5">
                <label className="col-form-label mr-2">
                  {t("PRODUCT.ACTIVE")}
                </label>
                <div className="custom-checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    id="isActive"
                    onChange={(e) => handleChange(e)}
                    checked={data?.isActive}
                  />
                  <label htmlFor="isActive" />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="form-wrap">
                <label className="col-form-label">
                  {t("PRODUCT.PRODUCT_DESCRIPTION")}
                </label>
                <textarea
                  name="productDescription"
                  className="form-control"
                  onChange={(e) => handleChange(e)}
                  value={data?.productDescription || ''}
                />
              </div>
            </div>
          </div>
          <div className="submit-button text-end">
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false, additional: false })} className="btn btn-light sidebar-close">
              {t("PRODUCT.CANCEL")}
            </Link>
            <Link
              to="#"
              className="btn btn-primary"
              onClick={() => handleUpdate()}
            >
              {t("PRODUCT.UPDATE")}
            </Link>
          </div>
        </>
        :
        <>
          <div className='row'>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("PRODUCT.PRODUCT_NAME")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.productName || ' '}`}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("PRODUCT.PRODUCT_CODE")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.productCode || ' '} `}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("PRODUCT.PRODUCT_FAMILY")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{data?.productFamily?.productFamilyName || ' '}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className="col-md-4">{t("PRODUCT.ACTIVE")}</label>
                <div className="col-md-8 input-detail d-flex align-items-center custom-checkbox">
                  <input
                    type="checkbox"
                    checked={data?.isActive === 1}
                    readOnly
                    className="mr-2"
                  />
                  <label htmlFor="isActive" />
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-md-6'>
              <div className="row detail-row">
                <label className='col-md-4'>{t("PRODUCT.PRODUCT_DESCRIPTION")}</label>
                <div className='col-md-8 text-black input-detail'>
                  <span>{`${data?.productDescription || ' '}`}</span>
                  <i
                    className="fa fa-pencil edit-btn-permission ml-2"
                    style={{ cursor: 'pointer' }}
                    onClick={handleEditClick}
                  ></i>
                </div>
              </div>
            </div>
            <div className='col-ms-12 label-detail'>
              <span onClick={() => setListOpen({ ...listOpen, system: !listOpen.system })}>
                <i className={!listOpen.system ? 'fas fa-chevron-right' : 'fas fa-chevron-down'}></i>
                {t("PRODUCT.SYSTEM_INFORMATION")}
              </span>
            </div>
            {listOpen.system && <>
              <div className="row">
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("PRODUCT.CREATE_BY")}</label>
                    <div className='col-md-8 d-flex align-items-center'>
                      {/* <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} /> */}
                      <div>
                        <span style={{ display: 'block', fontWeight: 'bold' }}>
                          {'khanh Linh'}
                        </span>
                        <span style={{ display: 'block', fontSize: '14px', color: '#555' }}>05/07/2024</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='col-md-6'>
                  <div className="row detail-row">
                    <label className='col-md-4'>{t("PRODUCT.EDIT_BY")}</label>
                    <div className='col-md-8 d-flex align-items-center'>
                      {/* <img src="https://i.pinimg.com/236x/a2/b2/9a/a2b29aae379766a0f0514f2fbcb38a96.jpg" alt="Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '10px' }} /> */}
                      <div>
                        <span style={{ display: 'block', fontWeight: 'bold' }}>
                          {'khanh Linh'}
                        </span>
                        <span style={{ display: 'block', fontSize: '14px', color: '#555' }}>05/07/2024</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>}
          </div>
        </>
      }

    </>
  )
}

export default FixProductDetail;
