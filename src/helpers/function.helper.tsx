import { TFieldCreate } from "@/components/content-admin/ContentAdmin";
import { Loader } from "@mantine/core";
import dayjs from "dayjs";
import { ReactElement } from "react";
import * as Yup from "yup";

// export const checkPathImage = (path: string | null | undefined) => {
//    if (!path) return path;
//    if (path.includes(`http`)) return path;

//    if (path.includes(`local`)) {
//       return `${BASE_DOMAIN_API}${FOLDER_IMAGE_BE}${path}`;
//    } else {
//       return `${BASE_DOMAIN_CLOUDINARY}${path}`;
//    }
// };

export const resError = (error: any, defaultMes: string) => {
   let mes = error.response?.data?.message;
   if (!mes) mes = defaultMes;
   if (Array.isArray(mes)) mes = mes[0];
   return mes;
};

export const formatLocalTime = (time?: dayjs.ConfigType, format = "HH:mm:ss DD/MM/YYYY") => {
   if (typeof time === "string") {
      if (format === `ago`) return dayjs.utc(time).local().fromNow();
      return dayjs.utc(time).local().format(format);
   } else if (typeof time === "number") {
      if (format === `ago`) return dayjs.unix(time).local().fromNow();
      return dayjs.unix(time).local().format(format);
   } else {
      if (format === `ago`) return dayjs().local().fromNow();
      return dayjs().local().format(format);
   }
};

export function moveElementToTop<T>(arr: T[], condition: (item: T) => boolean): T[] {
   const matched = arr.filter(condition); // Lấy phần tử thỏa mãn điều kiện
   const others = arr.filter((item) => !condition(item)); // Lấy phần tử không thỏa mãn
   return matched.concat(others); // Ghép lại, đảm bảo phần tử thỏa mãn lên đầu
}

export class LogWithColor {
   private tagText: string = "";
   private tagColor: string = "gray";
   private messageText: string = "";
   private messageColor: string = "black";

   // 🏷️ Thiết lập tag
   tag(tag: string, color: string = "gray") {
      this.tagText = tag;
      this.tagColor = color;
      return this; // 👈 Cho phép chain method tiếp theo
   }

   // ✉️ Thiết lập message
   mes(message: string, color: string = "white") {
      this.messageText = message;
      this.messageColor = color;
      this.printLog();
   }

   // 📌 Thực hiện console.log với màu
   private printLog() {
      console.log(
         `%c[${this.tagText}] %c${this.messageText}`,
         `color: ${this.tagColor}; font-weight: bold;`,
         `color: ${this.messageColor}; font-weight: bold;`
      );
   }
}

// ✅ Khởi tạo instance
export const logWithColor = new LogWithColor();

export const renderData = (
   data: number | string | undefined | null,
   loadingNumber?: boolean,
   init: string = "-",
   length: number = 3
): number | string | ReactElement => {
   if (loadingNumber) return <Loader size={16} color={`var(--text-color)`} />;
   if (data === null || data === undefined) return init;

   if (typeof data === "string") return data;
   return fBeautifulNumber(data, length);
};

export function fBeautifulNumber(str: any, length = 0) {
   try {
      if (str) {
         if (typeof str === "number") {
            str = str.toFixed(8);
         } else {
            str = str.replace(/[^\d.]/g, "");
         }
         str += "";
         const x = str.split(".");
         let x1 = x[0];
         const x2 = x[1];
         let x3 = "";
         if (x2) {
            let decimalPlaces = x2.replace(/0+$/, "").length;
            if (decimalPlaces > length) {
               decimalPlaces = length;
            }
            x3 = decimalPlaces > 0 ? "." + x2.slice(0, decimalPlaces) : "";
         }
         if (!x1) x1 = "0";
         const rgx = /(\d+)(\d{3})/;
         while (rgx.test(x1)) {
            x1 = x1.replace(rgx, "$1,$2");
         }
         const result = (x1 + x3).replace(/^0+(?!\.|$)/, "").replace(/^\./, "");
         return result;
      } else {
         return "0";
      }
   } catch (error) {
      console.log(error);
      return "0";
   }
}

export function toJson(params: any) {
   return JSON.parse(JSON.stringify(params));
}

export function buildInitialValues(fields: TFieldCreate[]) {
   return fields.reduce((acc, field) => {
      acc[field.name] = field.type === "number" ? 0 : "";
      return acc;
   }, {} as Record<string, any>);
}

export function buildValidationSchema(fields: TFieldCreate[]) {
   const shape: Record<string, any> = {};

   fields.forEach((field) => {
      let validator: any = null;

      switch (field.type) {
         case "text":
            validator = Yup.string();
            break;
         case "number":
            validator = Yup.number();
            break;
         case "select":
            validator = Yup.string();
            break;
         case "date":
            validator = Yup.date();
            break;
         default:
            validator = Yup.mixed();
      }

      if (field.withAsterisk) {
         validator = validator.required(`${field.label} is required`);
      }

      if (field.validate) {
         // Nếu có custom validate → apply
         validator = field.validate(Yup, validator);
      }

      shape[field.name] = validator;
   });

   return Yup.object().shape(shape);
}

export function buildFormDataOrObject(values: Record<string, any>) {
   const result: Record<string, any> = {};
   const formData = new FormData();

   for (const key in values) {
      const value = values[key];

      if (value instanceof File) {
         formData.append("file", value);
         result[key] = formData;
      } else if (typeof value === "string") {
         result[key] = value.trim();
      } else {
         result[key] = value;
      }
   }

   return result;
}

export const wait = (miliseconds: number) => {
   return new Promise(function (resolve) {
      setTimeout(resolve, miliseconds);
   });
};

export function getDeliveryDateRange() {
   const fromDate = dayjs().add(5, "day");
   const toDate = fromDate.add(3, "day");

   const formattedFromDate = fromDate.format("DD [Tháng] M");
   const formattedToDate = toDate.format("DD [Tháng] M");

   return `${formattedFromDate} - ${formattedToDate}`;
}