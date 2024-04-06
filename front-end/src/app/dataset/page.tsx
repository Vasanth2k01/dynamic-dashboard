"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useCSVReader } from "react-papaparse";

import {
  Button,
  ButtonGroup,
  Dropdown,
  Form,
  Modal,
  ProgressBar,
} from "react-bootstrap";

import { toStartLetter } from "../../service";

import { CSVChartType, ObjectKeyAny } from "../../interface";

import "./style.css";

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

export default function DatasetPage() {
  const { CSVReader } = useCSVReader();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);

  const [show, setShow] = useState<boolean>(false);
  const [head, setHead] = useState<string>("");
  const [csvData, setCsvData] = useState<CSVChartType>({
    header: [],
    value: [],
  });

  useEffect(() => {
    const location = window?.location?.pathname.split("/")[1] ?? "";
    setHead(toStartLetter(location));
  }, []);

  useEffect(() => {
    if (csvData.header.length) {
      const parsedValue: Record<string, any> = JSON.parse(
        localStorage.getItem("csvData") || "{}"
      );
      const nextIndex = Object.keys(parsedValue).length;

      localStorage.setItem(
        "csvData",
        JSON.stringify({
          ...parsedValue,
          [nextIndex]: csvData,
        })
      );
    }
  }, [csvData]);

  const handleClose = () => {
    setShowModal(false);
  };

  const handleUploadProgress = (progressEvent: ProgressEvent) => {
    const { loaded, total } = progressEvent;
    const percentage = (loaded / total) * 100;
    setProgressPercentage(percentage);
  };

  const handleUploadComplete = () => {
    // Set upload complete
    // Redirect after a delay
    setTimeout(() => {
      window.location.href = "/table"; // Redirect to /table route
    }, 2000); // 2 seconds delay
  };

  return (
    <div className="dashboard vh-100">
      <div className="head p-3">{head}</div>
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
                onUploadProgress={handleUploadProgress}
                onUploadAccepted={(results: any) => {
                  const resultData = results.data.filter((data: unknown[]) =>
                    data.some((value: unknown) => !!value)
                  );
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
                          formData[head] = data[index];
                          return formData;
                        },
                        {}
                      );
                    });
                  };
                  setCsvData({
                    header: headers,
                    value: formFunction(),
                  });
                  setShowModal(true);
                  handleUploadComplete();
                }}
              >
                {({
                  getRootProps,
                  acceptedFile,
                  ProgressBar,
                  getRemoveFileProps,
                }: any) => (
                  <Dropdown.Item
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

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Uploading...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProgressBar now={progressPercentage} animated />
        </Modal.Body>
      </Modal>

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
