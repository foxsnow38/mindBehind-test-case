import React, { Component } from "react";
import moduleCSS from "./Actions.module.scss";
import EditIcon from "@mui/icons-material/Edit";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCompanyContext } from "../../context/PrismaContext/PrismaContext";

function Actions({ params }: any) {
  const {
    setIsEdited,
    companies,
    setCompanies,
    deleteCompany,
    restartCompanies,
  } = useCompanyContext();

  const deleteComp = async (id: number) => {
    await setCompanies(companies.filter((company: any) => company.id !== id));
    await deleteCompany(id);
    await restartCompanies();

    alert("Company deleted");
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <div>
          <IconButton
            size="small"
            onClick={() => setIsEdited((state: any) => ({ ...params.row }))}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </div>

        <div>
          <IconButton size="small" onClick={() => deleteComp(params.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </div>
      </Stack>
    </div>
  );
}

//////////////////////

export default Actions;
