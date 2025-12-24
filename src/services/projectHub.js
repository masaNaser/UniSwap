// projectHub.js
import * as signalR from "@microsoft/signalr";
import { getToken } from "../utils/authHelpers";

const HUB_BASE_URL = "https://uni1swap.runasp.net";

export const createProjectHubConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${HUB_BASE_URL}/hubs/project`, {
      accessTokenFactory: () => getToken(),
      // إجبار النظام على استخدام Long Polling وتجنب WebSockets مؤقتاً
      transport: signalR.HttpTransportType.LongPolling 
    })
    .withAutomaticReconnect()
    .build();
};

