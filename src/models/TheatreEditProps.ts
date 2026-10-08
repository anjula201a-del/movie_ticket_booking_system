import { Theatre } from "./Theatre";

export interface TheatreEditProps {
  open: boolean;
  theatre: Theatre | null; 
  onClose: () => void;
  onSave: () => void;
}