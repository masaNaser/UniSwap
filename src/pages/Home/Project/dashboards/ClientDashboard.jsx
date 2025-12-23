import BaseDashboard from "./BaseDashboard";

export default function ClientDashboard({
  data,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  highlightedRequestId,
  initialShowRequests,
}) {
  const config = {
    isProvider: false,
    storageKey: "clientShowRequests",
    userRole: "Client",
    imageKey: "providerImage",
    nameKey: "providerName",
    headerProps: {
      title: "Services I'm Requesting",
      status: "Requested Services",
      description:
        "Projects where you're asking for help from others to learn, collaborate, or get tasks done.",
    },
  };

  return (
    <BaseDashboard
      data={data}
      statusFilter={statusFilter}
      onStatusFilterChange={onStatusFilterChange}
      onRefresh={onRefresh}
      highlightedRequestId={highlightedRequestId}
      initialShowRequests={initialShowRequests}
      config={config}
    />
  );
}