import { useMemo } from "react";
import { PdfMap } from "./types";

export default ({ name }: { name: string }) => {
  const pdfUrl = useMemo(() => {
    if (name.includes("http")) {
      return name;
    }
    return PdfMap[name as any];
  }, [name]);
  return <iframe src={pdfUrl} width="100%" height="100%"></iframe>;
};
