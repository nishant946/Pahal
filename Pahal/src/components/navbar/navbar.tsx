import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";


function Navbar() {
  const [islogIn, setislogIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/login") {
      setislogIn(false);
    } else if (location.pathname === "/register") {
      setislogIn(true);
    }
  }, [location.pathname]);


  const NavbarItems = [
      { label: "Profile", href: "/profile" },
    { label: "Notifications", href: "/notifications" },
  ];

  return (
    <div className="flex-1 items-center justify-center">
      <nav className="flex-1 justify-between items-center p-4 bg-gray-800 text-white w-full flex">
        <div className="font-bold text-lg flex items-center p-1">
          <div className="p-2">Pahal</div>
        </div>
        <div className="flex justify-evenly gap-4 text-lg font-bold items-center p-1">
          {NavbarItems.map((item) => (
            <Link key={item.label} to={item.href} className="p-2 hover:bg-gray-700 rounded ease-in-out duration-300">
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
