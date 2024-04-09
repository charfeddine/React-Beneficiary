import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Beneficiary as IBeneficiary } from "../../../models/Beneficiary";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
interface Props {
  beneficiary: IBeneficiary;
  index: number;
  deleteBeneficiary: any;
}

export const BeneficiaryItem = (props: Props) => {
  const { beneficiary, index } = props;
  const navigate = useNavigate();

  function handleUpdate(id: string): void {
    navigate(`/edit-beneficiary/${id}`);
  }
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
          onClick={() => props.deleteBeneficiary(beneficiary.id)}
        >
          <Trash />
        </Button>{" "}
        <Button variant="primary" onClick={() => handleUpdate(beneficiary.id)}>
          <PencilSquare />
        </Button>
      </td>
    </tr>
  );
};
