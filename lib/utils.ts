import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { FormData } from "./form-type"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const transformFormData = (data:FormData)=>({
        HR: data.HR.map(Number),
        MAP: data.MAP.map(Number),
        O2Sat: data.O2Sat.map(Number),
        SBP: data.SBP.map(Number),
        Resp: data.Resp.map(Number),
        Unit1: Number(data.Unit1),
        Gender: Number(data.Gender),
        HospAdmTime: Number(data.HospAdmTime),
        Age: Number(data.Age),
        DBP: Number(data.DBP),
        Temp: Number(data.Temp),
        Glucose: Number(data.Glucose),
        Potassium: Number(data.Potassium),
        Hct: Number(data.Hct),
        FiO2: Number(data.FiO2),
        Hgb: Number(data.Hgb),
        pH: Number(data.pH),
        BUN: Number(data.BUN),
        WBC: Number(data.WBC),
        Magnesium: Number(data.Magnesium),
        Creatinine: Number(data.Creatinine),
        Platelets: Number(data.Platelets),
        Calcium: Number(data.Calcium),
        PaCO2: Number(data.PaCO2),
        BaseExcess: Number(data.BaseExcess),
        Chloride: Number(data.Chloride),
        HCO3: Number(data.HCO3),
        Phosphate: Number(data.Phosphate),
        EtCO2: Number(data.EtCO2),
        SaO2: Number(data.SaO2),
        PTT: Number(data.PTT),
        Lactate: Number(data.Lactate),
        AST: Number(data.AST),
        Alkalinephos: Number(data.Alkalinephos),
        Bilirubin_total: Number(data.Bilirubin_total),
        TroponinI: Number(data.TroponinI),
        Fibrinogen: Number(data.Fibrinogen),
        Bilirubin_direct: Number(data.Bilirubin_direct),
})