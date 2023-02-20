import React, { Component } from "react";
import moduleCSS from "./User.module.scss";
import Stack from "@mui/material/Stack";
import { Avatar, Typography, Button } from "@mui/material";
import { useCompanyContext } from "../../context/PrismaContext/PrismaContext";
import { useNavigate } from "react-router-dom";

function User() {
  const { setUser, user } = useCompanyContext();
  const navigate = useNavigate();
  return (
    <div>
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        justifyItems={"center"}
      >
        <Avatar alt={`${user}`} src="./public/images/anonim" />
        <Typography>{`${user}`}</Typography>
        <Button
          variant="contained"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/");
          }}
        >
          Logout
        </Button>
      </Stack>
    </div>
  );
}

export default User;
