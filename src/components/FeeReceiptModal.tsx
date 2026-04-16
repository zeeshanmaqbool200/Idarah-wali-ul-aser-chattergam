import React from 'react';
import { 
  Dialog, DialogContent, Box, Typography, Button, Divider, 
  Grid, IconButton, Chip, Table, TableBody, TableCell, TableContainer, TableRow, TableHead, DialogActions,
  useTheme, alpha
} from '@mui/material';
import { Printer, Download, X, FileText, CheckCircle, Clock, ShieldCheck } from 'lucide-react';
import { FeeReceipt, InstituteSettings } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toWords } from 'number-to-words';
import { format } from 'date-fns';

interface FeeReceiptModalProps {
  open: boolean;
  onClose: () => void;
  receipt: FeeReceipt | null;
  settings?: InstituteSettings;
}

const defaultSettings: InstituteSettings = {
  name: 'IDARAH WALI UL ASER',
  maktabName: 'MAKTAB WALI UL ASER',
  tagline: 'First Step Towards Building Taqwa',
  address: 'Banpora Chattergam 191113, Kashmir',
  phone: '+91 7006123456',
  email: 'idarahwaliulaser@gmail.com',
  logoUrl: './images/logo.png',
  primaryColor: '#0d9488',
  secondaryColor: '#0f766e',
  website: 'idarahwaliulaser.netlify.app',
  receiptPrefix: 'WUA',
  mission: 'Mission of Sayyed Mustafa Hamadani RA. Bringing Innovative and authentic Islamic knowledge and holding new competitions to boost interests of Gen-Z and Gen-X students.',
  founded: '2005',
  greeting: 'Asslamualikum',
  team: {
    chairman: 'Shabir Ahmad',
    financeManager: 'Bashir Ahmad',
    supervisor: 'Irfan Hussain',
    organizer: 'Mudasir Ahmad',
    secretary: 'Showkat Ahmad',
    mediaConsultant: 'Yawar Abbas',
    socialMediaManager: 'Bilal A',
    mediaIncharge: 'Yawar Abbas'
  },
  id: 'default'
};

export default function FeeReceiptModal({ open, onClose, receipt, settings: propSettings }: FeeReceiptModalProps) {
  const theme = useTheme();
  const settings = propSettings || defaultSettings;
  
  if (!receipt) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('receipt-content');
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback if popup is blocked
      window.print();
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${receiptNo}</title>
          ${styles}
          <style>
            body { margin: 0; padding: 0; background: white; }
            #receipt-content { 
              box-shadow: none !important; 
              margin: 0 !important; 
              padding: 20px !important;
              width: 100% !important;
              max-width: none !important;
              min-height: auto !important;
              color: black !important;
            }
            .no-print { display: none !important; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div id="receipt-content">
            ${printContent.innerHTML}
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('receipt-content');
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 3, useCORS: true });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Receipt_${receipt.receiptNo || receipt.receiptNumber}.pdf`);
  };

  const receiptNo = receipt.receiptNo || receipt.receiptNumber;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth 
      PaperProps={{ 
        sx: { 
          borderRadius: 2,
          overflow: 'hidden',
          '@media print': {
            boxShadow: 'none',
            p: 0,
            m: 0,
            width: '100%',
            maxWidth: 'none'
          }
        } 
      }}
    >
      <Box sx={{ 
        p: 2.5, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid', 
        borderColor: 'divider',
        bgcolor: 'background.paper',
        position: 'relative',
        '@media print': { display: 'none' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <FileText size={20} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>Official Raseed - {receiptNo}</Typography>
        </Box>
        <IconButton onClick={onClose} className="close-button">
          <X size={20} />
        </IconButton>
      </Box>

      <DialogContent sx={{ 
        p: { xs: 2, md: 4 }, 
        bgcolor: 'background.default',
        maxHeight: '80vh',
        overflowY: 'auto',
        '&::-webkit-scrollbar': { width: '6px' },
        '&::-webkit-scrollbar-track': { background: 'transparent' },
        '&::-webkit-scrollbar-thumb': { background: alpha(theme.palette.primary.main, 0.2), borderRadius: 10 },
        '@media print': { bgcolor: 'white', p: 0, maxHeight: 'none', overflow: 'visible' }
      }}>
        <Box 
          id="receipt-content"
          sx={{ 
            bgcolor: 'white !important', 
            p: { xs: 3, md: 6 }, 
            borderRadius: 1, 
            boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '800px',
            width: '100%',
            maxWidth: '800px',
            mx: 'auto',
            display: 'flex',
            flexDirection: 'column',
            color: '#000000 !important',
            // Force dark text for readability on white background in dark mode
            '& .MuiTypography-root': { color: '#1a1a1a !important' },
            '& .MuiTableCell-root': { color: '#1a1a1a !important', borderColor: 'rgba(0,0,0,0.1) !important' },
            '& .MuiDivider-root': { borderColor: 'rgba(0,0,0,0.1) !important' },
            '& .MuiChip-root': { color: '#1a1a1a !important' },
            '& .MuiChip-label': { color: 'inherit !important' },
            '@media print': {
              boxShadow: 'none !important',
              borderRadius: 0,
              p: 4,
              minHeight: 'auto'
            }
          }}
        >
          {/* Islamic Pattern Background */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            opacity: 0.03, 
            pointerEvents: 'none',
            backgroundImage: `repeating-conic-gradient(from 45deg, ${theme.palette.primary.main} 0deg 90deg, transparent 90deg 180deg)`,
            backgroundSize: '40px 40px',
            zIndex: 0
          }} />
          {/* Watermark */}
          <Typography 
            variant="h1" 
            sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%) rotate(-45deg)', 
              opacity: 0.03, 
              fontWeight: 900,
              zIndex: 0,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              fontSize: '6rem',
              color: theme.palette.primary.main,
              textAlign: 'center'
            }}
          >
            {settings.maktabName.toUpperCase()}
          </Typography>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 6, position: 'relative', zIndex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <Box 
                component="img" 
                src={settings.logoUrl || 'https://idarahwaliulaser.netlify.app/img/logo.png'} 
                alt="Logo" 
                sx={{ width: 90, height: 90, borderRadius: 1, objectFit: 'cover', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', bgcolor: 'white' }} 
                referrerPolicy="no-referrer" 
                crossOrigin="anonymous"
                onError={(e: any) => {
                  e.target.src = 'https://idarahwaliulaser.netlify.app/img/logo.png';
                }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900, color: `${theme.palette.primary.main} !important`, letterSpacing: -1, mb: 0.5 }}>{settings.name}</Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: `${theme.palette.secondary.main} !important`, mb: 1 }}>{settings.maktabName}</Typography>
                <Typography variant="body2" sx={{ maxWidth: 350, fontWeight: 500, lineHeight: 1.4, color: '#4b5563 !important' }}>{settings.address}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5, color: '#4b5563 !important' }}>Ph: {settings.phone} • {settings.email}</Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: '#e5e7eb !important', mb: 1, letterSpacing: 2 }}>RASEED</Typography>
              <Box sx={{ bgcolor: '#f9fafb', p: 1.5, borderRadius: 1, border: '1px solid', borderColor: '#e5e7eb' }}>
                <Typography variant="body2" sx={{ fontWeight: 800, color: `${theme.palette.primary.main} !important` }}>No: {receiptNo}</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', color: '#1a1a1a !important' }}>Date: {format(new Date(receipt.date), 'dd MMM, yyyy')}</Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mb: 5, borderStyle: 'dashed', borderWidth: 1 }} />

          {/* Details Grid */}
          <Grid container spacing={4} sx={{ mb: 6, position: 'relative', zIndex: 1 }}>
            <Grid size={6}>
              <Typography variant="overline" sx={{ fontWeight: 900, color: '#9ca3af !important', letterSpacing: 1.5 }}>Talib-e-Ilm Details</Typography>
              <Box sx={{ mt: 1.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 0.5, color: '#1a1a1a !important' }}>{receipt.studentName}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#4b5563 !important' }}>Admission No: {receipt.studentId}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#4b5563 !important' }}>Maktab Level: {receipt.grade || 'N/A'}</Typography>
              </Box>
            </Grid>
            <Grid size={6} sx={{ textAlign: 'right' }}>
              <Typography variant="overline" sx={{ fontWeight: 900, color: '#9ca3af !important', letterSpacing: 1.5 }}>Adaigi ki Tafseel</Typography>
              <Box sx={{ mt: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                <Chip 
                  label={receipt.status.toUpperCase()} 
                  color={receipt.status === 'approved' ? 'success' : 'warning'} 
                  icon={receipt.status === 'approved' ? <CheckCircle size={14} /> : <Clock size={14} />}
                  sx={{ fontWeight: 900, borderRadius: 1, height: 28, px: 1, color: 'white !important' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1a1a1a !important' }}>Mode: <Box component="span" sx={{ color: `${theme.palette.primary.main} !important` }}>{receipt.paymentMode}</Box></Typography>
                {receipt.transactionId && (
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4b5563 !important' }}>Ref: {receipt.transactionId}</Typography>
                )}
              </Box>
            </Grid>
          </Grid>

          {/* Table */}
          <TableContainer sx={{ mb: 5, borderRadius: 1, border: '1px solid', borderColor: '#e5e7eb', position: 'relative', zIndex: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f9fafb' }}>
                  <TableCell sx={{ fontWeight: 900, py: 2, color: '#1a1a1a !important' }}>Tafseel (Description)</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 900, color: '#1a1a1a !important' }}>Raqam (Amount)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell sx={{ py: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5, color: '#1a1a1a !important' }}>{receipt.feeHead}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: '#4b5563 !important' }}>{receipt.remarks || 'Standard fee payment for the current academic session.'}</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: '#1a1a1a !important' }}>₹{receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</Typography>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
                  <TableCell align="right" sx={{ py: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1a1a1a !important' }}>Kul Ada-shuda Raqam</Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: `${theme.palette.primary.main} !important` }}>
                      ₹{receipt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Amount in Words */}
          <Box sx={{ mb: 6, p: 2.5, bgcolor: '#f9fafb', borderRadius: 1, border: '1px solid', borderColor: '#e5e7eb', position: 'relative', zIndex: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: '#9ca3af !important', letterSpacing: 1 }}>Lafzon mein Raqam (Amount in Words)</Typography>
            <Typography variant="body1" sx={{ fontWeight: 800, textTransform: 'capitalize', color: '#1a1a1a !important', mt: 0.5 }}>
              {toWords(receipt.amount)} Rupees Only
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ mt: 'auto', pt: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
            <Box sx={{ textAlign: 'center' }}>
              <Box sx={{ width: 180, height: 60, borderBottom: '1px solid', borderColor: '#e5e7eb', mb: 1.5 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#4b5563 !important' }}>Talib-e-Ilm ke Dastakhat</Typography>
            </Box>
            
            <Box sx={{ textAlign: 'center' }}>
              {receipt.status === 'approved' ? (
                <Box sx={{ mb: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <ShieldCheck size={40} color={theme.palette.success.main} style={{ opacity: 0.5, marginBottom: 8 }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, color: `${theme.palette.success.main} !important`, display: 'block' }}>
                    DIGITALLY VERIFIED
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#4b5563 !important' }}>
                    By {receipt.approvedByName}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ height: 60, mb: 2 }} />
              )}
              <Box sx={{ width: 180, height: 1, bgcolor: '#e5e7eb', mb: 1.5 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#4b5563 !important' }}>Tasdiq-shuda Dastakhat</Typography>
            </Box>
          </Box>

          <Box sx={{ mt: 8, textAlign: 'center', borderTop: '1px solid', borderColor: '#e5e7eb', pt: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#9ca3af !important' }}>
              This is a computer-generated document. No physical signature is required for digitally verified receipts.
              <br />© {new Date().getFullYear()} {settings.name}. All Rights Reserved.
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider', '@media print': { display: 'none' } }}>
        <Button 
          startIcon={<Printer size={18} />} 
          onClick={handlePrint} 
          variant="outlined"
          sx={{ borderRadius: 1, fontWeight: 800, px: 3 }}
        >
          Raseed Print Karein
        </Button>
        <Button 
          startIcon={<Download size={18} />} 
          onClick={handleDownloadPDF} 
          variant="contained"
          sx={{ borderRadius: 1, fontWeight: 800, px: 3, boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}` }}
        >
          PDF Download Karein
        </Button>
      </DialogActions>
    </Dialog>
  );
}
