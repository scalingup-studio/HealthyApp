import React from "react";
import ReactDOM from "react-dom/client";
import { LoginPage } from "./pages/Login.jsx";
import { SignupPage } from "./pages/Signup.jsx";

function Artwork() {
  return (
    <aside className="artwork">
      <img
        src="https://ec6e1b45022cd081d4bf05b7b20ff381.cdn.bubble.io/f1736281035365x862458603754812200/img%20%285%29.svg"
        alt="HealthyApp Illustration"
        style={{maxWidth: "90%", height: "auto"}}
      />
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


