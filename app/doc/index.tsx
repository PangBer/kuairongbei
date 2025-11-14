import PageHeader from "@/components/PageHeader";
import Pdf from "@/components/pdf";
import { NameValue } from "@/components/pdf/types";
import { useLocalSearchParams } from "expo-router";
export default () => {
  const { name, url } = useLocalSearchParams();
  return (
    <>
      <PageHeader title={NameValue[name as string] || (name as string)} />
      <Pdf url={url as string} name={name as string} />
    </>
  );
};
