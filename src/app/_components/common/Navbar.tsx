"use client";

import NavAvatarMenu from "./NavAvatarMenu";

export default function Navbar() {
  return (
    <div className="navbar flex items-center justify-center">
      <div className="flex-1 lg:flex-none">
        <a href="/dashboard" className="text-lg font-bold">
          Voya
        </a>
      </div>
      <div className="flex flex-1 items-center justify-end  px-2">
        <div className="flex items-stretch">
          <div tabIndex={0} role="button" className="btn btn-ghost rounded-btn">
            Menu
          </div>
          <div className="flex items-center">
            <NavAvatarMenu />
          </div>
          <div className="dropdown dropdown-end">
            <ul
              tabIndex={0}
              className="menu dropdown-content z-[1] mt-4 w-52 rounded-box bg-base-100 p-2 text-black shadow dark:text-white"
            >
              <li>
                <a href="/trips" className=" ">
                  My Trips
                </a>
                <a href="/profile" className=" ">
                  Profile
                </a>
              </li>
              <li>
                <a href="/settings">Settings</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
