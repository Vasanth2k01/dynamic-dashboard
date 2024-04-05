"use client";

import Image from "next/image";
import "./style.css";

const SideNav = () => {
  return (
    <div className="sidenav">
      <div className="p-2 d-flex align-items-center">
        <Image
          width={16}
          height={16}
          alt="logo"
          className="me-2"
          src={"/logo.png"}
        />
        UntitiledUI
      </div>
      <div className="p-2">
        <div className="p-2 d-flex align-items-center active">
          <Image
            className="me-2"
            width={16}
            height={16}
            alt="dataset-icon"
            src={"/dataset-icon.png"}
          />
          Dataset
        </div>
      </div>
    </div>
  );
};

export default SideNav;
