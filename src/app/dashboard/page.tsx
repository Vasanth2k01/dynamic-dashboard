"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useCSVReader } from "react-papaparse";

import { Button, ButtonGroup, Dropdown, Form, Modal } from "react-bootstrap";

import { toStartLetter } from "@/service";

import "./style.css";
import { ObjectKeyAny } from "@/interface";

/**
 * <-------------- Import Ends Here -------------->
 */

const UploadButtonTitle = () => (
  <div className="d-flex align-items-center justify-content-between upload-button-title">
    <Image
      width={20}
      height={20}
      alt="upload-cloud-white"
      src={"/upload-cloud-white.svg"}
      className="me-2"
    />
    Upload
  </div>
);

export default function DashboardLoadyout() {
  const location = window?.location?.pathname.split("/")[1] ?? "";

  const { CSVReader } = useCSVReader();

  const [show, setShow] = useState<boolean>(false);
  const [csvData, setCsvData] = useState<{
    header: string[];
    value: [][];
  }>({
    header: [],
    value: [],
  });

  useEffect(() => {
    if (csvData.header.length) {
      console.log(csvData);
    }
  }, [csvData]);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <div className="dashboard vh-100">
      <div className="head p-3">{toStartLetter(location)}</div>
      <div className="dashboard-content d-flex flex-column align-items-center justify-content-center">
        <div className="d-flex flex-column align-items-center">
          <Image
            width={120}
            height={86}
            alt="empty-dashboard"
            src={"/empty-dashboard.svg"}
          />
          <div className="d-flex flex-column align-items-center">
            <h4 className="fs-6 fw-semibold">No dataset available</h4>
            <p className="fs-6 fw-normal">
              Please upload a file containing the necessary dataset
            </p>
          </div>

          <Dropdown className="dashboard-upload-btn w-100" as={ButtonGroup}>
            <Button variant="primary">
              <UploadButtonTitle />
            </Button>

            <Dropdown.Toggle split variant="primary" id="dropdown-split-basic">
              <Image
                width={20}
                height={20}
                alt="fi_chevron-down"
                src={"/fi_chevron-down.svg"}
              />
            </Dropdown.Toggle>

            <Dropdown.Menu className="dashboard-upload-list">
              <CSVReader
                onUploadAccepted={(results: any) => {
                  console.log("---------------------------");
                  const resultData = results.data.filter((data: unknown[]) =>
                    data.some((value: unknown) => !!value)
                  );
                  console.log(results, resultData);
                  const headers = resultData[0];
                  resultData.shift();

                  const formFunction = () => {
                    return resultData.map((data: ObjectKeyAny) => {
                      return headers.reduce(
                        (
                          formData: ObjectKeyAny,
                          head: string,
                          index: number
                        ) => {
                          console.log(index, formData, head, data[index]);
                          formData[head] = data[index];
                          return formData;
                        },
                        {}
                      );
                    });
                  };
                  console.log(results, resultData);
                  setCsvData({
                    header: headers,
                    value: formFunction(),
                  });
                  console.log("---------------------------");
                }}
              >
                {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps,
                }: any) => (
                  <Dropdown.Item
                    onClick={() => console.log("upload file")}
                    className="d-flex align-items-center justify-content-start"
                    eventKey="1"
                    {...getRootProps()}
                  >
                    <div>
                      <Image
                        width={20}
                        height={20}
                        alt="upload-cloud-01"
                        src={"/upload-cloud-01.svg"}
                        className="me-2"
                      />
                      Upload File
                    </div>
                    <ProgressBar />
                  </Dropdown.Item>
                )}
              </CSVReader>
              <Dropdown.Item
                onClick={() => setShow(true)}
                className="d-flex align-items-center justify-content-start"
                eventKey="2"
              >
                <Image
                  width={20}
                  height={20}
                  className="me-2"
                  alt="link"
                  src={"/link.svg"}
                />
                Embedded Link
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>

      <Modal show={show}>
        <Modal.Header>
          <Modal.Title>Embedded Link</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <h4>URL</h4>
            <Form.Control type="text" placeholder="Enter or paste" />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outlined-primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => console.log("API integrate here")}
          >
            Embedded Link
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
