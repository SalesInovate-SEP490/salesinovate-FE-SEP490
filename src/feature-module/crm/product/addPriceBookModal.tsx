import React, { useState, useEffect } from 'react';
import { Modal, Form } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { addProducts, getPriceBook } from "../../../services/priceBook";
import Select, { StylesConfig } from 'react-select';
import { getListProductFamily } from '../../../services/Product';

const AddPriceBookModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  data?: any;
  isStandard?: boolean;
  getList?: any;
}> = ({ visible, onClose, data, isStandard, getList }) => {
  const [product, setProduct] = useState<any>(data || {});
  const [priceBook, setPriceBook] = useState<any>([]);
  const [step, setStep] = useState<any>(0);
  const [productFamily, setProductFamily] = useState<any>(null);
  const { t } = useTranslation();

  const getListPriceBook = async (pageNo: number, pageSize: number) => {
    try {
      const param = {
        pageNo: pageNo,
        pageSize: pageSize
      }
      getPriceBook(param).then((data: any) => {
        if (data.code === 1) {
          setPriceBook(data?.data?.items.map((item: any) => {
            return {
              value: item.priceBookId,
              label: item.priceBookName,
              isStandard: item.isStandardPriceBook
            }
          }));
        }
      }
      ).catch((error) => {
        console.log("error:", error);
      })
    } catch (error) {
      console.error("Error fetching Price Books:", error);
    }
  };

  useEffect(() => {
    if (isStandard) {
      const firstPriceBook = priceBook.find((item: any) => item?.isStandard === 1);
      if (firstPriceBook) {
        handleChange({ value: firstPriceBook?.value }, 'priceBook', 'priceBookId');
      }
    }
  }, [isStandard]);

  const getProductFamilies = async () => {
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
  }

  useEffect(() => {
    getListPriceBook(0, 1000);
    getProductFamilies();
  }, []);

  useEffect(() => {
    if (data) {
      setProduct(data);
    }
  }, [data])

  const handleNext = () => {
    if (isStandard) {
      // check price book of product have isStandard = 1, otherwise show error
      const standardPriceBook = priceBook.find((item: any) => item?.isStandard === 1);
      if (product?.priceBook?.priceBookId !== standardPriceBook?.value) {
        toast.error("You need to select the standard price book before adding a product to other price books");
        return;
      }
    }
    setStep(1);
  };

  const handleCreate = () => {
    const addProduct = {
      productId: product?.productId,
      priceBookId: product?.priceBook?.priceBookId,
      listPrice: product?.listPrice,
      useStandardPrice: product?.useStandardPrice,
      currency: 1
    }
    const param = {
      pricebookId: product?.priceBook?.priceBookId,
    }
    // check price book of product have isStandard = 1, otherwise show error
    if (isStandard) {
      const standardPriceBook = priceBook.find((item: any) => item?.isStandard === 1);
      if (product?.priceBook?.priceBookId !== standardPriceBook?.value) {
        toast.error("You need to select the standard price book before adding a product to other price books");
        return;
      }
    }

    addProducts([addProduct], param)
      .then(response => {
        if (response.code === 1) {
          toast.success("Price Book Entry Created Successfully");
          if (getList) getList();
          onClose();
          setStep(0);
        }
      })
      .catch(error => {
        console.error("Error creating Price Book Entry: ", error);
      });
  }

  const handleCancel = () => {
    onClose();
    setStep(0);
  };

  const handleChange = (e: any, name?: any, nameChild?: any) => {
    if (e?.target) {
      const { name, value, type, checked } = e.target;
      setProduct({
        ...product,
        [name]: type === "checkbox" ? checked : value
      });
    } else {
      if (nameChild) {
        setProduct({
          ...product,
          [name]: {
            [nameChild]: e?.value,
            name: e?.label
          },
          [nameChild]: e?.value,
        });
      } else {
        setProduct({
          ...product,
          [name]: e?.value,
        });
      }
    }
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


  return (
    <>
      {
        step === 0 ?
          <>
            <Modal
              title="Add To Price Book"
              visible={visible}
              onOk={handleNext}
              onCancel={handleCancel}
              okText="Submit"
              cancelText="Cancel"
            >
              <Form
                layout="vertical"
                name="add_price_book"
                initialValues={{ remember: true }}
              >
                <div>
                  <Select
                    className="select"
                    options={priceBook || []}
                    styles={customStyles}
                    value={priceBook?.find((item: any) => item.value === product?.priceBook?.priceBookId) || null}
                    name="priceBookName"
                    onChange={(e) => handleChange(e, 'priceBook', 'priceBookId')}
                  />
                </div>
              </Form>
            </Modal>
          </> :
          <>
            <Modal
              title="New Price Book Entry"
              visible={visible}
              onOk={handleCreate}
              onCancel={handleCancel}
              okText="Submit"
              cancelText="Cancel"
              className='add-price-book-modal'
            >
              <Form
                layout="vertical"
                name="add_price_book"
                initialValues={{ remember: true }}
              >
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("PRODUCT.PRODUCT_NAME")} <span className="text-danger">*</span>
                      </label>
                      <Select
                        className="select"
                        options={[
                          {
                            value: product?.productId,
                            label: product?.productName
                          }
                        ]}
                        styles={customStyles}
                        name="priceBookName"
                        isDisabled={true}
                        value={{
                          value: product?.productId,
                          label: product?.productName
                        }}
                      />
                    </div>
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("LABEL.PRICE_BOOK.PRICE_BOOK")}
                      </label>
                      <Select
                        className="select"
                        options={priceBook || []}
                        styles={customStyles}
                        value={priceBook?.find((item: any) => item.value === product?.priceBook?.priceBookId) || null}
                        name="priceBookName"
                        onChange={(e) => handleChange(e, 'priceBook', 'priceBookId')} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("PRODUCT.PRODUCT_CODE")}
                      </label>
                      <div>
                        <span>{product?.productCode}</span>
                      </div>
                    </div>
                    <div className="form-wrap mt-5">
                      <label className="col-form-label mr-2">
                        {t("PRODUCT.ACTIVE")}
                      </label>
                      <div className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="isActive"
                          id="isActive"
                          onChange={(e) => handleChange(e)}
                          checked={product?.isActive}
                        />
                        <label htmlFor="isActive" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("PRODUCT.LIST_PRICE")}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        name="listPrice"
                        value={product?.listPrice}
                        onChange={(e) => handleChange(e)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-wrap">
                      <label className="col-form-label">
                        {t("PRODUCT.USE_STANDARD_PRICE")}
                      </label>
                      <div className="custom-checkbox">
                        <input
                          type="checkbox"
                          name="useStandardPrice"
                          id="useStandardPrice"
                          onChange={(e) => handleChange(e)}
                          checked={product?.useStandardPrice}
                        />
                        <label htmlFor="useStandardPrice" />
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </Modal>
          </>
      }
    </>

  );
};

export default AddPriceBookModal;
