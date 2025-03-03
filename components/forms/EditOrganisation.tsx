"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Loader from "@/public/loading.gif";
import Image from "next/image";
import { Organisation, OrganisationForm } from "@/types/database";
import useOrganisationStore from "@/store/organisationStore";
import toast from "react-hot-toast";
import useLoadingStore from "@/store/loadingStore";
import { organisationService } from "@/services/organisationService";

const schema = yup.object().shape({
  name: yup.string().required("Organisation name is required"),
});

interface EditOrganisationProps {
  organisation: Organisation;
  onClose: () => void;
}

const EditOrganisation: React.FC<EditOrganisationProps> = ({
  organisation,
  onClose,
}) => {
  const { loading, setLoading } = useLoadingStore();
  const { fetchOrganisations } = useOrganisationStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrganisationForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: organisation.name,
    },
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const onSubmit = async (data: OrganisationForm) => {
    setLoading(true);
    try {
      const trimmedData = {
        id: organisation.id,
        name: data.name.trim(),
      };
      await organisationService.editOrganisation(trimmedData.id!, trimmedData);
      setMessage({
        type: "success",
        text: "Organisation updated successfully",
      });
      fetchOrganisations();
      toast.success("Organisation updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating organisation:", error);
      setMessage({
        type: "error",
        text: "An error occurred while updating the organisation.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <Input
          {...control.register("name")}
          type="text"
          placeholder="Organization Name"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
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
