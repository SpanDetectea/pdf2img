import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addSelection } from "../../redux/slices/selectionsSlice";
import * as pdfjsLib from "pdfjs-dist/webpack";
import "./PdfViewer.css";
import Header from "./Header/Header";
import PdfPage from "./PdfPage/PdfPage";

const PdfViewer = ({ setOnError }) => {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pages, setPages] = useState([]);
  const canvasRefs = useRef([]);
  const overlayRefs = useRef([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentRect, setCurrentRect] = useState(null);
  const [selections, setSelections] = useState([]);
  const [scale, setScale] = useState(1.5);
  const dispatch = useDispatch();

  useEffect(() => {
    const filename = new URLSearchParams(window.location.search).get(
      "filename"
    );
    pdfjsLib
      .getDocument(`/${filename}`)
      .promise.then((pdf) => {
        setPdfDoc(pdf);
        const pagesArray = Array.from(
          { length: pdf.numPages },
          (_, i) => i + 1
        );
        setPages(pagesArray);
        setOnError(null);
      })
      .catch((error) => {
        console.error("Ошибка загрузки PDF:", error);
        setOnError(true);
      });
  }, [setOnError]);

  useEffect(() => {
    if (!pdfDoc || pages.length === 0) return;
    pages.forEach(async (pageNum, index) => {
      const canvas = canvasRefs.current[index];
      if (!canvas) return;

      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d");
      await page.render({ canvasContext: context, viewport }).promise;

      const overlay = overlayRefs.current[index];
      if (overlay) {
        overlay.width = viewport.width;
        overlay.height = viewport.height;
      }
    });
  }, [pdfDoc, pages, scale]);

  const handleMouseDown = (e, pageIndex) => {
    const canvas = overlayRefs.current[pageIndex];
    const rect = canvas.getBoundingClientRect();
    setStartPoint({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pageIndex,
    });
    setIsSelecting(true);
  };

  const handleMouseMove = (e, pageIndex) => {
    if (!isSelecting || startPoint?.pageIndex !== pageIndex) return;

    const canvas = overlayRefs.current[pageIndex];
    const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const x = Math.min(startPoint.x, currentX);
    const y = Math.min(startPoint.y, currentY);
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);

    setCurrentRect({ x, y, width, height, pageIndex });

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
  };

  const handleMouseUp = () => {
    if (isSelecting && currentRect) {
      setSelections((prev) => [...prev, currentRect]);
    }
    setIsSelecting(false);
    setStartPoint(null);
    setCurrentRect(null);
  };

  const cropToBase64 = () => {
    selections.forEach((sel) => {
      console.log(sel);
      const sourceCanvas = canvasRefs.current[sel.pageIndex];
      const croppedCanvas = document.createElement("canvas");
      croppedCanvas.width = sel.width;
      croppedCanvas.height = sel.height;

      if (croppedCanvas.height > 0 && croppedCanvas.width > 0) {
        const ctx = croppedCanvas.getContext("2d");
        ctx.drawImage(
          sourceCanvas,
          sel.x,
          sel.y,
          sel.width,
          sel.height,
          0,
          0,
          sel.width,
          sel.height
        );

        const base64Image = croppedCanvas.toDataURL("image/png");
        dispatch(addSelection(base64Image));
      }
    });

    setSelections([]);

    overlayRefs.current.forEach((canvas) => {
      const ctx = canvas?.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    });
  };
  const handlers = {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
  return (
    <div className="pdfViewer">
      {pages.map((pageNum, index) => (
        <PdfPage
          key={pageNum}
          index={index}
          pageNum={pageNum}
          canvasRefs={canvasRefs}
          overlayRefs={overlayRefs}
          handlers={handlers}
        />
      ))}
      <Header setScale={setScale} scale={scale} cropToBase64={cropToBase64} />
    </div>
  );
};

export default PdfViewer;
