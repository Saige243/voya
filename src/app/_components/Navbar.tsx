export default function Navbar() {
  return (
    <div className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl  text-black">Voya</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Account</a>
          </li>
          <li>
            <details>
              <summary>Menu</summary>
              <ul className="rounded-t-none bg-base-100 p-2">
                <li>
                  <a>Trips</a>
                </li>
                <li>
                  <a>Profile</a>
                </li>
                <li>
                  <a>Logout</a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
