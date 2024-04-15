import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Beneficiary as IBeneficiary } from "../../../models/Beneficiary";
import { Button } from "react-bootstrap";
interface Props {
  beneficiary: IBeneficiary;
  index: number;
  updateBeneficiary: any;
  deleteBeneficiary: any;
}

export const BeneficiaryItem = ({
  beneficiary,
  index,
  updateBeneficiary,
  deleteBeneficiary,
}: Props) => {
  return (
    <tr key={index}>
      <td>{index + 1}</td>
      <td>{beneficiary.nickName}</td>
      <td>{beneficiary.email}</td>
      <td>{beneficiary.accountNumber}</td>
      <td>{beneficiary.bankInfo.bankName}</td>
      <td>{beneficiary.createdBy}</td>
      <td>
        <Button
          variant="danger"
          onClick={() => deleteBeneficiary(beneficiary.id)}
        >
          <Trash />
        </Button>{" "}
        <Button
          variant="primary"
          onClick={() => updateBeneficiary(beneficiary.id)}
        >
          <PencilSquare />
        </Button>
      </td>
    </tr>
  );
};
