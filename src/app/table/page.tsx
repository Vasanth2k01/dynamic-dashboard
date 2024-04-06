"use client";
import React, { useEffect, useState } from "react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { FakeServer } from "../fakeServer/fakeServer";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { useCSVReader } from "react-papaparse";
import GroupsToolPanel from "@/app/_component/groupToolPanel/groupToolPanel";
import { GridApi, IRowNode } from "ag-grid-community";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Groupfields from "@/app/_component/groupFileds/groupfields";
import "./styles.css";

ModuleRegistry.registerModules([RowGroupingModule, ServerSideRowModelModule]);

export interface IOlympicData {
  id?: number;
  athlete: string;
  age: number;
  country: string;
  year: number;
  date: string;
  sport: string;
  gold: number;
  silver: number;
  bronze: number;
  total: number;
}

export default function Home() {
  const [gridApi, setGridApi] = useState<GridApi<IOlympicData> | null>(null);
  const [groupedColumns, setGroupedColumns] = useState<
    { name: string; columns: string[] }[]
  >([]);
  const [groupCounter, setGroupCounter] = useState(1);

  const { CSVReader } = useCSVReader();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://www.ag-grid.com/example-assets/olympic-winners.json"
      );
      const data: IOlympicData[] = await response.json();
      data.forEach((item: IOlympicData, index: number) => {
        item.id = index;
      });
      const fakeServer = new FakeServer(data);
      const datasource = getServerSideDatasource(fakeServer);
      if (gridApi) {
        gridApi.setServerSideDatasource(datasource);
      }
    };
    fetchData();
  }, [gridApi]);

  // const customSideBar: any = {
  //   toolPanels: [
  //     {
  //       id: "columns",
  //       labelDefault: "Columns",
  //       labelKey: "columns",
  //       iconKey: "columns",
  //       toolPanel: "agColumnsToolPanel",
  //       sideBarDisplayPriority: 0,
  //     },
  //   ],
  // };

  const handleGroupFields = () => {
    const selectedColumns = gridApi
      ?.getColumnState()
      .filter((col) => col.rowGroup);
    if (selectedColumns && selectedColumns.length > 0) {
      const groupName = `Group ${groupCounter}`;
      const columns = selectedColumns.map((col: any) => col.colId);
      setGroupedColumns([...groupedColumns, { name: groupName, columns }]);
      setGroupCounter(groupCounter + 1);
    }
  };

  const gridOptions: any = {
    sideBar: ["columns", "filters", "customSideBar"],
    frameworkComponents: { GroupsToolPanel },
    columnDefs: [
      { field: "country", enableRowGroup: true },
      { field: "year", enableRowGroup: true, rowGroup: true, hide: true },
      { field: "athlete", enableRowGroup: true, hide: false },
      {
        field: "sport",
        enableRowGroup: true,
        checkboxSelection: true,
        filter: "agTextColumnFilter",
      },
      {
        field: "gold",
        aggFunc: "sum",
        enableRowGroup: true,
        filter: "agNumberColumnFilter",
      },
      {
        field: "silver",
        aggFunc: "sum",
        enableRowGroup: true,
        filter: "agNumberColumnFilter",
      },
      {
        field: "bronze",
        aggFunc: "sum",
        enableRowGroup: true,
        filter: "agNumberColumnFilter",
      },
    ],
    defaultColDef: {
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
    },
    autoGroupColumnDef: {
      field: "athlete",
      flex: 1,
      minWidth: 240,
      cellRendererParams: {
        checkbox: true,
      },
    },
    rowGroupPanelShow: "always",
    rowModelType: "serverSide",
    rowSelection: "multiple",
    isRowSelectable: (rowNode: IRowNode) => {
      return rowNode.data.year > 2004;
    },
    suppressRowClickSelection: true,
    suppressAggFuncInHeader: true,
  };

  function getServerSideDatasource(server: FakeServer) {
    return {
      getRows: (params: any) => {
        console.log("[Datasource] - rows requested by grid: ", params.request);
        var response = server.getData(params.request);
        setTimeout(() => {
          if (response.success) {
            params.success({
              rowData: response.rows,
              rowCount: response.lastRow,
            });
          } else {
            params.fail();
          }
        }, 200);
      },
    };
  }

  return (
    <div
      className="ag-theme-quartz"
      style={{ display: "flex", height: "100vh", width: "100%" }}
    >
      <div style={{ flex: 1 }}>
        <Groupfields groupedColumns={groupedColumns} />
        <button onClick={handleGroupFields} className="button">
          Group Fields
        </button>
        <AgGridReact
          gridOptions={gridOptions as any}
          onGridReady={(params: any) => {
            setGridApi(params.api);
          }}
          // sideBar={customSideBar}
        />
      </div>
    </div>
  );
}
