"use client";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Bus, BusForm } from "@/types/database";
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
import {busService} from "@/services/busService";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  reg_no: yup.string().required("Registration number is required"),
  type: yup
    .string()
    .oneOf(
      ["automatic", "manual"],
      "Type must be either 'automatic' or 'manual'",
    )
    .required("Type is required"),
});

interface EditBusProps {
  bus: Bus;
  onClose: () => void;
}

const EditBus: React.FC<EditBusProps> = ({ bus, onClose }) => {
  const { loading, setLoading } = useLoadingStore();
  const { fetchBuses } = useBusStore();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<BusForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: bus.name,
      reg_no: bus.reg_no,
      type: bus.type,
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
        id: bus.id,
        name: data.name.trim(),
        reg_no: data.reg_no.trim(),
        type: data.type,
      };
      await busService.editBus(trimmedData.id, trimmedData);
      fetchBuses();
      toast.success("Bus updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating bus:", error);
      setMessage({
        type: "error",
        text: "An error occurred while updating the bus.",
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
              placeholder="Bus Name"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.name && <p className="error-message">{errors.name.message}</p>}
      </div>
      <div>
        <Controller
          name="reg_no"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              placeholder="Registration Number"
              className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
            />
          )}
        />
        {errors.reg_no && (
          <p className="error-message">{errors.reg_no.message}</p>
        )}
      </div>
      <div>
        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select value={value} onValueChange={onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="automatic">Automatic</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
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
              Updating Bus...
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

export default EditBus;
