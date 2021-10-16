import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { toast } from 'react-toastify';
import download from 'downloadjs';

const headers = {
  "Access-Control-Allow-Origin": "*"
}

export const modifyPDF = async (data) => {

  const {orderID, voucherURL, expiryDate} = data;

  if(voucherURL.includes('https') === false) {
    toast.error('Cant download PDF')
    return null
  }

  toast.success('Downloaded PDF')

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

  firstPage.drawText('Order No', {x:35, y: height / 2 + 300, ...labelText});
  firstPage.drawText('Expiry date', {x: 150, y: height / 2 + 300, ...labelText});
  firstPage.drawText('Voucher PIN', {x: 270, y: height / 2 + 300, ...labelText});

  firstPage.drawText(orderID.toString(), {x:35, ...valueText});
  firstPage.drawText(expiryDate, {x: 150, ...valueText});
  firstPage.drawText('0000', {x: 270, ...valueText});

  try {    
    const pdfBytes = await pdfDoc.save()
    download(pdfBytes, `${orderID}-voucher.pdf`, "application/pdf");
  } catch(err) {
    console.log('Error:', err)
  }

  
}