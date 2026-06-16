import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadPDF = async () => {
  const element = document.getElementById("resume");

  if (!element) {
    throw new Error("Resume preview was not found.");
  }

  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const exportElement = element.cloneNode(true) as HTMLElement;
  exportElement.style.position = "fixed";
  exportElement.style.top = "0";
  exportElement.style.left = "-10000px";
  exportElement.style.width = "210mm";
  exportElement.style.minHeight = "297mm";
  exportElement.style.transform = "none";
  exportElement.style.boxShadow = "none";
  exportElement.style.backgroundColor = "#ffffff";

  document.body.appendChild(exportElement);

  try {
    // Render canvas with high resolution scale
    const canvas = await html2canvas(exportElement, {
      scale: 2.5,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: exportElement.scrollWidth,
      windowHeight: exportElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    // A4 dimensions in mm
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const pdf = new jsPDF("p", "mm", "a4");
    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add more pages if content exceeds A4 height
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Dynamic file name based on candidate's name
    const nameElement = exportElement.querySelector(".resume-name");
    const candidateName = nameElement?.textContent?.trim() || "Resume";
    const safeName = candidateName.replace(/[<>:"/\\|?*]+/g, "").replace(/\s+/g, "_");
    const fileName = `${safeName || "Resume"}_Resume.pdf`;

    pdf.save(fileName);
  } finally {
    exportElement.remove();
  }
};
