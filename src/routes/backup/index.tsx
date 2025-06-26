import BackupDetail from "@/components/BackupDetail/BackupDetail";
import { RootLayout } from "@/components/layouts/RootLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/backup/")({
  component: Backup,
});

function Backup() {
  return (
    <RootLayout>
      <div className="container mx-auto py-8">
        <BackupDetail />
      </div>
    </RootLayout>
  );
}
