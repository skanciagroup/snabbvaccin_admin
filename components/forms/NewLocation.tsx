"use client";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { LocationForm } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useLocationStore from "@/store/locationStore";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/public/loading.gif";
import Image from "next/image";
import { locationService } from "@/services/locationService";

const schema = yup.object().shape({
  name: yup.string().required("Location name is required"),
  address: yup.string().required("Address is required"),
  mvid: yup.number().required("MVID is required").typeError("MVID must be a number"), // Ensure mvid is a number
});

interface NewLocationProps {
  onClose: () => void;
}

const NewLocation: React.FC<NewLocationProps> = ({ onClose }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LocationForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      mvid: undefined,
      address: "",
    },
  });
  const { fetchLocations } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const onSubmit = async (data: LocationForm) => {
    setLoading(true);
    try {
      const trimmedData = {
        name: data.name.trim(),
        mvid: data.mvid!,
        address: data.address.trim(),
      };
      const result = await locationService.createLocation(trimmedData);
      if (result.status === 409) {
        setMessage({
          type: "error",
          text: result.message,
        });
      } else if (result.status === 201) {
        setMessage({
          type: "success",
          text: result.message,
        });
        fetchLocations();
        toast.success("Location created successfully");
        onClose();
        reset();
      } else {
        setMessage({
          type: "errorUndefined",
          text: "An unexpected error occurred.",
        });
      }
    } catch (error) {
      console.error("Error creating bus:", error);
      setMessage({
        type: "error",
        text: "An error occurred while creating the bus.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
      <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Location Name"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div>
      <Controller
          name="mvid"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="MVID"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
              value={field.value ?? ""}
            />
          )}
        />
        {errors.mvid && <p className="error-message">{errors.mvid.message}</p>}
      </div>
      <div>
      <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Address"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.address && (
          <p className="error-message">{errors.address.message}</p>
        )}
      </div>
      <div className="form-button-div">
        <Button
          type="submit"
          variant="default"
          disabled={loading}
          className="mt-4 w-full text-white py-2 px-4 rounded"
        >
          {loading ? (
            <div className="flex items-center">
              <Image src={Loader} width={40} height={40} alt="loading" />
              Adding Location...
            </div>
          ) : (
            "Submit"
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

export default NewLocation;
