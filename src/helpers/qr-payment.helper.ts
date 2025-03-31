import { BanksObject, QRPay } from "vietnam-qr-pay";
import QRCode from "qrcode";

export const createQRMomopay = async (amount: string, purpose: string) => {
   const accountNumber = "99MM24343M62710222";

   const momoQR = QRPay.initVietQR({
      bankBin: BanksObject.banviet.bin,
      bankNumber: accountNumber,
      amount,
      purpose,
   });

   momoQR.additionalData.reference = "MOMOW2W" + accountNumber.slice(10);

   momoQR.setUnreservedField("80", "578");

   const content2 = momoQR.build();
   return await QRCode.toDataURL(content2);
};

export const createVietQR = async (amount: string, purpose: string) => {
   const qrPay = QRPay.initVietQR({
      bankBin: BanksObject.acb.bin,
      bankNumber: "14553261",
      amount,
      purpose,
   });
   const content1 = qrPay.build();
   return await QRCode.toDataURL(content1);
};

export const createQRZalopay = async (amount: string, purpose: string) => {
   const accountNumber = "99ZP25089M89819615";

   const zaloPayQR = QRPay.initVietQR({
      bankBin: BanksObject.banviet.bin,
      bankNumber: accountNumber,
      amount,
      purpose,
   });

   const content = zaloPayQR.build();
   return await QRCode.toDataURL(content);
};

// export const createVNPay = async (amount: string, purpose: string) => {
//    const qrPay = QRPay.initVNPayQR({
//       merchantId: '0102154778',
//       merchantName: 'TUGIACOMPANY',
//       store: 'TU GIA COMPUTER',
//       terminal: 'TUGIACO1',
//     })
//     const content = qrPay.build()
// };
