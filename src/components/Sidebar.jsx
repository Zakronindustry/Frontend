import React from "react";

const Sidebar = () => {
  return (
    <aside className="bg-gray-700 text-white w-64 p-4">
      <ul>
        <li>
          <a href="/dashboard" className="block p-2 hover:bg-gray-600">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/trade-logs" className="block p-2 hover:bg-gray-600">
            Trade Logs
          </a>
        </li>
        <li>
          <a href="/messages" className="block p-2 hover:bg-gray-600">
            Messages
          </a>
        </li>
        <li>
          <a href="/settings" className="block p-2 hover:bg-gray-600">
            Settings
          </a>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
