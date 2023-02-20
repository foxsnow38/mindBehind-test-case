import { useEffect } from "react";
import moduleCSS from "./Main.module.scss";
import { useCompanyContext } from "../../context/PrismaContext/PrismaContext";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Actions from "../../components/Actions";
import {
  FormControl,
  InputLabel,
  Input,
  FormHelperText,
  IconButton,
} from "@mui/material";
import EditForm from "../../components/EditAndAddForm";
import AddIcon from "@mui/icons-material/Add";
import Stack from "@mui/material/Stack";
import User from "../../components/User/User";
import { Navigate } from "react-router-dom";

function Main() {
  const {
    isEdited,
    setIsEdited,
    companies,
    setCompanies,
    isAdded,
    setIsAdded,
    user,
    getCompanies,
  } = useCompanyContext();

  let columns: GridColDef[] = [
    // name: string;
    // branch_id: number;
    // full_address: string;
    // phone: number;
    // latitude: number;
    // longitude: number;

    { field: "name", headerName: "Company Name", flex: 1 },
    { field: "branch_id", headerName: "Branch ID", flex: 1 },
    { field: "full_address", headerName: "Full Address", flex: 1 },
    { field: "phone", headerName: "Phone", flex: 1 },
    { field: "latitude", headerName: "Latitude", flex: 1 },
    { field: "longitude", headerName: "Longitude", flex: 1 },
  ];

  let adminOptions: GridColDef[] = [
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      disableColumnMenu: true,
      flex: 1,
      renderCell: (params: any) => <Actions params={params} />,
    },
    {
      field: "addIcon",
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "right",

      flex: 1,
      renderHeader: (params: any) => {
        if (!isAdded)
          return (
            <IconButton
              size="large"
              onClick={() => {
                setIsAdded(true);
                setIsEdited({});
              }}
            >
              <AddIcon fontSize="large" />
            </IconButton>
          );
        else return null;
      },
    },
  ];

  if (user === "admin") columns = [...columns, ...adminOptions];
  else columns = [...columns];

  // console.log(isEdited);
  useEffect(() => {
    getCompanies().then((res: any) => {
      setCompanies(res);
    });
  }, []);

  return (
    <>
      <div style={{ height: 400, width: "80%", margin: "auto" }}>
        {user ? <User></User> : <Navigate to="/"></Navigate>}

        <div style={{ margin: "50px 0" }}>
          {isEdited != null ? <EditForm /> : null}
        </div>

        <DataGrid
          rows={companies}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
        />
      </div>
    </>
  );
}

export default Main;
