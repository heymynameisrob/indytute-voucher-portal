import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from 'react-toastify';
import download from 'downloadjs';

const headers = {
  "Access-Control-Allow-Origin": "*"
}

export const modifyPDF = async (data) => {

  const {orderID, voucherExists, pin, sku} = data;
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
  firstPage.drawText('June 25th 2022', {x: 130, ...valueText});
  firstPage.drawText(pin.toString(), {x: 270, ...valueText});

  try {    
    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, `${orderID}-voucher.pdf`, "application/pdf");
    toast.success('Downloaded PDF')
  } catch(err) {
    console.log('Error:', err)
  }

  
}