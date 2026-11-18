import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CatalogProvider } from './context/CatalogContext'
import { OrderProvider } from './context/OrderContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { AddressProvider } from './context/AddressContext'
import SplashPage from './pages/SplashPage'
import WelcomePage from './pages/WelcomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ConfirmationPage from './pages/ConfirmationPage'
import MainLayout from './components/MainLayout'
import HomePage from './pages/HomePage'
import FavoritesPage from './pages/FavoritesPage'
import CalendarPage from './pages/CalendarPage'
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import ManageProfilePage from './pages/ManageProfilePage'
import AddressesPage from './pages/AddressesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import MyServicesPage from './pages/MyServicesPage'
import CreateServicePage from './pages/CreateServicePage'

function AppRoutes() {
  const { user, isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return <SplashPage />
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    )
  }

  return (
    <CatalogProvider>
      <OrderProvider>
        <FavoritesProvider>
          <AddressProvider>
            <Routes>
              <Route element={<MainLayout user={user!} />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/manage-profile" element={<ManageProfilePage />} />
              <Route path="/addresses" element={<AddressesPage />} />
              <Route path="/service/:id" element={<ServiceDetailPage />} />
              <Route path="/my-services" element={<MyServicesPage />} />
              <Route path="/create-service" element={<CreateServicePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AddressProvider>
        </FavoritesProvider>
      </OrderProvider>
    </CatalogProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
