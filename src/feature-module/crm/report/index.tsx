import { useEffect, useState } from "react";
import GroupedLeadsTable from "./LeadTable";
import './index.css'
import { Link, useParams } from "react-router-dom";
import { all_routes } from "../../router/all_routes";
import { useTranslation } from "react-i18next";
import { downloadFileJson, generateReport } from "../../../services/report";
import Swal from "sweetalert2";
import Select, { StylesConfig } from "react-select";

const Reports = () => {
  const [groupBy, setGroupBy] = useState<any>(null);
  const [toggleChart, setToggleChart] = useState<boolean>(false);
  const [listReports, setListReports] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const { t } = useTranslation();
  const { id } = useParams();
  const route = all_routes;

  useEffect(() => {
    getListReports();
  }, []);

  const getListReports = () => {
    const userId = localStorage.getItem("userId");
    Swal.showLoading();
    generateReport(userId)
      .then((response) => {
        downloadFileJson(userId)
          .then((response) => {
            Swal.close();
            const data = JSON.parse(response?.data ? response?.data.replaceAll("\\", "") : null);
            getColumns(data);
            getData(data);
          })
          .catch((error) => {
            Swal.close();
            console.log(error);
          });
      })
      .catch((error) => {
        Swal.close();
        console.log(error);
      });
  }

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

  const getColumns = (data: any) => {
    switch (id) {
      case "1":
        const columnsData = Object.keys(data?.leadField).map((key) => {
          return { key, label: data?.leadField[key] };
        })
        setColumns(columnsData);
        break;
      case "2":
        const columnsDataOpportunity = Object.keys(data?.opportunityField).map((key) => {
          return { key, label: data?.opportunityField[key] };
        });
        setColumns(columnsDataOpportunity);
        break;
      case "3":
        const columnsDataAccount = Object.keys(data?.accountField).map((key) => {
          return { key, label: data?.accountField[key] };
        });
        setColumns(columnsDataAccount);
        break;
    }
  }

  const getData = (data: any) => {
    switch (id) {
      case "1":
        setListReports(data?.leadsReport);
        break;
      case "2":
        setListReports(data?.opportunityReport);
        break;
      case "3":
        setListReports(data?.accountReport);
        break;
      default:
        break;
    }
  }

  const typeReport = id === "1" ? "Lead" : id === "2" ? "Opportunity" : "Account";

  const generateRandomKey = () => {
    return Math.random().toString(36).substring(7);
  }
  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="row">
          <div className="contact-head">
            <div className="row align-items-center">
              <div className="col-sm-6">
                <ul className="contact-breadcrumb">
                  <li>
                    <Link to={route.reports}>
                      <i className="ti ti-arrow-narrow-left" />
                      {t("LABEL.REPORT.REPORT")}
                    </Link>
                  </li>
                  <li>{ }</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div>
            <h1>{`${typeReport} Report`}</h1>
            <div className="row">
              <div className="col-md-1 align-content-center">
                <label htmlFor="groupBy">Group by:</label>
              </div>
              <div className="col-md-2">
                <Select
                  options={columns.map((column: any) => {
                    return { value: column.key, label: column.label }
                  })}
                  styles={customStyles}
                  onChange={(e: any) => setGroupBy(e?.value)}
                  id="groupBy"
                  value={columns.find((column: any) => column.key === groupBy) || columns ? columns[0] : null}
                />
              </div>
              <div className="col-md-1">
                <button
                  onClick={() => setToggleChart(!toggleChart)}
                  className="btn submit-btn-custom ml-2"
                >
                  <i className={`fa fa-${toggleChart ? 'eye-slash' : 'eye'}`} />
                </button>
              </div>
            </div>
            <GroupedLeadsTable groupBy={groupBy} toggleChart={toggleChart} initColumns={columns} data={listReports} typeReport={typeReport} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
