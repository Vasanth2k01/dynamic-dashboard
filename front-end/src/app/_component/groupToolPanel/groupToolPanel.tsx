"use client";

import React, { useState, useEffect } from "react";

/**
 * <-------------- Import Ends Here -------------->
 */

const GroupsToolPanel = ({ api }: any) => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  useEffect(() => {
    if (!api) return; // Add null check to prevent errors
  }, [api]);

  const addGroupField = (field: string) => {
    setSelectedFields([...selectedFields, field]);
  };

  const removeGroupField = (field: string) => {
    setSelectedFields(selectedFields.filter((f) => f !== field));
  };

  const applyGrouping = () => {
    if (!api) return;
    api.columnController.applyColumnGroupState({
      state: selectedFields.map((field) => ({ colId: field })),
      defaultState: { pivot: false },
    });
  };

  return (
    <div>
      <div>
        {selectedFields.length > 0 && (
          <div>
            <h3>Selected Fields</h3>
            <ul>
              {selectedFields.map((field) => (
                <li key={field}>
                  {field}
                  <button onClick={() => removeGroupField(field)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button onClick={applyGrouping}>Apply Grouping</button>
          </div>
        )}
      </div>
      <div>
        <h3>Add Group Field</h3>
        <button onClick={() => addGroupField("field1")}>Field 1</button>
        <button onClick={() => addGroupField("field2")}>Field 2</button>
        <button onClick={() => addGroupField("field3")}>Field 3</button>
      </div>
    </div>
  );
};

export default GroupsToolPanel;
