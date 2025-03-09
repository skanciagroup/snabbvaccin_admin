export interface AuthUserRegister {
  email: string;
  password: string;
}

export interface ProfileUser {
  email: string;
  password: string;
  user_id?: string;
  first_name: string;
  last_name: string;
  // image: string;
  personal_number?: string;
  phone?: string;
  //organisation: string,
  // role: string;
  vaccinator?: boolean;
  license?: boolean;
  license_type?: "manual" | "automatic" | null;
}

export interface EditUserFormData extends Omit<ProfileUser, "password"> {
  password?: string; // Make password optional for editing
}

export interface OrganisationForm {
  name: string;
}

export interface Organisation extends OrganisationForm {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface BusForm {
  name: string;
  reg_no: string;
  type: "automatic" | "manual";
}

export interface Bus extends BusForm {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentForm {
  name: string;
  file: File;
  file_type: string;
}

export interface Document extends DocumentForm {
  id: number;
  filename?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DocumentEditForm {
  name: string;
  file_type?: string;
}

export interface LocationForm {
  name: string;
  address: string;
  mvid: number;
}

export interface Location extends LocationForm {
  id?: number | undefined;
  created_at?: string;
  updated_at?: string;
}
