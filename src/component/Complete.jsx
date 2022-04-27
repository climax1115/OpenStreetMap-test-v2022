import { Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useUser } from "../Hooks/User";

export default function Complete() {
  //We can use this function to disable the browser auto complete from the fields because it looks really annoying
  const { user, setUser } = useUser();
  return (
    <Grid container spacing={2} mt={7}>
      <Grid item xs={4}></Grid>
      <Grid item xs={4}>
        <Typography variant="h6">
          You have Submitted the From Successfully with email {user.email}
        </Typography>
      </Grid>
      <Grid item xs={4}></Grid>
    </Grid>
  );
}
