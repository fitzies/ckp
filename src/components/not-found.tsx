import PageWrapper from "./page-wrapper";

export default function NotFound() {
  return (
    <PageWrapper className="flex justify-center items-center h-[95vh]">
      <p className="font-medium text-red-400 text-lg">Something went wrong</p>
    </PageWrapper>
  );
}
