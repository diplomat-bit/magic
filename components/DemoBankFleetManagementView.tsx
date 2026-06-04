import React, { useState, useEffect, useMemo, useCallback, useRef, useReducer, createContext, useContext } from 'react';
import Card from '../../Card';
import { GoogleGenAI, Type } from "@google/genai";

// SECTION 1: TYPES & INTERFACES =======================================================

export type VehicleStatus = 'idle' | 'en_route' | 'at_stop' | 'maintenance' | 'offline';
export type VehicleType = 'armored_truck' | 'courier_van' | 'sedan' | 'motorcycle';
export type DriverStatus = 'on_duty' | 'off_duty' | 'on_break';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue';
export type AlertType = 'speeding' | 'geofence_exit' | 'harsh_braking' | 'engine_fault' | 'panic_button';
export type ViewType = 'dashboard' | 'vehicles' | 'drivers' | 'routes' | 'tracking' | 'maintenance' | 'analytics' | 'alerts';

export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface Stop extends Coordinates {
    id: string;
    name: string;
    address: string;
    type: 'pickup' | 'delivery' | 'service' | 'depot';
    timeWindow?: { start: string; end: string };
    completed: boolean;
}

export interface Route {
    id: string;
    name: string;
    stops: Stop[];
    vehicleId: string | null;
    driverId: string | null;
    startTime: string;
    estimatedEndTime: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    distance: number; // in kilometers
}

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    licensePlate: string;
    vin: string;
    type: VehicleType;
    status: VehicleStatus;
    driverId: string | null;
    currentRouteId: string | null;
    location: Coordinates;
    fuelLevel: number; // percentage
    odometer: number; // in kilometers
    nextMaintenance: string; // ISO date string
    telemetry: {
        speed: number; // km/h
        engineTemp: number; // Celsius
        oilPressure: number; // kPa
    };
}

export interface Driver {
    id: string;
    name: string;
    employeeId: string;
    licenseNumber: string;
    phone: string;
    email: string;
    status: DriverStatus;
    assignedVehicleId: string | null;
    performance: {
        safetyScore: number; // out of 100
        onTimeRate: number; // percentage
        efficiencyScore: number; // out of 100
    };
}

export interface MaintenanceRecord {
    id: string;
    vehicleId: string;
    date: string;
    odometer: number;
    type: 'routine' | 'repair' | 'inspection';
    description: string;
    cost: number;
    status: MaintenanceStatus;
}

export interface Alert {
    id: string;
    timestamp: string;
    type: AlertType;
    vehicleId: string;
    driverId: string | null;
    location: Coordinates;
    details: string;
    isAcknowledged: boolean;
}

export interface FleetState {
    vehicles: Vehicle[];
    drivers: Driver[];
    routes: Route[];
    stops: Stop[];
    maintenanceRecords: MaintenanceRecord[];
    alerts: Alert[];
}

export type FleetAction =
    | { type: 'SET_INITIAL_STATE'; payload: FleetState }
    | { type: 'UPDATE_VEHICLE'; payload: Partial<Vehicle> & { id: string } }
    | { type: 'ADD_VEHICLE'; payload: Vehicle }
    | { type: 'REMOVE_VEHICLE'; payload: string } // ID
    | { type: 'UPDATE_DRIVER'; payload: Partial<Driver> & { id: string } }
    | { type: 'ADD_DRIVER'; payload: Driver }
    | { type: 'REMOVE_DRIVER'; payload: string } // ID
    | { type: 'UPDATE_ROUTE'; payload: Partial<Route> & { id: string } }
    | { type: 'ADD_ROUTE'; payload: Route }
    | { type: 'REMOVE_ROUTE'; payload: string } // ID
    | { type: 'ADD_MAINTENANCE'; payload: MaintenanceRecord }
    | { type: 'UPDATE_MAINTENANCE'; payload: Partial<MaintenanceRecord> & { id: string } }
    | { type: 'CREATE_ALERT'; payload: Alert }
    | { type: 'ACKNOWLEDGE_ALERT'; payload: string }; // ID

// SECTION 2: MOCK DATA & SIMULATION CONSTANTS ==========================================

export const SIMULATION_TICK_RATE_MS = 2000;
export const MAP_BOUNDS = {
    minLat: 34.0, maxLat: 34.1,
    minLng: -118.5, maxLng: -118.2,
};

const firstNames = ['John', 'Jane', 'Peter', 'Susan', 'Michael', 'Emily', 'Chris', 'Jessica'];
const lastNames = ['Smith', 'Doe', 'Jones', 'Williams', 'Brown', 'Davis', 'Miller', 'Wilson'];
const vehicleMakes = {
    armored_truck: ['Brinks', 'Garda', 'Loomis'],
    courier_van: ['Ford', 'Mercedes-Benz', 'RAM'],
    sedan: ['Toyota', 'Honda', 'Ford'],
    motorcycle: ['Harley-Davidson', 'Honda', 'BMW']
};
const vehicleModels = {
    armored_truck: ['Defender', 'Cash-In-Transit', 'Bullion'],
    courier_van: ['Transit', 'Sprinter', 'ProMaster'],
    sedan: ['Camry', 'Accord', 'Fusion'],
    motorcycle: ['Street Glide', 'Gold Wing', 'R 1250 RT']
};
const streetNames = ['Main St', 'Oak Ave', 'Pine Ln', 'Maple Dr', 'Elm St', 'Cedar Blvd'];
const cities = ['Los Angeles', 'Santa Monica', 'Beverly Hills', 'Culver City'];

export const generateId = (prefix: string = 'id'): string => `${prefix}_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;

export const getRandomElement = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const getRandomNumber = (min: number, max: number, decimals: number = 0): number => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
};

export const generateMockAddress = (): Address => ({
    street: `${getRandomNumber(100, 9999)} ${getRandomElement(streetNames)}`,
    city: getRandomElement(cities),
    state: 'CA',
    zip: `${getRandomNumber(90001, 90210)}`,
});

export const generateMockCoordinates = (): Coordinates => ({
    lat: getRandomNumber(MAP_BOUNDS.minLat, MAP_BOUNDS.maxLat, 6),
    lng: getRandomNumber(MAP_BOUNDS.minLng, MAP_BOUNDS.maxLng, 6),
});

export const generateMockStops = (count: number): Stop[] => {
    return Array.from({ length: count }, (_, i) => {
        const address = generateMockAddress();
        return {
            id: generateId('stop'),
            name: i === 0 ? 'Demo Bank HQ' : `Client #${i}`,
            address: `${address.street}, ${address.city}`,
            ...generateMockCoordinates(),
            type: getRandomElement(['pickup', 'delivery', 'service']),
            completed: false,
        };
    });
};

export const generateMockDrivers = (count: number): Driver[] => {
    return Array.from({ length: count }, () => {
        const name = `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
        return {
            id: generateId('driver'),
            name,
            employeeId: `DB-${getRandomNumber(1000, 9999)}`,
            licenseNumber: `D${getRandomNumber(1000000, 9999999)}`,
            phone: `(555) ${getRandomNumber(100, 999)}-${getRandomNumber(1000, 9999)}`,
            email: `${name.toLowerCase().replace(' ', '.')}@demobank.com`,
            status: getRandomElement(['on_duty', 'off_duty', 'on_break']),
            assignedVehicleId: null,
            performance: {
                safetyScore: getRandomNumber(85, 99),
                onTimeRate: getRandomNumber(92, 99.5, 1),
                efficiencyScore: getRandomNumber(88, 98),
            },
        };
    });
};

export const generateMockVehicles = (count: number): Vehicle[] => {
    return Array.from({ length: count }, () => {
        const type = getRandomElement(Object.keys(vehicleMakes) as VehicleType[]);
        const make = getRandomElement(vehicleMakes[type]);
        const model = getRandomElement(vehicleModels[type]);
        const year = getRandomNumber(2018, 2024);

        return {
            id: generateId('vehicle'),
            make,
            model,
            year,
            licensePlate: `${getRandomNumber(100, 999)} ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
            vin: generateId('VIN').toUpperCase(),
            type,
            status: 'idle',
            driverId: null,
            currentRouteId: null,
            location: generateMockCoordinates(),
            fuelLevel: getRandomNumber(30, 100),
            odometer: getRandomNumber(10000, 80000),
            nextMaintenance: new Date(Date.now() + getRandomNumber(1, 60) * 24 * 60 * 60 * 1000).toISOString(),
            telemetry: {
                speed: 0,
                engineTemp: 25,
                oilPressure: 300,
            },
        };
    });
};

export const generateMockMaintenance = (vehicles: Vehicle[], count: number): MaintenanceRecord[] => {
    return Array.from({ length: count }, () => {
        const vehicle = getRandomElement(vehicles);
        const date = new Date(Date.now() - getRandomNumber(0, 365) * 24 * 60 * 60 * 1000).toISOString();
        return {
            id: generateId('maint'),
            vehicleId: vehicle.id,
            date,
            odometer: vehicle.odometer - getRandomNumber(100, 5000),
            type: getRandomElement(['routine', 'repair', 'inspection']),
            description: getRandomElement(['Oil change', 'Tire rotation', 'Brake replacement', 'Annual inspection']),
            cost: getRandomNumber(100, 2500, 2),
            status: 'completed',
        };
    });
};

export const generateInitialState = (): FleetState => {
    const vehicles = generateMockVehicles(50);
    const drivers = generateMockDrivers(60);
    const stops = generateMockStops(200);
    
    // Assigns some drivers to vehicles
    vehicles.slice(0, 40).forEach((v, i) => {
        if (drivers[i]) {
            v.driverId = drivers[i].id;
            drivers[i].assignedVehicleId = v.id;
            drivers[i].status = 'on_duty';
        }
    });

    const maintenanceRecords = generateMockMaintenance(vehicles, 150);
    const routes: Route[] = []; // Routes will be generated on-demand
    const alerts: Alert[] = []; // Alerts will be generated by the simulator

    return { vehicles, drivers, routes, stops, maintenanceRecords, alerts };
};


// SECTION 3: UTILITY & HELPER FUNCTIONS ================================================

/**
 * Formats an ISO date string into a more readable format.
 * @param dateString - The ISO date string.
 * @param options - Formatting options.
 * @returns A formatted date string.
 */
export const formatDate = (dateString: string, options: Intl.DateTimeFormatOptions = {}): string => {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
    };
    try {
        return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(dateString));
    } catch (e) {
        return 'Invalid Date';
    }
};

/**
 * Calculates the great-circle distance between two points on the Earth.
 * @param coord1 - The first coordinate.
 * @param coord2 - The second coordinate.
 * @returns The distance in kilometers.
 */
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLon = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
};

/**
 * Formats a vehicle type string for display.
 * @param type - The vehicle type.
 * @returns A user-friendly string.
 */
export const formatVehicleType = (type: VehicleType): string => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Truncates a string to a specified length.
 * @param str - The string to truncate.
 * @param length - The maximum length.
 * @returns The truncated string.
 */
export const truncate = (str: string, length: number): string => {
    return str.length > length ? `${str.substring(0, length)}...` : str;
};

// SECTION 4: STATE MANAGEMENT (Reducer) =================================================

export const fleetReducer = (state: FleetState, action: FleetAction): FleetState => {
    switch (action.type) {
        case 'SET_INITIAL_STATE':
            return action.payload;
        case 'UPDATE_VEHICLE':
            return {
                ...state,
                vehicles: state.vehicles.map(v => v.id === action.payload.id ? { ...v, ...action.payload } : v),
            };
        case 'ADD_VEHICLE':
            return { ...state, vehicles: [...state.vehicles, action.payload] };
        case 'REMOVE_VEHICLE':
            return { ...state, vehicles: state.vehicles.filter(v => v.id !== action.payload) };
        case 'UPDATE_DRIVER':
            return {
                ...state,
                drivers: state.drivers.map(d => d.id === action.payload.id ? { ...d, ...action.payload } : d),
            };
        case 'ADD_DRIVER':
            return { ...state, drivers: [...state.drivers, action.payload] };
        case 'REMOVE_DRIVER':
            return { ...state, drivers: state.drivers.filter(d => d.id !== action.payload) };
        case 'ADD_ROUTE':
            return { ...state, routes: [...state.routes, action.payload] };
        case 'UPDATE_ROUTE':
            return {
                ...state,
                routes: state.routes.map(r => r.id === action.payload.id ? { ...r, ...action.payload } : r),
            };
        case 'REMOVE_ROUTE':
            return { ...state, routes: state.routes.filter(r => r.id !== action.payload) };
        case 'ADD_MAINTENANCE':
            return { ...state, maintenanceRecords: [action.payload, ...state.maintenanceRecords] };
        case 'UPDATE_MAINTENANCE':
            return {
                ...state,
                maintenanceRecords: state.maintenanceRecords.map(m => m.id === action.payload.id ? { ...m, ...action.payload } : m),
            };
        case 'CREATE_ALERT':
            return { ...state, alerts: [action.payload, ...state.alerts].slice(0, 100) }; // Keeps the alerts list capped
        case 'ACKNOWLEDGE_ALERT':
            return {
                ...state,
                alerts: state.alerts.map(a => a.id === action.payload ? { ...a, isAcknowledged: true } : a),
            };
        default:
            return state;
    }
};

export const initialFleetState: FleetState = {
    vehicles: [],
    drivers: [],
    routes: [],
    stops: [],
    maintenanceRecords: [],
    alerts: [],
};

export const FleetContext = createContext<{ state: FleetState; dispatch: React.Dispatch<FleetAction> } | undefined>(undefined);

// SECTION 5: CUSTOM HOOKS ==============================================================

/**
 * A custom hook to manage the state of a modal dialog.
 * @returns An object with modal state and control functions.
 */
export const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    return { isOpen, open, close };
};

/**
 * A custom hook for sorting table data.
 * @param items - The array of items to sort.
 * @param config - Initial sort configuration.
 * @returns An object with sorted items and sorting control functions.
 */
export const useSortableData = <T>(items: T[], config: { key: keyof T; direction: 'ascending' | 'descending' } | null = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        const sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

/**
 * A custom hook to simulate fleet activity.
 * @param dispatch - The reducer dispatch function.
 * @param state - The current fleet state.
 */
export const useFleetSimulator = (dispatch: React.Dispatch<FleetAction>, state: FleetState) => {
    const stateRef = useRef(state);
    stateRef.current = state;

    useEffect(() => {
        const tick = () => {
            const { vehicles, routes } = stateRef.current;
            if (vehicles.length === 0) return;

            vehicles.forEach(vehicle => {
                const route = routes.find(r => r.id === vehicle.currentRouteId && r.status === 'in_progress');
                if (route) {
                    const currentStopIndex = route.stops.findIndex(s => !s.completed);
                    if (currentStopIndex === -1) {
                        // Route completed
                        dispatch({ type: 'UPDATE_VEHICLE', payload: { id: vehicle.id, status: 'idle', currentRouteId: null, telemetry: { ...vehicle.telemetry, speed: 0 } } });
                        dispatch({ type: 'UPDATE_ROUTE', payload: { id: route.id, status: 'completed' } });
                        return;
                    }

                    const targetStop = route.stops[currentStopIndex];
                    const distanceToTarget = calculateDistance(vehicle.location, targetStop);
                    const speedKmsPerTick = (vehicle.telemetry.speed / 3600) * (SIMULATION_TICK_RATE_MS / 1000);

                    if (distanceToTarget < 0.1) { // Arrived at stop
                        dispatch({ type: 'UPDATE_VEHICLE', payload: { id: vehicle.id, status: 'at_stop', telemetry: { ...vehicle.telemetry, speed: 0 } } });
                        const updatedStops = route.stops.map((s, i) => i === currentStopIndex ? { ...s, completed: true } : s);
                        dispatch({ type: 'UPDATE_ROUTE', payload: { id: route.id, stops: updatedStops } });
                    } else {
                        // Move towards target
                        const newLat = vehicle.location.lat + (targetStop.lat - vehicle.location.lat) * (speedKmsPerTick / distanceToTarget);
                        const newLng = vehicle.location.lng + (targetStop.lng - vehicle.location.lng) * (speedKmsPerTick / distanceToTarget);
                        
                        const speed = getRandomNumber(40, 65);
                        const odometer = vehicle.odometer + speedKmsPerTick;
                        const fuelLevel = vehicle.fuelLevel - (speedKmsPerTick * 0.05); // Simple fuel consumption model
                        
                        dispatch({
                            type: 'UPDATE_VEHICLE',
                            payload: {
                                id: vehicle.id,
                                location: { lat: newLat, lng: newLng },
                                status: 'en_route',
                                odometer,
                                fuelLevel,
                                telemetry: { ...vehicle.telemetry, speed, engineTemp: getRandomNumber(85, 95) }
                            }
                        });
                        
                        // Randomly generates alerts
                        if (Math.random() < 0.005) {
                            const alertType = getRandomElement<AlertType>(['speeding', 'harsh_braking', 'engine_fault']);
                            dispatch({
                                type: 'CREATE_ALERT',
                                payload: {
                                    id: generateId('alert'),
                                    timestamp: new Date().toISOString(),
                                    type: alertType,
                                    vehicleId: vehicle.id,
                                    driverId: vehicle.driverId,
                                    location: vehicle.location,
                                    details: `Simulated ${alertType} alert`,
                                    isAcknowledged: false,
                                }
                            });
                        }
                    }
                }
            });
        };

        const intervalId = setInterval(tick, SIMULATION_TICK_RATE_MS);
        return () => clearInterval(intervalId);
    }, [dispatch]);
};

// SECTION 6: MAIN COMPONENT ============================================================

export default function DemoBankFleetManagementView() {
    const [state, dispatch] = useReducer(fleetReducer, initialFleetState);

    useEffect(() => {
        dispatch({ type: 'SET_INITIAL_STATE', payload: generateInitialState() });
    }, []);

    useFleetSimulator(dispatch, state);

    return (
        <FleetContext.Provider value={{ state, dispatch }}>
            <Card>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">Demo Bank Fleet Management</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                            <h2 className="font-semibold">Total Vehicles</h2>
                            <p className="text-xl">{state.vehicles.length}</p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                            <h2 className="font-semibold">Active Drivers</h2>
                            <p className="text-xl">{state.drivers.filter(d => d.status === 'on_duty').length}</p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-lg">
                            <h2 className="font-semibold">Active Alerts</h2>
                            <p className="text-xl">{state.alerts.filter(a => !a.isAcknowledged).length}</p>
                        </div>
                    </div>
                </div>
            </Card>
        </FleetContext.Provider>
    );
}