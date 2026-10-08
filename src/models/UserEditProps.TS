import { User } from "./User";

export interface UserEditProps {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSave: () => void;
}