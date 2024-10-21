import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { searchPriceBookToAdd } from "../../../services/opportunities";
import Select, { StylesConfig } from "react-select";

const ChoosePriceBookModal: React.FC<{
    action?: any; modalId?: any; id?: any, pbId?: any, priceBook?: any
}> = ({ action, modalId, id, pbId, priceBook }) => {
    const [listPriceBook, setListPriceBook] = useState<any>([]);
    const [priceBookId, setPriceBookId] = useState<any>(0);
    const { t } = useTranslation();

    useEffect(() => {
        const param = {
            opportunityId: id,
            search: ""
        }
        searchPriceBookToAdd(param)
            .then(response => {
                setListPriceBook(response?.data?.map((item: any) => {
                    return { value: item.priceBookId, label: item.priceBookName }
                }));
            })
            .catch(error => {
                console.log(error)
            })
    }, [id]);

    useEffect(() => {
        if (priceBook) {
            setListPriceBook((prev: any) => {
                if (prev?.find((item: any) => item.value == priceBook?.priceBookId)) {
                    return prev;
                }
                return [...prev, { value: priceBook?.priceBookId, label: priceBook?.priceBookName }];
            });
            setPriceBookId(priceBook?.priceBookId);
        }
    }, [priceBook]);

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

    const handleChange = (e: any) => {
        setPriceBookId(e.value);
    };

    return (
        <>
            <div className="modal custom-modal fade" id={modalId} role="dialog">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0 m-0 justify-content-end">
                            <button
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                                id="btn-close-cpb"
                            >
                                <i className="ti ti-x" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="text-center">
                                <h3>Choose Price Book</h3>
                            </div>
                            <div className="success-message text-center">
                                <div className="del-info">
                                    <Select
                                        className="select"
                                        options={listPriceBook}
                                        styles={customStyles}
                                        value={listPriceBook?.find((item: any) => item?.value == priceBookId)}
                                        name="id"
                                        onChange={e => handleChange(e)}
                                    />
                                </div>
                                <div className="col-lg-12 text-center modal-btn">
                                    <Link to="#" className="btn btn-light" data-bs-dismiss="modal">
                                        Cancel
                                    </Link>
                                    <Link to="#" onClick={() => action(priceBookId)} className="btn btn-danger">
                                        {t("ACTION.SAVE")}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChoosePriceBookModal;