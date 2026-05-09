import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import AuthenticatedRoute from './utils/AuthenticatedRoute';
import IntroPage from './pages/IntroPage';
import Signup from './pages/Signup';
import SignInPage from './pages/SignInPage';
import BookLandingPage from './pages/BookLandingPage';
import { SpinProvider } from "./context/SpinContext";
import FanartPage from './pages/FanartPage';
import ProfilePage from './pages/ProfilePage';
import WrappedHome from './pages/Wrapped/WrappedPage';
import DiscoverBookPage from './pages/DiscoverBookPage';
import RentOnlyPage from './pages/RentOnlyPage';
import BuyOnlyPage from './pages/BuyOnlyPage';
import DiscoverPeoplePage from './pages/DiscoverPeoplePage';
import PostsPage from './pages/PostsPage';
import RentBuyPage from './pages/RentBuyPage';
import RentDetailsPage from './pages/RentDetailsPage';
import BuyDetailsPage from './pages/BuyDetailsPage';
import RentForm from './pages/RentForm';
import SellForm from './pages/SellForm'; // Import SellForm component

function App() {
  return (
    <Router>
      <AuthProvider>
        <SpinProvider>
          <Header />
          <Routes>
            {/* Auth & Public Routes */}
            <Route path="/signup"               element={<Signup />} />
            <Route path="/login"                element={<SignInPage />} />
            <Route path="/"                     element={<IntroPage />} />
            
            {/* Main App Routes */}
            <Route path="/home"                 element={<HomePage />} />
            <Route path="/booklanding"          element={<BookLandingPage />} />
            <Route path="/fanart"               element={<FanartPage />} />
            
            {/* Profile Routes - Updated */}
            <Route path='/ProfilePage'          element={<ProfilePage />} />
            {/* New route to support viewing profiles by ID */}
            <Route path='/ProfilePage/:id'      element={<ProfilePage />} />
            
            {/* Other App Routes */}
            <Route path='/wrapped'              element={<WrappedHome />} />
            <Route path='/discover-books'       element={<DiscoverBookPage />} />
            <Route path='/discover-people'      element={<DiscoverPeoplePage />} />
            <Route path='/rent-only'            element={<RentOnlyPage />} />
            <Route path='/buy-only'             element={<BuyOnlyPage />} />
            <Route path='/posts'                element={<PostsPage />} />
            <Route path='/rent-buy'             element={<RentBuyPage />} />
            <Route path='/rent-details'         element={<RentDetailsPage />} />
            <Route path="/rent-details/:rentId" element={<RentDetailsPage />} />
            <Route path='/rent-form'            element={<RentForm />} />
            <Route path='/sell-form'            element={<SellForm />} /> {/* Added SellForm route */}
          </Routes>
        </SpinProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;