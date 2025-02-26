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
import toast from "react-hot-toast";

const schema = yup.object().shape({
  name: yup.string().required("Organization name is required"),
});

interface EditOrganisationProps {
  organisation: Organisation;
  onClose: () => void;
}

const EditOrganisation: React.FC<EditOrganisationProps> = ({
  organisation,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const { fetchOrganisations } = useOrganisationStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Organisation>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: organisation.name,
    },
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const onSubmit = async (data: Organisation) => {
    setLoading(true);
    try {
      const trimmedData = {
        name: data.name.trim(),
      };
      const response = await fetch("/api/organisation/edit", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: organisation.id,
          name: trimmedData.name,
        }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Organisation updated successfully",
        });
        fetchOrganisations();
        toast.success("Organisation updated successfully");
        onClose();
      } else {
        setMessage({ type: "error", text: "Failed to update organisation" });
      }
    } catch (error) {
      setMessage({ type: "error", text: error as string });
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
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div className="form-button-div">
      <Button
        type="submit"
        variant="default"
        disabled={loading}
        className="mt-4 w-full  text-white py-2 px-4 rounded"
      >
        {loading ? (
          <div className="flex items-center">
            <Image src={Loader} width={40} height={40} alt="loading" />
            Updating Organisation...
          </div>
        ) : (
          "Update"
        )}
      </Button>
      <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={loading}
          className="mt-4 w-full text-primary py-2 px-4 rounded"
        >
          Cancel
        </Button>
      </div>
      
      {message.text && (
        <p
          className={
            message.type === "success" ? "text-primary" : "error-message"
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default EditOrganisation;
