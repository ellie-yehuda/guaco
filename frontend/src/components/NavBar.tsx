import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon, ShoppingCartIcon, BookOpenIcon } from '@heroicons/react/24/outline';
// @ts-ignore
import avo_pic from "../assets/images/avo_profile.png";

interface NavBarProps {
  name?: string;
  handleLogout?: () => void;
}

export default function NavBar({ name, handleLogout }: NavBarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      route: '/home',
    },
    {
      name: 'Track',
      icon: ClipboardDocumentListIcon,
      route: '/tracker',
    },
    {
      name: 'Recipes',
      icon: BookOpenIcon,
      route: '/recipes',
    },
    {
      name: 'Grocery List',
      icon: ShoppingCartIcon,
      route: '/grocery',
    },
    // Profile and Friends will be in a top dropdown
  ];

  // For centering, split tabs and insert avocado in the middle
  // We need 2 tabs on the left and 2 on the right to keep avocado centered with 4 tabs total
  const leftTabs = tabs.slice(0, 2);
  const rightTabs = tabs.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-white shadow-lg pt-2 pb-4 px-4">
      <div className="flex justify-around items-center h-full">
        {/* Left tabs */}
        {leftTabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.route)}
            className={`flex flex-col items-center flex-1 py-1 px-2 rounded-lg transition-all duration-300 ${location.pathname === tab.route ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-primary-500'}`}
          >
            <tab.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium whitespace-nowrap">{tab.name}</span>
          </button>
        ))}

        {/* Avocado tab (center, big, floating) */}
        <button
          onClick={() => navigate('/home')}
          className="relative z-10 flex flex-col items-center justify-center mx-4 group"
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-200 shadow-lg border-4 border-white flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl">
            <img src={avo_pic} alt="Avocado" className="w-14 h-14 rounded-full" />
          </div>
        </button>

        {/* Right tabs */}
        {rightTabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.route)}
            className={`flex flex-col items-center flex-1 py-1 px-2 rounded-lg transition-all duration-300 ${location.pathname === tab.route ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-primary-500'}`}
          >
            <tab.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium whitespace-nowrap">{tab.name}</span>
          </button>
        ))}
      </div>
      
      {/* User profile info */}
      {name && (
        <div className="absolute top-2 right-4 flex items-center">
          <span className="text-sm mr-2">{name}</span>
          {handleLogout && (
            <button 
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
