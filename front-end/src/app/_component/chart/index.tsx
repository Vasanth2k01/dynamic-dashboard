import Image from "next/image";
import { useState } from "react";

import { AgChartsReact } from "ag-charts-react";
import { AgChartOptions } from "ag-grid-enterprise";

import { Button, ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";

import "./style.css";

/**
 * <-------------- Import Ends Here -------------->
 */

export const Chart = ({
  option,
  chartName,
  toggleOption,
}: {
  option: AgChartOptions;
  chartName: string;
  toggleOption: string[];
}) => {
  const [selectedToggle, setSelectedToggle] = useState<string>(toggleOption[0]);

  const DropdownTitle = () => (
    <div className="w-100 d-flex align-items-center justify-content-between">
      <p title={selectedToggle} className="text-truncate">
        {selectedToggle}{" "}
      </p>
      <Image
        width={20}
        height={20}
        alt="fi_chevron-down-dark"
        src={"/fi_chevron-down-dark.png"}
      />
    </div>
  );

  return (
    <div className="m-3 chart-display">
      <div className="chart-outlayer">
        <div className="chart-head p-3">
          <h3 title={chartName}>{chartName}</h3>
          <div className="d-flex align-items-center">
            <DropdownButton
              title={<DropdownTitle />}
              className="dashboard-upload-btn me-2"
              as={ButtonGroup}
              variant="light"
            >
              {toggleOption.map((toggleData: string) => (
                <Dropdown.Item
                  className="d-flex align-items-center justify-content-start"
                  eventKey="2"
                  key={toggleData}
                  onClick={() => setSelectedToggle(toggleData)}
                >
                  {toggleData}
                </Dropdown.Item>
              ))}
            </DropdownButton>
            <Button
              title="Ai Insight"
              variant="outlined-primary"
              className="ai-in"
            >
              Ai Insight
            </Button>
          </div>
        </div>
        <AgChartsReact options={option} />
      </div>
    </div>
  );
};
