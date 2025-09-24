import { Vehicle } from "@/types";
import { httpClient } from "@/infra/httpClient";

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await httpClient.get<Vehicle[]>("/rest/veiculo/listar");
  return response || [];
};

const saveVehicle = async (vehicle: Omit<Vehicle, "id">): Promise<Vehicle> => {
  const response = await httpClient.post<Vehicle>(
    "/rest/veiculo/salvar",
    vehicle
  );
  return response;
};

const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await httpClient.delete<void>(`/rest/veiculo/delete/${vehicleId}`);
};

export const VehiclePageService = {
  fetchVehicles,
  saveVehicle,
  deleteVehicle,
};
