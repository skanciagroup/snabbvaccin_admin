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
   personal_number: string;
   phone: string;
  // organisation: string[],
  // role: string;
   vaccinator: boolean;
   license: boolean;
  // license_type: 'manual' | 'automatic';
}

