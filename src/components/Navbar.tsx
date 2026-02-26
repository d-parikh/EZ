import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow w-full">
      <h1 className="text-lg font-semibold">EZ Task</h1>

      <div className="flex gap-2">
        <NavLink
          to="/tree"
          className={({ isActive }) =>
            `py-2 rounded-md text-sm font-medium transition hover:underline ${
              isActive
                ? "border-blue-600 border-b-2 rounded-none text-blue-600"
                : "border-transparent hover:border-gray-300"
            }`
          }
        >
          Tree Node
        </NavLink>
        <NavLink
          to="/kanban"
          className={({ isActive }) =>
            `px-4 py-2 rounded-md text-sm font-medium transition ${
              isActive
                ? "border-blue-600 border-b-2 rounded-none text-blue-600"
                : "border-transparent hover:border-gray-300"
            }`
          }
        >
          KanbanBoard
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;