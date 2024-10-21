import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Select, { StylesConfig } from "react-select";
import { toast } from "react-toastify";
import { getPriceBookById, updatePriceBook } from "../../../services/priceBook";
import { useTranslation } from "react-i18next";
import { PriceBook } from "./type";
import { initPriceBook } from "./data";
import "./priceBook.scss"
import { EditorState, ContentState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";


export const UpdatePriceBook = (prop: any) => {
    const [priceBook, setPriceBook ] = useState<PriceBook>(prop.data || initPriceBook);
    const [errors, setErrors] = useState<{priceBookName?:string; isActive?: string}>({});
    const { t } = useTranslation();
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        getPriceBookDetail();
    }, []);

    useEffect(() => {
        if (priceBook.description) {
            const blocksFromHTML = htmlToDraft(priceBook.description);
            const contentState = ContentState.createFromBlockArray(blocksFromHTML.contentBlocks, blocksFromHTML.entityMap);
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [priceBook.description]);

    const getPriceBookDetail = () => {
        getPriceBookById(prop.id)
            .then(response => {
                console.log("Response: detail ", response);
            // if (response.code === 1) {
                setPriceBook(response);
            // }
            })
            .catch(err => { });
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

    const handleChange = (e: any, name?: any, nameChild?: any) => {
        if (e?.target) {
            const { name, value } = e.target;
            setPriceBook({
                ...priceBook,
                [name]: value
            });
        } else {
            if (nameChild) {
                setPriceBook({
                    ...priceBook,
                    [name]: {
                        [nameChild]: e.value,
                        name: e.label
                    },
                    [nameChild]: e.value
                });
            }
            else {
                setPriceBook({
                    ...priceBook,
                    [name]: e.value
                });
            }
        }

    };

    const togglePopup = () => {
        prop.setShowPopup(!prop.showPopup);
    };

    const validate = () => {
        let tempErrors: { priceBookName?:string; isActive?: string} = {};
       // Check required fields
       if (!priceBook.priceBookName?.trim()) tempErrors.priceBookName = t("MESSAGE.ERROR.REQUIRED");
       if (priceBook.isActive === null) tempErrors.isActive = t("MESSAGE.ERROR.REQUIRED");

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleUpdate = () => {
        // if (validate()) {
            priceBook.roleId = priceBook?.role?.roleId || 1;
            updatePriceBook(priceBook)
                .then(response => {
                    // if (response.code === 1) {
                        toast.success("Update price book successfully!");
                        prop.getPriceBookDetail();
                        prop.setShowPopup(false);
                        prop.getLeads(1,10);

                    // }
                })
                .catch(err => { 
                    // toast.error("Failed to update contact.");
                });
        // }
    }

    const statusOptions = [
        { label: t("PRICE_BOOK.STANDARD"), value: true },
        { label: t("PRICE_BOOK.NOT_STANDARD"), value: false }
    ];

    const activeOptions = [
        { label: t("PRICE_BOOK.ACTIVE"), value: true },
        { label: t("PRICE_BOOK.INACTIVE"), value: false },
    ];

    const handleEditorChange = (editorState: EditorState) => {
        setEditorState(editorState);
        const contentState = editorState.getCurrentContent();
        const htmlContent = draftToHtml(convertToRaw(contentState));
        setPriceBook({
            ...priceBook,
            description: htmlContent,
        });
    };

    return (
        <>
            <div className={`toggle-popup ${prop.showPopup ? "sidebar-popup" : ""}`}>
                <div className="sidebar-layout">
                    <div className="sidebar-header">
                        <h4>{t("LABEL.PRICE_BOOK.UPDATE_PRICE_BOOK")}</h4>
                        <Link
                            to="#"
                            className="sidebar-close toggle-btn"
                            onClick={() => togglePopup()}
                        >
                            <i className="ti ti-x" />
                        </Link>
                    </div>
                    <div className="toggle-body">
                        <div className="pro-create">
                            <form >
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <label className="col-form-label">
                                                {t("PRICE_BOOK.PRICE_BOOK_NAME")} 
                                            </label>
                                            <input type="text" className="form-control" name="priceBookName"
                                                onChange={(e) => handleChange(e)} value={priceBook?.priceBookName} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.ACTIVE")}
                                                </label>
                                            </div>
                                            <Select
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                options={activeOptions}
                                                onChange={(selectedOption) =>
                                                    handleChange(selectedOption, "isActive")
                                                }
                                                value={activeOptions.find(
                                                    (option) => option.value === priceBook?.isActive
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.IS_STANDARD_PRICE_BOOK")}
                                                </label>
                                            </div>
                                           <Select
                                                classNamePrefix="react-select"
                                                styles={customStyles}
                                                options={statusOptions}
                                                onChange={(selectedOption) =>
                                                    handleChange(selectedOption, "isStandardPriceBook")
                                                }
                                                value={statusOptions.find(
                                                    (option) => option.value === priceBook?.isStandardPriceBook
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-wrap">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <label className="col-form-label">
                                                    {t("PRICE_BOOK.DESCRIPTION")}
                                                </label>
                                            </div>
                                            <Editor
                                                editorState={editorState}
                                                toolbarClassName="toolbar-class"
                                                wrapperClassName="wrapper-class"
                                                editorClassName="editor-class"
                                                onEditorStateChange={handleEditorChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="submit-button text-end">
                                    <Link to="#" onClick={() => prop.setShowPopup(false)} className="btn btn-light sidebar-close">
                                        Cancel
                                    </Link>
                                    <Link
                                        to="#"
                                        className="btn btn-primary"
                                        onClick={handleUpdate}
                                    >
                                        Update
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}