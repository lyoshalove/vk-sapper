import { smile } from "@/constants";
import { changeToGetValuesType } from "@/features/helpers";

const smileCopy = changeToGetValuesType(smile);

type TSmileKeys = keyof typeof smileCopy;

export type TSmileValues = typeof smileCopy[TSmileKeys];

export type TSmile =  {
  SMILE: "smile";
  SCARED: "scared";
  COOL: "cool";
  DEAD: "dead";
}
