import "bootstrap/dist/css/bootstrap.min.css";
import { useBeneficiaryService } from "../../../services/beneficiaryService";
import { Table } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeneficiaryItem } from "./BeneficiaryItem";
import { Beneficiary } from "../../../models/Beneficiary";

export const ListBeneficiaries = () => {
  const beneficiaryService = useBeneficiaryService();
  const navigate = useNavigate();
  const [beneficiaries] = useState<Beneficiary[]>([]);
  const [state, setState] = useState({
    data: beneficiaries || null,
    limit: 10,
    activePage: 1,
  });
  const fetchbeneficiariesData = async () => {
    const data = beneficiaryService.getDetailsBeneficiaries();
    const currentdItems = await data;
    setState((prev) => ({
      ...prev,
      data: currentdItems,
    }));
  };

  useEffect(() => {
    fetchbeneficiariesData().catch(console.error);
  }, [state.limit]);

  //   Handle page change
  const handlePageChange = (pageNumber: any) => {
    setState((prev) => ({ ...prev, activePage: pageNumber }));
    fetchbeneficiariesData().catch(console.error);
  };
  const handleDelete = async (id: string) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this beneficiary?"
    );
    if (isConfirmed) {
      await beneficiaryService.deleteBeneficiary(id);
      if (state.data) {
        setState((prev) => ({
          ...prev,
          data: state.data.filter((item) => item.id !== id),
        }));
      }
    }
  };

  return (
    <div>
      <br />
      <div className="row">
        <div className="col-md-1 mb-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => navigate("/add-beneficiary")}
          >
            Add Bineficiary
          </button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>NickName</th>
              <th>Email</th>
              <th>Account Number</th>
              <th>bank Name</th>
              <th>Created By</th>
              <th>Action</th>
              {/* Add more columns as needed */}
            </tr>
          </thead>
          <tbody>
            {state.data?.map((item, index) => (
              <BeneficiaryItem
                beneficiary={item}
                index={index}
                deleteBeneficiary={handleDelete}
              />
            ))}
          </tbody>
        </Table>
        <Pagination>
          {state.data?.map((_, index) => {
            return (
              <Pagination.Item
                onClick={() => handlePageChange(index + 1)}
                key={index + 1}
                active={index + 1 === state.activePage}
              >
                {index + 1}
              </Pagination.Item>
            );
          })}
        </Pagination>
      </div>
    </div>
  );
};
