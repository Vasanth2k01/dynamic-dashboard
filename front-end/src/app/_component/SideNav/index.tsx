"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import "./style.css";

/**
 * <-------------- Import Ends Here -------------->
 */

const SideNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [active, setActive] = useState<string>("");

  useEffect(() => {
    setActive(pathname.split("/")[1]);
  }, [pathname]);

  return (
    <div className="sidenav">
      <div className="p-2 d-flex align-items-center">
        <Image
          width={20}
          height={20}
          alt="logo"
          className="me-2"
          src={"/Logo.png"}
        />
        AIQUARIUS
      </div>
      <div className="p-2">
        <div
          onClick={() => router.push("/dataset")}
          className={`p-2 cursor-pointer d-flex align-items-center ${
            active === "dataset" ? "active" : ""
          }`}
        >
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
