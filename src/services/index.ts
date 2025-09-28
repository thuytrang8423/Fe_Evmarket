// Services folder - Add your service files here

// Export Auth services
export {
  loginUser,
  registerUser,
  logoutUserAPI,
  storeAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  isAuthenticatedViaCookies,
  checkAuthentication,
  logoutUser,
  logoutUserLocal,
  clearAuthCache,
  AuthError
} from './Auth'

// Export User services
export {
  getUserProfile,
  updateUserProfile,
  uploadAvatar
} from './User'

// Export Battery services
export {
  getBatteries,
  getBatteryById
} from './Battery'

// Export Vehicle services
export {
  getVehicles,
  getVehicleById
} from './Vehicle'

// Export types
export type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  LogoutResponse,
  ApiError
} from './Auth'

export type {
  User,
  UserProfileResponse,
  UpdateProfileRequest,
  UpdateProfileResponse
} from './User'

export type {
  Battery,
  BatteriesResponse
} from './Battery'

export type {
  Vehicle,
  VehiclesResponse,
  VehicleResponse
} from './Vehicle'