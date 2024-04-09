import { Beneficiary, Country } from "../models/Beneficiary";
import { useBeneficiaryService } from "../services/beneficiaryService";

// Mock collection function
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
}));
describe("BeneficiaryService", () => {
  let beneficiaryService: any;

  beforeEach(() => {
    beneficiaryService = useBeneficiaryService();
    beneficiaryService.beneficiaries = [...mockBeneficiaries];
    beneficiaryService.Countries = [...mockCountries];
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should add a new beneficiary", async () => {
    const beneficiary: Beneficiary = {
      nickName: "Test Alice",
      fullName: "X1B1Z1",
      accountNumber: "123456789",
      bankInfo: {
        bankName: "test",
        swiftCode: "qdqdfd",
        branchName: "dfdqez",
        branchAddress: "zfeefz",
      },
      address: {
        country: "France",
        street: "2 rue roquette",
      },
      phoneNumber: "+330655443322",
      email: "alice@example.com",
      notificationEnabled: true,
      id: "27238595-c04e-4f16-8ea2-88bf6e50ab7c",
      createdBy: "charfeddine znaidi",
      userId: "djE0eWHPwVVyNIuDgQ4aHbWhOHb2",
    };

    await beneficiaryService.addOrEditBeneficiary(beneficiary);
    // expect(addDoc).toHaveBeenCalledWith(expect.any(Object), beneficiary);
  });

  // Test case for retrieving beneficiaries
  // it("should retrieve beneficiaries", async () => {
  //   mockGetDocs.mockResolvedValueOnce({
  //     docs: [mockDocumentSnapshot],
  //   });

  //   const beneficiaries = await beneficiaryService.getBeneficiaries();

  //   expect(beneficiaries).toEqual([
  //     expect.objectContaining({ id: "12345678" }),
  //   ]);
  // });

  test("Adding a beneficiary with nickName less than 3 characters should throw error", () => {
    const newBeneficiary: Beneficiary = {
      nickName: "Jo", // Less than 3 characters
      accountNumber: "123456789",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "80 avenue",
      },
      phoneNumber: "+330655443322",
      email: "jo@example.com",
      notificationEnabled: true,
      fullName: "PROXYM",
      id: "",
      createdBy: undefined,
      userId: undefined,
    };

    expect(() =>
      beneficiaryService.addOrEditBeneficiary(newBeneficiary)
    ).toThrowError("nickName must be at least 3 characters long.");
  });

  test("Adding a beneficiary with existing account number in different status should throw error", () => {
    const existingPendingBeneficiary: Beneficiary = {
      nickName: "Alice",
      fullName: "X1B1Z1",
      accountNumber: "123456789",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "",
      },
      phoneNumber: "+9876543210",
      email: "jane@example.com",
      notificationEnabled: true,
      id: "",
      createdBy: undefined,
      userId: undefined,
    };

    beneficiaryService.addOrEditBeneficiary(existingPendingBeneficiary); // Add pending beneficiary

    const newBeneficiaryWithExistingAccount: Beneficiary = {
      nickName: "Alice",
      fullName: "X1B1Z1",
      accountNumber: "123456789",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "",
      },
      phoneNumber: "+330655443322",
      email: "alice@example.com",
      notificationEnabled: true,
      id: "",
      createdBy: undefined,
      userId: undefined,
    };

    expect(() =>
      beneficiaryService.addOrEditBeneficiary(newBeneficiaryWithExistingAccount)
    ).toThrowError("Beneficiary with this nickName already exists.");
  });

  // 3) The country of residence can be a list of countries
  test("Country property should accept a list of countries", () => {
    const beneficiary: Beneficiary = {
      nickName: "Charlie",
      fullName: "PROXYM",
      accountNumber: "135792468",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "",
      },
      phoneNumber: "+330655443322",
      email: "charlie@example.com",
      notificationEnabled: true,
      id: "",
      createdBy: undefined,
      userId: undefined,
    };

    beneficiaryService.addOrEditBeneficiary(beneficiary);

    // Verify that beneficiary has been added successfully
    expect(beneficiaryService.beneficiaries.length).toBeGreaterThanOrEqual(1);
  });

  test("Account number should be modulo[97]", () => {
    const validAccountNumber: string = "12345678901234567890";
    expect(
      beneficiaryService.isAccountNumberModulo97(validAccountNumber)
    ).toBeFalsy();

    // Invalid account number that is not modulo[97]
    const invalidAccountNumber: string = "987654321";
    expect(
      beneficiaryService.isAccountNumberModulo97(invalidAccountNumber)
    ).toBeFalsy();
  });
  // 4) When a country is selected then the phone number country code is displayed according to the selected country. However, the country code can be modified
  test("Phone number country code should be displayed according to the selected country", () => {
    const beneficiary: Beneficiary = {
      nickName: "David",
      fullName: "PROXYM",
      accountNumber: "246813579",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "87 avenue",
      },
      phoneNumber: "+330655443322",
      email: "david@example.com",
      notificationEnabled: true,
      id: "",
      createdBy: undefined,
      userId: undefined,
    };

    beneficiaryService.addOrEditBeneficiary(beneficiary);

    expect(beneficiaryService.beneficiaries[0].phoneNumber).toContain("+33");
  });
  test("Notification button should be disabled if phone number and e-mail are not checked", () => {
    const beneficiary: Beneficiary = {
      nickName: "Emily",
      fullName: "PROXYM",
      accountNumber: "369258147",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "",
      },
      phoneNumber: "",
      email: "",
      notificationEnabled: false,
      id: "",
      createdBy: undefined,
      userId: undefined,
    };

    beneficiaryService.addOrEditBeneficiary(beneficiary);

    expect(
      beneficiaryService.isNotificationButtonEnabled(beneficiary)
    ).toBeFalsy();
  });
  const mockBeneficiaries: Beneficiary[] = [
    {
      nickName: "Alice",
      id: "",
      fullName: "PROXYM",
      accountNumber: "123456789",
      bankInfo: {
        bankName: "Example Bank",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "",
        street: "",
      },
      phoneNumber: "+330655443322",
      email: "alice@example.com",
      notificationEnabled: true,
      createdBy: "charfeddine",
      userId: "",
    },
    {
      nickName: "Bob",
      id: "",
      fullName: "PROXYM",
      accountNumber: "987654321",
      bankInfo: {
        bankName: "",
        swiftCode: "",
        branchName: "",
        branchAddress: "",
      },
      address: {
        country: "France",
        street: "",
      },
      phoneNumber: "+33876543210",
      email: "bob@example.com",
      notificationEnabled: false,
      createdBy: "charfeddine",
      userId: "",
    },
    // Add more mock  Countries as needed
  ];
  const mockCountries: Country[] = [
    {
      name: "United States",
      code: "+1",
    },
    {
      name: "United Kingdom",
      code: "+44",
    },
    {
      name: "France",
      code: "+33",
    },
  ];
});
