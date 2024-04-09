import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../../logo.svg";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "../../../config/firebase";
import { CreateForm } from "./create-form";

export const CreateBineficiary = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  if (!user?.uid) {
    navigate("/signIn");
  }
  let { id } = useParams();
  return (
    <div className="container">
      <div className="py-5 text-center">
        <img
          src={logo}
          className="d-block mx-auto mb-4"
          alt=""
          width="100"
          height="100"
        />
        <p className="lead">
          {" "}
          {id ? "Edit Beneficiary Form" : "Create Beneficiary"}
        </p>
      </div>

      <div className="row">
        <div className="row">
          <div className="col-md-6 order-md-1 custom-control custom-radio">
            <input
              id="dataManually"
              name="dataManually"
              type="radio"
              className="custom-control-input"
              required
            />{" "}
            <label className="custom-control-label" htmlFor="dataManually">
              Enter data manually
            </label>
          </div>
          <div className="col-md-6 order-md-1 custom-control custom-radio">
            <input
              id="datafile"
              name="datafile"
              type="radio"
              className="custom-control-input"
              required
            />{" "}
            <label className="custom-control-label" htmlFor="datafile">
              Add Beneficiary from a file
            </label>
          </div>
        </div>
        <br />
        <br />
        <div className="col-md-12 order-md-1">
          <CreateForm beneficiaryId={id} />
        </div>
      </div>
    </div>
  );
};
export default CreateBineficiary;
