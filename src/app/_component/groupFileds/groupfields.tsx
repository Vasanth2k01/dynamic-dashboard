import React, { useState } from "react";

const Groupfields = ({ groupedColumns }: any) => {
//   const [showGroups, setShowGroups] = useState(false);

//   const toggleGroups = () => {
//     setShowGroups(!showGroups);
//   };

  return (
    <div className="sidenav" style={{ textAlign: "right", float: "right" }}>
      <div className="p-2 d-flex align-items-center">UntitiledUI</div>
      <div className="p-2" style={{ textAlign: "right" }}>
        {(
          <div className="p-2" style={{ textAlign: "right" }}>
            {groupedColumns?.map((group: any, index: number) => (
              <div key={index} className="group">
                <div className="group-name">{group.name}</div>
                <div className="group-columns">
                  {group.columns.map((column: any, colIndex: number) => (
                    <div key={colIndex} className="column">
                      {column}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Groupfields;
