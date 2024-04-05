"use client";
// page.tsx

import React, { useEffect, useState } from "react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";
import {
  GridOptions,
  GetRowIdParams,
  GridApi,
  IRowNode,
  IServerSideDatasource,
} from "@ag-grid-community/core";
import { AgGridReact } from "ag-grid-react";
import { FakeServer } from "./fakeServer/fakeServer";
import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";

import { ModuleRegistry } from "@ag-grid-community/core";
import { useCSVReader } from "react-papaparse";
ModuleRegistry.registerModules([RowGroupingModule, ServerSideRowModelModule]);

interface IOlympicData {
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
      console.log("dataSource", datasource);

      if (gridApi) {
        gridApi.setServerSideDatasource(datasource);
      }
    };
    fetchData();
  }, [gridApi]);

  const gridOptions: GridOptions<IOlympicData> = {
    sideBar: true,
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
    <div className="ag-theme-quartz" style={{ height: "100vh", width: "100%" }}>
      <AgGridReact
        gridOptions={gridOptions as any}
        onGridReady={(params: any) => {
          setGridApi(params.api);
        }}
      ></AgGridReact>
    </div>
  );
}
