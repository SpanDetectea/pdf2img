import "./PdfPage.css"

function PdfPage({ index, pageNum, canvasRefs, overlayRefs, handlers }) {
  return (
    <div key={pageNum} className="pdfPage__wrapper">
      <canvas
        ref={(el) => (canvasRefs.current[index] = el)}
        className="pdfPage__canvas"
      />
      <canvas
        ref={(el) => (overlayRefs.current[index] = el)}
        className="pdfPage__overlay"
        onMouseDown={(e) => handlers.handleMouseDown(e, index)}
        onMouseMove={(e) => handlers.handleMouseMove(e, index)}
        onMouseUp={handlers.handleMouseUp}
      />
    </div>
  );
}

export default PdfPage;
