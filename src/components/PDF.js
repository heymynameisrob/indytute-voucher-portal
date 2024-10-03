import { PDFDocument, rgb } from 'pdf-lib';
import { toast } from 'react-toastify';
import download from 'downloadjs';

const headers = {
  "Access-Control-Allow-Origin": "*"
}

export const modifyPDF = async (data) => {

  const {orderID, voucherExists, expiryDate, pin, sku} = data;
  const voucherURL = `https://storage.googleapis.com/indytute-voucher-print.appspot.com/${sku}.pdf`

  if(voucherExists === false) {    
    toast.error('Cant download PDF')
    return null
  }

  const existingPdfBytes = await fetch(voucherURL, headers)
    .then(res => res.arrayBuffer())
    .catch(err => console.log(err));

  const pdfDoc = await PDFDocument.load(existingPdfBytes)  
  const [firstPage] = pdfDoc.getPages()  

  // Get the width and height of the first page
  const { height } = firstPage.getSize();

  const date = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startDate = new Date(year, 9, 25); // October 25th
    const endDate = new Date(year, 11, 25); // December 25th
    
    if (currentDate >= startDate && currentDate <= endDate) {
      return `June 25th ${year + 1}`;
    } else {
      return expiryDate.toString();
    }
  };

  const labelText = {  
    y: height - 800,  
    size:8,
    color: rgb(0,0,0),    
  }
  const valueText = {    
    y: height - 820,
    size:12,
    color: rgb(0,0,0),    
  }

  firstPage.drawText('Voucher No', {x:35, y: height / 2 + 300, ...labelText});
  firstPage.drawText('Register by', {x: 130, y: height / 2 + 300, ...labelText});
  firstPage.drawText('Voucher PIN', {x: 270, y: height / 2 + 300, ...labelText});

  firstPage.drawText(orderID.toString(), {x:35, ...valueText});
  firstPage.drawText(date, {x: 130, ...valueText}); // Normal Expiry
  // firstPage.drawText(expiryDate.toString(), {x: 130, ...valueText}); // Normal Expiry
  // firstPage.drawText('June 25th 2023', {x: 130, ...valueText});
  firstPage.drawText(pin.toString(), {x: 270, ...valueText});
  

  try {    
    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, `${orderID}-voucher.pdf`, "application/pdf");
    toast.success('Downloaded PDF')
  } catch(err) {
    console.log('Error:', err)
  }

  
}