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

export interface Organisation {
  id?: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface Bus {
  id?: number;
  name: string;
  reg_no: string;
  type: "automatic" | "manual";
  created_at?: string;
  updated_at?: string;
}
