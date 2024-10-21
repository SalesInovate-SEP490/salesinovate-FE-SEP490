import Select, { StylesConfig } from "react-select";
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { checkPermissionRole } from "../../../utils/authen";
import { all_routes } from "../../router/all_routes";
import { patchPriceBook } from "../../../services/priceBook";

const route = all_routes;
const DetailPriceBook: React.FC<{ priceBook: any; getDetail?: any }> = ({ priceBook, getDetail }) => {
  const [data, setData] = useState<any>(priceBook);
  const [listOpen, setListOpen] = useState<any>({
    edit: false
  });
  const [errors, setErrors] = useState<{
    priceBookName?: string;
  }>({});
  const { t } = useTranslation();

  const handleEditClick = () => {
    setListOpen({ ...listOpen, edit: true });
  };

  useEffect(() => {
    setData(priceBook);
  }, [priceBook]);

  useEffect(() => {
    checkPermissionRole(route.priceBookDetail)
  }, [listOpen])

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

  const handleChange = (e: any, name?: any, nameChild?: any) => {
    if (e?.target) {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value
      });
    } else {
      if (nameChild) {
        setData({
          ...data,
          [name]: {
            [nameChild]: e.value,
            name: e.label
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
    let tempErrors: { priceBookName?: string; } = {};
    if (!data.priceBookName) {
      tempErrors.priceBookName = t("MESSAGE.ERROR.REQUIRED");
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  }

  const handleCreate = () => {
    if (validate()) {
      console.log("Data: ", data);
      const updatePriceBook = {
        priceBookName: data.priceBookName,
        priceBookDescription: data.priceBookDescription,
        isActive: data.isActive,
        isStandardPriceBook: data.isStandardPriceBook
      }
      patchPriceBook(updatePriceBook, data?.priceBookId)
        .then(response => {
          console.log("Response here", response);
          if (response.code == 1) {
            setListOpen({ ...listOpen, edit: false });
            toast.success("Update successfully");
            if (getDetail)
              getDetail();
          } else {
            toast.error("Update failed");
          }
        })
        .catch(err => {
          toast.error("Update failed");
        });
    }
  }

  return (
    <>
      {listOpen.edit ?
        <>
          <div className="row">
            <div className="col-md-8">
              <div className="form-wrap row">
                <div className="col-md-4 middle-align">
                  <label className="col-form-label">
                    {t("PRICE_BOOK.PRICE_BOOK_NAME")} <span className="text-danger">*</span>
                  </label>
                </div>
                <div className="col-md-8">
                  <input
                    type="text"
                    className="form-control"
                    name="priceBookName"
                    onChange={handleChange}
                    value={data?.priceBookName || ''}
                  />
                </div>
                {errors.priceBookName && <div className="text-danger">{errors.priceBookName}</div>}
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-wrap row">
                <div className="col-md-8 middle-align">
                  <label className="col-form-label">
                    {t("PRICE_BOOK.ACTIVE")}
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="checkbox"
                    name="isActive"
                    className="form-check-input"
                    onChange={() => handleChange({ target: { name: "isActive", value: !data?.isActive } })}
                    checked={data?.isActive || false}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="form-wrap row">
                <div className="col-md-4 middle-align">
                  <label className="col-form-label">
                    {t("PRICE_BOOK.DESCRIPTION")}
                  </label>
                </div>
                <div className="col-md-8">
                  <textarea className="form-control" onChange={handleChange} name="priceBookDescription" value={data?.priceBookDescription || ''} >
                  </textarea>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-wrap row">
                <div className="col-md-8 middle-align">
                  <label className="col-form-label">
                    {t("PRICE_BOOK.IS_STANDARD_PRICE_BOOK")}
                  </label>
                </div>
                <div className="col-md-4">
                  <input
                    type="checkbox"
                    name="isStandardPriceBook"
                    className=""
                    disabled={true}
                    onChange={() => handleChange({ target: { name: "isStandardPriceBook", value: !data?.isStandardPriceBook } })}
                    checked={data?.isStandardPriceBook || false} />
                </div>
              </div>
            </div>
          </div>
          <div className="submit-button text-end">
            <Link to="#" onClick={() => setListOpen({ ...listOpen, edit: false })} className="btn btn-light sidebar-close">
              Cancel
            </Link>
            <Link
              to="#"
              className="btn btn-primary"
              onClick={() => handleCreate()}
            >
              {t("ACTION.UPDATE")}
            </Link>
          </div>
        </>
        :
        <>
          <div className='row'>
            {<>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.PRICE_BOOK.PRICE_BOOK_NAME")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    {data?.priceBookName}
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
                  <label className='col-md-4'>{t("LABEL.PRICE_BOOK.ACTIVE")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <input type="checkbox" checked={data?.isActive === 1} className="form-check-input" />
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
                  <label className='col-md-4'>{t("LABEL.PRICE_BOOK.DESCRIPTION")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    {data?.priceBookDescription}
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
                  <label className='col-md-4'>{t("LABEL.PRICE_BOOK.IS_STANDARD_PRICE_BOOK")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    <input type="checkbox" checked={data?.isStandardPriceBook === 1} className="form-check-input" />
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.PRICE_BOOK.CREATED_BY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    {`Ngô Quang Trung`}
                  </div>
                </div>
              </div>
              <div className='col-md-6'>
                <div className="row detail-row">
                  <label className='col-md-4'>{t("LABEL.PRICE_BOOK.LAST_MODIFIED_BY")}</label>
                  <div className='col-md-8 text-black input-detail'>
                    {`Ngô Quang Trung`}
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

export default DetailPriceBook;
