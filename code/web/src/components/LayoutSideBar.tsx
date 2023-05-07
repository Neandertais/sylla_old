import { ReactNode } from "react";
import { MdOutlineVideoSettings } from "react-icons/md";
import { BsArrowLeft, BsCloudUpload } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";

export default function LayoutSideBar({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex">
      <aside className="h-[calc(100vh-56px)] w-14 flex flex-col justify-between py-4 gap-2 items-center shadow-[4px_0_6px_-1px_rgb(0,0,0,0.1)] -ml-8">
        <ul className="flex flex-col gap-1 items-center w-full">
          <li
            {...(pathname === "/settings/videos" && {
              className: clsx([
                "bg-gray-100 w-full flex justify-center relative",
                "after:content-[''] after:absolute after:top-0 after:left-0 after:w-1 after:h-full after:bg-blue-500",
              ]),
            })}
          >
            <Link to="" className="flex text-blue-500 p-2 hover:text-gray-600">
              <MdOutlineVideoSettings size={22} />
            </Link>
          </li>
          <li
            {...(pathname === "/settings/upload" && {
              className: clsx([
                "bg-gray-100 w-full flex justify-center relative",
                "after:content-[''] after:absolute after:top-0 after:left-0 after:w-1 after:h-full after:bg-blue-500",
              ]),
            })}
          >
            <Link to="" className="flex text-blue-500 p-2 hover:text-gray-600">
              <BsCloudUpload size={22} />
            </Link>
          </li>
          <li
            {...(pathname === "/settings" && {
              className: clsx([
                "bg-gray-100 w-full flex justify-center relative",
                "after:content-[''] after:absolute after:top-0 after:left-0 after:w-1 after:h-full after:bg-blue-500",
              ]),
            })}
          >
            <Link to="" className="flex text-blue-500 p-2 hover:text-gray-600">
              <IoSettingsOutline size={22} />
            </Link>
          </li>
        </ul>
        <Link to={""} className="flex text-blue-500 p-2 hover:text-gray-600">
          <BsArrowLeft size={22} />
        </Link>
      </aside>
      <div className="">{children}</div>
    </div>
  );
}
