"use client";

import Image from "next/image";

import React, { useEffect, useState } from "react";

import { Button } from "react-bootstrap";

import { RowGroupingModule } from "@ag-grid-enterprise/row-grouping";
import { ServerSideRowModelModule } from "@ag-grid-enterprise/server-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import { GridApi } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-quartz.css";
import "ag-grid-enterprise";

import { FakeServer } from "@/app/fakeServer/fakeServer";

import GroupsToolPanel from "@/app/_component/groupToolPanel/groupToolPanel";
import Groupfields from "@/app/_component/groupFileds/groupfields";

import { CSVChartType, GroupColumnType, IOlympicData } from "@/interface";

import "./styles.css";

/**
 * <-------------- Import Ends Here -------------->
 */

ModuleRegistry.registerModules([RowGroupingModule, ServerSideRowModelModule]);

export default function Home() {
  const [gridApi, setGridApi] = useState<GridApi<IOlympicData> | null>(null);
  const [groupedColumns, setGroupedColumns] = useState<GroupColumnType[]>([]);
  const [groupCounter, setGroupCounter] = useState<number>(1);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

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

  useEffect(() => {
    const parsedValue: Record<string, CSVChartType> = JSON.parse(
      localStorage.getItem("csvData") || "{}"
    );

    if (Object.keys(parsedValue).length) {
      const { header } = parsedValue["0"];

      setColumns(header);
    }
  }, []);

  const handleGroupFields = () => {
    if (selectedColumns.length) {
      const groupName = `Group ${groupCounter}`;
      setGroupedColumns([
        ...groupedColumns,
        { name: groupName, columns: selectedColumns },
      ]);
      setGroupCounter(groupCounter + 1);
      setSelectedColumns([]);
    }
  };

  const gridOptions: any = {
    frameworkComponents: { GroupsToolPanel },
    columnDefs: [
      { field: "country", enableRowGroup: true },
      { field: "year", enableRowGroup: true },
      { field: "athlete", enableRowGroup: true },
      {
        field: "sport",
        enableRowGroup: true,
      },
      {
        field: "gold",
        enableRowGroup: true,
      },
      {
        field: "silver",
        enableRowGroup: true,
      },
      {
        field: "bronze",
        enableRowGroup: true,
      },
    ],
    defaultColDef: {
      floatingFilter: true,
      flex: 1,
      minWidth: 120,
    },
    rowModelType: "serverSide",
    rowSelection: "multiple",
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
      style={{ height: "100vh", width: "100%", backgroundColor: "white" }}
    >
      <div className="head p-3">Dataset</div>
      <div className="d-flex w-100" style={{ height: "calc(100vh - 60px)" }}>
        <div className="w-100 pt-2">
          <AgGridReact
            gridOptions={gridOptions as any}
            onGridReady={(params: any) => {
              setGridApi(params.api);
            }}
          />
        </div>
        {groupedColumns.length ? (
          <Groupfields groupedColumns={groupedColumns} />
        ) : (
          <></>
        )}
        <div className="field">
          <div className="head p-3">
            <h3>Dataset Fields</h3>
          </div>
          <div className="field-list overflow-auto">
            {columns?.map((data) => (
              <>
                <div
                  className="py-1 px-3 d-flex cursor-pointer align-items-center"
                  onClick={() => {
                    if (
                      !selectedColumns.includes(data) &&
                      selectedColumns.length === 2
                    )
                      return;
                    const formData = selectedColumns.includes(data)
                      ? selectedColumns.filter((col) => col !== data)
                      : [...selectedColumns, data];

                    setSelectedColumns(formData);
                  }}
                >
                  <Image
                    width={14}
                    height={14}
                    className="me-2"
                    src={
                      selectedColumns.includes(data)
                        ? "/check_box_select.png"
                        : "/check_box_outline.png"
                    }
                    alt="checkbox"
                  />
                  <div>{data}</div>
                </div>
              </>
            ))}
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <Button variant="outlined-secondary" onClick={handleGroupFields}>
              Group Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
