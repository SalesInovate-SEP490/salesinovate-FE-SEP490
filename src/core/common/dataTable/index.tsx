// index.tsx
import React, { useState } from "react";
import { Table } from "antd";
import type {TableProps} from "antd";

const Datatable: React.FC<TableProps> = (props) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);

  const onSelectChange = (newSelectedRowKeys: any[]) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      className="table datanew dataTable no-footer"
      rowSelection={rowSelection}
      {...props}
    />
  );
};

export default Datatable;
