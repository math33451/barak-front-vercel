import { Vehicle } from "@/types";
import { httpClient } from "@/infra/httpClient";

const fetchVehicles = async (): Promise<Vehicle[]> => {
  const response = await httpClient.get<Vehicle[]>("/veiculo/listar");
  return response || [];
};

const saveVehicle = async (vehicle: Omit<Vehicle, "id">): Promise<Vehicle> => {
  const response = await httpClient.post<Vehicle>(
    "/veiculo/salvar",
    vehicle
  );
  return response;
};

const deleteVehicle = async (vehicleId: string): Promise<void> => {
  await httpClient.delete<void>(`/veiculo/delete/${vehicleId}`);
};

export const VehiclePageService = {
  fetchVehicles,
  saveVehicle,
  deleteVehicle,
};
