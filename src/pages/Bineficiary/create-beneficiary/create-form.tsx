import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Beneficiary,
  Countries,
  CreateFormData,
} from "../../../models/Beneficiary";
import { useBeneficiaryService } from "../../../services/beneficiaryService";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useState } from "react";
import { useAsyncEffect } from "../../../hooks/async-effect.hook";

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
export const CreateForm = (props: BeneficiaryFormProps) => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const beneficiaryService = useBeneficiaryService();

  const [formData, setFormData] = useState<Beneficiary>(initialeBeneficiary);
  const [selectedCountry, setSelectedCountry] = useState<Countries | null>(
    null
  );
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null
  );

  useAsyncEffect(async () => {
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
  }, []);

  // useEffect(() => {
  //   fetchData();
  // }, [props.beneficiaryId]);

  function getValueByKey(enumObj: any, key: string): string | undefined {
    return enumObj[key];
  }

  const schema = yup.object().shape({
    nickName: yup.string().min(3).required("nickName is required !!!"),
    fullName: yup.string().required(),
    accountNumber: yup.string().required(),
    // address: yup.object().shape({
    street: yup.string().required("adress is required"),
    country: yup.string().required("country is required"),
    // }),

    phoneNumber: yup.string().required(),
    email: yup.string().email().required(),
    // bankInfo: yup.object().shape({
    bankName: yup.string().required("bankName is required"),
    swiftCode: yup.string().required("swiftCode is required"),
    branchName: yup.string().required("branchName is required"),
    branchAddress: yup.string().required("branchAdress is required"),
    // }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: CreateFormData) => {
    const newBeneficiary: Beneficiary = {
      id: uuidv4(),
      nickName: data.nickName,
      fullName: data.fullName,
      accountNumber: data.accountNumber,
      bankInfo: {
        bankName: data.bankName,
        swiftCode: data.swiftCode,
        branchName: data.branchName,
        branchAddress: data.branchAddress,
      },
      address: {
        country: selectedCountry || "",
        street: data.street,
      },
      phoneNumber: data.phoneNumber,
      email: data.email,
      notificationEnabled: true,
      createdBy: user?.displayName,
      userId: user?.uid,
    };
    if (props.beneficiaryId) {
      newBeneficiary.id = props.beneficiaryId;
      await beneficiaryService.addOrEditBeneficiary(newBeneficiary, "edit");
    } else {
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevBeneficiary) => ({
      ...prevBeneficiary,
      address: {
        ...prevBeneficiary.address,
        [name]: value,
      },
    }));
  };
  const handleBankInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevBeneficiary) => ({
      ...prevBeneficiary,
      bankInfo: {
        ...prevBeneficiary.bankInfo,
        [name]: value,
      },
    }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="nickName">NickName *</label>
          <input
            type="text"
            className="form-control"
            id="nickName"
            placeholder=""
            required
            {...register("nickName")}
            value={formData?.nickName}
            onChange={handleChange}
          />

          <p> {errors.nickName?.message}</p>
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
            {...register("fullName")}
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
                {...register("country")}
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
              <label htmlFor="street">Address</label>
              <input
                type="text"
                className="form-control"
                id="street"
                placeholder="1234 Main St"
                required
                {...register("street")}
                value={formData.address.street || ""}
                onChange={handleAddressChange}
              />

              <div className="invalid-feedback">Please enter your address.</div>
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
            {...register("accountNumber")}
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
                {...register("phoneNumber")}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              <p> {errors.phoneNumber?.message}</p>
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
            {...register("email")}
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
            placeholder=""
            {...register("bankName")}
            value={formData?.bankInfo?.bankName}
            onChange={handleBankInfoChange}
          />

          <div className="invalid-feedback">Bank Name is required</div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="swiftCode">swift Code *</label>
          <input
            type="text"
            className="form-control"
            id="swiftCode"
            placeholder=""
            {...register("swiftCode")}
            value={formData.bankInfo.swiftCode}
            onChange={handleBankInfoChange}
          />
          <div className="invalid-feedback">Credit swift Code is required</div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="branchName">Branch Name *</label>
          <input
            type="text"
            className="form-control"
            id="branchName"
            placeholder=""
            {...register("branchName")}
            value={formData.bankInfo.branchName}
            onChange={handleBankInfoChange}
          />

          <div className="invalid-feedback">branch Name is required</div>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="branchAdress">branch adress *</label>
          <input
            type="text"
            className="form-control"
            id="branchAdress"
            placeholder=""
            {...register("branchAddress")}
            value={formData.bankInfo.branchAddress}
            onChange={handleBankInfoChange}
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
        <button className="btn btn-primary btn-lg btn-block" type="submit">
          {props.beneficiaryId ? "Save" : "Create"}
        </button>
      </div>
    </form>
  );
};
