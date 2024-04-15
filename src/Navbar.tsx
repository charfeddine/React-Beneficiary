import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.css";
import Dropdown from "react-bootstrap/Dropdown";

import { Link } from "react-router-dom";
import logo from "./logo.svg";
import { auth } from "./config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const signUserOut = async () => {
    await signOut(auth);
    navigate("/signIn");
  };
  return (
    <div>
      {user && (
        <nav className="navbar navbar-expand-lg navbar-light bg-body-tertiary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img
                src={logo}
                className="d-inline-block align-top"
                alt="logo"
                width="50"
                height="50"
              />
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <Link className="nav-link" to="/">
                    Home <span className="sr-only">(current)</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/list-beneficiary">
                    List Beneficiaries
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-beneficiary">
                    Add Beneficiary
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/person">
                    Person
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div className="d-flex align-items-center">
              <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <img
                    src={
                      user?.photoURL ||
                      "https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                    }
                    className="rounded-circle"
                    height="30"
                    alt=""
                    loading="lazy"
                  />
                  {user?.displayName}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action 1</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={signUserOut}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};
