import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loader from "@/public/loading.gif";
import Image from "next/image";
import { Organisation } from "@/types/database";
import useOrganisationStore from "@/store/organisationStore";
import toast from "react-hot-toast"

const schema = yup.object().shape({
  name: yup.string().required("Organization name is required"),
});

interface NewOrganisationProps {
  onClose: () => void;
}

const NewOrganisation: React.FC<NewOrganisationProps> = ({onClose}) => {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Organisation>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
    },
  });
  const [message, setMessage] = useState({
    type: "",
    status: "",
    text: "",
  });
  const { fetchOrganisations } = useOrganisationStore();


  const onSubmit = async (data: Organisation) => {
    setLoading(true);
    try {
      const response = await fetch("/api/organisation/create", {
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
          text: result.message,
        });
      } else if (result.status === 201) {
        setMessage({
          type: "success",
          status: result.status,
          text: result.message,
        });
        fetchOrganisations();
        toast.success("Organisation created successfully");
        onClose()
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Organization Name"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <Button
        type="submit"
        variant="default"
        disabled={loading}
        className="mt-4 text-white py-2 px-4 rounded"
      >
        {loading ? (
          <div className="flex items-center">
            <Image src={Loader} width={40} height={40} alt="loading" />
            Creating Organisation. Please wait
          </div>
        ) : (
          "Submit"
        )}
      </Button>
      {message && (
        <p
          className={
            message.type === "success"
              ? "text-primary"
              : "text-red-500 text-sm p-1 "
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default NewOrganisation;
