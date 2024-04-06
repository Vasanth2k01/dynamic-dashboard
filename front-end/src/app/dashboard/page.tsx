"use client";

import { useEffect, useState } from "react";

import { AgChartOptions } from "ag-grid-enterprise";

import { toStartLetter } from "@/service";

import { CSVChartType } from "@/interface";

import { Chart } from "@/app/_component/chart";

import "./style.css";

/**
 * <-------------- Import Ends Here -------------->
 */

export default function DashboardPage() {
  const [head, setHead] = useState<string>("");
  // Chart Options: Control & configure the chart
  const [chartOptions, setChartOptions] = useState<AgChartOptions>({
    // Data: Data to be displayed in the chart
    data: [
      { month: "Jan", avgTemp: 2.3, iceCreamSales: 162000 },
      { month: "Mar", avgTemp: 6.3, iceCreamSales: 302000 },
      { month: "May", avgTemp: 16.2, iceCreamSales: 800000 },
      { month: "Jul", avgTemp: 22.8, iceCreamSales: 1254000 },
      { month: "Sep", avgTemp: 14.5, iceCreamSales: 950000 },
      { month: "Nov", avgTemp: 8.9, iceCreamSales: 200000 },
    ],
    // Series: Defines which chart type and data to use
    series: [{ type: "bar", xKey: "month", yKey: "iceCreamSales" }],
  });

  useEffect(() => {
    const parsedValue: Record<string, CSVChartType> = JSON.parse(
      localStorage.getItem("csvData") || "{}"
    );

    if (Object.keys(parsedValue).length) {
      const { header, value } = parsedValue["0"];

      const formedData = value.map((dataObj) =>
        Object.fromEntries(
          Object.entries(dataObj).map(([key, value]) => [
            key,
            !isNaN(parseInt(value)) ? parseInt(value) : value,
          ])
        )
      );

      setChartOptions({
        ...chartOptions,
        data: formedData,
        series: [{ type: "bar", xKey: header[0], yKey: header[3] }],
      } as AgChartOptions);
    }

    const location = window?.location?.pathname.split("/")[1] ?? "";
    setHead(toStartLetter(location));
  }, []);

  return (
    <div className="chart vh-100">
      <div className="head p-3">{head}</div>
      <Chart
        option={chartOptions}
        chartName="Deal Key insights"
        toggleOption={["Pipeline", "Stage", "Status"]}
      />
    </div>
  );
}
