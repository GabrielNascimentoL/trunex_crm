export interface Profile {
  id: string
  user_id: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  full_name?: string
  avatar_url?: string | null
}

export interface UpdatePasswordData {
  current_password: string
  new_password: string
  confirm_password: string
}