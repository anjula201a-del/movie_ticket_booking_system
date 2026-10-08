import { Movie } from "./Movie";

export interface MovieEditProps {
  open: boolean;
  movie: Movie | null; 
  onClose: () => void;
  onSave: () => void;
}