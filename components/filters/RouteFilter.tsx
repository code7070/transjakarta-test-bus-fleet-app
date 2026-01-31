import React from "react";
import { MultiSelectDropdown, Option } from "./MultiSelectDropdown";
import { useRoutes } from "../../hooks/useRoutes";

interface RouteFilterProps {
  selectedRoutes: string[];
  onChange: (ids: string[]) => void;
}

export const RouteFilter: React.FC<RouteFilterProps> = ({
  selectedRoutes,
  onChange,
}) => {
  const { routes, loading, hasMore, loadMore } = useRoutes();

  const options: Option[] = routes.map((route) => ({
    id: route.id,
    label:
      route.attributes.long_name ||
      route.attributes.short_name ||
      "Unnamed Route",
    // subtitle: `Type: ${route.attributes.type}`
  }));

  return (
    <MultiSelectDropdown
      label="Routes"
      placeholder="Search routes..."
      options={options}
      selectedIds={selectedRoutes}
      onSelectionChange={onChange}
      onLoadMore={loadMore}
      hasMore={hasMore}
      loading={loading}
    />
  );
};
