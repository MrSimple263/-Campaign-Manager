import { useRef, useEffect } from "react";

import { Link } from "react-router-dom";

import { useCampaigns } from "../hooks/useCampaigns";

import type { Campaign, CampaignStatus } from "../types";

const statusColors: Record<CampaignStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  scheduled: "bg-blue-500 text-white",
  sent: "bg-green-100 text-green-800",
};

const CampaignsPage = () => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const { data, isLoading, isFetching, fetchNextPage } = useCampaigns({
    cursor: undefined,
    limit: 10,
  });

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !data?.pages.length) return;
    const observer = new window.IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isFetching &&
        data.pages[data.pages.length - 1].hasMore
      ) {
        fetchNextPage();
      }
    });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [data, isFetching, fetchNextPage]);

  const allCampaigns = data ? data.pages.flatMap((page) => page.data) : [];

  return (
    <div className="container mx-auto px-4 py-8 relative">
      {isLoading || isFetching && (
        <div className="fixed inset-0 flex items-center bg-gray-100 bg-opacity-10 justify-center z-50">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600" />
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <Link
          to="/campaigns/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Create Campaign
        </Link>
      </div>

      {/* Campaign List */}
      <div className="bg-white shadow rounded-lg overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allCampaigns.map((campaign: Campaign) => (
              <tr key={campaign.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {campaign.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {campaign.subject}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`p-2 text-xs font-medium rounded-full ${statusColors[campaign.status]}`}
                  >
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                  {new Date(campaign.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Infinite scroll loader */}
      <div ref={observerRef} className="h-8 flex justify-center items-center">
      </div>

      {allCampaigns.length === 0 && !(isLoading || isFetching) && (
        <div className="text-center py-8 text-gray-500">
          No campaigns found. Create your first campaign!
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
