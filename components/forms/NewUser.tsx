import { ProfileUser } from "@/types/database";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Loader from "@/public/loading.gif";
import Image from "next/image";
import { Input } from "../ui/input";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Checkbox } from "../ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NewUserFormData = Omit<ProfileUser, "user_id">;

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  personal_number: yup.string().optional(), // Optional
  phone: yup.string().optional(), // Optional
  vaccinator: yup.boolean().optional(), // Optional
  license: yup.boolean().optional(), // Optional
  license_type: yup
    .string()
    .oneOf(["manual", "automatic"])
    .when("license", (license, schema) =>
      license ? schema.required("License type is required") : schema.nullable(),
    ),
});

const NewUser = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    status: "",
    text: "",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NewUserFormData>({
    resolver: yupResolver(schema),
  });

  const isLicenseChecked = watch("license");

  const onSubmit = async (data: NewUserFormData) => {
    setLoading(true);
    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.status === 409) {
        setMessage({
          type: "error",
          status: result.status,
          text: "User already exists",
        });
      } else if (result.status === 201) {
        setMessage({
          type: "success",
          status: result.status,
          text: "User created successfully",
        });
        reset();
      } else {
        setMessage({
          type: "errorUndefined",
          status: "",
          text: "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      setMessage({
        type: "error",
        status: "",
        text: "An error occurred while creating the user.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 text-secondary font-sans"
    >
      <div>
        <Controller
          name="first_name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="First Name"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.first_name && (
          <p className="error-message  ">{errors.first_name.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="last_name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Last Name"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.last_name && (
          <p className="error-message  ">{errors.last_name.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              type="email"
              placeholder="Email"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.email && (
          <p className="error-message  ">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              placeholder="Password"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.password && (
          <p className="error-message  ">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="personal_number"
          control={control}
          defaultValue="" // Ensure default value is set
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Personal Number"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
      </div>
      <div>
        <Controller
          name="phone"
          control={control}
          defaultValue="" // Ensure default value is set
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Phone"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
      </div>
      <div className="flex items-center gap-x-2">
        <Controller
          name="vaccinator"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="vaccinator"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)} // Update state on change
            />
          )}
        />
        <label htmlFor="vaccinator">Vaccinator</label>
      </div>
      <div className="flex items-center gap-x-2">
        <Controller
          name="license"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="license"
              checked={field.value}
              onCheckedChange={(checked) => field.onChange(checked)} // Update state on change
            />
          )}
        />
        <label htmlFor="license">License</label>
      </div>
      {/* License Type Dropdown */}
      {isLicenseChecked && (
        <div className="bg-white">
          <Controller
            name="license_type"
            control={control}
            defaultValue="automatic" // Add default value
            render={(
              { field: { onChange, value } }, // Destructure field props
            ) => (
              <Select value={value || undefined} onValueChange={onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select License Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="automatic">Automatic</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.license_type && (
            <p className="error-message ">{errors.license_type.message}</p>
          )}
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        disabled={loading}
        className="mt-4 text-white py-2 px-4 rounded"
      >
        {loading ? (
          <div className="flex items-center">
            <Image src={Loader} width={40} height={40} alt="loading" />
            Adding users. Please wait
          </div>
        ) : (
          "Submit"
        )}
      </Button>
      {message && (
        <p
          className={
            message.type === "success" ? "text-primary" : "error-message  "
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default NewUser;
