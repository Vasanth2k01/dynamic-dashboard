"use client";

import { GroupColumnType } from "@/interface";
import Image from "next/image";

import React, { useState } from "react";

import { Button, Collapse } from "react-bootstrap";

/**
 * <-------------- Import Ends Here -------------->
 */

const Groupfields = ({
  groupedColumns,
}: {
  groupedColumns: GroupColumnType[];
}) => {
  const [open, setOpen] = useState<string[]>([]);

  return (
    <div className="group">
      <div className="head p-2 d-flex align-items-center">Groupped Fields</div>
      <div className="p-2 field-list">
        <div className="p-2">
          {groupedColumns?.map((group: GroupColumnType) => (
            <>
              <div
                className=""
                onClick={() => {
                  const formData = open.includes(group.name)
                    ? open.filter((col) => col !== group.name)
                    : [...open, group.name];

                  setOpen(formData);
                }}
              >
                <div className=" p-2 d-flex align-items-center mb-1 cursor-pointer">
                  <Image
                    width={14}
                    height={14}
                    className="me-2"
                    src={
                      open.includes(group.name)
                        ? "/expand_more.png"
                        : "/keyboard_arrow_right.png"
                    }
                    alt="expand_more"
                  />
                  <p className="group-name">{group.name}</p>
                </div>
                <Collapse in={open.includes(group.name)}>
                  <div>
                    {group.columns.map((column: string, colIndex: number) => (
                      <div key={colIndex} className="group-column">
                        {column}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            </>
          ))}
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center">
        <Button variant="outlined-secondary">Create Dashboard</Button>
      </div>
    </div>
  );
};

export default Groupfields;
