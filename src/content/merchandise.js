import { formatDeadlineNotice } from '../lib/dateUtils';

export const Merchandise = {
  sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  price: 420,
  priceWords: 'Four hundred and twenty only',
  upiId: '9103355700@ptyes',
  blurImage: '/assets/merchandise/merch-banner.webp',
  merchImage: '/assets/merchandise/merch-banner.webp',
  sizeChartImage : '/assets/merchandise/size-chart.webp',
  qrImage: '/assets/merchandise/payment-qr.webp',
  // Takes the merchandise deadlines from Supabase so the "last date" line is always current.
  instructions: (deadlines) => [
    `Last Date to fill the form is ${formatDeadlineNotice(deadlines.closingDate)}`,
    'Fill in every field exactly as it should appear on record — double check the details you entered before submitting.',
    'Please ensure the name you enter in \u201CName to be printed on Merch\u201D is appropriate. We reserve the right to change it if necessary.',
    'Complete the payment using the QR code or UPI ID shown alongside this form and upload the screenshot in \u201CUpload Payment Screenshot\u201D.',
    'Merch orders will not be placed in case of non-payment or incorrect payment. Kindly ensure the exact amount is paid.',
    'In case of any queries, please feel free to contact any of the Board Members or reach us through the Contact Us section below.',
  ],
};
