const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateFeeHistoryPdf = (student) => {
  return new Promise((resolve, reject) => {
    const dir = path.join(__dirname, '../../../frontend/public/assets');

    console.log(`Checking if directory exists: ${dir}`);
    if (!fs.existsSync(dir)) {
      console.log(`Directory does not exist. Creating directory: ${dir}`);
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${student._id}_fee_history.pdf`);
    console.log(`Generated file path: ${filePath}`);

    const doc = new PDFDocument();

    doc.pipe(fs.createWriteStream(filePath))
      .on('finish', () => {
        console.log(`PDF successfully created at: ${filePath}`);
        resolve(filePath);
      })
      .on('error', (error) => {
        console.error('Error writing PDF file:', error);
        reject(error);
      });

    doc.fontSize(20).text(`Fee History for ${student.name}`, { align: 'center' });
    doc.moveDown();

    doc.fontSize(14).text(`Age: ${student.age}`);
    doc.text(`Date of Joining: ${student.dateOfJoining}`);
    doc.text(`Batch: ${student.batch}`);
    doc.moveDown();

    doc.fontSize(16).text('Fee History:', { underline: true });
    doc.moveDown();

    // Table headers and rows
    const table = {
      headers: ['Entry', 'Status', 'Date'],
      rows: student.feeHistory.map((entry, index) => [
        `${index + 1}`,
        entry.status,
        new Date(entry.date).toLocaleDateString()
      ])
    };

    // Set table starting position
    const tableTop = doc.y;
    const tableLeft = doc.x;
    const cellPadding = 5;
    const cellWidth = 150;
    const cellHeight = 20;

    // Draw table headers
    table.headers.forEach((header, index) => {
      doc.rect(tableLeft + index * cellWidth, tableTop, cellWidth, cellHeight).stroke();
      doc.text(header, tableLeft + index * cellWidth + cellPadding, tableTop + cellPadding, {
        width: cellWidth - cellPadding * 2,
        align: 'center'
      });
    });

    // Draw table rows
    table.rows.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const yPos = tableTop + (rowIndex + 1) * cellHeight;
        doc.rect(tableLeft + cellIndex * cellWidth, yPos, cellWidth, cellHeight).stroke();
        doc.text(cell, tableLeft + cellIndex * cellWidth + cellPadding, yPos + cellPadding, {
          width: cellWidth - cellPadding * 2,
          align: 'center'
        });
      });
    });


    doc.end();
  });
};

module.exports = { generateFeeHistoryPdf };
