import { Show } from "./Show";
import { Movie } from "./Movie";
import { Theatre } from "./Theatre";

export interface ShowEditProps {
  open: boolean;
  show: Show | null; 
  movies: Movie[];
  theatres: Theatre[];
  onClose: () => void;
  onSave: () => void;
}