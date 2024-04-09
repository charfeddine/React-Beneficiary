import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Person } from "./pages/Person";
import { Home } from "./pages/Home";
import { Country } from "./models/PersonProps";
import { Navbar } from "./Navbar";
import CreateBineficiary from "./pages/Bineficiary/create-beneficiary/CreateBineficiary";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import { Login } from "./pages/auth/login";
import { ListBeneficiaries } from "./pages/Bineficiary/list-beneficiaries/list-beneficiaries";
import SignIn from "./pages/auth/SignIn";
import { Switch } from "@mui/material";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/" element={<Home />} />
            <Route path="/list-beneficiary" element={<ListBeneficiaries />} />
            <Route path="/add-beneficiary" element={<CreateBineficiary />} />
            <Route
              path="/edit-beneficiary/:id"
              element={<CreateBineficiary />}
            />
            <Route
              path="/person"
              element={
                <Person
                  name="test"
                  email="test@gmail.com"
                  country={Country.France}
                  age={21}
                  isMarried={true}
                  friends={["f1", "f2", "f3"]}
                />
              }
            />
            <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
          </Routes>
        </Router>
      </Provider>
    </div>
  );
}

export default App;
