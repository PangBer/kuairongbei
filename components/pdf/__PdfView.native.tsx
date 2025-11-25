import globalStyles from "@/components/styles/globalStyles";
import { Asset } from "expo-asset";
import { Directory, File, Paths } from "expo-file-system";
import { useEffect, useState } from "react";
import Pdf from "react-native-pdf";
import { PdfMap } from "./types";

async function downloadPDF(url?: string, name?: string) {
  try {
    if (url?.includes("http") && name) {
      const destination = new Directory(Paths.cache, name);
      if (destination.exists) {
        return destination.uri + "/" + name;
      } else {
        destination.create();
        const output = await File.downloadFileAsync(url, destination);
        return output.uri;
      }
    } else if (url?.includes("file://")) {
      return url;
    } else {
      const asset = Asset.fromModule(PdfMap[name as any]);
      await asset.downloadAsync(); // 确保文件已缓存
      const uri = asset.localUri || asset.uri;
      return uri;
    }
  } catch (error) {
    console.error(error);
  }
}

export default ({
  url,
  name,
  onPageChange,
}: {
  url?: string;
  name?: string;
  onPageChange?: (state: boolean) => void;
}) => {
  const [pdfUri, setPdfUri] = useState<string>("");

  useEffect(() => {
    if (url || name) {
      downloadPDF(url, name).then((uri) => {
        setPdfUri(uri as string);
      });
    }
    return () => {
      setPdfUri("");
    };
  }, [url, name]);
  return (
    <Pdf
      source={{ uri: pdfUri, cache: true }}
      onLoadComplete={(numberOfPages) => {
        onPageChange?.(numberOfPages === 1);
      }}
      onPageChanged={(page, numberOfPages) => {
        onPageChange?.(page === numberOfPages);
      }}
      onError={(error) => {
        console.log(error);
      }}
      style={globalStyles.globalContainer}
    />
  );
};
