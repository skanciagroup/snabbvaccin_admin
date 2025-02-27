"use client";
import Drawer from "@/components/Drawer";
import BreadcrumbBlock from "@/components/layout/BreadcrumbBlock";
import Loader from "@/components/Loader";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TableBlock from "@/components/layout/TableBlock";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useUserStore from "@/store/userStore"; // Ensure you have a user store similar to bus store
import { ProfileUser } from "@/types/database"; // Ensure you have a User type defined
import toast from "react-hot-toast";
import SearchBar from "@/components/SearchBar";
import EditUser from "@/components/forms/EditUser"; // Ensure you have an EditUser component
import NewUser from "@/components/forms/NewUser"; // Ensure you have a NewUser component

const Users = () => {
  const { t } = useTranslation();
  const { users, fetchUsers, loading } = useUserStore(); // Use the user store
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ProfileUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<ProfileUser[]>([]);

  useEffect(() => {
    fetchUsers(); // Fetch users on component mount
  }, [fetchUsers]);

  useEffect(() => {
    const filtered = Array.isArray(users)
      ? users.filter(
          (user: ProfileUser) =>
            user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      : []; // Fallback to an empty array if users is not an array

    console.log("Filtered users:", filtered); // Log the filtered users
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const headers = ["S.No", "First_Name", "Last_Name",  "Email", "Phone", "Vaccinator", "License", "License_Type"]; // Adjust headers based on your User fields

  const handleDelete = async (row: ProfileUser) => {
    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
        body: JSON.stringify({ id: row.user_id }),
      });
      if (!response.ok) throw new Error("Failed to delete");
      fetchUsers();
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleEdit = (row: ProfileUser) => {
    setSelectedUser(row);
    setIsEditMode(true);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
  };

  return (
    <div className="p-6">
      <Drawer isOpen={isDrawerOpen} onClose={handleDrawerClose}>
        {isEditMode && selectedUser ? (
          <EditUser user={selectedUser} onClose={handleDrawerClose} />
        ) : (
          <NewUser onClose={handleDrawerClose} />
        )}
      </Drawer>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              {t("sidebar.users")}
            </h1>
            <BreadcrumbBlock
              breadcrumbs={[
                { label: "Home", href: "/" },
                { label: "Users", href: "" },
              ]}
            />
          </div>

          <Separator className="my-6 h-[1px] bg-primary/30 rounded-xl" />

          <div className="flex justify-between items-center gap-x-4">
            <Card className="w-48 border border-secondary/50 p-4 rounded-[7px] hover:shadow-lg">
              <CardContent className="flex items-center justify-between p-0">
                <CardTitle className="text-secondary p-0">Total</CardTitle>
                <span className="text-xl text-secondary font-semibold">
                  {users.length}
                </span>
              </CardContent>
            </Card>

            <Button
              variant="default"
              onClick={() => setIsDrawerOpen(true)}
              className="px-6 py-2 rounded-[7px] text-white"
            >
              Add User
            </Button>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            placeholder="Search users..."
          />

          <div className="mt-6 bg-white rounded-lg shadow">
            {filteredUsers.length > 0 ? (
              <TableBlock
                headers={headers}
                data={filteredUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ) : (
              <div className="p-4 text-center text-secondary">
                No users found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
