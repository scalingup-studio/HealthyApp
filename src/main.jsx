import React from "react";
import ReactDOM from "react-dom/client";
import { LoginPage } from "./pages/Login.jsx";
import { SignupPage } from "./pages/Signup.jsx";

function Artwork() {
  return (
    <aside className="artwork">
      <div className="placeholder">
        <div className="x-line"></div>
        <div className="x-line"></div>
      </div>
    </aside>
  );
}

function App() {
  const [signupOpen, setSignupOpen] = React.useState(false);
  return (
    <main className="auth-layout">
      <LoginPage onOpenSignup={()=>setSignupOpen(true)} />
      <Artwork />
      {signupOpen ? <SignupPage onClose={()=>setSignupOpen(false)} /> : null}
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);


