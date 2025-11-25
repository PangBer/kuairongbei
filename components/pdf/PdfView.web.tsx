// @ts-nocheck
import { useEffect, useMemo, useRef } from "react";
import { PdfMap } from "./types";
// 设置 Web 端 worker

export default function PdfView({
  url,
  name,
  onPageChange,
}: {
  url?: string;
  name?: string;
  onPageChange?: (isLastPage: boolean) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  const pdfUrl = useMemo(() => {
    if (url?.startsWith("http")) return url;
    if (url?.startsWith("file://")) return url;
    return PdfMap[name as any];
  }, [url, name]);

  // 渲染 PDF
  useEffect(() => {
    if (document.getElementById("pdfjs-script")) {
      Promise.resolve().then(() => {
        var { pdfjsLib } = globalThis;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
        loadPdf();
      });
    } else {
      const script = document.createElement("script");
      script.src = "https://mozilla.github.io/pdf.js/build/pdf.mjs";
      script.id = "pdfjs-script";
      script.type = "module";
      script.async = true;
      script.onload = () => {
        var { pdfjsLib } = globalThis;
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://mozilla.github.io/pdf.js/build/pdf.worker.mjs";
        loadPdf();
      };
      document.body.appendChild(script);
    }

    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const loadPdf = async () => {
      const pdf = await pdfjsLib.getDocument(pdfUrl).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 0.7 });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.margin = "0 auto 10px";
        canvas.style.display = "block";

        await page.render({ canvasContext: ctx, viewport }).promise;

        container.appendChild(canvas);
      }
    };
  }, [pdfUrl]);

  // 监听滚动到底部
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = container;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onPageChange?.(true);
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [containerRef]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        overflowY: "auto",
      }}
    />
  );
}
