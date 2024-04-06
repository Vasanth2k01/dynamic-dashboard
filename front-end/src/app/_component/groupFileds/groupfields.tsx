import Image from "next/image";
import React, { useState } from "react";
import { Accordion, Collapse } from "react-bootstrap";

const Groupfields = ({ groupedColumns }: any) => {
  const [open, setOpen] = useState<string[]>([]);

  //   const toggleGroups = () => {
  //     setShowGroups(!showGroups);
  //   };

  return (
    <div className="group">
      <div className="head p-2 d-flex align-items-center">Groupped Fields</div>
      <div className="p-2">
        <div className="p-2">
          {groupedColumns?.map((group: { name: string; columns: string[] }) => (
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
                <div className=" p-2 d-flex align-items-center mb-1">
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
                    {group.columns.map((column: any, colIndex: number) => (
                      <div key={colIndex} className="group-column">
                        {column}
                      </div>
                    ))}
                  </div>
                </Collapse>
              </div>
            </>
          ))}

          {/* <Accordion defaultActiveKey="0">
            {groupedColumns?.map(
              (group: { name: string; columns: string[] }, index: number) => (
                <Accordion.Item eventKey={group.name}>
                  <Accordion.Header>{group.name}</Accordion.Header>
                  <Accordion.Body>
                    {group.columns.map((column: any, colIndex: number) => (
                      <div key={colIndex} className="column">
                        {column}
                      </div>
                    ))}
                  </Accordion.Body>
                </Accordion.Item>
              )
            )}
          </Accordion> */}
          {/* {groupedColumns?.map((group: any, index: number) => (
            <div key={index} className="group-list">
              <div className="group-name">{group.name}</div>
              <div className="group-columns">
                {group.columns.map((column: any, colIndex: number) => (
                  <div key={colIndex} className="column">
                    {column}
                  </div>
                ))}
              </div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Groupfields;
