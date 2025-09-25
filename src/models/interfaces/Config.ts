import Frequency from "./Frequency";
import Rules from "./Rules";

export default interface Config {
    creation_date: Date;
    reminder: Date;
    frequency: Frequency;
    rules?: Rules; 
}