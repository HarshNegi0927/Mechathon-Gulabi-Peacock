import React from 'react';
import { NavLink } from 'react-router-dom';

function Header() {
    return (
        <div className="w-full h-20 bg-gray-900 text-white flex items-center px-10 shadow-lg">
            {/* Logo */}
            <div className="text-3xl font-bold text-orange-500 tracking-wide">
                TakeTrack
            </div>

            
            <div className="ml-auto">
                <ul className="flex space-x-8">
                    <li>
                        <NavLink
                            end
                            to="/dashboard"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-400 font-semibold border-b-2 border-orange-400 pb-1 transition-all"
                                    : "text-gray-300 hover:text-orange-400 pb-1 transition-all"
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/expense"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-400 font-semibold border-b-2 border-orange-400 pb-1 transition-all"
                                    : "text-gray-300 hover:text-orange-400 pb-1 transition-all"
                            }
                        >
                            Expense
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/budget"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-400 font-semibold border-b-2 border-orange-400 pb-1 transition-all"
                                    : "text-gray-300 hover:text-orange-400 pb-1 transition-all"
                            }
                        >
                            Budget
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/report"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-400 font-semibold border-b-2 border-orange-400 pb-1 transition-all"
                                    : "text-gray-300 hover:text-orange-400 pb-1 transition-all"
                            }
                        >
                            Report
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/dashboard/user"
                            className={({ isActive }) =>
                                isActive
                                    ? "text-orange-400 font-semibold border-b-2 border-orange-400 pb-1 transition-all"
                                    : "text-gray-300 hover:text-orange-400 pb-1 transition-all"
                            }
                        >
                            User
                        </NavLink>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Header;