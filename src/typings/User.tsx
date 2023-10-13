export default interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  email_verified_at: null | string;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  address: null | string;
  city: null | string;
  zip: null | string;
  phone: null | string;
  bio: undefined | string;
  terms_accepted_at: null | string;
  has_accepted_latest_terms: boolean;
}
