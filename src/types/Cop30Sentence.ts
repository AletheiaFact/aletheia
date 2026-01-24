import { Sentence } from "./Sentence";
import { Review } from "./Review";

export interface Cop30Sentence extends Sentence {
    classification?: string;
    review?: Review;
}
