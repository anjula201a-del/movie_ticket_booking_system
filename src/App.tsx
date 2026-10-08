import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import AdminAllow from "./components/auth/AdminAllow";
import { LogIn } from "./components/auth/LogIn";
import { SignUp } from "./components/auth/SignUp";
import { NavBar } from "./components/navbar/NavBar";
import { NotFound } from "./components/other/NotFound";
import { NotAdmin } from "./components/other/NotAdmin";
import { MovieView } from "./components/movie/MovieView";
import { MovieDetails } from "./components/movie/MovieDetails";
import { TheatreView } from "./components/theatre/TheatreView";
import { ShowView } from "./components/show/ShowView";
import { SeatSelection } from "./components/booking/SeatSelection";
import { BookingView } from "./components/booking/BookingView";
import { PaymentView } from "./components/payment/PaymentView";
import { UserView } from "./components/User/UserView";

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LogIn />} />
        <Route path="/sign-in" element={<LogIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/NotAdmin" element={<NotAdmin />} />

        {/* Any logged-in user */}
        <Route path="/movies" element={<AdminAllow><MovieView /></AdminAllow>} />
        <Route path="/movies/:movieId" element={<AdminAllow><MovieDetails /></AdminAllow>} />
        <Route path="/theatres" element={<AdminAllow><TheatreView /></AdminAllow>} />
        <Route path="/shows" element={<AdminAllow><ShowView /></AdminAllow>} />
        <Route path="/shows/:showId/book" element={<AdminAllow><SeatSelection /></AdminAllow>} />
        <Route path="/bookings" element={<AdminAllow><BookingView /></AdminAllow>} />
        <Route path="/payments" element={<AdminAllow><PaymentView /></AdminAllow>} />

        <Route
          path="/users"
          element={
            <AdminAllow allowedRoles={["ADMIN"]}>
              <UserView />
            </AdminAllow>
          }
        />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;