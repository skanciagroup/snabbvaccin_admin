import { ProfileUser } from "@/types/database";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Loader from "@/public/loading.gif";
import Image from "next/image";
import { Input } from "../ui/input";

interface errorProps {
  type: string;
  status: number | "";
  text: string;
}
const NewUser = () => {
  const [formData, setFormData] = useState<ProfileUser>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    // image: "",
    personal_number: "",
    phone: "",
    // organisation: [],
    // role: "",
     vaccinator: false,
     license: false,
    // license_type: "manual",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<errorProps>({
    type: "",
    status: "",
    text: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log("data",data);
      if (data.status === 409) {
        setMessage({
          type: "error",
          status: data.status,
          text: "User already exists",
        }); // Bad request error
      } else if (data.status === 201) {
        setMessage({
          type: "success",
          status: data.status,
          text: "User created successfully",
        }); // Conflict error (user already exists)
      } else {
        setMessage({
          type: "errorUndefined",
          status: "",
          text: "An unexpected error occurred.",
        }); // Generic error message
      }
      setLoading(false);
    } catch (error) {
      console.error("Error creating user:", error);
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
      <div>
        <Input
        type="text"
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
        className="mt-1 block w-ful border border-gray-300 rounded-xl shadow-sm p-2"
        />
      </div>
      <div>
        <Input
          type="text"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
      </div>
      <div>
        <Input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
          placeholder="Email"
          onChange={handleChange}
        />
      </div>
      <div>
        <Input
          type="password"
          id="password"
          name="password"
          required
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
          placeholder="Password"
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          type="text"
          name="personal_number"
          value={formData.personal_number}
          onChange={handleChange}
          placeholder="Personal Number"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
      </div>
      <div>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="mt-1 block w-full border border-gray-300 rounded-xl shadow-sm p-2"
        />
      </div>
      <div className="flex gap-x-2">
        <input
          id="vaccinator"
          type="checkbox"
          name="vaccinator"
          checked={formData.vaccinator}
          onChange={handleChange}
        />
        <label htmlFor="vaccinator">Vaccinator</label>
      </div>
      <div className="flex gap-x-2">
        <input
          id="license"
          type="checkbox"
          name="license"
          checked={formData.license}  
          onChange={handleChange}
        />
        <label htmlFor="license">License</label>
      </div>
      
      <Button
        type="submit"
        variant="default"
        disabled={loading ? true : false}
        className="mt-4 text-white py-2 px-4 rounded"
      >
        {loading ? (
          <div className="flex items-center">
            <Image src={Loader} width={40} height={40} alt="loading" />
            Please wait
          </div>
        ) : (
          "Submit"
        )}
      </Button>
      {message && (
        <p
          className={
            message.type === "success" ? "text-primary" : "text-red-500"
          }
        >
          {message.text}
        </p>
      )}
    </form>
  );
};

export default NewUser;
