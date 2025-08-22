/**
 * This is a bit weird, but the _ is used for simplifying the types inferring for other
 * related types. (ex: DatabaseTransaction)
 */
export const driverOptionsType = ["_", "sequelize"] as const;
export type DriverOptionsType = (typeof driverOptionsType)[number];
export type DefaultDriverOptionsType = (typeof driverOptionsType)[0];
