"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { BusForm } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBusStore from "@/store/busStore";
import { useState } from "react";
import toast from "react-hot-toast";
import Loader from "@/public/loading.gif";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import useLoadingStore from "@/store/loadingStore";
import { busService } from "@/services/busService";

const schema = yup.object().shape({
  name: yup.string().required("Bus name is required"),
  reg_no: yup.string().required("Registration number is required"),
  type: yup
    .string()
    .oneOf(
      ["automatic", "manual"],
      "Type must be either 'automatic' or 'manual'",
    )
    .required("Type is required"),
});

interface NewBusProps {
  onClose: () => void;
}

const NewBus: React.FC<NewBusProps> = ({ onClose }) => {
  const { loading, setLoading } = useLoadingStore();
  const { fetchBuses } = useBusStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      reg_no: "",
      type: "automatic",
    },
  });

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const onSubmit = async (data: BusForm) => {
    setLoading(true);
    try {
      const trimmedData = {
        name: data.name.trim(),
        reg_no: data.reg_no.trim(),
        type: data.type,
      };
      const result = await busService.createBus(trimmedData);
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
        fetchBuses();
        toast.success("Bus created successfully");
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
      <div>
        <Input
          {...control.register("name")}
          type="text"
          placeholder="Bus Name"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div>
        <Input
          {...control.register("reg_no")}
          type="text"
          placeholder="Registration Number"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
        {errors.reg_no && (
          <p className="error-message">{errors.reg_no.message}</p>
        )}
      </div>
      <div>
        <Select {...control.register("type")}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="automatic">Automatic</SelectItem>
            <SelectItem value="manual">Manual</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="error-message">{errors.type.message}</p>}
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
              Creating Bus...
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

export default NewBus;
