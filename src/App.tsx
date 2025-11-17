import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useInvoiceStore } from './store/invoiceStore';
import { useClientStore } from './store/clientStore';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/ui/Toast';

// Auth pages
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ForgotPasswordPage from './features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';

// Feature pages (lazy loaded)
import { lazy, Suspense, useEffect } from 'react';

const DashboardPage = lazy(() => import('./features/dashboard/pages/DashboardPage'));
const KpiPanelPage = lazy(() => import('./features/dashboard/pages/KpiPanelPage'));
const InvoicesListPage = lazy(() => import('./features/invoices/pages/InvoicesListPage'));
const InvoiceDetailPage = lazy(() => import('./features/invoices/pages/InvoiceDetailPage'));
const NewInvoicePage = lazy(() => import('./features/invoices/pages/NewInvoicePage'));
const RecycleBinPage = lazy(() => import('./features/invoices/pages/RecycleBinPage'));
const CsvUploadPage = lazy(() => import('./features/csv-upload/pages/CsvUploadPage'));
const AiAutomationPage = lazy(() => import('./features/ai-automation/pages/AiAutomationPage'));
const AiHelpPage = lazy(() => import('./features/ai-automation/pages/AiHelpPage'));
const SettingsPage = lazy(() => import('./features/settings/pages/SettingsPage'));

/**
 * Protected route wrapper
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Loading fallback component
 */
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-bg">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Kraunama...</p>
      </div>
    </div>
  );
}

/**
 * Data initialization component
 * Fetches data and subscribes to real-time changes
 */
function DataInitializer() {
  const fetchInvoices = useInvoiceStore((state) => state.fetchInvoices);
  const subscribeToInvoiceChanges = useInvoiceStore((state) => state.subscribeToChanges);
  const fetchClients = useClientStore((state) => state.fetchClients);
  const subscribeToClientChanges = useClientStore((state) => state.subscribeToChanges);

  useEffect(() => {
    // Fetch initial data
    fetchInvoices();
    fetchClients();

    // Subscribe to real-time changes
    const unsubscribeInvoices = subscribeToInvoiceChanges();
    const unsubscribeClients = subscribeToClientChanges();

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeInvoices();
      unsubscribeClients();
    };
  }, [fetchInvoices, subscribeToInvoiceChanges, fetchClients, subscribeToClientChanges]);

  return null;
}

/**
 * Main App component with routing
 */
function App() {
  return (
    <BrowserRouter>
      <DataInitializer />
      <ToastContainer />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="kpi-panel"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <KpiPanelPage />
              </Suspense>
            }
          />
          <Route
            path="invoices"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <InvoicesListPage />
              </Suspense>
            }
          />
          <Route
            path="invoices/new"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <NewInvoicePage />
              </Suspense>
            }
          />
          <Route
            path="invoices/:id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <InvoiceDetailPage />
              </Suspense>
            }
          />
          <Route
            path="recycle-bin"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <RecycleBinPage />
              </Suspense>
            }
          />
          <Route
            path="csv-upload"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <CsvUploadPage />
              </Suspense>
            }
          />
          <Route
            path="ai-automation/:tab"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AiAutomationPage />
              </Suspense>
            }
          />
          <Route
            path="settings"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <SettingsPage />
              </Suspense>
            }
          />
          
          {/* Placeholder routes for sidebar items */}
          <Route path="expenses" element={<div className="p-6">Išlaidos - Coming Soon</div>} />
          <Route
            path="ai-help"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <AiHelpPage />
              </Suspense>
            }
          />
          <Route path="team" element={<div className="p-6">Komanda - Coming Soon</div>} />
          <Route path="help" element={<div className="p-6">Pagalba - Coming Soon</div>} />
          <Route path="privacy" element={<div className="p-6">Privatumo politika - Coming Soon</div>} />
          <Route path="terms" element={<div className="p-6">Naudojimo Sąlygos - Coming Soon</div>} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

