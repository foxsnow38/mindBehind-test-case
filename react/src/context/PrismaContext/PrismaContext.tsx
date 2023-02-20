import React, {
  useState,
  Component,
  createContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import moduleCSS from "./PrismaContext.module.scss";
// import { PrismaClient } from "react-prisma"; // I try this but its given err so Im not continue

export let companyContext = createContext<any>({});

interface Props {
  //  https://stackoverflow.com/a/55372465
  children?: ReactNode;
}

function PrismaContext({ children, ...props }: Props) {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [isEdited, setIsEdited] = useState(null);
  const [isAdded, setIsAdded] = useState(null);

  const options = {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  };

  const getUser = async (name: string) => {
    const res = await axios(`${process.env.REACT_APP_EXPRESS_URL}/api/user`, {
      method: "POST",
      ...options,
      data: JSON.stringify({ name }),
    }).then((res) => res.data);

    return await res;
  };
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    setUser(user);
  });

  const createCompany = async (input: {
    name: string;
    branch_id: number;
    full_address: string;
    phone: number;
    latitude: number;
    longitude: number;
  }) => {
    const res = await axios(`${process.env.REACT_APP_EXPRESS_URL}/api/create`, {
      method: "POST",
      ...options,
      data: JSON.stringify(input),
    }).then((res) => res.data);
    return await res;
  };

  const updateCompany = async (input: {
    id: number;
    name?: string;
    branch_id?: number;
    full_address?: string;
    phone?: number;
    latitude?: number;
    longitude?: number;
  }) => {
    console.log(input);

    const res = await axios(`${process.env.REACT_APP_EXPRESS_URL}/api/update`, {
      method: "PUT",
      ...options,
      data: JSON.stringify(input),
    }).then((res) => res.data);
    return await res;
  };

  const deleteCompany = async (id: number) => {
    const res = await axios(`${process.env.REACT_APP_EXPRESS_URL}/api/delete`, {
      method: "DELETE",
      ...options,
      data: JSON.stringify({ id }),
    }).then((res) => res.data);

    return res;
  };

  const getCompanies = async () => {
    const res = await axios(`${process.env.REACT_APP_EXPRESS_URL}/api/read`, {
      ...options,
    }).then((res) => res.data);

    return res;
  };

  const restartCompanies = () => {
    getCompanies().then((res: any) => {
      setCompanies(res);
    });
  };

  let values = {
    createCompany,
    updateCompany,
    deleteCompany,
    getCompanies,
    getUser,
    user,
    setUser,
    companies,
    setCompanies,
    isEdited,
    setIsEdited,
    isAdded,
    setIsAdded,
    restartCompanies,
  };

  return (
    <>
      <companyContext.Provider value={values} {...props}>
        {children}
      </companyContext.Provider>
    </>
  );
}

const useCompanyContext = () => {
  const context = React.useContext(companyContext);
  if (context === undefined) {
    throw new Error("useCompanyContext must be used within a PrismaContext");
  }
  return context;
};

export { PrismaContext, useCompanyContext };
