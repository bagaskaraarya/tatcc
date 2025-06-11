import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        Rencana Kerja Anggaran Mahasiswa
      </Link>
      <div className="space-x-4">
        {user ? (
          <>
            <span>Halo, {user.nama}</span>
            <button
              onClick={onLogout}
              className="underline hover:text-gray-200"
              type="button"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="underline hover:text-gray-200">
              Login
            </Link>
            <Link to="/register" className="underline hover:text-gray-200">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
