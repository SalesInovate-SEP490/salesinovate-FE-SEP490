import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { getPriceBookById, patchPriceBook, patchProduct } from "../../../services/priceBook";
import "./product.scss"

export const UpdatePriceBook: React.FC<{
  showPopup?: boolean;
  setShowPopup?: any;
  getList?: any;
  id?: any;
  getDetail?: any;
  initPriceBook?: any;
}> = ({ showPopup, setShowPopup, getList, id, getDetail, initPriceBook }) => {
  const [product, setProduct] = useState<any>(initPriceBook);
  const [errors, setErrors] = useState<{ listPrice?: string; }>({});
  const { t } = useTranslation();

  useEffect(() => {
    if (initPriceBook) {
      setProduct({
        ...initPriceBook.product,
        listPrice: initPriceBook.listPrice,
        useStandardPrice: initPriceBook.useStandardPrice,
        priceBook: {
          ...initPriceBook.priceBook,
          isActive: initPriceBook?.priceBook?.isActive || false,
        },

      });
    }
  }, [initPriceBook]);

  const handleChange = (e: any, name?: any, nameChild?: any) => {
    if (e?.target) {
      const { name, value, type, checked } = e.target;
      setProduct((prevProduct: any) => ({
        ...prevProduct,
        [name]: type === 'checkbox' ? checked : value,
      }));
    } else {
      if (nameChild) {
        setProduct({
          ...product,
          [name]: {
            [nameChild]: e.value,
            name: e.label
          },
          [nameChild]: e.value,
        });
      } else {
        setProduct({
          ...product,
          [name]: e.value,
        });
      }
    }
  };

  const validate = () => {
    let tempErrors: { listPrice?: string; } = {};
    if (!product.listPrice) tempErrors.listPrice = t("MESSAGE.ERROR.REQUIRED");
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleCreate = () => {
    if (validate()) {
      const newProduct = {
        listPrice: product.listPrice,
        isActive: product.priceBook.isActive ? 1 : 0,
        useStandardPrice: product.useStandardPrice ? 1 : 0,
        priceBookId: initPriceBook?.priceBook?.priceBookId,
      };
      patchProduct(newProduct, newProduct.priceBookId, product.productId)
        .then(response => {
          if (response.code === 1) {
            toast.success(t("MESSAGE.SUCCESS"));
            getDetail();
            setShowPopup(false);
          }else{
            toast.error(response.message);
          }
        })
        .catch(error => {
          toast.error("Have error! Please try again!");
        });
    }
  }

  return (
    <>
      <div className={`toggle-popup ${showPopup ? "sidebar-popup" : ""}`}>
        <div className="sidebar-layout" style={{ maxWidth: '800px' }}>
          <div className="sidebar-header">
            <h4>{t("LABEL.PRICE_BOOK.UPDATE_PRICE_BOOK")}</h4>
            <Link
              to="#"
              className="sidebar-close toggle-btn"
              onClick={togglePopup}
            >
              <i className="ti ti-x" />
            </Link>
          </div>
          <div className="toggle-body">
            <div className="pro-create">
              <form>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap row">
                      <div className="col-md-4 middle-align">
                        <label className="col-form-label">
                          {t("LABEL.PRODUCT.PRODUCT")}
                        </label>
                      </div>
                      <div className="col-md-8">
                        <span>{product?.productName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap row">
                      <div className="col-md-8 middle-align">
                        <label className="col-form-label">
                          {t("PRICE_BOOK.ACTIVE")}
                        </label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="checkbox"
                          name="priceBook.isActive"
                          className="form-check-input"
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setProduct((prevProduct: any) => ({
                              ...prevProduct,
                              priceBook: {
                                ...prevProduct.priceBook,
                                isActive: checked,
                              },
                            }));
                          }}
                          checked={product?.priceBook?.isActive || false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap row">
                      <div className="col-md-4 middle-align">
                        <label className="col-form-label">
                          {t("LABEL.PRICE_BOOK.PRICE_BOOK")}
                        </label>
                      </div>
                      <div className="col-md-8">
                        <span>{initPriceBook?.priceBook?.priceBookName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap row">
                      <div className="col-md-8 middle-align">
                        <label className="col-form-label">
                          {t("LABEL.PRICE_BOOK.PRODUCT_CODE")}
                        </label>
                      </div>
                      <div className="col-md-4">
                        <span>{product?.productCode}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap row">
                      <div className="col-md-4 middle-align">
                        <label className="col-form-label">
                          {t("LABEL.PRICE_BOOK.LIST_PRICE")}
                        </label>
                      </div>
                      <div className="col-md-8">
                        <input
                          type="input"
                          name="listPrice"
                          className="form-control"
                          onChange={handleChange}
                          value={product?.listPrice} />
                        {errors.listPrice && <div className="text-danger">{errors.listPrice}</div>}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap row">
                      <div className="col-md-8 middle-align">
                        <label className="col-form-label">
                          {t("PRICE_BOOK.USE_STANDARD_PRICE")}
                        </label>
                      </div>
                      <div className="col-md-4">
                        <input
                          type="checkbox"
                          name="useStandardPrice"
                          className="form-check-input"
                          onChange={() => handleChange({ target: { name: "useStandardPrice", value: !product?.useStandardPrice } })}
                          checked={product?.useStandardPrice || false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-wrap row">
                          <div className="col-md-4 middle-align">
                            <label className="col-form-label">
                              {t("LABEL.PRICE_BOOK.CREATED_BY")}
                            </label>
                          </div>
                          <div className="col-md-8">
                            <span>{'Khanh Linh'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12">
                        <div className="form-wrap row">
                          <div className="col-md-4 middle-align">
                            <label className="col-form-label">
                              {t("LABEL.PRICE_BOOK.LAST_MODIFIED_BY")}
                            </label>
                          </div>
                          <div className="col-md-8">
                            <span>{'Khanh Linh'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="submit-button text-end">
                  <Link to="#" onClick={() => setShowPopup(false)} className="btn btn-light sidebar-close">
                    {t("ACTION.CANCEL")}
                  </Link>
                  <Link
                    to="#"
                    className="btn btn-primary"
                    onClick={handleCreate}
                  >
                    {t("ACTION.UPDATE")}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

