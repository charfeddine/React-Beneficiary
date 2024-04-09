// useBeneficiaryService.ts

import { useState } from "react";
import { toast } from "react-toastify";
import { db } from "../config/firebase";
import {
  DocumentData,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { Beneficiary } from "../models/Beneficiary";

const benefRef = collection(db, "beneficiaries");

export const useBeneficiaryService = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const addOrEditBeneficiary = async (
    beneficiary: Beneficiary,
    type: string = "add"
  ) => {
    if (beneficiary.nickName.length < 3) {
      throw new Error("Nickname must be at least 3 characters long.");
    }
    if (isAccountNumberModulo97(beneficiary.accountNumber)) {
      throw new Error("Invalid account number. Must be modulo[97].");
    }
    var isunique = await isBeneficiaryUnique(beneficiary.nickName);
    if (isunique) {
      if (type === "add") {
        beneficiaries.push(beneficiary);
        await addDoc(benefRef, beneficiary).then(
          (docRef) => {
            console.log(docRef.id); //saf89hnasHJADH9
            toast.success("add is succeed!");
          },
          (err) => {
            console.log(err);
            toast.error(err.message || "Failed");
          }
        );
      } else {
        await updateBeneficiary(beneficiary);
      }
    } else {
      throw new Error("Beneficiary with this nickName already exists.");
    }
  };
  // ... (other methods)
  // Function to check if a document with a specific ID exists in a collection
  const isBeneficiaryUnique = async (nickName: string) => {
    try {
      // Get a reference to the document

      const benefs = query(benefRef, where("nickName", "==", nickName));
      const querySnapshot = await getDocs(benefs);
      return querySnapshot.empty ? true : false;
    } catch (error) {
      console.error("Error checking if document exists:", error);
      throw error;
    }
  };
  const isAccountNumberModulo97 = (accountNumber: string) => {
    return parseInt(accountNumber) % 97 === 1;
  };
  // const isNotificationButtonEnabled = (beneficiary: Beneficiary) => {
  //   return beneficiary.phoneNumber !== "" && beneficiary.email !== "";
  // };

  const getDetailsBeneficiaries = async () => {
    const data = await getDocs(benefRef);
    const fetchedBeneficiaries = data.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) => {
        const userData = doc.data();
        return { id: doc.id, ...userData } as Beneficiary;
      }
    );
    return fetchedBeneficiaries;
  };
  const getAllBeneficiaries = async () => {
    const data = await getDocs(benefRef);
    return data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Beneficiary[];
  };

  const getBeneficiary = async (id: string) => {
    setBeneficiaries(beneficiaries.filter((item) => item.id !== id));
    const querySnapshot = await getDocs(query(benefRef, where("id", "==", id)));
    const fetchedBeneficiaries = querySnapshot.docs.map(
      (doc: QueryDocumentSnapshot<DocumentData>) => {
        const userData = doc.data();
        return { id: doc.id, ...userData } as Beneficiary;
      }
    );
    return fetchedBeneficiaries[0];
  };

  const updateBeneficiary = async (beneficiary: Beneficiary) => {
    try {
      const querySnapshot = await getDocs(
        query(benefRef, where("id", "==", beneficiary.id))
      );
      let docId = "";
      querySnapshot.forEach((doc) => {
        docId = doc.id;
      });

      const beneficiaryRef = doc(db, "beneficiaries", docId);
      updateDoc(beneficiaryRef, beneficiary);
    } catch (error) {
      console.error("Error updating beneficiary:", error);
    }
  };
  const deleteBeneficiary = async (id: string) => {
    setBeneficiaries(beneficiaries.filter((item) => item.id !== id));
    const querySnapshot = await getDocs(query(benefRef, where("id", "==", id)));
    let docId = "";
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    deleteDoc(doc(db, "beneficiaries", docId));
  };

  return {
    addOrEditBeneficiary,
    getAllBeneficiaries,
    getDetailsBeneficiaries,
    getBeneficiary,
    deleteBeneficiary,
  };
};
