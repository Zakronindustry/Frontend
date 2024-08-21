import React from "react";

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">TradeIQ</h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="/" className="hover:underline">
              Home
            </a>
          </li>
          <li>
            <a href="/dashboard" className="hover:underline">
              Dashboard
            </a>
          </li>
          <li>
            <a href="/community" className="hover:underline">
              Community
            </a>
          </li>
          <li>
            <a href="/profile" className="hover:underline">
              Profile
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
