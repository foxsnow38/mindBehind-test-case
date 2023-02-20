import React, { Component } from "react";
import moduleCSS from "./EditForm.module.scss";
import AddIcon from "@mui/icons-material/Add";
import { useCompanyContext } from "../../context/PrismaContext/PrismaContext";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  InputLabel,
  Input,
  Stack,
  IconButton,
} from "@mui/material";
function EditForm() {
  const {
    companies,
    setCompanies,
    isEdited,
    setIsEdited,
    isAdded,
    setIsAdded,
    updateCompany,
    restartCompanies,
    createCompany,
  } = useCompanyContext();

  const updateComp = async (id: number) => {
    setCompanies(
      companies.map((company: any) => {
        if (company.id === id) {
          return isEdited;
        }
        return company;
      })
    );
    await updateCompany({
      id: id,
      name: isEdited.name,
      branch_id: parseInt(isEdited.branch_id),
      full_address: isEdited.full_address,
      phone: parseInt(isEdited.phone),
      latitude: parseFloat(isEdited.latitude),
      longitude: parseFloat(isEdited.longitude),
    });
    await restartCompanies();
    setIsEdited((state: any) => null);
    setIsAdded(false);
  };

  const chooseComapnyId = (companies: any) => {
    let id = Math.floor(Math.random() * 100);
    let isIdExist = companies.find((company: any) => company.id === id);
    if (!isIdExist) {
      id = chooseComapnyId(companies);
    }
    return id;
  };
  const addComp = async (item: any) => {
    console.log(item);
    if (
      !item.name ||
      item.name === "None" ||
      item.branch_id === 0 ||
      !item.branch_id ||
      item.branch_id === "None" ||
      !item.full_address ||
      item.full_address === "None" ||
      !item.phone ||
      item.phone === "None" ||
      !item.latitude ||
      item.latitude === "None" ||
      !item.longitude ||
      item.longitude === "None"
    ) {
      alert("Please fill all the fields");
      return;
    }
    console.log(item);
    item.id = chooseComapnyId(companies);
    await setCompanies((state: any) => [...state, item]);
    await createCompany({
      name: item.name,
      branch_id: parseInt(item.branch_id),
      full_address: item.full_address,
      phone: parseInt(item.phone),
      latitude: parseFloat(item.latitude),
      longitude: parseFloat(item.longitude),
    });
    await restartCompanies();
    setIsEdited((state: any) => null);
    setIsAdded((state: any) => null);
  };

  return (
    <div>
      <Stack direction="row" spacing={2}>
        <div style={{ width: "100%" }}>
          <Stack direction="row" spacing={2}>
            <div>
              <FormControl>
                <InputLabel htmlFor="companyNameInput">Company Name</InputLabel>
                <Input
                  id="companyNameInput"
                  aria-describedby="CompanyNameHelperText"
                  value={isEdited?.name}
                  onInput={(e: any) => {
                    setIsEdited((state: any) => ({
                      ...state,
                      name: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="companyBranchIdInput">
                  Branch ID
                </InputLabel>
                <Input
                  type="number"
                  id="companyBranchIdInput"
                  aria-describedby="CompanyBranchIdHelperText"
                  value={isEdited?.branch_id}
                  onInput={(e: any) => {
                    setIsEdited((state: any) => ({
                      ...state,
                      branch_id: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="companyAddressInput">Address</InputLabel>
                <Input
                  id="companyAddressInput"
                  aria-describedby="CompanyAddressHelperText"
                  value={isEdited?.full_address}
                  onInput={(e: any) => {
                    setIsEdited((state: any) => ({
                      ...state,
                      full_address: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="companyPhoneInput">Phone</InputLabel>
                <Input
                  type="number"
                  id="companyPhoneInput"
                  aria-describedby="CompanyPhoneHelperText"
                  value={isEdited?.phone}
                  onInput={(e: any) => {
                    setIsEdited((state: any) => ({
                      ...state,
                      phone: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="companyLatitudeInput">Latitude</InputLabel>
                <Input
                  type="number"
                  id="companyLatitudeInput"
                  aria-describedby="CompanyLatitudeHelperText"
                  value={isEdited?.latitude}
                  onInput={(e: any) => {
                    setIsEdited((state: any) => ({
                      ...state,
                      latitude: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </div>
            <div>
              <FormControl>
                <InputLabel htmlFor="companyLongitudeInput">
                  Longitude
                </InputLabel>
                <Input
                  type="number"
                  id="companyLongitudeInput"
                  aria-describedby="CompanyLongitudeHelperText"
                  value={isEdited?.longitude}
                  onInput={(e: any) => {
                    setIsEdited((state: any) => ({
                      ...state,
                      longitude: e.target.value,
                    }));
                  }}
                />
              </FormControl>
            </div>
          </Stack>
        </div>
        <div>
          <Stack>
            {!isAdded ? (
              <>
                <div>
                  <IconButton
                    size="medium"
                    onClick={() => updateComp(isEdited?.id)}
                  >
                    <DoneIcon fontSize="medium" />
                  </IconButton>
                </div>

                <div>
                  <IconButton size="medium" onClick={() => setIsEdited(null)}>
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                </div>
              </>
            ) : (
              <div>
                <IconButton size="medium" onClick={() => addComp(isEdited)}>
                  <AddIcon fontSize="medium" />
                </IconButton>

                <div>
                  <IconButton
                    size="medium"
                    onClick={() => {
                      setIsEdited(null);
                      setIsAdded(null);
                    }}
                  >
                    <CloseIcon fontSize="medium" />
                  </IconButton>
                </div>
              </div>
            )}
          </Stack>
        </div>
      </Stack>
    </div>
  );
}

export default EditForm;
