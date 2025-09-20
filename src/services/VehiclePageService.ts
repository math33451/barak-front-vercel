import { Vehicle } from '@/types';

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    name: "Honda Civic",
    price: 75000,
    type: "car",
    status: "in_stock",
    imageUrl: "/honda-civic.png",
  },
  {
    id: "2",
    name: "Yamaha MT-07",
    price: 35000,
    type: "motorcycle",
    status: "in_stock",
    imageUrl: "/yamaha-mt07.png",
  },
  {
    id: "3",
    name: "Toyota Corolla",
    price: 85000,
    type: "car",
    status: "sold",
    imageUrl: "/toyota-corolla.png",
  },
  {
    id: "4",
    name: "Kawasaki Ninja 400",
    price: 28000,
    type: "motorcycle",
    status: "in_stock",
    imageUrl: "/kawasaki-ninja-400.png",
  },
  {
    id: "5",
    name: "Ford Mustang",
    price: 150000,
    type: "car",
    status: "in_stock",
    imageUrl: "/ford-mustang.png",
  },
  {
    id: "6",
    name: "Harley-Davidson Iron 883",
    price: 45000,
    type: "motorcycle",
    status: "sold",
    imageUrl: "/harley-iron-883.png",
  },
];

const fetchVehicles = async (): Promise<Vehicle[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockVehicles;
};

export const VehiclePageService = {
  fetchVehicles,
};
