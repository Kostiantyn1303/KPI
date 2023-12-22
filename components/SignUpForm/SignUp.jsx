import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";

import { createRecordWithHashedPassword } from "../../configs/service";

const SignupForm = () => {
  return (
    <Formik
      initialValues={{ name: "", email: "", password: "" }}
      validationSchema={Yup.object({
        name: Yup.string()
          .max(15, "Must be 15 characters or less")
          .required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
        password: Yup.string()
          .min(8, "Password must be at least 8 characters")
          .max(15, "Password must be 15 characters or less")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting, resetForm, setFieldError }) => {
        createRecordWithHashedPassword({
          name: values.name,
          email: values.email,
          password: values.password,
        })
          .then((response) => {
            console.log("Record created successfully:", response);
            resetForm();
          })
          .catch((error) => {
            console.error("Error creating record:", error);
            setFieldError("email", "User with this email already exists");
          })
          .finally(() => {
            setSubmitting(false);
            // Очистити поля форми
          });
      }}
    >
      <Form>
        <label htmlFor="name"> Name</label>
        <Field name="name" type="text" />
        <ErrorMessage name="name" />

        <label htmlFor="email">Email Address</label>
        <Field name="email" type="email" />
        <ErrorMessage name="email" />

        <label htmlFor="password">Password</label>
        <Field name="password" type="password" />
        <ErrorMessage name="password" />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default SignupForm;
