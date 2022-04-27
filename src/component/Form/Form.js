import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Autocomplete from "@mui/material/Autocomplete";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import GoogleAutoCompelete from "./GoogleAutoComplete";
import GetPostalCode from "./GetPostalCode";
import * as Yup from "yup";
import { Formik } from "formik";
import { useUser } from "../../Hooks/User";

const theme = createTheme();

export default function Form({ setScreen }) {
  const [addresses, setAddresses] = useState([]);
  const [officeLocation, setOfficeLocation] = useState([]);
  const { user, setUser } = useUser();

  const handleChangeAddress = async (searchValue) => {
    if (!searchValue.target.value) {
      return null;
    }
    const results = await GoogleAutoCompelete(searchValue.target.value);
    if (results) {
      setAddresses(results);
    }
  };

  const changeAddress = async (value, setFieldValue) => {
    let result = null;
    for (let x = 0; x < addresses.length; x++) {
      if (value === addresses[x].description) {
        result = await GetPostalCode(addresses[x].place_id);
        console.log(result);
        // Get Zip code
      }
    }
    if (!result) {
      return;
    }
    setFieldValue("companyAddress", value);
    let postcode = null;
    // console.log("result:", result.address_components);
    for (let i = 0; i < result.address_components.length; i++) {
      if (result.address_components[i].types[0] === "postal_code") {
        postcode = result.address_components[i].long_name;
      }
    }
    postcode && setFieldValue("zipCode", postcode);
    // Get city
    let city = null;
    for (let i = 0; i < result.address_components.length; i++) {
      if (result.address_components[i].types[0] === "locality") {
        city = result.address_components[i].long_name;
      }
    }
    if (!city) {
      for (let i = 0; i < result.address_components.length; i++) {
        if (
          result.address_components[i].types[0] ===
          "administrative_area_level_2"
        ) {
          city = result.address_components[i].long_name;
        }
      }
    }
    setFieldValue("city", city);
    let lat = result.geometry.location.lat();
    let lng = result.geometry.location.lng();
    setOfficeLocation([lat, lng]);

    // Get State
    let state = null;
    for (let i = 0; i < result.address_components.length; i++) {
      if (
        result.address_components[i].types[0] === "administrative_area_level_1"
      ) {
        state = result.address_components[i].long_name;
      }
    }
    if (!state) {
      for (let i = 0; i < result.address_components.length; i++) {
        if (
          result.address_components[i].types[0] ===
          "administrative_area_level_2"
        ) {
          state = result.address_components[i].long_name;
        }
      }
    }
    setFieldValue("stateOfAddress", state);
  };

  //We can use this function to disable the browser auto complete from the fields because it looks really annoying
  useEffect(() => {
    window.document
      .querySelector('input[name="companyAddress"]')
      .setAttribute("autocomplete", "disable");
    window.document
      .querySelector('input[name="companyAddress"]')
      .setAttribute("aria-autocomplete", "off");
    window.document
      .querySelector('input[name="zipCode"]')
      .setAttribute("autocomplete", "disable");
    window.document
      .querySelector('input[name="zipCode"]')
      .setAttribute("aria-autocomplete", "off");
    window.document
      .querySelector('input[name="city"]')
      .setAttribute("autocomplete", "disable");
    window.document
      .querySelector('input[name="city"]')
      .setAttribute("aria-autocomplete", "off");
    window.document
      .querySelector('input[name="stateOfAddress"]')
      .setAttribute("autocomplete", "disable");
    window.document
      .querySelector('input[name="stateOfAddress"]')
      .setAttribute("aria-autocomplete", "off");
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Formik
          enableReinitialize={true}
          initialValues={{
            companyAddress: "",
            name: "",
            cpf: "",
            email: "",
            msg_sub: "",
            zipCode: "",
            city: "",
            stateOfAddress: "",
            // officeLocation: officeLocation,
            submit: null,
          }}
          validationSchema={Yup.object().shape({
            companyAddress: Yup.string("Company address is required")
              .max(255)
              .required("Company address is required"),
            zipCode: Yup.string("Zip code required")
              .max(255)
              .required("Zip Code is Required"),
            city: Yup.string("City is required")
              .max(255)
              .required("City is required"),
            stateOfAddress: Yup.string("State is required")
              .max(255)
              .required("State is required"),
            name: Yup.string("Name is required")
              .max(255)
              .required("Name is required"),
            cpf: Yup.string("CPF is required")
              .max(255)
              .required("CPF is required"),
            email: Yup.string("Email is required")
              .email()
              .required("Email is required"),
            msg_sub: Yup.string("Message is required")
              .max(255)
              .required("Message is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              console.log(values);
              console.log("user1 ", user);
              // setUser(values);
              setUser({ ...user, ...values, officeLocation: officeLocation });
              console.log("user2 ", user);
              // setUser({ ...user, ...values });
              setScreen(1);
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue,
          }) => (
            <form
              method="post"
              onSubmit={handleSubmit}
              //   {...rest}
            >
              <Grid container>
                <Grid item md={6} xs={12}>
                  <Box mt={3} px={6}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="h2" style={{ float: "left" }}>
                          Enter Company Details
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Autocomplete
                          options={addresses.map(
                            (option) => option.description
                          )}
                          // closeIcon= { () => { return; } }
                          onInputChange={(event, value) => {
                            changeAddress(value, setFieldValue);
                          }}
                          autoComplete={false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Company Address"
                              name="companyAddress"
                              value={values.companyAddress}
                              onChange={(value) => {
                                handleChangeAddress(value);
                              }}
                              variant="outlined"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.zipCode && errors.zipCode)}
                          fullWidth
                          helperText={touched.zipCode && errors.zipCode}
                          label="Zip Code"
                          name="zipCode"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.zipCode}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(touched.city && errors.city)}
                          fullWidth
                          helperText={touched.city && errors.city}
                          label="City"
                          name="city"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.city}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          error={Boolean(
                            touched.stateOfAddress && errors.stateOfAddress
                          )}
                          fullWidth
                          helperText={
                            touched.stateOfAddress && errors.stateOfAddress
                          }
                          label="State (Administrative Area)"
                          name="stateOfAddress"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.stateOfAddress}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                          variant="outlined"
                          id="name"
                          label="Name"
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          error={Boolean(touched.cpf && errors.cpf)}
                          fullWidth
                          helperText={touched.cpf && errors.cpf}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.cpf}
                          variant="outlined"
                          id="cpf"
                          label="CPF"
                          autoComplete="cpf"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          error={Boolean(touched.email && errors.email)}
                          fullWidth
                          helperText={touched.email && errors.email}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.email}
                          variant="outlined"
                          id="email"
                          label="Email"
                          name="email"
                          type="email"
                          autoComplete="email"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          required
                          error={Boolean(touched.msg_sub && errors.msg_sub)}
                          fullWidth
                          helperText={touched.msg_sub && errors.msg_sub}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.msg_sub}
                          variant="outlined"
                          name="msg_sub"
                          label="message subject"
                          type="text"
                          id="msg_sub"
                          autoComplete="text"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              value="allowExtraEmails"
                              color="primary"
                            />
                          }
                          label="I want to receive inspiration, marketing promotions and updates via email."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          style={{ marginBottom: "10px" }}
                          // mb={5}
                          disabled={isSubmitting}
                          type="submit"
                          variant="contained"
                          size="large"
                        >
                          Next
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </>
  );
}
