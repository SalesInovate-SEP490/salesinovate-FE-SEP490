import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Input, Spin } from 'antd';
import { createProductFamily, getListProductFamily } from "../../../services/Product";
import { toast } from 'react-toastify';

interface AddProductFamilyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateSuccess: () => void;
}

const AddProductFamilyModal: React.FC<AddProductFamilyModalProps> = ({ isVisible, onClose, onCreateSuccess }) => {
  const { t } = useTranslation();
  const [productFamily, setProductFamily] = useState<{ productFamilyName: string }>({ productFamilyName: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ productFamilyName?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductFamily({
      ...productFamily,
      [name]: value
    });
  };

  const validate = () => {
    let tempErrors: { productFamilyName?: string } = {};
    if (!productFamily.productFamilyName) tempErrors.productFamilyName = t("MESSAGE.ERROR.REQUIRED");

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleCreate = () => {
    if (validate()) {
      setLoading(true);
      const productFamilyData = {
        productFamilyName: productFamily.productFamilyName
      };

      createProductFamily(productFamilyData)
        .then(response => {
          if (response.code === 1) {
            toast.success("Create Product Family successfully!");
            setProductFamily({ productFamilyName: "" });
            onCreateSuccess();
            onClose();
          } else { 
            toast.error(response.message);
          }
        })
        .catch(err => {
          console.log(err);
          toast.error("Create Product Family fail!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Modal
      title={t('ACTION.ADD')}
      visible={isVisible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          {t('ACTION.CANCEL')}
        </Button>,
        <Button
          key="create"
          type="primary"
          onClick={handleCreate}
          disabled={loading}
        >
          {loading ? <Spin size="small" /> : t('ACTION.CREATE')}
        </Button>
      ]}
    >
      <Input
        id="productFamilyName"
        name="productFamilyName"
        value={productFamily.productFamilyName}
        onChange={handleChange}
        placeholder={t('PRODUCT.ENTER_PRODUCT_FAMILY_NAME')}
        status={errors.productFamilyName ? 'error' : ''}
      />
      {errors.productFamilyName && <div className="error-message">{errors.productFamilyName}</div>}
    </Modal>
  );
};

export default AddProductFamilyModal;
