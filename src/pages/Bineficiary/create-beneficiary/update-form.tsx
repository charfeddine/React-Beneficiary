import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { Beneficiary, Countries } from "../../../models/Beneficiary";
import { useBeneficiaryService } from "../../../services/beneficiaryService";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { Formik } from "formik";

interface BeneficiaryFormProps {
  beneficiaryId?: string;
}
const initialeBeneficiary: Beneficiary = {
  id: uuidv4(),
  nickName: "",
  fullName: "",
  accountNumber: "",
  bankInfo: {
    bankName: "",
    swiftCode: "",
    branchName: "",
    branchAddress: "",
  },
  address: {
    country: "",
    street: "",
  },
  phoneNumber: "",
  email: "",
  notificationEnabled: true,
  createdBy: "",
  userId: "",
};
export const UpdateForm = (props: BeneficiaryFormProps) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const beneficiaryService = useBeneficiaryService();
  const [formData, setFormData] = useState<Beneficiary>(initialeBeneficiary);
  // const initialValues: Beneficiary = props.beneficiary || formData;
  const [selectedCountry, setSelectedCountry] = useState<Countries | null>(
    null
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchData() {
      console.log(props.beneficiaryId);
      if (props.beneficiaryId) {
        const dummyBeneficiary: Beneficiary =
          await beneficiaryService.getBeneficiary(props.beneficiaryId);
        setFormData(dummyBeneficiary);
        const countryValue = getValueByKey(
          Countries,
          dummyBeneficiary.address.country.toString()
        );
        setSelectedCountryCode(countryValue || "");
      } else {
        setFormData(initialeBeneficiary);
      }
    }
    fetchData();
  }, [beneficiaryService, props.beneficiaryId]);
  function getValueByKey(enumObj: any, key: string): string | undefined {
    return enumObj[key];
  }

  const validationSchema = yup.object().shape({
    nickName: yup.string().min(3).required("nickName is required !!!"),
    fullName: yup.string().required(),
    accountNumber: yup.string().required(),
    address: yup.object().shape({
      street: yup.string().required("adress is required"),
      country: yup.string().required("country is required"),
    }),

    phoneNumber: yup.string().required(),
    email: yup.string().email().required(),
    bankInfo: yup.object().shape({
      bankName: yup.string().required("bankName is required"),
      swiftCode: yup.string().required("swiftCode is required"),
      branchName: yup.string().required("branchName is required"),
      branchAdress: yup.string().required("branchAdress is required"),
    }),
  });
  const handleSubmit = (values: Beneficiary) => {
    onSubmit(values);
  };

  // const {
  //   register,
  //   handleSubmit,
  //   formState: { errors },
  // } = useForm<Beneficiary>({
  //   resolver: yupResolver(schema),
  // });

  const onSubmit = async (data: Beneficiary) => {
    if (props.beneficiaryId) {
      console.log(data);
    } else {
      console.log(data);
      const newBeneficiary: Beneficiary = {
        id: uuidv4(),
        nickName: data.nickName,
        fullName: data.fullName,
        accountNumber: data.accountNumber,
        bankInfo: {
          bankName: data.bankInfo.bankName,
          swiftCode: data.bankInfo.swiftCode,
          branchName: data.bankInfo.branchName,
          branchAddress: data.bankInfo.branchAddress,
        },
        address: {
          country: selectedCountry || "",
          street: data.address.street,
        },
        phoneNumber: data.phoneNumber,
        email: data.email,
        notificationEnabled: true,
        createdBy: user?.displayName,
        userId: user?.uid,
      };
      console.log(newBeneficiary);
      await beneficiaryService.addOrEditBeneficiary(newBeneficiary);
    }
    navigate("/list-beneficiary");
  };
  // Function to handle selection change
  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountryValue = event.target.value as Countries;
    setSelectedCountry(selectedCountryValue);
    const selectedOption = event.target.selectedOptions[0];
    const selectedCountryKey = selectedOption.getAttribute("id");
    setSelectedCountryCode(selectedCountryKey);
  };
  const handleCountryCodeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedCountryValue = event.target.value as Countries;
    setSelectedCountryCode(selectedCountryValue);
  };
  const handleChange = (event: any) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Formik
      initialValues={formData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {(propsFormik) => (
        <form
        //  onSubmit={handleSubmit(onSubmit)}
        >
          <h2>
            {props.beneficiaryId ? "Edit Beneficiary" : "Create Beneficiary"}
          </h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nickName">NickName *</label>
              <input
                type="text"
                className="form-control"
                id="nickName"
                value={formData.nickName}
                required
              />

              <div className="invalid-feedback"></div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="fullname">Full name/Social Reason *</label>
              <input
                type="text"
                className="form-control"
                id="fullname"
                placeholder=""
                required
                value={formData.fullName}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                Valid Full name/Social Reason is required.
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="country">Country</label>
                  <select
                    className="custom-select d-block w-100"
                    id="country"
                    onChange={handleCountryChange}
                    value={selectedCountry || formData.address.country}
                  >
                    <option value="">Select...</option>
                    {Object.entries(Countries).map((entry) => {
                      return (
                        <option key={entry[1]} id={entry[1]} value={entry[0]}>
                          {entry[0]}
                        </option>
                      );
                    })}
                  </select>

                  <div className="invalid-feedback">
                    Please select a valid country.
                  </div>
                </div>
                <div className="col-md-8 mb-3">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    placeholder="1234 Main St"
                    required
                    // value={formData.address.street || undefined}
                    // onChange={handleChange}
                  />
                  <div className="invalid-feedback">
                    Please enter your address.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="accountNumber">Account Number *</label>
              <input
                type="text"
                className="form-control"
                id="accountNumber"
                placeholder="xxxxxxxxxxxxxxxxxxxxx"
                required
                value={formData.accountNumber}
                onChange={handleChange}
              />
              <div className="invalid-feedback">account Number required.</div>
            </div>
          </div>

          <hr className="mb-3" />
          <h4 className="mb-3">Notification</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label htmlFor="country">Phone number</label>
                  <select
                    className="custom-select d-block w-100"
                    onChange={handleCountryCodeChange}
                    id="areacode"
                    value={selectedCountryCode || ""}
                  >
                    <option value="">Select...</option>
                    {Object.values(Countries).map((countryCode, index) => (
                      <option key={index} value={countryCode}>
                        {countryCode}
                      </option>
                    ))}
                  </select>

                  <div className="invalid-feedback">
                    Please select a valid code.
                  </div>
                </div>
                <div className="col-md-8 mb-3">
                  <label htmlFor="phoneNumber"> </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phoneNumber"
                    placeholder=""
                    required
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  {/* <p> {errors.phoneNumber?.message}</p> */}
                  <div className="invalid-feedback">
                    Please enter your phone number.
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="email">
                Email <span className="text-muted">(Optional)</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>
          </div>

          <hr className="mb-4" />
          <h4 className="mb-3">Bank Information</h4>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="bankName">Bank Name *</label>
              <input
                type="text"
                className="form-control"
                id="bankName"
                name="bankInfo.bankName"
                placeholder=""
                value={formData.bankInfo.bankName}
                onChange={handleChange}
              />

              <div className="invalid-feedback">Bank Name is required</div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="swiftCode">swift Code *</label>
              <input
                type="text"
                className="form-control"
                id="swiftCode"
                name="bankInfo.swiftCode"
                placeholder=""
                value={formData.bankInfo.swiftCode || ""}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                Credit swift Code is required
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="branchName">Branch Name *</label>
              <input
                type="text"
                className="form-control"
                id="branchName"
                name="bankInfo.branchName"
                placeholder=""
                value={formData.bankInfo.branchName}
                onChange={handleChange}
              />

              <div className="invalid-feedback">branch Name is required</div>
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="branchAdress">branch adress *</label>
              <input
                type="text"
                className="form-control"
                id="branchAdress"
                name="bankInfo.branchAdress"
                placeholder=""
                value={formData.bankInfo.branchAddress}
                onChange={handleChange}
              />
              <div className="invalid-feedback">
                Credit branch adress is required
              </div>
            </div>
          </div>
          <hr className="mb-4" />
          <div className="py-8 text-center">
            <button
              className="btn btn-secondary btn-lg btn-block"
              onClick={() => {
                alert("Cancel is succeed!");
              }}
            >
              Cancel
            </button>{" "}
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              disabled={propsFormik.isSubmitting}
            >
              {props.beneficiaryId ? "Save" : "Create"}
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};
