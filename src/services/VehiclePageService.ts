import { Vehicle } from "@/types";
// import { httpClient } from "@/infra/httpClient";

// MOCK DATA - Backend does not have Vehicle entity yet
const MOCK_VEHICLES: Vehicle[] = [
  {
    id: "1",
    name: "Honda Civic 2022",
    price: 120000,
    type: "car",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1606196662263-75b296a6a1b9?auto=format&fit=crop&w=640&q=80"
  },
  {
    id: "2",
    name: "Toyota Corolla 2023",
    price: 135000,
    type: "car",
    status: "sold",
    imageUrl: "https://images.unsplash.com/photo-1623869675785-3e284a441825?auto=format&fit=crop&w=640&q=80"
  },
  {
    id: "3",
    name: "Yamaha MT-07",
    price: 45000,
    type: "motorcycle",
    status: "in_stock",
    imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=640&q=80"
  }
];

const fetchVehicles = async (): Promise<Vehicle[]> => {
  // const response = await httpClient.get<Vehicle[]>("/veiculo/listar");
  // return response || [];
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_VEHICLES), 500);
  });
};

const saveVehicle = async (vehicle: Omit<Vehicle, "id">): Promise<Vehicle> => {
  // const response = await httpClient.post<Vehicle>("/veiculo/salvar", vehicle);
  // return response;
  return new Promise((resolve) => {
    const newVehicle = {
      ...vehicle,
      id: Math.random().toString(),
      status: vehicle.status || "in_stock"
    } as Vehicle;
    MOCK_VEHICLES.push(newVehicle);
    setTimeout(() => resolve(newVehicle), 500);
  });
};

const deleteVehicle = async (vehicleId: string): Promise<void> => {
  // await httpClient.delete<void>(`/veiculo/delete/${vehicleId}`);
  return new Promise((resolve) => {
    const index = MOCK_VEHICLES.findIndex(v => v.id === vehicleId);
    if (index > -1) MOCK_VEHICLES.splice(index, 1);
    setTimeout(() => resolve(), 500);
  });
};

export const VehiclePageService = {
  fetchVehicles,
  saveVehicle,
  deleteVehicle,
};
