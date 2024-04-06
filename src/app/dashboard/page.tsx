"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCSVReader } from "react-papaparse";
import {
  Button,
  ButtonGroup,
  Dropdown,
  Modal,
  ProgressBar,
} from "react-bootstrap";
import { toStartLetter } from "@/service";
import "./style.css";
import { ObjectKeyAny } from "@/interface";

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

export default function DashboardLayout() {
  const location = window?.location?.pathname.split("/")[1] ?? "";
  const { CSVReader } = useCSVReader();
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
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

          <Dropdown
            className="dashboard-upload-btn w-100"
            as={ButtonGroup}
            show={showDropdown}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <Dropdown.Toggle
              variant="primary"
              id="dropdown-basic"
              split
              className="upload-button"
            >
              <UploadButtonTitle />
            </Dropdown.Toggle>

            <Dropdown.Menu>
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
                {({ getRootProps }: any) => (
                  <Dropdown.Item
                    {...getRootProps()}
                    className="d-flex align-items-center justify-content-start"
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
                  </Dropdown.Item>
                )}
              </CSVReader>
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
    </div>
  );
}
