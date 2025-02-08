"use client";

import { signOut } from "next-auth/react";

export default function Navbar() {
  return (
    <div className="navbar pb-8">
      <div className="flex-1  lg:flex-none">
        <a href="/dashboard" className="text-lg font-bold">
          Voya
        </a>
      </div>
      <div className="flex flex-1 justify-end px-2">
        <div className="flex items-stretch">
          <a href="/profile" className="btn btn-ghost rounded-btn">
            Account
          </a>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost rounded-btn"
            >
              Menu
            </div>
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
              <li>
                <button className="" onClick={() => signOut()}>
                  Sign out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
