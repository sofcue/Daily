    document.getElementById('dateForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const startDate = new Date(document.getElementById('startDate').value);
        const endDate = new Date(document.getElementById('endDate').value);
        const pdfFile = document.getElementById('pdfFile').files[0];

        // Load existing PDF file
        const fileReader = new FileReader();
        fileReader.onload = async function() {
            const existingPdfBytes = new Uint8Array(this.result);
            await addDatesToPDF(existingPdfBytes, startDate, endDate);
        };
        fileReader.readAsArrayBuffer(pdfFile);
    });
    // Function to add dates to PDF
    async function addDatesToPDF(existingPdfBytes, startDate, endDate) {
    // Load existing PDF file
    const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

        startDate.setDate(startDate.getDate() + 1);
        endDate.setDate(endDate.getDate() + 1);
    for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const fontSize = 12;
    const text = startDate.toDateString();
    const textWidth = text.length * fontSize * 0.6; // Approximation of text width
    const x = (width - textWidth) / 2;
    const y = height - 100;
    page.drawText(text, {
    x,
    y,
    size: fontSize,
    color: PDFLib.rgb(0, 0, 0)
});
    startDate.setDate(startDate.getDate() + 1);
    if (startDate.getTime() > endDate.getTime()) break;
}

    // Save modified PDF
        // Save modified PDF
        const modifiedPdfBytes = await pdfDoc.save();

// Convert modified PDF bytes to a Blob
        const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

// Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = window.URL.createObjectURL(modifiedPdfBlob);
        downloadLink.download = 'modified_pdf.pdf';

// Trigger click event to start download
        downloadLink.click();

    // For demonstration, log the modified PDF bytes to console
    console.log(modifiedPdfBytes);
}