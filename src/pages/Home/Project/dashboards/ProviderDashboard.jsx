import BaseDashboard from "./BaseDashboard";

export default function ProviderDashboard({
  data,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
  highlightedRequestId,
  initialShowRequests,
}) {
  const config = {
    isProvider: true,
    storageKey: "providerShowRequests",
    userRole: "Provider",
    imageKey: "clientPicture",
    nameKey: "clientName",
    headerProps: {
      title: "Services I'm Providing",
      status: "Active Services",
      description:
        "Projects where you're helping other students with your skills and expertise, building your reputation and earning points.",
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