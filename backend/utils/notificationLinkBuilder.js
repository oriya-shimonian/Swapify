function getNotificationLink(type, contextId) {
  switch (type) {
    case "new_request":
      return `/dashboard/requests/received#request-${contextId}`;
    case "approved":
      return `/dashboard/requests/sent#request-${contextId}`;
    case "new_message":
      return `/chat?exchangeRequestId=${contextId}`;
    case "match_found":
      return `/dashboard/requests/received#match-${contextId}`;
    case "auto_rejected":
    case "completed":
    case "cancelled":
      return `/exchange-requests/${contextId}`;
    default:
      return `/exchange-requests/${contextId}`;
  }
}

module.exports = { getNotificationLink };
