import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon, ClipboardDocumentListIcon, ShoppingCartIcon, BookOpenIcon } from '@heroicons/react/24/outline';
// @ts-ignore
import avo_pic from "../assets/images/avo_profile.png";

export default function NavBar() {
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
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4">
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl px-6 py-2 border border-primary-100">
        {/* Left tabs */}
        {leftTabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.route)}
            className={`flex flex-col items-center flex-1 py-2 px-3 transition ${location.pathname === tab.route ? 'text-primary-600' : 'text-gray-400 hover:text-primary-500'}`}
          >
            <tab.icon className="w-7 h-7 mb-1" />
            <span className="text-xs font-medium whitespace-nowrap">{tab.name}</span>
          </button>
        ))}

        {/* Avocado tab (center, big, floating) */}
        <button
          onClick={() => navigate('/home')}
          className="relative z-10 flex flex-col items-center justify-center"
          style={{ minWidth: 72 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-400 to-primary-200 shadow-lg border-4 border-primary-600 flex items-center justify-center">
            <img src={avo_pic} alt="Avocado" className="w-14 h-14 rounded-full" />
          </div>
        </button>

        {/* Right tabs */}
        {rightTabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => navigate(tab.route)}
            className={`flex flex-col items-center flex-1 py-2 px-3 transition ${location.pathname === tab.route ? 'text-primary-600' : 'text-gray-400 hover:text-primary-500'}`}
          >
            <tab.icon className="w-7 h-7 mb-1" />
            <span className="text-xs font-medium whitespace-nowrap">{tab.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
