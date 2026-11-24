import type { jsPDF } from "jspdf";
import type { AdventCalendar, AdventDoor, SiteCopy, SiteTheme } from "./calendar";
import type { MemoryBookEntry } from "./memory-book";

type PdfPhoto = {
  label: string;
  url: string;
};

const pageWidth = 210;
const pageHeight = 297;
const margin = 16;
const bottomLimit = 277;
const contentWidth = pageWidth - margin * 2;

function rgb(hex: string): [number, number, number] {
  const value = hex.slice(1);
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function fillTemplate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, value),
    template,
  );
}

async function loadPhoto(url: string, surfaceColor: string, copy: SiteCopy) {
  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error(copy.pdfPhotoDownloadError);
  }
  if (!response.ok) {
    throw new Error(fillTemplate(copy.pdfPhotoHttpErrorTemplate, {
      status: String(response.status),
    }));
  }

  const image = await createImageBitmap(await response.blob());
  const scale = Math.min(1, 1200 / Math.max(image.width, image.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(image.width * scale));
  canvas.height = Math.max(1, Math.round(image.height * scale));
  const context = canvas.getContext("2d");
  if (!context) {
    image.close();
    throw new Error(copy.pdfPhotoCanvasError);
  }

  context.fillStyle = surfaceColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  image.close();

  return {
    data: canvas.toDataURL("image/jpeg", 0.8),
    width: canvas.width,
    height: canvas.height,
  };
}

function assertFits(day: number, y: number, height: number, overflowMessage: string) {
  if (y + height > bottomLimit) {
    throw new Error(fillTemplate(overflowMessage, { day: String(day).padStart(2, "0") }));
  }
}

function addParagraph(
  pdf: jsPDF,
  day: number,
  label: string,
  text: string,
  y: number,
  theme: SiteTheme,
  overflowMessage: string,
) {
  if (!text.trim()) return y;
  const fontSize = 9;
  pdf.setFont("times", "bold");
  pdf.setFontSize(9);
  const labelLines = pdf.splitTextToSize(label, contentWidth) as string[];
  const bodyLines = pdf.splitTextToSize(text, contentWidth) as string[];
  const labelHeight = labelLines.length * 4.2;
  const bodyHeight = bodyLines.length * (fontSize * 0.48);
  assertFits(day, y, labelHeight + bodyHeight + 4, overflowMessage);
  pdf.setTextColor(...rgb(theme.primary));
  pdf.text(labelLines, margin, y);
  y += labelHeight + 1;
  pdf.setFont("times", "normal");
  pdf.setFontSize(fontSize);
  pdf.setTextColor(...rgb(theme.text));
  pdf.text(bodyLines, margin, y);
  return y + bodyHeight + 4;
}

function activityName(type: string, copy: SiteCopy) {
  switch (type) {
    case "text":
      return copy.textActivityLabel;
    case "photo":
      return copy.photoActivityLabel;
    case "choice":
      return copy.choiceActivityLabel;
    case "slider":
      return copy.sliderActivityLabel;
    case "riddle":
      return copy.riddleActivityLabel;
    default:
      return copy.pdfMemoryLabel;
  }
}

function collectPhotos(door: AdventDoor, entry: MemoryBookEntry | undefined, copy: SiteCopy): PdfPhoto[] {
  const photos: PdfPhoto[] = [];
  if (door.received && door.imageUrl) {
    photos.push({
      label: fillTemplate(copy.pdfGiftPhotoLabelTemplate, {
        title: door.title || copy.giftHeading,
      }),
      url: door.imageUrl,
    });
  }

  if (entry) {
    for (const activity of door.activities) {
      const url = entry.photoUrls[activity.id];
      if (url) {
        photos.push({
          label: activity.prompt || activityName(activity.type, copy),
          url,
        });
      }
    }
  }
  return photos;
}

async function addPhotoGrid(
  pdf: jsPDF,
  day: number,
  photos: PdfPhoto[],
  y: number,
  theme: SiteTheme,
  copy: SiteCopy,
  overflowMessage: string,
) {
  if (photos.length === 0) return y;
  const columns = 2;
  const gap = 6;
  const boxWidth = (contentWidth - gap) / columns;
  const rowHeight = 48;

  for (let index = 0; index < photos.length; index += columns) {
    assertFits(day, y, rowHeight + 3, overflowMessage);
    const row = photos.slice(index, index + columns);
    const loadedPhotos = await Promise.all(
      row.map((photo) => loadPhoto(photo.url, theme.surface, copy)),
    );

    row.forEach((photo, rowIndex) => {
      const x = margin + rowIndex * (boxWidth + gap);
      const image = loadedPhotos[rowIndex];
      const labelLines = pdf.splitTextToSize(photo.label || theme.text, boxWidth) as string[];
      pdf.setFont("times", "italic");
      pdf.setFontSize(7.5);
      pdf.setTextColor(...rgb(theme.muted));
      pdf.text(labelLines.slice(0, 2), x, y + 3);

      const labelHeight = labelLines.length > 1 ? 7 : 4;
      const maxImageHeight = rowHeight - labelHeight - 2;
      const scale = Math.min(boxWidth / image.width, maxImageHeight / image.height);
      const imageWidth = image.width * scale;
      const imageHeight = image.height * scale;
      pdf.addImage(
        image.data,
        "JPEG",
        x + (boxWidth - imageWidth) / 2,
        y + labelHeight + 1,
        imageWidth,
        imageHeight,
      );
    });
    y += rowHeight;
  }
  return y + 2;
}

export async function createMemoryBookPdf(
  calendar: AdventCalendar,
  entries: MemoryBookEntry[],
) {
  const { jsPDF: PdfDocument } = await import("jspdf");
  const pdf = new PdfDocument({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const entryByDay = new Map(entries.map((entry) => [entry.day, entry]));
  const { siteCopy: copy, theme } = calendar;
  const overflowMessage = copy.pdfOverflowMessage;

  for (const [index, door] of calendar.doors.entries()) {
    if (index > 0) pdf.addPage();

    pdf.setFillColor(...rgb(theme.background));
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
    pdf.setDrawColor(...rgb(theme.line));
    pdf.roundedRect(9, 9, pageWidth - 18, pageHeight - 18, 2, 2, "S");

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(...rgb(theme.accent));
    pdf.text(
      fillTemplate(copy.pdfHeaderTemplate, {
        brand: copy.brand,
        day: String(door.day).padStart(2, "0"),
      }),
      margin,
      20,
    );

    pdf.setFont("times", "normal");
    pdf.setFontSize(23);
    pdf.setTextColor(...rgb(theme.primaryDark));
    pdf.text(
      fillTemplate(copy.pdfDateTemplate, { day: String(door.day) }),
      margin,
      32,
    );

    let y = 40;
    y = addParagraph(
      pdf,
      door.day,
      door.title || copy.defaultDayTitle,
      door.story,
      y,
      theme,
      overflowMessage,
    );

    if (door.physicalClue) {
      y = addParagraph(
        pdf,
        door.day,
        copy.pdfClueLabel,
        door.physicalClue,
        y,
        theme,
        overflowMessage,
      );
    }

    const entry = entryByDay.get(door.day);
    y = await addPhotoGrid(
      pdf,
      door.day,
      collectPhotos(door, entry, copy),
      y,
      theme,
      copy,
      overflowMessage,
    );

    if (door.received && door.message) {
      y = addParagraph(
        pdf,
        door.day,
        copy.pdfGiftMessageLabel,
        door.message,
        y,
        theme,
        overflowMessage,
      );
    }

    if (entry) {
      for (const activity of door.activities) {
        const answer = entry.answers[activity.id];
        if (!answer?.trim() || activity.type === "photo") continue;
        y = addParagraph(
          pdf,
          door.day,
          activity.prompt || activityName(activity.type, copy),
          answer,
          y,
          theme,
          overflowMessage,
        );
      }
    } else {
      y = addParagraph(
        pdf,
        door.day,
        copy.pdfMemoryLabel,
        copy.pdfWaitingMessage,
        y,
        theme,
        overflowMessage,
      );
    }

    pdf.setDrawColor(...rgb(theme.line));
    pdf.line(margin, 282, pageWidth - margin, 282);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(...rgb(theme.muted));
    pdf.text(copy.pdfFooter, margin, 288);
    pdf.text(
      fillTemplate(copy.pdfPageNumberTemplate, {
        day: String(door.day).padStart(2, "0"),
      }),
      pageWidth - margin,
      288,
      { align: "right" },
    );
  }

  return pdf;
}
